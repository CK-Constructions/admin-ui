import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFileToS3, UpdateService } from '../../api';
import { useGetQuery } from '../../query/hooks/queryHook';
import { queryConfigs } from '../../query/queryConfig';
import { ServiceBody } from '../lib/types/payloads';

interface ServiceSpec {
	id?: number;
	label: string;
	value: string;
}

interface ServiceRate {
	id?: number;
	period: 'Daily' | 'Weekly' | 'Monthly';
	rate: number;
}

interface ServiceImage {
	id?: number;
	image: string;
	is_primary: number;
}

interface PendingImage {
	id?: number;
	file?: File;
	uri: string;
	isPrimary: boolean;
	isFromDB?: boolean;
}

const ServiceUpdatePage: React.FC = () => {
	const { id } = useParams();
	const queryClient = useQueryClient();
	const serviceId = Number(id);

	/* -------------------- State -------------------- */
	const [category, setCategory] = useState<number | null>(null);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [contactPhone, setContactPhone] = useState('');
	const [deliveryTime, setDeliveryTime] = useState('');
	const [specifications, setSpecifications] = useState<ServiceSpec[]>([]);
	const [rates, setRates] = useState<ServiceRate[]>([]);
	const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

	const [newSpec, setNewSpec] = useState<ServiceSpec>({ label: '', value: '' });
	const [newRate, setNewRate] = useState<{ period: ServiceRate['period']; rate: string }>({
		period: 'Daily',
		rate: '',
	});

	/* -------------------- Fetch Service -------------------- */
	const { queryFn: serviceFunc, queryKeys: serviceKey } = queryConfigs.useGetServiceDetails;
	const { data, isLoading } = useGetQuery({
		func: serviceFunc,
		key: serviceKey,
		params: { id: serviceId },
		isEnabled: !!serviceId,
	});

	const serviceData = data?.result;

	useEffect(() => {
		if (!serviceData) return;

		setCategory(serviceData.category);
		setTitle(serviceData.name);
		setDescription(serviceData.description);
		setContactPhone(serviceData.contact_phone);
		setDeliveryTime(serviceData.delivery_time);

		setSpecifications(serviceData.specifications ?? []);
		setRates(
			serviceData.rates_list?.map((r: any) => ({
				id: r.id,
				period: r.period,
				rate: r.rate,
			})) ?? [],
		);

		const existingImages =
			serviceData.images_list?.map((img: any) => ({
				id: img.id,
				uri: img.image,
				isPrimary: img.is_primary === 1,
				isFromDB: true,
			})) ?? [];

		setPendingImages(existingImages);
	}, [serviceData]);

	/* -------------------- Mutation -------------------- */
	const { mutateAsync: updateService, isPending } = useMutation({
		mutationFn: UpdateService,
		onSuccess: () => {
			alert('Service updated successfully!');
			queryClient.invalidateQueries();
			window.history.back();
		},
		onError: (err: any) => alert(err?.message || 'Failed to update'),
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
		setPendingImages((prev) => [...prev, ...newImages]);
	};

	const setPrimaryImage = (index: number) => {
		setPendingImages((prev) => prev.map((img, i) => ({ ...img, isPrimary: i === index })));
	};

	const removeImage = (index: number) => {
		setPendingImages((prev) => prev.filter((_, i) => i !== index));
	};

	/* -------------------- Specs & Rates -------------------- */
	const addSpec = () => {
		if (!newSpec.label || !newSpec.value) return alert('Label & Value required');
		setSpecifications((prev) => [...prev, newSpec]);
		setNewSpec({ label: '', value: '' });
	};

	const removeSpec = (index: number) => setSpecifications((prev) => prev.filter((_, i) => i !== index));

	const addRate = () => {
		const rateValue = Number(newRate.rate);
		if (!rateValue || rates.some((r) => r.period === newRate.period)) return alert('Invalid rate');
		setRates((prev) => [...prev, { period: newRate.period, rate: rateValue }]);
		setNewRate({ period: 'Daily', rate: '' });
	};

	const removeRate = (index: number) => setRates((prev) => prev.filter((_, i) => i !== index));

	/* -------------------- Submit Update -------------------- */
	const handleSubmit = async () => {
		if (!serviceId || !category || !title || !deliveryTime) return alert('Required fields missing');

		// Upload new images
		const finalImages: ServiceImage[] = [];
		for (const img of pendingImages) {
			if (img.isFromDB) {
				finalImages.push({ id: img.id, image: img.uri, is_primary: img.isPrimary ? 1 : 0 });
			} else if (img.file) {
				const url = await uploadFileToS3(img.file);
				finalImages.push({ image: url, is_primary: img.isPrimary ? 1 : 0 });
			}
		}

		const body: ServiceBody = {
			id: serviceId, // <-- lowercase
			category,
			title,
			description,
			contact_phone: contactPhone,
			delivery_time: deliveryTime,
			specifications: specifications.length ? specifications : undefined,
			// rates: rates.length ? rates : undefined,
			images: finalImages.length ? finalImages : undefined,
		};

		await updateService({
			id: serviceId, // number, not string
			body: {
				id: serviceId, // payload field
				category,
				title,
				description,
				contact_phone: contactPhone,
				delivery_time: deliveryTime,
				specifications: specifications.length ? specifications : undefined,
				// rates: rates.length ? rates : undefined,
				images: finalImages.length ? finalImages : undefined,
			},
		});
	};

	if (isLoading) return <div className="p-10">Loading service...</div>;

	return (
		<div className="max-w-5xl mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-bold">Update Service</h1>

			<input className="w-full border p-3" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
			<textarea className="w-full border p-3" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
			<input className="w-full border p-3" placeholder="Phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
			<input className="w-full border p-3" placeholder="Delivery Time" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />

			{/* Images */}
			<input type="file" multiple accept="image/*" onChange={handleImageSelect} />
			{pendingImages.map((img, i) => (
				<div key={i} className="flex gap-3 items-center my-2">
					<img src={img.uri} className="w-20 h-20 rounded object-cover" />
					<button className="bg-blue-600 text-white px-3 py-1" onClick={() => setPrimaryImage(i)}>
						{img.isPrimary ? 'Primary' : 'Set Primary'}
					</button>
					<button className="bg-red-600 text-white px-3 py-1" onClick={() => removeImage(i)}>
						Remove
					</button>
				</div>
			))}

			{/* Specifications */}
			<div className="space-y-2">
				<h3 className="font-semibold">Specifications</h3>
				<div className="flex gap-2">
					<input
						placeholder="Label"
						value={newSpec.label}
						onChange={(e) => setNewSpec({ ...newSpec, label: e.target.value })}
						className="border p-2 flex-1"
					/>
					<input
						placeholder="Value"
						value={newSpec.value}
						onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
						className="border p-2 flex-1"
					/>
					<button onClick={addSpec} className="bg-blue-600 text-white px-4 rounded">
						Add
					</button>
				</div>
				{specifications.map((s, i) => (
					<div key={i} className="flex justify-between">
						<span>
							{s.label}: {s.value}
						</span>
						<button onClick={() => removeSpec(i)} className="text-red-600">
							Remove
						</button>
					</div>
				))}
			</div>

			{/* Rates */}

			<button onClick={handleSubmit} disabled={isPending} className="bg-green-600 text-white px-6 py-3 rounded">
				{isPending ? 'Updating...' : 'Update Service'}
			</button>
		</div>
	);
};

export default ServiceUpdatePage;
