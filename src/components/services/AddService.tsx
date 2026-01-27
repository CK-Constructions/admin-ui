import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddService, uploadFileToS3 } from '../../api';
import { useGetQuery } from '../../query/hooks/queryHook';
import { queryConfigs } from '../../query/queryConfig';
import { TCategory } from '../lib/types/response';
import { ServiceBody } from '../lib/types/payloads';
import { ArrowBack } from '@mui/icons-material';
import { Navigate, useNavigate } from 'react-router';

/* -------------------- Types -------------------- */

interface ServiceSpec {
	label: string;
	value: string;
}

interface ServiceRate {
	period: 'Daily' | 'Weekly' | 'Monthly';
	rate: number;
}

interface PendingImage {
	file: File;
	uri: string;
	isPrimary: boolean;
}

/* -------------------- Component -------------------- */

const ServiceAddPage: React.FC = () => {
	const queryClient = useQueryClient();

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

	const [uploading, setUploading] = useState(false);

	/* -------------------- Categories -------------------- */

	const { queryFn, queryKeys } = queryConfigs.useGetServiceCategories;
	const { data, isLoading } = useGetQuery({
		func: queryFn,
		key: queryKeys,
		params: { offset: 0, limit: 100 },
	});

	/* -------------------- Mutation -------------------- */

	const { mutateAsync: addService, isPending } = useMutation({
		mutationFn: AddService,
		onSuccess: () => {
			alert('Service created successfully');
			queryClient.invalidateQueries({ queryKey: ['services'] });
			window.history.back();
		},
		onError: (err: any) => {
			alert(err?.message || 'Failed to create service');
		},
	});

	/* -------------------- Image Handling -------------------- */

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		const imgs: PendingImage[] = Array.from(files)
			.filter((f) => f.type.startsWith('image/'))
			.map((file, index) => ({
				file,
				uri: URL.createObjectURL(file),
				isPrimary: pendingImages.length === 0 && index === 0,
			}));

		setPendingImages((prev) => [...prev, ...imgs]);
	};

	const setPrimaryImage = (index: number) => {
		setPendingImages((prev) => prev.map((img, i) => ({ ...img, isPrimary: i === index })));
	};

	const removeImage = (index: number) => {
		setPendingImages((prev) => prev.filter((_, i) => i !== index));
	};

	useEffect(() => {
		return () => {
			pendingImages.forEach((img) => URL.revokeObjectURL(img.uri));
		};
	}, [pendingImages]);

	/* -------------------- Specs -------------------- */

	const addSpec = () => {
		if (!newSpec.label || !newSpec.value) {
			alert('Label and value are required');
			return;
		}
		setSpecifications((prev) => [...prev, newSpec]);
		setNewSpec({ label: '', value: '' });
	};

	const removeSpec = (index: number) => {
		setSpecifications((prev) => prev.filter((_, i) => i !== index));
	};

	/* -------------------- Rates -------------------- */

	const addRate = () => {
		const rateValue = Number(newRate.rate);

		if (isNaN(rateValue) || rateValue <= 0) {
			alert('Enter a valid rate');
			return;
		}

		if (rates.some((r) => r.period === newRate.period)) {
			alert('Rate for this period already exists');
			return;
		}

		setRates((prev) => [...prev, { period: newRate.period, rate: rateValue }]);
		setNewRate({ period: 'Daily', rate: '' });
	};

	const removeRate = (index: number) => {
		setRates((prev) => prev.filter((_, i) => i !== index));
	};

	/* -------------------- Submit -------------------- */

	const handleSubmit = async () => {
		if (!category) return alert('Category is required');
		if (!title.trim()) return alert('Title is required');
		if (!deliveryTime.trim()) return alert('Delivery time is required');
		// if (rates.length === 0) return alert('At least one rate is required');
		if (pendingImages.length === 0) return alert('At least one image is required');

		setUploading(true);

		try {
			if (!pendingImages.some((i) => i.isPrimary)) {
				pendingImages[0].isPrimary = true;
			}

			const uploadedImages = [];
			for (const img of pendingImages) {
				const url = await uploadFileToS3(img.file);
				uploadedImages.push({
					image: url,
					is_primary: img.isPrimary ? 1 : 0,
				});
			}

			const payload: ServiceBody = {
				category,
				title,
				description,
				contact_phone: contactPhone,
				delivery_time: deliveryTime,
				specifications: specifications.length ? specifications : undefined,
				images: uploadedImages,
				is_active: 0,
			};

			await addService(payload);
		} finally {
			setUploading(false);
		}
	};

	if (isLoading) return <div className="p-10">Loading...</div>;

	/* -------------------- UI -------------------- */

	return (
		<div className="max-w-5xl mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-bold">Add Admin Service</h1>

			{/* Category */}
			<select className="w-full border p-3 rounded" value={category ?? ''} onChange={(e) => setCategory(Number(e.target.value))}>
				<option value="">Select Category</option>
				{data?.result?.list.map((c: TCategory) => (
					<option key={c.id} value={c.id} disabled={c.is_active === 1}>
						{c.name}
					</option>
				))}
			</select>

			{/* Basic Fields */}
			<input className="w-full border p-3 rounded" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
			<textarea className="w-full border p-3 rounded" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
			<input className="w-full border p-3 rounded" placeholder="Contact Phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
			<input className="w-full border p-3 rounded" placeholder="Delivery Time" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />

			{/* Images */}
			<input type="file" multiple accept="image/*" onChange={handleImageSelect} />
			{pendingImages.map((img, i) => (
				<div key={i} className="flex gap-3 items-center">
					<img src={img.uri} className="w-20 h-20 object-cover rounded" />
					<button onClick={() => setPrimaryImage(i)} className="bg-blue-600 text-white px-3 py-1 rounded">
						{img.isPrimary ? 'Primary' : 'Set Primary'}
					</button>
					<button onClick={() => removeImage(i)} className="bg-red-600 text-white px-3 py-1 rounded">
						Remove
					</button>
				</div>
			))}

			{/* Specifications */}
			<h3 className="font-semibold">Specifications</h3>
			<div className="flex gap-2">
				<input
					placeholder="Label"
					className="border p-2 flex-1"
					value={newSpec.label}
					onChange={(e) => setNewSpec({ ...newSpec, label: e.target.value })}
				/>
				<input
					placeholder="Value"
					className="border p-2 flex-1"
					value={newSpec.value}
					onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
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

			{/* Rates */}

			{/* Submit */}
			<button onClick={handleSubmit} disabled={isPending || uploading} className="bg-green-600 text-white px-6 py-3 rounded">
				{uploading ? 'Uploading...' : 'Create Service'}
			</button>
		</div>
	);
};

export default ServiceAddPage;
