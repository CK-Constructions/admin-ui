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
	const { id } = useParams();
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

		setRates(rentalData.rates_list ?? []);
		setSpecifications(rentalData.specifications ?? []);

		const dbImages: RentalImage[] = (rentalData.images_list ?? []).map((img: any) => ({
			uri: img.image,
			isPrimary: img.is_primary === 1,
			id: img.id,
			isFromDB: true,
		}));
		setImages(dbImages);
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
			isPrimary: false,
		}));
		setImages((prev) => [...prev, ...newImages]);
	};

	const setPrimaryImage = (index: number) => {
		setImages((prev) => prev.map((img, i) => ({ ...img, isPrimary: i === index })));
	};

	const removeImage = (index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	};

	/* -------------------- Submit -------------------- */
	const handleSubmit = async () => {
		if (!title || !category || !contactPhone) return alert('Please fill required fields');

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
			name: title,
			category,
			description,
			contact_phone: contactPhone,
			delivery_time: deliveryTime,
			delivery_fee: deliveryFee,
			insurance_required: insuranceRequired ? 1 : 0,
			rates: rates.length > 0 ? rates : undefined,
			specifications: specifications.length > 0 ? specifications : undefined,
			images: uploadedImages.length > 0 ? uploadedImages : undefined,
		};

		await updateRental({ id: Number(id), body });
	};

	if (isLoading) return <div className="p-10">Loading rental...</div>;

	/* -------------------- UI -------------------- */
	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-bold">Update Rental</h1>

			<input className="w-full border p-3" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
			<input className="w-full border p-3" value={category ?? ''} onChange={(e) => setCategory(Number(e.target.value))} placeholder="Category ID" />
			<textarea className="w-full border p-3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
			<input className="w-full border p-3" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="Contact Phone" />
			<input className="w-full border p-3" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} placeholder="Delivery Time" />
			<input
				className="w-full border p-3"
				type="number"
				value={deliveryFee ?? ''}
				onChange={(e) => setDeliveryFee(Number(e.target.value))}
				placeholder="Delivery Fee"
			/>
			<label>
				<input type="checkbox" checked={insuranceRequired} onChange={(e) => setInsuranceRequired(e.target.checked)} /> Insurance Required
			</label>

			{/* Images */}
			<input type="file" multiple accept="image/*" onChange={handleImageSelect} />
			{images.map((img, i) => (
				<div key={i} className="flex items-center gap-3">
					<img src={img.uri} className="w-20 h-20 rounded object-cover" />
					<button className="bg-blue-600 text-white px-3 py-1" onClick={() => setPrimaryImage(i)}>
						{img.isPrimary ? 'Primary' : 'Set Primary'}
					</button>
					<button className="bg-red-600 text-white px-3 py-1" onClick={() => removeImage(i)}>
						Remove
					</button>
				</div>
			))}

			<button onClick={handleSubmit} disabled={isPending} className="bg-green-600 text-white px-6 py-3 rounded">
				{isPending ? 'Updating...' : 'Update Rental'}
			</button>
		</div>
	);
};

export default RentalUpdatePage;
