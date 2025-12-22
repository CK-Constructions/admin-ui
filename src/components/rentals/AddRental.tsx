// import React, { useState, useEffect, useCallback } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useToaster } from 'react-hot-toast';
// import { queryConfigs } from '../../query/queryConfig';
// // Adjust path

// interface RentalSpec {
// 	label: string;
// 	value: string;
// }

// interface RentalRate {
// 	period: 'per trip' | 'per hour';
// 	rate: number;
// }

// interface PendingImage {
// 	id: string;
// 	uri: string;
// 	file: File;
// 	isPrimary: boolean;
// }

// const RentalAddScreen: React.FC = () => {
// 	const [rental, setRental] = useState({
// 		category: 0,
// 		name: '',
// 		description: '',
// 		contact_phone: '',
// 		delivery_time: '',
// 		is_active: 1,
// 		insurance_required: 1,
// 		specifications: [] as RentalSpec[],
// 		rates: [] as RentalRate[],
// 		delivery_fee: 0.0,
// 	});

// 	const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
// 	const [uploadingImages, setUploadingImages] = useState(false);
// 	const [newSpec, setNewSpec] = useState({ label: '', value: '' });
// 	const [newRate, setNewRate] = useState({ period: 'Daily' as const, rate: '' });

// 	const queryClient = useQueryClient();
// 	const { toasts } = useToaster();

// 	const { data: categories, isLoading: loadingCategories } = useQuery({
// 		queryKey: ['rentalCategories'],
// 		queryFn: () => queryConfigs.useGetRentalCategories.queryFn({ limit: 1000, offset: 0 }),
// 	});

// 	const addRentalMutation = useMutation({
// 		mutationFn: queryConfigs.useAddRentals.queryFn,
// 		onSuccess: () => {
// 			console.log('Rental created successfully', 'success');
// 			queryClient.invalidateQueries({ queryKey: ['rentals'] });
// 			window.history.back();
// 		},
// 		onError: () => console.log('Failed to create rental', 'error'),
// 	});

// 	const categoryItems = categories?.data?.result?.list || [];

// 	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		const files = e.target.files;
// 		if (!files) return;

// 		Array.from(files).forEach((file) => {
// 			if (!file.type.startsWith('image/')) return;

// 			const uri = URL.createObjectURL(file);
// 			const newImage: PendingImage = {
// 				id: Math.random().toString(36),
// 				uri,
// 				file,
// 				isPrimary: pendingImages.length === 0,
// 			};
// 			setPendingImages((prev) => [...prev, newImage]);
// 		});

// 		e.target.value = ''; // Reset input
// 	};

// 	const removeImage = (id: string) => {
// 		setPendingImages((prev) => {
// 			const filtered = prev.filter((img) => img.id !== id);
// 			if (filtered.length > 0 && !filtered.some((i) => i.isPrimary)) {
// 				filtered[0].isPrimary = true;
// 			}
// 			return filtered;
// 		});
// 	};

// 	const setPrimaryImage = (id: string) => {
// 		setPendingImages((prev) => prev.map((img) => ({ ...img, isPrimary: img.id === id })));
// 	};

// 	const addSpecification = () => {
// 		if (!newSpec.label.trim() || !newSpec.value.trim()) {
// 			showToast('Both label and value are required', 'error');
// 			return;
// 		}
// 		setRental((prev) => ({
// 			...prev,
// 			specifications: [...prev.specifications, { ...newSpec }],
// 		}));
// 		setNewSpec({ label: '', value: '' });
// 	};

// 	const addRate = () => {
// 		const rateNum = parseFloat(newRate.rate);
// 		if (!newRate.rate || isNaN(rateNum) || rateNum <= 0) {
// 			showToast('Enter a valid rate amount', 'error');
// 			return;
// 		}
// 		setRental((prev) => ({
// 			...prev,
// 			rates: [...prev.rates, { period: newRate.period, rate: rateNum }],
// 		}));
// 		setNewRate({ period: 'Daily', rate: '' });
// 	};

// 	const handleSubmit = async () => {
// 		if (!rental.name || !rental.category || pendingImages.length === 0) {
// 			showToast('Title, category, and at least one image are required', 'error');
// 			return;
// 		}

// 		try {
// 			setUploadingImages(true);
// 			const uploadedImages = [];

// 			for (const img of pendingImages) {
// 				const formData = new FormData();
// 				formData.append('file', img.file);
// 				formData.append('width', '800');
// 				formData.append('height', '600');

