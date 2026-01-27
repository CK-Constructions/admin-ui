import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TCategory } from '../lib/types/response';
import { uploadFileToS3 } from '../../api';
import axios from 'axios';
import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery } from '../../query/hooks/queryHook';

interface RentalSpec {
	label: string;
	value: string;
}

interface RentalRate {
	period: 'PerHour' | 'PerTrip';
	rate: number;
}

interface PendingImage {
	uri: string;
	file: File;
	isPrimary: boolean;
}

interface RentalFormData {
	category: number;
	name: string;
	description: string;
	contact_phone: string;
	delivery_time: string;
	is_active: number;
	insurance_required: number;
	specifications: RentalSpec[];
	rates: RentalRate[];
	delivery_fee: number;
}

// Success Modal Component
const SuccessModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	message?: string;
}> = ({ isOpen, onClose, title = 'Success!', message = 'Rental created successfully' }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
			<div className="relative mx-4 w-full max-w-md transform rounded-2xl bg-white p-6 text-center shadow-2xl transition-all">
				{/* Success Icon */}
				<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
					<svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
					</svg>
				</div>

				{/* Title & Message */}
				<h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
				<p className="mb-6 text-gray-600">{message}</p>

				{/* Action Button */}
				<button
					onClick={onClose}
					className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
				>
					Continue
				</button>

				{/* Close button */}
				<button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
					<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		</div>
	);
};

const createRental = async (rentalData: any) => {
	const response = await axios.post('/rentals', rentalData);
	return response.data;
};

