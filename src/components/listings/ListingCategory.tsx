import { useState } from 'react';
import {
	Button,
	TextField,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Pagination,
	Chip,
	Tooltip,
	CircularProgress,
	Box,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Avatar,
} from '@mui/material';
import { queryConfigs } from '../../query/queryConfig';
import { MdOutlineAddToPhotos } from 'react-icons/md';
import { uploadFileToS3 } from '../../api';
import { useGetQuery, useMutationQuery } from '../../query/hooks/queryHook';
import { TQueryParams } from '../lib/types/common';
import { TCategory } from '../lib/types/response';
import { FaBan, FaEdit, FaEye } from 'react-icons/fa';
import { BsUniversalAccessCircle } from 'react-icons/bs';
import { sanitizeValue, showNotification } from '../utils/utils';
import { countStyle } from '../vendors/Vendors';
import { TUserFormData } from '../lib/types/payloads';
import { useNavigate } from 'react-router';
import Header from '../common/Header';
import dayjs from 'dayjs';
import Loading from '../common/Loader';
export default function ListingCategory() {
	const navigate = useNavigate();
	const [currentPage, setCurrentPage] = useState(1);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [selectedUser, setSelectedUser] = useState<TCategory | null>(null);
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
	const [params, setParams] = useState<TQueryParams>({
		id: '',
		name: '',
	});
	const [searchParams, setSearchParams] = useState<TQueryParams>({
		id: '',
		name: '',
	});
	const [newCategoryName, setNewCategoryName] = useState('');
	const [uploadedImageId, setUploadedImageId] = useState<string | null>(null);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];

			// Create preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewImage(reader.result as string);
			};
			reader.readAsDataURL(file);

			try {
				// Upload image
				const response = await uploadFileToS3(file);
				setUploadedImageId(response.id.toString());
				showNotification('success', 'Image uploaded successfully');
			} catch (error) {
				console.error(error);
				showNotification('error', 'Failed to upload image');
			}
		}
	};

	const [editCategoryName, setEditCategoryName] = useState('');
	const [isAdding, setIsAdding] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editCategory, setEditCategory] = useState<TCategory | null>(null);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	const [openBanDialog, setOpenBanDialog] = useState(false);
	const [openViewDialog, setOpenViewDialog] = useState(false);

	const limit = 10;
	const { queryFn: addCategory } = queryConfigs.useAddCategories;
	const { queryFn: updateCategoryFunc } = queryConfigs.useUpdateCategories;
	const { queryFn: getCategoryFunc, queryKey: categoryKey } = queryConfigs.useGetAllCategories;
	const { data, refetch, isLoading, isRefetching, isError } = useGetQuery({
		func: getCategoryFunc,
		key: categoryKey,
		params: {
			offset: (currentPage - 1) * limit,
			limit,
			...searchParams,
		},
	});
	const { mutate } = useMutationQuery({
		invalidateKey: categoryKey,
		func: addCategory,
		onSuccess: () => {
			showNotification('success', 'Listing Category Added Successfully');
			handleCloseModal();
			refetch();
		},
	});
	const { mutate: updateCategory } = useMutationQuery({
		invalidateKey: categoryKey,
		func: updateCategoryFunc,
		onSuccess: () => {
			showNotification('success', 'Brand updated successfully');
			handleCloseEditModal();
			refetch();
		},
		onError: () => {
			setIsUpdating(false);
		},
	});

	const handleOpenEdit = (category: TCategory) => {
		setEditCategory(category);
		setOpenEditDialog(true);
	};

	const handleAddCategory = () => {
		const trimmedName = newCategoryName.trim();

		if (!trimmedName) {
			showNotification('error', 'Category name cannot be empty');
			return;
		}

		if (!uploadedImageId) {
			showNotification('error', 'Please upload an image for the category');
			return;
		}

		mutate({
			name: trimmedName.toLowerCase(),
			image: uploadedImageId,
		});
	};
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setParams((prev) => ({ ...prev, [name]: value }));
	};
	const handleSearch = () => {
		setSearchParams(params);
	};
	const handleClear = () => {
		setParams({
			id: '',
			name: '',
		});
		setSearchParams({
			id: '',
			name: '',
		});
	};
	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		event.preventDefault();
		setCurrentPage(value);
	};
	const handleOpenBanDialog = (category: TCategory) => {
		setSelectedUser(category);
		setOpenBanDialog(true);
	};
	const handleOpenViewDialog = (category: TCategory) => {
		setSelectedUserId(category.id);
		setOpenViewDialog(true);
	};
	const handleSubmit = (categoryData: TUserFormData) => {};
	const handleClickBack = () => {
		navigate(-1);
	};
	const handleOpenModal = () => {
		setIsModalOpen(true);
	};
	const handleCloseEditModal = () => {
		setOpenEditDialog(false);
		setEditCategory(null);
		setIsUpdating(false);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setNewCategoryName('');
	};

	const handleUpdateCategory = () => {
		if (!editCategory || !editCategory?.name.trim()) {
			showNotification('error', 'Brand name cannot be empty');
			return;
		}
		setIsUpdating(true);
		updateCategory({ body: editCategory, id: editCategory.id });
	};
	if (isLoading || isRefetching) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
				<Loading />
			</Box>
		);
	}
	if (isError) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
				<Typography color="error">Error loading categorys. Please try again.</Typography>
			</Box>
		);
	}
	if (!data?.result?.list || data.result.list.length === 0) {
		return (
			<>
				<div className="pb-4">
					<Header
						onBackClick={handleClickBack}
						onReloadClick={refetch}
						showButton={true}
						buttonTitle="Add Listing Category"
						pageName="Listing Categories"
						buttonFunc={handleOpenModal}
					/>
				</div>
				<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh">
					<Typography variant="h6" color="textSecondary" gutterBottom>
						No categorys found
					</Typography>
					<Button variant="contained" onClick={() => setIsModalOpen(true)}>
						Add new category
					</Button>
				</Box>
			</>
		);
	}
	return (
		<>
			<div className="pb-4">
				<Header
					onBackClick={handleClickBack}
					onReloadClick={refetch}
					showButton={true}
					buttonTitle="Add Listing Category"
					pageName="Listing Categories"
					buttonFunc={handleOpenModal}
				/>
			</div>
			<div className="flex flex-col h-full p-6">
				<div className="my-6 flex gap-2">
					<TextField
						name="name"
						label="Name"
						variant="outlined"
						size="small"
						value={params.name}
						onChange={handleSearchChange}
						sx={{
							width: '20%',
						}}
					/>
					<TextField
						name="id"
						label="ID"
						variant="outlined"
						size="small"
						value={params.id}
						onChange={handleSearchChange}
						sx={{
							width: '20%',
						}}
					/>
					<div className="flex space-x-2 items-center">
						<Button variant="outlined" onClick={handleSearch}>
							Search
						</Button>
						<Button variant="outlined" onClick={handleClear}>
							Clear
						</Button>
					</div>
				</div>
				<TableContainer component={Paper}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell sx={{ backgroundColor: 'black', color: 'white', px: 2 }}>ID</TableCell>
								<TableCell sx={{ backgroundColor: 'black', color: 'white', px: 2 }}>Image</TableCell> {/* ✅ NEW COLUMN */}
								<TableCell sx={{ backgroundColor: 'black', color: 'white', px: 2 }}>Name</TableCell>
								<TableCell sx={{ backgroundColor: 'black', color: 'white', px: 2 }}>Status</TableCell>
								<TableCell sx={{ backgroundColor: 'black', color: 'white', px: 2 }}>Created On</TableCell>
								<TableCell sx={{ backgroundColor: 'black', color: 'white', px: 2 }}>Actions</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{data?.result.list.map((category: TCategory) => (
								<TableRow key={category.id}>
									<TableCell sx={{ px: 2 }}>{category.id}</TableCell>

									{/* ✅ IMAGE COLUMN */}
									<TableCell sx={{ px: 2 }}>
										{category.image ? (
											<Avatar
												src={`${process.env.REACT_APP_BASE_URL}/${category.image}`}
												sx={{ width: 50, height: 50, borderRadius: 2 }}
											/>
										) : (
											<Avatar
												sx={{
													width: 50,
													height: 50,
													borderRadius: 2,
													bgcolor: '#ccc',
													color: '#555',
													fontSize: 14,
												}}
											>
												N/A
											</Avatar>
										)}
									</TableCell>

									<TableCell sx={{ px: 2 }} className="capitalize">
										{category.name}
									</TableCell>

									<TableCell sx={{ px: 2 }}>
										<Chip
											label={category.is_active === 0 ? 'Active' : 'Disabled'}
											color={category.is_active === 0 ? 'success' : 'error'}
											size="small"
											variant="outlined"
											sx={{
												fontWeight: 500,
												borderWidth: 1.5,
												'& .MuiChip-label': { px: 0.75 },
											}}
										/>
									</TableCell>

									<TableCell sx={{ px: 2 }}>{dayjs(category?.created_on).format('DD-MM-YYYY')}</TableCell>

									<TableCell sx={{ px: 2 }}>
										<section className="w-full flex gap-2">
											<Tooltip title="Edit">
												<button onClick={() => handleOpenEdit(category)} className="action-button">
													<FaEdit size={14} />
												</button>
											</Tooltip>

											{category.is_active === 0 && (
												<Tooltip title="Disable">
													<button onClick={() => handleOpenBanDialog(category)} className="red-action-button">
														<FaBan size={14} />
													</button>
												</Tooltip>
											)}
											{category.is_active === 1 && (
												<Tooltip title="Enable">
													<button onClick={() => handleOpenBanDialog(category)} className="green-action-button">
														<BsUniversalAccessCircle size={14} />
													</button>
												</Tooltip>
											)}
										</section>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<div className="flex items-center justify-center mt-5">
					<div className="flex items-center justify-end space-x-3">
						{sanitizeValue(data?.result?.count) > 0 && (
							<Pagination
								count={Math.ceil(sanitizeValue(data?.result?.count) / limit)}
								size="medium"
								page={currentPage}
								onChange={handlePageChange}
							/>
						)}
						<p className="flex items-center space-x-2 font-medium text-slate-700">
							<span>Total result:</span>
							<span className={countStyle}>{sanitizeValue(data?.result?.count)}</span>
						</p>
					</div>
				</div>
			</div>
			<Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
				<DialogTitle>Add New Listing Category</DialogTitle>
				<DialogContent>
					<Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
						{/* Image Upload Section */}
						<Box
							sx={{
								border: '2px dashed',
								borderColor: 'grey.400',
								borderRadius: 2,
								p: 3,
								textAlign: 'center',
								cursor: 'pointer',
								'&:hover': {
									borderColor: 'primary.main',
									backgroundColor: 'action.hover',
								},
							}}
							onClick={() => document.getElementById('category-image-upload')?.click()}
							onDrop={(e) => {
								e.preventDefault();
								e.stopPropagation();
								if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
									handleImageChange({
										target: { files: e.dataTransfer.files },
									} as React.ChangeEvent<HTMLInputElement>);
								}
							}}
							onDragOver={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
						>
							<input id="category-image-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
							{previewImage ? (
								<img
									src={previewImage}
									alt="Category Preview"
									style={{
										maxWidth: '100%',
										maxHeight: '200px',
										objectFit: 'contain',
										borderRadius: 8,
									}}
								/>
							) : (
								<>
									<div className="flex items-center justify-center mb-2">
										<MdOutlineAddToPhotos style={{ fontSize: 48, color: 'gray' }} />
									</div>
									<Typography variant="body1" color="text.secondary">
										Click to browse or drag & drop your image here
									</Typography>
									<Typography variant="caption" color="text.secondary">
										(Only one image allowed)
									</Typography>
								</>
							)}
						</Box>

						{/* Category Name Input */}
						<TextField
							fullWidth
							label="Category Name"
							variant="outlined"
							value={newCategoryName}
							onChange={(e) => setNewCategoryName(e.target.value)}
							disabled={isAdding}
						/>
					</Box>
				</DialogContent>

				<DialogActions>
					<Button onClick={handleCloseModal} disabled={isAdding}>
						Cancel
					</Button>
					<Button
						onClick={handleAddCategory}
						variant="contained"
						disabled={isAdding || !newCategoryName.trim() || !uploadedImageId}
						sx={{ color: 'white' }}
					>
						{isAdding ? <CircularProgress size={24} /> : 'Add'}
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={openEditDialog && !!editCategory} onClose={handleCloseEditModal} fullWidth maxWidth="sm">
				<DialogTitle>Edit Brand</DialogTitle>
				<DialogContent>
					<Box sx={{ mt: 2 }}>
						<div className="space-y-5">
							<TextField
								fullWidth
								label="Brand"
								variant="outlined"
								value={editCategory?.name}
								onChange={(e) => setEditCategory((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
								disabled={isUpdating}
							/>
						</div>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseEditModal} disabled={isUpdating}>
						Cancel
					</Button>
					<Button onClick={handleUpdateCategory} variant="contained" disabled={isUpdating || !editCategory} color="primary">
						{isUpdating ? <CircularProgress size={24} /> : 'Update'}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