// 				try {
// 					const res = await uploadFileToS3(formData);
// 					uploadedImages.push({
// 						image: res.id,
// 						is_primary: img.isPrimary ? 1 : 0,
// 					});
// 				} catch (err) {
// 					showToast('Failed to upload one or more images', 'error');
// 					return;
// 				}
// 			}

// 			await addRentalMutation.mutateAsync({
// 				...rental,
// 				images: uploadedImages,
// 			});
// 		} catch (err) {
// 			console.error(err);
// 		} finally {
// 			setUploadingImages(false);
// 		}
// 	};

// 	const isSubmitting = addRentalMutation.isPending || uploadingImages;

// 	return (
// 		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
// 			<div className="max-w-4xl mx-auto px-6">
// 				<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Add New Rental</h1>

// 				{/* Images Section */}
// 				<section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
// 					<h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Images</h2>
// 					<div className="flex gap-4 mb-6">
// 						<label className="flex-1 cursor-pointer">
// 							<input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" disabled={isSubmitting} />
// 							<div className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition">
// 								<PhotoIcon className="w-5 h-5" />
// 								<span>Choose from Gallery</span>
// 							</div>
// 						</label>
// 						<label className="flex-1 cursor-pointer">
// 							<input type="file" accept="image/*" capture="environment" onChange={handleImageSelect} className="hidden" />
// 							<div className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition">
// 								<CameraIcon className="w-5 h-5" />
// 								<span>Take Photo</span>
// 							</div>
// 						</label>
// 					</div>

// 					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
// 						{pendingImages.map((img) => (
// 							<div key={img.id} className="relative group rounded-lg overflow-hidden bg-gray-100">
// 								<img src={img.uri} alt="preview" className="w-full h-48 object-cover" />
// 								<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
// 									<button
// 										onClick={() => setPrimaryImage(img.id)}
// 										className={`px-3 py-1 rounded text-xs text-white mr-2 ${img.isPrimary ? 'bg-green-600' : 'bg-blue-600'}`}
// 									>
// 										{img.isPrimary ? 'Primary' : 'Set Primary'}
// 									</button>
// 									<button onClick={() => removeImage(img.id)} className="p-2 bg-red-600 rounded-full">
// 										<XMarkIcon className="w-5 h-5 text-white" />
// 									</button>
// 								</div>
// 								{img.isPrimary && <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">Primary</div>}
// 								<div className="absolute bottom-0 left-0 right-0 bg-yellow-500 text-white text-center py-1 text-xs">Pending Upload</div>
// 							</div>
// 						))}
// 					</div>
// 				</section>

// 				<div className="grid md:grid-cols-2 gap-8">
// 					{/* Left Column */}
// 					<div className="space-y-6">
// 						<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
// 							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
// 							<select
// 								value={rental.category}
// 								onChange={(e) => setRental({ ...rental, category: Number(e.target.value) })}
// 								className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
// 								disabled={loadingCategories}
// 							>
// 								<option value={0}>Select Category</option>
// 								{categoryItems.map((cat: any) => (
// 									<option key={cat.id} value={cat.id} disabled={!cat.is_active}>
// 										{cat.name} {cat.is_active ? '' : '(Inactive)'}
// 									</option>
// 								))}
// 							</select>
// 						</div>

// 						<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
// 							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
// 							<input
// 								type="text"
// 								value={rental.name}
// 								onChange={(e) => setRental({ ...rental, name: e.target.value })}
// 								placeholder="Rental Title"
// 								className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
// 							/>
// 						</div>

// 						<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
// 							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Insurance Required</label>
// 							<select
// 								value={rental.insurance_required}
// 								onChange={(e) => setRental({ ...rental, insurance_required: Number(e.target.value) })}
// 								className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
// 							>
// 								<option value={1}>Required</option>
// 								<option value={0}>Not Required</option>
// 							</select>
// 						</div>

// 						<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
// 							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Phone</label>
// 							<input
// 								type="tel"
// 								value={rental.contact_phone}
// 								onChange={(e) => setRental({ ...rental, contact_phone: e.target.value })}
// 								placeholder="Contact Phone"
// 								className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
// 							/>
// 						</div>
// 					</div>

