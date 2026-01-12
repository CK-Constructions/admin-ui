import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFileToS3, UpdateRental } from '../../api';
import { useGetQuery } from '../../query/hooks/queryHook';
import { queryConfigs } from '../../query/queryConfig';
import { RentalBody } from '../lib/types/payloads';

interface RentalSpec {
	label: string;
	value: string;
	id?: number;
}

interface RentalRate {
	period: 'PerTrip' | 'PerHour';
	rate: number;
	id?: number;
}

interface RentalImage {
	uri: string;
	file?: File;
	isPrimary: boolean;
	id?: number;
	isFromDB?: boolean;
}

const RentalUpdatePage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const isEdit = !!id;

	/* -------------------- State -------------------- */
	const [title, setTitle] = useState('');
	const [category, setCategory] = useState<number | undefined>();
	const [description, setDescription] = useState('');
	const [contactPhone, setContactPhone] = useState('');
	const [deliveryTime, setDeliveryTime] = useState('');
	const [deliveryFee, setDeliveryFee] = useState<number | undefined>();
	const [insuranceRequired, setInsuranceRequired] = useState(false);

	const [rates, setRates] = useState<RentalRate[]>([]);
	const [specifications, setSpecifications] = useState<RentalSpec[]>([]);
	const [images, setImages] = useState<RentalImage[]>([]);

	/* -------------------- Fetch Rental -------------------- */
	const { queryFn, queryKeys } = queryConfigs.useGetRentalById;
	const { data, isLoading } = useGetQuery({
		func: queryFn,
		key: queryKeys,
		params: { id },
		isEnabled: isEdit,
	});

	const rentalData = data?.result;

	useEffect(() => {
		if (!rentalData) return;

		setTitle(rentalData.name ?? '');
		setCategory(rentalData.category ?? undefined);
		setDescription(rentalData.description ?? '');
		setContactPhone(rentalData.contact_phone ?? '');
		setDeliveryTime(rentalData.delivery_time ?? '');
		setDeliveryFee(rentalData.delivery_fee ?? undefined);
		setInsuranceRequired(rentalData.insurance_required === 1);

		setRates(
			(rentalData.rates_list ?? []).map((r: any) => ({
				id: r.id,
				period: r.period as 'PerTrip' | 'PerHour',
				rate: r.rate,
			}))
		);

		setSpecifications(
			(rentalData.specifications ?? []).map((s: any) => ({
				id: s.id,
				label: s.label,
				value: s.value,
			}))
		);

		const dbImages: RentalImage[] = (rentalData.images_list ?? []).map((img: any) => ({
			uri: img.image.replace(/[<>]/g, ''),
			isPrimary: img.is_primary === 1,
			id: img.id,
			isFromDB: true,
		}));
		setImages(dbImages.length > 0 ? dbImages : []);
	}, [rentalData]);

	/* -------------------- Mutation -------------------- */
	const { mutateAsync: updateRental, isPending } = useMutation({
		mutationFn: UpdateRental,
		onSuccess: () => {
			alert('Rental updated successfully!');
			queryClient.invalidateQueries();
			window.history.back();
		},
		onError: (err: any) => alert(err?.message || 'Failed to update rental'),
	});

	/* -------------------- Image Handling -------------------- */
	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		const newImages = Array.from(files).map((file) => ({
			file,
			uri: URL.createObjectURL(file),
			isPrimary: images.length === 0 && images.every((img) => !img.isPrimary),
		}));
		setImages((prev) => [...prev, ...newImages]);
	};

	const setPrimaryImage = (index: number) => {
		setImages((prev) => prev.map((img, i) => ({ ...img, isPrimary: i === index })));
	};

	const removeImage = (index: number) => {
		setImages((prev) => {
			const updated = prev.filter((_, i) => i !== index);
			if (prev[index].isPrimary && updated.length > 0 && !updated.some((img) => img.isPrimary)) {
				updated[0].isPrimary = true;
			}
			return updated;
		});
	};

	/* -------------------- Rates & Specs Handling -------------------- */
	const addRate = () => setRates((prev) => [...prev, { period: 'PerHour', rate: 0 }]);
	const updateRate = (index: number, field: 'period' | 'rate', value: any) =>
		setRates((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
	const removeRate = (index: number) => setRates((prev) => prev.filter((_, i) => i !== index));

	const addSpecification = () => setSpecifications((prev) => [...prev, { label: '', value: '' }]);
	const updateSpecification = (index: number, field: 'label' | 'value', value: string) =>
		setSpecifications((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
	const removeSpecification = (index: number) => setSpecifications((prev) => prev.filter((_, i) => i !== index));

	/* -------------------- Submit -------------------- */
	const handleSubmit = async () => {
		if (!title.trim()) return alert('Title is required');
		if (!category) return alert('Category is required');
		if (!contactPhone.trim()) return alert('Contact phone is required');
		if (images.length === 0) return alert('At least one image is required');
		if (!images.some((img) => img.isPrimary)) return alert('Please select a primary image');

		const uploadedImages = [];
		for (const img of images) {
			if (img.isFromDB) {
				uploadedImages.push({ image: img.uri, is_primary: img.isPrimary ? 1 : 0, id: img.id });
				continue;
			}
			const url = await uploadFileToS3(img.file!);
			uploadedImages.push({ image: url, is_primary: img.isPrimary ? 1 : 0 });
		}

		const body: RentalBody = {
			id: Number(id),
			name: title.trim(),
			category,
			description: description.trim() || undefined,
			contact_phone: contactPhone.trim(),
			delivery_time: deliveryTime.trim() || undefined,
			delivery_fee: deliveryFee,
			insurance_required: insuranceRequired ? 1 : 0,
			rates: rates.length > 0 ? rates.filter((r) => r.rate > 0) : undefined,
			specifications:
				specifications.length > 0
					? specifications.filter((s) => s.label.trim() && s.value.trim()).map((s) => ({ label: s.label.trim(), value: s.value.trim(), id: s.id }))
					: undefined,
			images: uploadedImages,
		};

		await updateRental({ id: Number(id), body });
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-xl text-gray-600">Loading rental details...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-10 px-4">
			<div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
				<div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
					<h1 className="text-4xl font-bold">Update Rental Listing</h1>
					<p className="mt-2 text-blue-100">Edit details for your rental item</p>
				</div>

				<div className="p-8 space-y-10">
					{/* Basic Information */}
					<section>
						<h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Basic Information</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Title <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
									placeholder="e.g., TATA 407 Truck"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Category ID <span className="text-red-500">*</span>
								</label>
								<input
									type="number"
									value={category ?? ''}
									onChange={(e) => setCategory(e.target.value ? Number(e.target.value) : undefined)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
									placeholder="e.g., 1015"
								/>
							</div>

							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									rows={4}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
									placeholder="Describe your rental item..."
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Contact Phone <span className="text-red-500">*</span>
								</label>
								<input
									type="tel"
									value={contactPhone}
									onChange={(e) => setContactPhone(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
									placeholder="e.g., 9863534939"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time</label>
								<input
									type="text"
									value={deliveryTime}
									onChange={(e) => setDeliveryTime(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
									placeholder="e.g., Within 24 hours"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Delivery Fee (₹)</label>
								<input
									type="number"
									value={deliveryFee ?? ''}
									onChange={(e) => setDeliveryFee(e.target.value ? Number(e.target.value) : undefined)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
									placeholder="0 for free delivery"
								/>
							</div>

							<div className="flex items-center space-x-3">
								<input
									type="checkbox"
									id="insurance"
									checked={insuranceRequired}
									onChange={(e) => setInsuranceRequired(e.target.checked)}
									className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
								/>
								<label htmlFor="insurance" className="text-sm font-medium text-gray-700 cursor-pointer">
									Insurance Required
								</label>
							</div>
						</div>
					</section>

					{/* Rental Rates */}
					<section>
						<h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Rental Rates</h2>
						<div className="space-y-4">
							{rates.map((rate, index) => (
								<div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
									<select
										value={rate.period}
										onChange={(e) => updateRate(index, 'period', e.target.value as 'PerTrip' | 'PerHour')}
										className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									>
										<option value="PerHour">Per Hour</option>
										<option value="PerTrip">Per Trip</option>
									</select>
									<input
										type="number"
										value={rate.rate}
										onChange={(e) => updateRate(index, 'rate', Number(e.target.value) || 0)}
										placeholder="Rate in ₹"
										className="w-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									/>
									<button onClick={() => removeRate(index)} className="text-red-600 hover:text-red-800 font-medium transition">
										Remove
									</button>
								</div>
							))}
							<button onClick={addRate} className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition">
								<span className="text-2xl">+</span> Add New Rate
							</button>
						</div>
					</section>

					{/* Specifications */}
					<section>
						<h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Specifications</h2>
						<div className="space-y-4">
							{specifications.map((spec, index) => (
								<div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
									<input
										type="text"
										value={spec.label}
										onChange={(e) => updateSpecification(index, 'label', e.target.value)}
										placeholder="Label (e.g., Load Capacity)"
										className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									/>
									<input
										type="text"
										value={spec.value}
										onChange={(e) => updateSpecification(index, 'value', e.target.value)}
										placeholder="Value (e.g., 1.5 Ton)"
										className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									/>
									<button onClick={() => removeSpecification(index)} className="text-red-600 hover:text-red-800 font-medium transition">
										Remove
									</button>
								</div>
							))}
							<button onClick={addSpecification} className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition">
								<span className="text-2xl">+</span> Add Specification
							</button>
						</div>
					</section>

					{/* Images */}
					<section>
						<h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
							Images <span className="text-red-500">*</span> ({images.length} uploaded)
						</h2>
						<label className="block mb-6">
							<input
								type="file"
								multiple
								accept="image/*"
								onChange={handleImageSelect}
								className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer transition"
							/>
						</label>

						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
							{images.map((img, i) => (
								<div key={i} className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
									<img src={img.uri} alt={`Rental ${i + 1}`} className="w-full h-64 object-cover" />
									<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">
										<div className="space-y-2">
											<button
												onClick={() => setPrimaryImage(i)}
												className={`w-full py-2 rounded-lg font-medium transition ${
													img.isPrimary ? 'bg-green-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'
												}`}
											>
												{img.isPrimary ? '✓ Primary Image' : 'Set as Primary'}
											</button>
											<button
												onClick={() => removeImage(i)}
												className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
											>
												Remove
											</button>
										</div>
									</div>
									{img.isPrimary && (
										<div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow">
											PRIMARY
										</div>
									)}
								</div>
							))}
						</div>
					</section>

					{/* Submit */}
					<div className="flex justify-end pt-8 border-t">
						<button
							onClick={handleSubmit}
							disabled={isPending}
							className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
						>
							{isPending ? 'Updating Rental...' : 'Update Rental'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RentalUpdatePage;
