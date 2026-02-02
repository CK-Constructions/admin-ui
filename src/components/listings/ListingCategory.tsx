import { useState } from 'react';
import {
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

import { FaBan, FaEdit } from 'react-icons/fa';
import { BsUniversalAccessCircle } from 'react-icons/bs';

import dayjs from 'dayjs';
import { useNavigate } from 'react-router';

import Header from '../common/Header';
import Loading from '../common/Loader';

import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery, useMutationQuery } from '../../query/hooks/queryHook';
import { sanitizeValue, showNotification } from '../utils/utils';
import { countStyle } from '../vendors/Vendors';

import type { TCategory } from '../lib/types/response';

const LIMIT = 10;

export default function ListingCategory() {
	const navigate = useNavigate();

	// ==============================
	// STATE
	// ==============================
	const [page, setPage] = useState(1);

	const [addOpen, setAddOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);

	// Add Category
	const [newName, setNewName] = useState('');

	// Edit Category
	const [editCategory, setEditCategory] = useState<TCategory | null>(null);

	// ==============================
	// FETCH CATEGORIES
	// ==============================
	const { queryFn, queryKey } = queryConfigs.useGetAllCategories;

	const { data, isLoading, isError, refetch } = useGetQuery({
		func: queryFn,
		key: queryKey,
		params: {
			offset: (page - 1) * LIMIT,
			limit: LIMIT,
		},
	});

	// ==============================
	// MUTATIONS
	// ==============================
	const { mutate: addCategory, isPending: isAdding } = useMutationQuery({
		func: queryConfigs.useAddCategories.queryFn,
		invalidateKey: queryKey,
		onSuccess: () => {
			showNotification('success', 'Category added successfully!');
			closeAdd();
		},
	});

	const { mutate: updateCategory, isPending: isUpdating } = useMutationQuery({
		func: queryConfigs.useUpdateCategories.queryFn,
		invalidateKey: queryKey,
		onSuccess: () => {
			showNotification('success', 'Category updated successfully!');
			setEditOpen(false);
			setEditCategory(null);
		},
	});

	// ==============================
	// HANDLERS
	// ==============================
	const closeAdd = () => {
		setAddOpen(false);
		setNewName('');
	};

	const handleAdd = () => {
		if (!newName.trim()) {
			showNotification('error', 'Category name is required');
			return;
		}

		addCategory({
			name: newName.trim(),
		});
	};

	const handleUpdate = () => {
		if (!editCategory?.name.trim()) {
			showNotification('error', 'Category name is required');
			return;
		}

		updateCategory({
			id: editCategory.id,
			body: {
				name: editCategory.name.trim(),
			},
		});
	};

	// ==============================
	// LOADING & ERROR UI
	// ==============================
	if (isLoading) {
		return (
			<Box minHeight="60vh" display="flex" justifyContent="center" alignItems="center">
				<Loading />
			</Box>
		);
	}

	if (isError) {
		return (
			<Box minHeight="60vh" display="flex" justifyContent="center" alignItems="center">
				<Typography color="error">Failed to load categories</Typography>
			</Box>
		);
	}

	// ==============================
	// MAIN UI
	// ==============================
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

			{/* CATEGORY TABLE */}
			<TableContainer component={Paper}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							{['ID', 'Name', 'Status', 'Created', 'Actions'].map((h) => (
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

								<TableCell className="capitalize">{cat.name}</TableCell>

								<TableCell>
									<Chip label={cat.is_active === 0 ? 'Active' : 'Disabled'} color={cat.is_active === 0 ? 'success' : 'error'} size="small" />
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

			{/* PAGINATION */}
			<Box mt={4} display="flex" justifyContent="center" gap={2}>
				<Pagination page={page} count={Math.ceil(sanitizeValue(data?.result?.count) / LIMIT)} onChange={(_, v) => setPage(v)} />
				<p>
					Total: <span className={countStyle}>{sanitizeValue(data?.result?.count)}</span>
				</p>
			</Box>

			{/* ============================= */}
			{/* ADD CATEGORY MODAL */}
			{/* ============================= */}
			<Dialog open={addOpen} onClose={closeAdd} fullWidth maxWidth="sm">
				<DialogTitle>Add Category</DialogTitle>

				<DialogContent>
					<Box mt={2}>
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

			{/* ============================= */}
			{/* EDIT CATEGORY MODAL */}
			{/* ============================= */}
			<Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
				<DialogTitle>Edit Category</DialogTitle>

				<DialogContent>
					<Box mt={2}>
						<TextField
							fullWidth
							label="Category Name"
							value={editCategory?.name || ''}
							onChange={(e) => setEditCategory((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
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
