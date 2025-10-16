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
} from '@mui/material';
import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery } from '../../query/hooks/queryHook';
import { TQueryParams } from '../lib/types/common';
import { TAdmin } from '../lib/types/response';
import { FaBan, FaEdit, FaEye } from 'react-icons/fa';
import { BsUniversalAccessCircle } from 'react-icons/bs';
import { sanitizeValue } from '../utils/utils';
import { countStyle } from '../vendors/Vendors';
import AddUser from './AddUser';
import { TUserFormData } from '../lib/types/payloads';
import { BanAdmin } from './BanAdmin';
import VIewSupport from './VIewSupport';
import EditSupport from './EditSupport';
import { useNavigate } from 'react-router';
import Header from '../common/Header';

export default function Users() {
	const navigate = useNavigate();

	// State
	const [currentPage, setCurrentPage] = useState(1);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<TAdmin | null>(null);
	const [editingUser, setEditingUser] = useState<TAdmin | null>(null);
	const [viewingUserId, setViewingUserId] = useState<number | null>(null);
	const [searchParams, setSearchParams] = useState<TQueryParams>({
		email: '',
		username: '',
		mobile: '',
	});
	const [inputParams, setInputParams] = useState<TQueryParams>({
		email: '',
		username: '',
		mobile: '',
	});

	// Query
	const limit = 10;
	const { queryFn: getUsersFn, queryKey: userKey } = queryConfigs.useGetAdmins;
	const { data, refetch, isLoading, isRefetching, isError } = useGetQuery({
		func: getUsersFn,
		key: userKey,
		params: {
			offset: (currentPage - 1) * limit,
			limit,
			...searchParams,
		},
	});

	// Handlers
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInputParams((prev) => ({ ...prev, [name]: value }));
	};

	const handleSearch = () => setSearchParams(inputParams);
	const handleClear = () => {
		setInputParams({ email: '', username: '', mobile: '' });
		setSearchParams({ email: '', username: '', mobile: '' });
	};
	const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => setCurrentPage(value);
	const handleClickBack = () => navigate(-1);

	// Modal handlers
	const openAddUserModal = () => setIsAddModalOpen(true);
	const openEditUserModal = (user: TAdmin) => setEditingUser(user);
	const openBanDialog = (user: TAdmin) => setSelectedUser(user);
	const openViewDialog = (userId: number) => setViewingUserId(userId);

	const handleSubmit = (userData: TUserFormData) => {
		// API call for add/edit
	};

	if (isLoading || isRefetching) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
				<CircularProgress />
			</Box>
		);
	}

	if (isError) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
				<Typography color="error">Error loading users. Please try again.</Typography>
			</Box>
		);
	}

	const userList = data?.result?.list || [];

	return (
		<>
			<Header onBackClick={handleClickBack} onReloadClick={refetch} showButton buttonTitle="Add User" pageName="Users" buttonFunc={openAddUserModal} />

			<Box className="flex flex-col h-full p-6">
				{/* Search Section */}
				<Box className="my-6 flex gap-2">
					{['email', 'username', 'mobile'].map((field) => (
						<TextField
							key={field}
							name={field}
							label={field.charAt(0).toUpperCase() + field.slice(1)}
							variant="outlined"
							size="small"
							value={inputParams[field as keyof TQueryParams]}
							onChange={handleSearchChange}
							sx={{ width: '20%' }}
						/>
					))}
					<Box className="flex space-x-2 items-center">
						<Button variant="outlined" onClick={handleSearch}>
							Search
						</Button>
						<Button variant="outlined" onClick={handleClear}>
							Clear
						</Button>
					</Box>
				</Box>

				{/* Table */}
				{userList.length === 0 ? (
					<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh">
						<Typography variant="h6" color="textSecondary" gutterBottom>
							No users found
						</Typography>
						<Button variant="contained" onClick={openAddUserModal}>
							Add New User
						</Button>
					</Box>
				) : (
					<>
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow sx={{ backgroundColor: 'black' }}>
										<TableCell sx={{ color: 'white' }}>Name</TableCell>
										<TableCell sx={{ color: 'white' }}>Email</TableCell>
										<TableCell sx={{ color: 'white' }}>Mobile</TableCell>
										<TableCell sx={{ color: 'white' }}>Status</TableCell>
										<TableCell sx={{ color: 'white' }}>Actions</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{userList.map((user: TAdmin) => (
										<TableRow key={user.id}>
											<TableCell>{user.fullname}</TableCell>
											<TableCell>{user.email}</TableCell>
											<TableCell>{user.phone}</TableCell>
											<TableCell>
												<Chip
													label={user.is_active === 0 ? 'Active' : 'Disabled'}
													color={user.is_active === 0 ? 'success' : 'error'}
													size="small"
													variant="outlined"
													sx={{
														fontWeight: 500,
														borderWidth: 1.5,
														'& .MuiChip-label': { px: 0.75 },
													}}
												/>
											</TableCell>
											<TableCell>
												<Box className="flex gap-2">
													<Tooltip title="Edit">
														<Button size="small" onClick={() => openEditUserModal(user)}>
															<FaEdit size={14} />
														</Button>
													</Tooltip>
													<Tooltip title="View">
														<Button size="small" onClick={() => openViewDialog(user.id)}>
															<FaEye size={14} />
														</Button>
													</Tooltip>
													{user.is_active === 0 ? (
														<Tooltip title="Ban User">
															<Button size="small" color="error" onClick={() => openBanDialog(user)}>
																<FaBan size={14} />
															</Button>
														</Tooltip>
													) : (
														<Tooltip title="UnBan User">
															<Button size="small" color="success" onClick={() => openBanDialog(user)}>
																<BsUniversalAccessCircle size={14} />
															</Button>
														</Tooltip>
													)}
												</Box>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>

						{/* Pagination */}
						<Box className="flex items-center justify-center mt-5 space-x-3">
							{sanitizeValue(data?.result?.count) > 0 && (
								<Pagination
									count={Math.ceil(sanitizeValue(data?.result?.count) / limit)}
									size="medium"
									page={currentPage}
									onChange={handlePageChange}
								/>
							)}
							<Typography className="flex items-center space-x-2 font-medium text-slate-700">
								<span>Total result:</span>
								<span className={countStyle}>{sanitizeValue(data?.result?.count)}</span>
							</Typography>
						</Box>
					</>
				)}

				{/* Modals */}
				<AddUser open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleSubmit} />
				{selectedUser && (
					<BanAdmin open={!!selectedUser} onClose={() => setSelectedUser(null)} isBanned={selectedUser.is_active === 1} user={selectedUser} />
				)}
				{viewingUserId && <VIewSupport open={!!viewingUserId} onClose={() => setViewingUserId(null)} userid={viewingUserId} />}
				{editingUser && <EditSupport open={!!editingUser} onClose={() => setEditingUser(null)} userid={editingUser.id} />}
			</Box>
		</>
	);
}
