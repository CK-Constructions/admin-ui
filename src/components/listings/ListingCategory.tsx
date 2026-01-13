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

	const [addOpen, setAddOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);

	const [newName, setNewName] = useState('');
	const [newImage, setNewImage] = useState<string | null>(null);
	const [newPreview, setNewPreview] = useState<string | null>(null);

	const [editCategory, setEditCategory] = useState<TCategory | null>(null);
	const [editPreview, setEditPreview] = useState<string | null>(null);

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
			showNotification('success', 'Category added');
			closeAdd();
		},
	});

	const { mutate: updateCategory, isPending: isUpdating } = useMutationQuery({
		func: queryConfigs.useUpdateCategories.queryFn,
		invalidateKey: queryKey,
		onSuccess: () => {
			showNotification('success', 'Category updated');
			setEditOpen(false);
			setEditCategory(null);
			setEditPreview(null);
		},
	});

	/* ───────────── Image Upload ───────────── */
	const uploadImage = async (file?: File, onSuccess?: (url: string) => void, setPreview?: (p: string) => void) => {
		if (!file) return;
		setPreview?.(URL.createObjectURL(file));

		try {
			const url = await uploadFileToS3(file);
			onSuccess?.(url);
			showNotification('success', 'Image uploaded');
		} catch {
			showNotification('error', 'Upload failed');
		}
	};

	/* ───────────── Handlers ───────────── */
	const closeAdd = () => {
		setAddOpen(false);
		setNewName('');
		setNewImage(null);
		setNewPreview(null);
	};

	const handleAdd = () => {
		if (!newName.trim() || !newImage) {
			showNotification('error', 'Name & image required');
			return;
		}

		addCategory({
			name: newName.trim().toLowerCase(),
			image: newImage,
		});
	};

	const handleUpdate = () => {
		if (!editCategory?.name.trim()) {
			showNotification('error', 'Name required');
			return;
		}

		updateCategory({
			id: editCategory.id,
			body: {
				name: editCategory.name.trim(),
				image: editCategory.image,
			},
		});
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
				buttonTitle="Add Category"
				onBackClick={() => navigate(-1)}
				onReloadClick={refetch}
				buttonFunc={() => setAddOpen(true)}
			/>

			{/* Search */}
			{/* <Box className="flex gap-2 my-4">
				<TextField size="small" label="Name" value={search.name} onChange={(e) => setSearch({ ...search, name: e.target.value })} />
				<TextField size="small" label="ID" value={search.id} onChange={(e) => setSearch({ ...search, id: e.target.value })} />
				<Button onClick={() => setAppliedSearch(search)}>Search</Button>
				<Button onClick={() => setSearch({ id: '', name: '' }) || setAppliedSearch({ id: '', name: '' })}>Clear</Button>
			</Box> */}

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
									<Tooltip title="Edit">
										<button
											onClick={() => {
												setEditCategory(cat);
												setEditOpen(true);
											}}
										>
											<FaEdit />
										</button>
									</Tooltip>
									{cat.is_active === 0 ? <FaBan /> : <BsUniversalAccessCircle />}
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
			<Dialog open={addOpen} onClose={closeAdd} fullWidth maxWidth="sm">
				<DialogTitle>Add Category</DialogTitle>
				<DialogContent>
					<Box className="space-y-4 mt-2">
						<Box className="border-dashed border-2 p-4 text-center cursor-pointer" onClick={() => document.getElementById('add-img')?.click()}>
							<input
								id="add-img"
								type="file"
								hidden
								accept="image/*"
								onChange={(e) => uploadImage(e.target.files?.[0], setNewImage, (p) => setNewPreview(p))}
							/>
							{newPreview ? <img src={newPreview} style={{ maxHeight: 200 }} /> : <MdOutlineAddToPhotos size={48} />}
						</Box>

						<TextField fullWidth label="Category Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeAdd}>Cancel</Button>
					<Button variant="contained" onClick={handleAdd} disabled={isAdding}>
						{isAdding ? <CircularProgress size={22} /> : 'Add'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Edit Modal */}
			<Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
				<DialogTitle>Edit Category</DialogTitle>
				<DialogContent>
					<Box className="space-y-4 mt-2">
						<Box className="border-dashed border-2 p-4 text-center cursor-pointer" onClick={() => document.getElementById('edit-img')?.click()}>
							<input
								id="edit-img"
								type="file"
								hidden
								accept="image/*"
								onChange={(e) =>
									uploadImage(e.target.files?.[0], (url) => setEditCategory((p) => (p ? { ...p, image: url } : p)), setEditPreview)
								}
							/>
							<img src={editPreview || editCategory?.image} style={{ maxHeight: 200 }} />
						</Box>

						<TextField
							fullWidth
							label="Category Name"
							value={editCategory?.name || ''}
							onChange={(e) => setEditCategory((p) => (p ? { ...p, name: e.target.value } : p))}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setEditOpen(false)}>Cancel</Button>
					<Button variant="contained" onClick={handleUpdate} disabled={isUpdating}>
						{isUpdating ? <CircularProgress size={22} /> : 'Update'}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