const RentalAddPage: React.FC = () => {
	const [categoryValue, setCategoryValue] = useState<number | null>(null);
	const [insuranceValue, setInsuranceValue] = useState<number>(1);
	const [showSuccessModal, setShowSuccessModal] = useState(false);

	const [rental, setRental] = useState<RentalFormData>({
		category: 0,
		name: '',
		description: '',
		contact_phone: '8258974175',
		delivery_time: '1 day',
		is_active: 0,
		insurance_required: 1,
		specifications: [],
		rates: [],
		delivery_fee: 0.0,
	});

	const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
	const [uploadingImages, setUploadingImages] = useState(false);

	const [newSpec, setNewSpec] = useState({ label: '', value: '' });
	const [newRate, setNewRate] = useState<{
		period: 'PerHour' | 'PerTrip';
		rate: string;
	}>({ period: 'PerHour', rate: '' });

	const queryClient = useQueryClient();

	// Fetch categories
	const { queryFn: getRentalFunc, queryKeys: rentalKey } = queryConfigs.useGetRentalCategories;

	const { data, isLoading, isError } = useGetQuery({
		func: getRentalFunc,
		key: rentalKey,
		params: {
			offset: 0,
			limit: 100, // get all for dropdown
		},
	});

	const { mutate: addRental, isPending } = useMutation({
		mutationFn: createRental,
		onSuccess: () => {
			// Show success modal instead of alert
			setShowSuccessModal(true);
			queryClient.invalidateQueries({ queryKey: ['rentals'] });
		},
		onError: (error) => {
			console.error('Error creating rental:', error);
			alert('Failed to create rental'); // Keep alert for errors if needed
		},
	});

	// Handle success modal close
	const handleSuccessModalClose = () => {
		setShowSuccessModal(false);
		window.history.back();
	};

	// Sync insurance value
	useEffect(() => {
		setRental((prev) => ({ ...prev, insurance_required: insuranceValue }));
	}, [insuranceValue]);

	// Image handling
	const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		const newImages: PendingImage[] = [];

		Array.from(files).forEach((file) => {
			if (!file.type.startsWith('image/')) return;

			const previewUrl = URL.createObjectURL(file);
			const isFirst = pendingImages.length === 0 && newImages.length === 0;

			newImages.push({
				uri: previewUrl,
				file,
				isPrimary: isFirst,
			});
		});

		setPendingImages((prev) => [...prev, ...newImages]);
	};

	const removePendingImage = (index: number) => {
		setPendingImages((prev) => {
			const updated = prev.filter((_, i) => i !== index);
			URL.revokeObjectURL(prev[index].uri);

			if (prev[index].isPrimary && updated.length > 0) {
				updated[0].isPrimary = true;
			}
			return updated;
		});
	};

	const setPendingPrimaryImage = (index: number) => {
		setPendingImages((prev) =>
			prev.map((img, i) => ({
				...img,
				isPrimary: i === index,
			})),
		);
	};

	// Specifications
	const addSpecification = () => {
		if (newSpec.label.trim() && newSpec.value.trim()) {
			setRental((prev) => ({
				...prev,
				specifications: [...prev.specifications, { ...newSpec }],
			}));
			setNewSpec({ label: '', value: '' });
		} else {
			alert('Please enter both label and value');
		}
	};

	const removeSpecification = (index: number) => {
		setRental((prev) => ({
			...prev,
			specifications: prev.specifications.filter((_, i) => i !== index),
		}));
	};

	// Rates
	const addRate = () => {
		const rateValue = parseFloat(newRate.rate);
		if (isNaN(rateValue) || rateValue <= 0) {
			alert('Please enter a valid positive rate amount');
			return;
		}
		setRental((prev) => ({
			...prev,
			rates: [...prev.rates, { period: newRate.period, rate: rateValue }],
		}));
		setNewRate({ period: 'PerHour', rate: '' });
	};

	const removeRate = (index: number) => {
		setRental((prev) => ({
			...prev,
			rates: prev.rates.filter((_, i) => i !== index),
		}));
	};

	// Submit
	const handleAddRental = async () => {
		if (pendingImages.length === 0) {
			alert('Please add at least one image');
			return;
		}
		if (!categoryValue) {
			alert('Please select a category');
			return;
		}
		if (!rental.name.trim()) {
			alert('Please enter a title');
			return;
		}
		if (!rental.contact_phone.trim()) {
			alert('Please enter a contact phone');
			return;
		}

		try {
			setUploadingImages(true);
			const uploadedImages: { image: string; is_primary: number }[] = [];

			for (const img of pendingImages) {
				const publicUrl = await uploadFileToS3(img.file);
				uploadedImages.push({
					image: publicUrl,
					is_primary: img.isPrimary ? 1 : 0,
				});
			}

			const requestData = {
				...rental,
				category: categoryValue,
				images: uploadedImages,
			};

			await addRental(requestData);
		} catch (error) {
			console.error('Error creating rental:', error);
			alert('Failed to create rental');
		} finally {
			setUploadingImages(false);
		}
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="text-xl">Loading categories...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 text-gray-900">
			<div className="mx-auto max-w-7xl p-4 md:p-6">
				<div className="mb-6 md:mb-8">
					<h1 className="text-2xl md:text-3xl font-bold">Add New Rental</h1>
					<p className="mt-2 text-gray-500">Fill in the details below to create a new rental listing</p>
				</div>

				{/* Loading Overlay */}
				{(isPending || uploadingImages) && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
						<div className="rounded-xl bg-white p-6 text-center">
							<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
							<p className="text-lg font-medium">{uploadingImages ? 'Uploading images...' : 'Creating rental...'}</p>
							<p className="mt-2 text-sm text-gray-600">Please don't close this page</p>
						</div>
					</div>
				)}

				{/* Success Modal */}
				<SuccessModal
					isOpen={showSuccessModal}
					onClose={handleSuccessModalClose}
					title="Rental Created Successfully!"
					message="Your rental listing has been created and is now visible to customers."
				/>

				<div className="grid gap-6 lg:grid-cols-3">
					{/* Images Section */}
					<div className="lg:col-span-1">
						<div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
							<h2 className="mb-4 text-lg md:text-xl font-semibold">Images</h2>

							<div className="mb-4">
								<label className="mb-2 block text-sm font-medium">Upload Images *</label>
								<input
									type="file"
									accept="image/*"
									multiple
									onChange={handleImageSelection}
									className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm file:mr-4 file:rounded file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-white"
								/>
								<p className="mt-2 text-sm text-gray-500">At least one image required. First image becomes primary by default.</p>
							</div>

							<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
								{pendingImages.map((image, index) => (
									<div key={index} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-300 bg-gray-100">
										<img src={image.uri} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
										<div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/40">
											<div className="absolute bottom-0 left-0 right-0 flex translate-y-full justify-between bg-black/60 p-2 transition-transform group-hover:translate-y-0">
												<button
													onClick={() => setPendingPrimaryImage(index)}
													className={`rounded px-2 py-1 text-xs font-medium ${
														image.isPrimary ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white hover:bg-gray-700'
													}`}
												>
													{image.isPrimary ? 'Primary' : 'Set Primary'}
												</button>
												<button
													onClick={() => removePendingImage(index)}
													className="rounded bg-red-500 p-1 text-white hover:bg-red-600"
												>
													<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
													</svg>
												</button>
											</div>
										</div>
										{image.isPrimary && (
											<div className="absolute top-2 left-2 rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white">Primary</div>
										)}
									</div>
								))}
							</div>

							{pendingImages.length > 0 && (
								<div className="mt-4 rounded-lg bg-gray-100 p-3">
									<p className="text-sm font-medium">
										{pendingImages.length} image{pendingImages.length !== 1 ? 's' : ''} selected
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Form Section */}
					<div className="lg:col-span-2 space-y-6">
						{/* Basic Info */}
						<div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
							<h2 className="mb-4 text-lg md:text-xl font-semibold">Basic Information</h2>
							<div className="grid gap-4 md:grid-cols-2">
								<div>
									<label className="mb-2 block text-sm font-medium">Category *</label>
									<select
										value={categoryValue ?? ''}
										onChange={(e) => {
											const val = e.target.value ? Number(e.target.value) : null;
											setCategoryValue(val);
											setRental((prev) => ({ ...prev, category: val ?? 0 }));
										}}
										className="w-full rounded-lg border border-gray-300 px-4 py-3"
									>
										<option value="">-- Select Category --</option>

										{data?.result.list.map((category: TCategory) => (
											<option key={category.id} value={category.id} disabled={category.is_active === 1}>
												{category.name}
												{category.is_active === 1 && ' (Disabled)'}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium">Insurance Required</label>
									<select
										value={insuranceValue}
										onChange={(e) => setInsuranceValue(Number(e.target.value))}
										className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
									>
										<option value={1}>Required</option>
										<option value={0}>Not Required</option>
									</select>
								</div>

								<div className="md:col-span-2">
									<label className="mb-2 block text-sm font-medium">Title *</label>
									<input
										type="text"
										value={rental.name}
										onChange={(e) => setRental((prev) => ({ ...prev, name: e.target.value }))}
										placeholder="e.g., Professional DSLR Camera"
										className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<div className="md:col-span-2">
									<label className="mb-2 block text-sm font-medium">Description</label>
									<textarea
										rows={4}
										value={rental.description}
										onChange={(e) => setRental((prev) => ({ ...prev, description: e.target.value }))}
										placeholder="Describe your rental item..."
										className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium">Contact Phone *</label>
									<input
										type="tel"
										value={rental.contact_phone}
										onChange={(e) => setRental((prev) => ({ ...prev, contact_phone: e.target.value }))}
										placeholder="+1234567890"
										className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium">Delivery Time</label>
									<input
										type="text"
										value={rental.delivery_time}
										onChange={(e) => setRental((prev) => ({ ...prev, delivery_time: e.target.value }))}
										placeholder="e.g., 2-3 business days"
										className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium">Delivery Fee ($)</label>
									<input
										type="number"
										min="0"
										step="0.01"
										value={rental.delivery_fee}
										onChange={(e) => setRental((prev) => ({ ...prev, delivery_fee: parseFloat(e.target.value) || 0 }))}
										placeholder="0.00"
										className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
									/>
								</div>
							</div>
						</div>

						{/* Specifications */}
						<div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
							<h2 className="mb-4 text-lg md:text-xl font-semibold">Specifications</h2>
							<div className="mb-4 grid gap-3 sm:grid-cols-3">
								<input
									type="text"
									value={newSpec.label}
									onChange={(e) => setNewSpec((prev) => ({ ...prev, label: e.target.value }))}
									placeholder="Label (e.g., Brand)"
									className="rounded-lg border border-gray-300 px-4 py-3"
								/>
								<input
									type="text"
									value={newSpec.value}
									onChange={(e) => setNewSpec((prev) => ({ ...prev, value: e.target.value }))}
									placeholder="Value (e.g., Canon)"
									className="rounded-lg border border-gray-300 px-4 py-3"
								/>
								<button
									onClick={addSpecification}
									className="flex items-center justify-center rounded-lg bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600"
								>
									<svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
									</svg>
									Add
								</button>
							</div>

							<div className="space-y-3">
								{rental.specifications.length === 0 ? (
									<p className="rounded-lg bg-gray-100 p-4 text-center text-gray-600">No specifications added yet</p>
								) : (
									rental.specifications.map((spec, i) => (
										<div key={i} className="flex items-center justify-between rounded-lg bg-gray-100 p-4">
											<div>
												<span className="font-medium">{spec.label}:</span>
												<span className="ml-2 text-gray-700">{spec.value}</span>
											</div>
											<button onClick={() => removeSpecification(i)} className="text-red-600 hover:text-red-800">
												Remove
											</button>
										</div>
									))
								)}
							</div>
						</div>

						{/* Rates */}
						<div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
							<h2 className="mb-4 text-lg md:text-xl font-semibold">Rental Rates</h2>
							<div className="mb-4 grid gap-3 sm:grid-cols-3">
								<select
									value={newRate.period}
									onChange={(e) => setNewRate((prev) => ({ ...prev, period: e.target.value as any }))}
									className="rounded-lg border border-gray-300 px-4 py-3"
								>
									<option value="PerHour">Per Hour</option>
									<option value="PerTrip">Per Trip</option>
								</select>
								<input
									type="number"
									min="0"
									step="0.01"
									value={newRate.rate}
									onChange={(e) => setNewRate((prev) => ({ ...prev, rate: e.target.value }))}
									placeholder="Rate Amount"
									className="rounded-lg border border-gray-300 px-4 py-3"
								/>
								<button
									onClick={addRate}
									className="flex items-center justify-center rounded-lg bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600"
								>
									<svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
									</svg>
									Add Rate
								</button>
							</div>

							<div className="space-y-3">
								{rental.rates.length === 0 ? (
									<p className="rounded-lg bg-gray-100 p-4 text-center text-gray-600">No rates added yet</p>
								) : (
									rental.rates.map((rate, i) => (
										<div key={i} className="flex items-center justify-between rounded-lg bg-gray-100 p-4">
											<div>
												<span className="font-medium">{rate.period === 'PerHour' ? 'Hourly' : 'Per Trip'} Rate:</span>
												<span className="ml-2 text-lg font-semibold text-blue-600">${rate.rate.toFixed(2)}</span>
											</div>
											<button onClick={() => removeRate(i)} className="text-red-600 hover:text-red-800">
												Remove
											</button>
										</div>
									))
								)}
							</div>
						</div>

						{/* Actions */}
						<div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
							<button
								onClick={() => window.history.back()}
								className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
							>
								Cancel
							</button>
							<button
								onClick={handleAddRental}
								disabled={
									isPending ||
									uploadingImages ||
									pendingImages.length === 0 ||
									!categoryValue ||
									!rental.name.trim() ||
									!rental.contact_phone.trim()
								}
								className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Create Rental
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
  };

export default RentalAddPage;
