import { useState } from 'react';
import {
	Avatar,
	Box,
	Button,
	Chip,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Pagination,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import { MdOutlineAddToPhotos } from 'react-icons/md';
import { FaBan, FaEdit } from 'react-icons/fa';
import { BsUniversalAccessCircle } from 'react-icons/bs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';

import Header from '../common/Header';
import Loading from '../common/Loader';
import { uploadFileToS3 } from '../../api';
import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery, useMutationQuery } from '../../query/hooks/queryHook';
import { sanitizeValue, showNotification } from '../utils/utils';
import { countStyle } from '../vendors/Vendors';

import type { TCategory } from '../lib/types/response';
import type { TQueryParams } from '../lib/types/common';

const LIMIT = 10;

export default function ListingCategory() {
	const navigate = useNavigate();

	/* ───────────── State ───────────── */
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState<TQueryParams>({ id: '', name: '' });
	const [appliedSearch, setAppliedSearch] = useState<TQueryParams>({ id: '', name: '' });

	const [addModalOpen, setAddModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);

	const [newCategoryName, setNewCategoryName] = useState('');
	const [editCategory, setEditCategory] = useState<TCategory | null>(null);

	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);

	/* ───────────── Queries ───────────── */
	const { queryFn, queryKey } = queryConfigs.useGetAllCategories;

	const { data, isLoading, isError, refetch } = useGetQuery({
		func: queryFn,
		key: queryKey,
		params: {
			offset: (page - 1) * LIMIT,
			limit: LIMIT,
			...appliedSearch,
		},
	});

	/* ───────────── Mutations ───────────── */
	const { mutate: addCategory, isPending: isAdding } = useMutationQuery({
		func: queryConfigs.useAddCategories.queryFn,
		invalidateKey: queryKey,
		onSuccess: () => {
			showNotification('success', 'Category added successfully');
			handleCloseAddModal();
		},
	});

	const { mutate: updateCategory, isPending: isUpdating } = useMutationQuery({
		func: queryConfigs.useUpdateCategories.queryFn,
		invalidateKey: queryKey,
		onSuccess: () => {
			showNotification('success', 'Category updated successfully');
			setEditModalOpen(false);
			setEditCategory(null);
		},
	});

	/* ───────────── Handlers ───────────── */
	const handleImageUpload = async (file?: File) => {
		if (!file) return;

		setImagePreview(URL.createObjectURL(file));

		try {
			const url = await uploadFileToS3(file); // ✅ STRING
			setImageUrl(url);
			showNotification('success', 'Image uploaded');
		} catch {
			showNotification('error', 'Image upload failed');
		}
	};

	const handleAddCategory = () => {
		if (!newCategoryName.trim() || !imageUrl) {
			showNotification('error', 'Name & image are required');
			return;
		}

		addCategory({
			name: newCategoryName.trim().toLowerCase(),
			image: imageUrl,
		});
	};

	const handleUpdateCategory = () => {
		if (!editCategory?.name.trim()) {
			showNotification('error', 'Category name required');
			return;
		}

		updateCategory({
			id: editCategory.id,
			body: editCategory,
		});
	};

	const handleCloseAddModal = () => {
		setAddModalOpen(false);
		setNewCategoryName('');
		setImagePreview(null);
		setImageUrl(null);
	};

	/* ───────────── UI STATES ───────────── */
	if (isLoading) {
		return (
			<Box minHeight="60vh" display="flex" alignItems="center" justifyContent="center">
				<Loading />
			</Box>
		);
	}

	if (isError) {
		return (
			<Box minHeight="60vh" display="flex" alignItems="center" justifyContent="center">
				<Typography color="error">Failed to load categories</Typography>
			</Box>
		);
	}

	/* ───────────── Render ───────────── */
	return (
		<>
			<Header
				pageName="Listing Categories"
				showButton
				buttonTitle="Add Listing Category"
				onBackClick={() => navigate(-1)}
				onReloadClick={refetch}
				buttonFunc={() => setAddModalOpen(true)}
			/>

			{/* Search */}
			<Box className="flex gap-2 my-4">
				<TextField size="small" label="Name" value={search.name} onChange={(e) => setSearch((p) => ({ ...p, name: e.target.value }))} />
				<TextField size="small" label="ID" value={search.id} onChange={(e) => setSearch((p) => ({ ...p, id: e.target.value }))} />
				<Button variant="outlined" onClick={() => setAppliedSearch(search)}>
					Search
				</Button>
				<Button
					variant="outlined"
					onClick={() => {
						setSearch({ id: '', name: '' });
						setAppliedSearch({ id: '', name: '' });
					}}
				>
					Clear
				</Button>
			</Box>

			{/* Table */}
			<TableContainer component={Paper}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							{['ID', 'Image', 'Name', 'Status', 'Created', 'Actions'].map((h) => (
								<TableCell key={h} sx={{ bgcolor: 'black', color: 'white' }}>
									{h}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.result?.list.map((cat: TCategory) => (
							<TableRow key={cat.id}>
								<TableCell>{cat.id}</TableCell>
								<TableCell>
									<Avatar src={cat.image || undefined} sx={{ width: 48, height: 48 }} />
								</TableCell>
								<TableCell className="capitalize">{cat.name}</TableCell>
								<TableCell>
									<Chip
										label={cat.is_active === 0 ? 'Active' : 'Disabled'}
										color={cat.is_active === 0 ? 'success' : 'error'}
										size="small"
										variant="outlined"
									/>
								</TableCell>
								<TableCell>{dayjs(cat.created_on).format('DD-MM-YYYY')}</TableCell>
								<TableCell>
									<div className="flex gap-2">
										<Tooltip title="Edit">
											<button
												onClick={() => {
													setEditCategory(cat);
													setEditModalOpen(true);
												}}
											>
												<FaEdit />
											</button>
										</Tooltip>
										{cat.is_active === 0 ? <FaBan /> : <BsUniversalAccessCircle />}
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Pagination */}
			<Box mt={4} display="flex" justifyContent="center" gap={2}>
				<Pagination page={page} count={Math.ceil(sanitizeValue(data?.result?.count) / LIMIT)} onChange={(_, v) => setPage(v)} />
				<p>
					Total: <span className={countStyle}>{sanitizeValue(data?.result?.count)}</span>
				</p>
			</Box>

			{/* Add Modal */}
			<Dialog open={addModalOpen} onClose={handleCloseAddModal} fullWidth maxWidth="sm">
				<DialogTitle>Add Category</DialogTitle>
				<DialogContent>
					<Box className="space-y-4 mt-2">
						<Box className="border-dashed border-2 p-4 text-center cursor-pointer" onClick={() => document.getElementById('cat-upload')?.click()}>
							<input id="cat-upload" type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
							{imagePreview ? <img src={imagePreview} style={{ maxHeight: 200 }} /> : <MdOutlineAddToPhotos size={48} />}
						</Box>

						<TextField label="Category Name" fullWidth value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseAddModal}>Cancel</Button>
					<Button variant="contained" onClick={handleAddCategory} disabled={isAdding}>
						{isAdding ? <CircularProgress size={22} /> : 'Add'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Edit Modal */}
			<Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} fullWidth maxWidth="sm">
				<DialogTitle>Edit Category</DialogTitle>
				<DialogContent>
					<TextField
						fullWidth
						label="Category Name"
						value={editCategory?.name || ''}
						onChange={(e) => setEditCategory((p) => (p ? { ...p, name: e.target.value } : p))}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
					<Button variant="contained" onClick={handleUpdateCategory} disabled={isUpdating}>
						{isUpdating ? <CircularProgress size={22} /> : 'Update'}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
