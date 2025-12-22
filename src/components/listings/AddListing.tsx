import React, { useState } from 'react';
import { Autocomplete, Box, Button, Grid, TextField, Typography } from '@mui/material';
import { uploadFileToS3 } from '../../api';
import { showNotification } from '../utils/utils';
import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery } from '../../query/hooks/queryHook';
import { TCategory } from '../lib/types/response';
import { useNavigate } from 'react-router';

interface TAttribute {
	attribute_name: string;
	attribute_value: string;
}
interface TImage {
	image: string;
	is_primary: boolean;
	preview?: string; // Local preview URL
}
interface TListingBody {
	seller_id: number;
	category_id: number;
	title: string;
	description: string;
	price: number;
	delivery_time: number;
	attributes: TAttribute[];
	images: TImage[];
}

const AddListing = () => {
	const { queryFn: UserFunc, queryKey: userKey } = queryConfigs.useGetAllCategories;
	const { data: categoryData } = useGetQuery({
		func: UserFunc,
		key: userKey,
		params: { offset: 0, limit: 1000 },
	});
	const categories = categoryData?.result?.list || [];

	const [formData, setFormData] = useState<TListingBody>({
		seller_id: 1, // Set a demo seller ID
		category_id: 0,
		title: '',
		description: '',
		price: 0,
		delivery_time: 0,
		attributes: [],
		images: [],
	});

	const [attributeName, setAttributeName] = useState('');
	const [attributeValue, setAttributeValue] = useState('');
	const navigate = useNavigate();

	// Handle image selection with preview
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onloadend = () => {
			const newImage: TImage = {
				image: '', // Will be updated after upload
				preview: reader.result as string,
				is_primary: formData.images.length === 0,
			};
			setFormData((prev) => ({ ...prev, images: [...prev.images, newImage] }));
		};
		reader.readAsDataURL(file);

		// Upload in background
		(async () => {
			try {
				const response = await uploadFileToS3(file);
				if (response.success) {
					setFormData((prev) => ({
						...prev,
						images: prev.images.map((img) => (img.preview === URL.createObjectURL(file) ? { ...img, image: response.data.id.toString() } : img)),
					}));
				} else {
					showNotification('error', 'Failed to upload image');
				}
			} catch (error) {
				console.error(error);
				showNotification('error', 'Failed to upload image');
			}
		})();
	};

	const handleAttributeAdd = () => {
		if (attributeName && attributeValue) {
			const newAttribute: TAttribute = {
				attribute_name: attributeName,
				attribute_value: attributeValue,
			};
			setFormData((prev) => ({ ...prev, attributes: [...prev.attributes, newAttribute] }));
			setAttributeName('');
			setAttributeValue('');
		}
	};

	const handleAttributeRemove = (index: number) => {
		setFormData((prev) => ({
			...prev,
			attributes: prev.attributes.filter((_, i) => i !== index),
		}));
	};

	const handleAttributeChange = (index: number, name: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			attributes: prev.attributes.map((attr, i) => (i === index ? { attribute_name: name, attribute_value: value } : attr)),
		}));
	};

	const handleImageRemove = (index: number) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
	};

	const handleMakePrimary = (index: number) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.map((img, i) => ({ ...img, is_primary: i === index })),
		}));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log('Submitting:', formData);
		showNotification('success', 'Listing created successfully!');
		navigate('/listings');
	};

	return (
		<Box sx={{ padding: 4, backgroundColor: '#f9f9f9' }}>
			<Typography variant="h4" sx={{ marginBottom: 2 }}>
				Add Listing
			</Typography>
			<form onSubmit={handleSubmit}>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<Autocomplete
							options={categories}
							getOptionLabel={(option: TCategory) => option?.name}
							onChange={(event, newValue: TCategory | null) => setFormData((prev) => ({ ...prev, category_id: newValue?.id ?? 0 }))}
							renderInput={(params) => <TextField {...params} label="Select Category" variant="outlined" placeholder="Search categories..." />}
							isOptionEqualToValue={(option, value) => option.id === value.id}
							value={categories.find((cat: any) => cat.id === formData.category_id) || null}
						/>
					</Grid>

					<Grid item xs={12}>
						<TextField
							label="Title"
							value={formData.title}
							onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
							fullWidth
						/>
					</Grid>

					<Grid item xs={12}>
						<TextField
							label="Description"
							value={formData.description}
							onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
							fullWidth
							multiline
							rows={4}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField
							label="Price"
							type="number"
							value={formData.price}
							onChange={(e) => setFormData((prev) => ({ ...prev, price: parseFloat(e.target.value) }))}
							fullWidth
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField
							label="Delivery Time"
							type="number"
							value={formData.delivery_time}
							onChange={(e) => setFormData((prev) => ({ ...prev, delivery_time: parseInt(e.target.value, 10) }))}
							fullWidth
						/>
					</Grid>

					<Grid item xs={12}>
						<Typography variant="h6">Attributes</Typography>
						<ul className="list-none">
							{formData.attributes.map((attr, index) => (
								<li key={index} className="flex items-center mb-2 gap-2">
									<TextField
										label="Name"
										value={attr.attribute_name}
										onChange={(e) => handleAttributeChange(index, e.target.value, attr.attribute_value)}
									/>
									<TextField
										label="Value"
										value={attr.attribute_value}
										onChange={(e) => handleAttributeChange(index, attr.attribute_name, e.target.value)}
									/>
									<Button variant="contained" color="error" onClick={() => handleAttributeRemove(index)}>
										Remove
									</Button>
								</li>
							))}
						</ul>
						<div className="flex items-center mb-2 gap-2">
							<TextField label="Name" value={attributeName} onChange={(e) => setAttributeName(e.target.value)} />
							<TextField label="Value" value={attributeValue} onChange={(e) => setAttributeValue(e.target.value)} />
							<Button variant="contained" color="primary" onClick={handleAttributeAdd}>
								Add Attribute
							</Button>
						</div>
					</Grid>

					<Grid item xs={12}>
						<Typography variant="h6">Images</Typography>
						<input type="file" onChange={handleImageChange} className="mb-2" />
						<div className="grid grid-cols-4 gap-2 mt-2">
							{formData.images.map((image, index) => (
								<div key={index} className="relative border p-1">
									<img
										src={image.preview || `${process.env.REACT_APP_GET_MEDIA}/${image.image}`}
										alt={`Image ${index}`}
										className="w-full h-32 object-cover"
										onError={(e) => {
											const target = e.target as HTMLImageElement;
											target.onerror = null;
											target.src = 'https://via.placeholder.com/150?text=No+Image';
										}}
									/>
									<div className="flex justify-between items-center mt-1">
										<Button
											size="small"
											variant={image.is_primary ? 'contained' : 'outlined'}
											color="success"
											onClick={() => handleMakePrimary(index)}
										>
											{image.is_primary ? 'Primary' : 'Make Primary'}
										</Button>
										<Button size="small" variant="contained" color="error" onClick={() => handleImageRemove(index)}>
											Remove
										</Button>
									</div>
								</div>
							))}
						</div>
					</Grid>

					<Grid item xs={12}>
						<Button variant="contained" color="primary" type="submit">
							Create Listing
						</Button>
					</Grid>
				</Grid>
			</form>
		</Box>
	);
};

export default AddListing;