// 					{/* Right Column */}
// 					<div className="space-y-6">
// 						<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
// 							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
// 							<textarea
// 								rows={5}
// 								value={rental.description}
// 								onChange={(e) => setRental({ ...rental, description: e.target.value })}
// 								placeholder="Describe your rental..."
// 								className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
// 							/>
// 						</div>

// 						<div className="grid grid-cols-2 gap-4">
// 							<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
// 								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Delivery Time</label>
// 								<input
// 									type="text"
// 									value={rental.delivery_time}
// 									onChange={(e) => setRental({ ...rental, delivery_time: e.target.value })}
// 									placeholder="e.g. 2-3 hours"
// 									className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
// 								/>
// 							</div>
// 							<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
// 								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Delivery Fee ($)</label>
// 								<input
// 									type="number"
// 									step="0.01"
// 									value={rental.delivery_fee}
// 									onChange={(e) => setRental({ ...rental, delivery_fee: parseFloat(e.target.value) || 0 })}
// 									placeholder="0.00"
// 									className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
// 								/>
// 							</div>
// 						</div>
// 					</div>
// 				</div>

// 				{/* Specifications */}
// 				<section className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
// 					<h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Specifications</h2>
// 					<div className="flex gap-3 mb-4">
// 						<input
// 							placeholder="Label (e.g. Brand)"
// 							value={newSpec.label}
// 							onChange={(e) => setNewSpec({ ...newSpec, label: e.target.value })}
// 							className="flex-1 px-4 py-3 border rounded-lg dark:bg-gray-700"
// 						/>
// 						<input
// 							placeholder="Value (e.g. Canon)"
// 							value={newSpec.value}
// 							onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
// 							className="flex-1 px-4 py-3 border rounded-lg dark:bg-gray-700"
// 						/>
// 						<button onClick={addSpecification} className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
// 							<PlusIcon className="w-6 h-6" />
// 						</button>
// 					</div>
// 					<div className="space-y-2">
// 						{rental.specifications.map((spec, i) => (
// 							<div key={i} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded">
// 								<div>
// 									<strong>{spec.label}:</strong> {spec.value}
// 								</div>
// 								<button onClick={() => setRental({ ...rental, specifications: rental.specifications.filter((_, idx) => idx !== i) })}>
// 									<XMarkIcon className="w-5 h-5 text-red-600" />
// 								</button>
// 							</div>
// 						))}
// 					</div>
// 				</section>

// 				{/* Rates */}
// 				<section className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
// 					<h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Rental Rates</h2>
// 					<div className="flex gap-3 mb-4">
// 						<select
// 							value={newRate.period}
// 							onChange={(e) => setNewRate({ ...newRate, period: e.target.value as any })}
// 							className="px-4 py-3 border rounded-lg dark:bg-gray-700"
// 						>
// 							<option>Daily</option>
// 							<option>Weekly</option>
// 							<option>Monthly</option>
// 						</select>
// 						<input
// 							type="number"
// 							placeholder="Rate Amount"
// 							value={newRate.rate}
// 							onChange={(e) => setNewRate({ ...newRate, rate: e.target.value })}
// 							className="flex-1 px-4 py-3 border rounded-lg dark:bg-gray-700"
// 						/>
// 						<button onClick={addRate} className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
// 							<PlusIcon className="w-6 h-6" />
// 						</button>
// 					</div>
// 					<div className="space-y-2">
// 						{rental.rates.map((rate, i) => (
// 							<div key={i} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded">
// 								<div>
// 									<strong>{rate.period} Rate:</strong> ${rate.rate.toFixed(2)}
// 								</div>
// 								<button onClick={() => setRental({ ...rental, rates: rental.rates.filter((_, idx) => idx !== i) })}>
// 									<XMarkIcon className="w-5 h-5 text-red-600" />
// 								</button>
// 							</div>
// 						))}
// 					</div>
// 				</section>

// 				{/* Submit Buttons */}
// 				<div className="mt-10 flex justify-center gap-6">
// 					<button
// 						onClick={handleSubmit}
// 						disabled={isSubmitting}
// 						className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
// 					>
// 						{isSubmitting ? 'Creating & Uploading...' : `Create Rental ${pendingImages.length > 0 ? `(${pendingImages.length} images)` : ''}`}
// 					</button>
// 					<button onClick={() => window.history.back()} className="px-8 py-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">
// 						Cancel
// 					</button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default RentalAddScreen;
import React from 'react';

const AddRental = () => {
	return <div>AddRental</div>;
};

export default AddRental;
