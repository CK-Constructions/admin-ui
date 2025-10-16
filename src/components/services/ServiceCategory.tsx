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
	Modal,
} from '@mui/material';
import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery, useMutationQuery } from '../../query/hooks/queryHook';
import { TQueryParams } from '../lib/types/common';
import { TCategory } from '../lib/types/response';
import { FaBan, FaEdit } from 'react-icons/fa';
import { BsUniversalAccessCircle } from 'react-icons/bs';
import { sanitizeValue, showNotification } from '../utils/utils';
import { countStyle } from '../vendors/Vendors';
import { useNavigate } from 'react-router';
import Header from '../common/Header';
import dayjs from 'dayjs';
import Loading from '../common/Loader';
import { UpdateActivityServiceCategory } from '../../api';

// ✅ Update API import

export default function ServiceCategory() {
	const navigate = useNavigate();
	const [currentPage, setCurrentPage] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isAdding, setIsAdding] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const [editingCategory, setEditingCategory] = useState<TCategory | null>(null);
	const [newCategoryName, setNewCategoryName] = useState('');

	const [params, setParams] = useState<TQueryParams>({
		id: '',
		name: '',
	});
	const [searchParams, setSearchParams] = useState<TQueryParams>({
		id: '',
		name: '',
	});

	const limit = 10;
	const { queryFn: getServiceFunc, queryKeys: serviceKey } = queryConfigs.useGetServiceCategories;
	const { queryFn: AddServiceFunc } = queryConfigs.useAddServiceCategory;

	const { data, refetch, isLoading, isRefetching, isError } = useGetQuery({
		func: getServiceFunc,
		key: serviceKey,
		params: {
			offset: (currentPage - 1) * limit,
			limit,
			...searchParams,
		},
	});

	// ✅ Add mutation for Add
	const { mutate: addService } = useMutationQuery({
		invalidateKey: serviceKey,
		func: AddServiceFunc,
		onSuccess: () => {
			handleCloseModal();
			setIsAdding(false);
			showNotification('success', 'Category Added Successfully');
		},
	});

	// ✅ Add mutation for Update
	const { mutate: updateService } = useMutationQuery({
		invalidateKey: serviceKey,
		func: UpdateActivityServiceCategory,
		onSuccess: () => {
			handleCloseModal();
			setIsEditing(false);
			showNotification('success', 'Category Updated Successfully');
		},
	});

	// 🔍 Search Handlers
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setParams((prev) => ({ ...prev, [name]: value }));
	};
	const handleSearch = () => setSearchParams(params);
	const handleClear = () => {
		setParams({ id: '', name: '' });
		setSearchParams({ id: '', name: '' });
	};

	// ➕ Add Category
	const handleOpenModal = () => {
		setEditingCategory(null);
		setNewCategoryName('');
		setIsModalOpen(true);
	};
	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditingCategory(null);
		setNewCategoryName('');
	};
	const handleAddCategory = () => {
		setIsAdding(true);
		const trimmedName = newCategoryName.trim();
		if (!trimmedName) {
			setIsAdding(false);
			showNotification('error', 'Category name cannot be empty');
			return;
		}
		addService({ name: trimmedName.toLowerCase() });
	};

	// ✏️ Edit Category
	const handleOpenEdit = (category: TCategory) => {
		setEditingCategory(category);
		setNewCategoryName(category.name);
		setIsModalOpen(true);
	};
	const handleUpdateCategory = () => {
		if (!editingCategory) return;
		setIsEditing(true);
		const trimmedName = newCategoryName.trim();
		if (!trimmedName) {
			setIsEditing(false);
			showNotification('error', 'Category name cannot be empty');
			return;
		}
		updateService({
			id: editingCategory.id,
			body: { name: trimmedName.toLowerCase(), is_active: editingCategory.is_active },
		});
	};

	// ⬅ Back Button
	const handleClickBack = () => navigate(-1);

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
				<Typography color="error">Error loading categories. Please try again.</Typography>
			</Box>
		);
	}

	return (
		<>
			<div className="pb-4">
				<Header
					onBackClick={handleClickBack}
					onReloadClick={refetch}
					showButton={true}
					buttonTitle="Add Service Category"
					pageName="Service Categories"
					buttonFunc={handleOpenModal}
				/>
			</div>

			{/* Search Bar */}
			<div className="flex flex-col h-full p-6">
				<div className="my-6 flex gap-2">
					<TextField name="name" label="Name" size="small" value={params.name} onChange={handleSearchChange} sx={{ width: '20%' }} />
					<TextField name="id" label="ID" size="small" value={params.id} onChange={handleSearchChange} sx={{ width: '20%' }} />
					<div className="flex space-x-2 items-center">
						<Button variant="outlined" onClick={handleSearch}>
							Search
						</Button>
						<Button variant="outlined" onClick={handleClear}>
							Clear
						</Button>
					</div>
				</div>

				{/* Table */}
				<TableContainer component={Paper}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell>ID</TableCell>
								<TableCell>Name</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Created On</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data?.result.list.map((category: TCategory) => (
								<TableRow key={category.id}>
									<TableCell>{category.id}</TableCell>
									<TableCell className="capitalize">{category.name}</TableCell>
									<TableCell>
										<Chip
											label={category.is_active === 0 ? 'Active' : 'Disabled'}
											color={category.is_active === 0 ? 'success' : 'error'}
											size="small"
											variant="outlined"
										/>
									</TableCell>
									<TableCell>{dayjs(category?.created_on).format('DD-MM-YYYY')}</TableCell>
									<TableCell>
										<section className="w-full flex gap-2">
											<Tooltip title="Edit">
												<button onClick={() => handleOpenEdit(category)} className="action-button">
													<FaEdit size={14} />
												</button>
											</Tooltip>
											{category.is_active === 0 ? (
												<Tooltip title="Disable">
													<button className="red-action-button">
														<FaBan size={14} />
													</button>
												</Tooltip>
											) : (
												<Tooltip title="Enable">
													<button className="green-action-button">
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

				{/* Pagination */}
				<div className="flex items-center justify-center mt-5">
					<div className="flex items-center justify-end space-x-3">
						{sanitizeValue(data?.result?.count) > 0 && (
							<Pagination
								count={Math.ceil(sanitizeValue(data?.result?.count) / limit)}
								page={currentPage}
								onChange={(_, v) => setCurrentPage(v)}
							/>
						)}
						<p className="flex items-center space-x-2 font-medium text-slate-700">
							<span>Total result:</span>
							<span className={countStyle}>{sanitizeValue(data?.result?.count)}</span>
						</p>
					</div>
				</div>
			</div>

			{/* Modal for Add/Edit */}
			<Modal open={isModalOpen} onClose={handleCloseModal}>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 400,
						bgcolor: 'background.paper',
						boxShadow: 24,
						p: 4,
						borderRadius: 2,
					}}
				>
					<Typography variant="h6" gutterBottom>
						{editingCategory ? 'Edit Category' : 'Add New Category'}
					</Typography>
					<TextField fullWidth label="Category Name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} sx={{ mb: 2 }} />
					<Box display="flex" justifyContent="flex-end" gap={2}>
						<Button variant="outlined" onClick={handleCloseModal}>
							Cancel
						</Button>
						{editingCategory ? (
							<Button variant="contained" onClick={handleUpdateCategory} disabled={isEditing}>
								{isEditing ? <CircularProgress size={20} /> : 'Update'}
							</Button>
						) : (
							<Button variant="contained" onClick={handleAddCategory} disabled={isAdding}>
								{isAdding ? <CircularProgress size={20} /> : 'Add'}
							</Button>
						)}
					</Box>
				</Box>
			</Modal>
		</>
	);
}
