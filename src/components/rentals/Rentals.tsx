'use client';

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
import { Link, useNavigate } from 'react-router';
import { TRentalItem } from '../lib/types/response';
import { TQueryParams } from '../lib/types/common';
import { sanitizeValue } from '../utils/utils';
import { countStyle } from '../vendors/Vendors';
import { FaBan, FaEye } from 'react-icons/fa';
import { BsUniversalAccessCircle } from 'react-icons/bs';
import Header from '../common/Header';

type TBanRentalPayload = {
	id: number;
	rental_id: number;
	ban_reason: string;
};

type TUnbanRentalPayload = {
	id: number;
	rental_id: number;
	lift_reason: string;
};

export default function Rentals() {
	const navigate = useNavigate();
	const limit = 10;

	const [currentPage, setCurrentPage] = useState(1);
	const [params, setParams] = useState<TQueryParams>({ email: '', username: '', mobile: '' });
	const [searchParams, setSearchParams] = useState<TQueryParams>({ email: '', username: '', mobile: '' });

	const [banModalOpen, setBanModalOpen] = useState(false);
	const [unbanModalOpen, setUnbanModalOpen] = useState(false);
	const [reason, setReason] = useState('');
	const [selectedRentalId, setSelectedRentalId] = useState<number | null>(null);

	// Fetch rentals
	const { queryFn: rentalFunc, queryKeys: rentalKey } = queryConfigs.useGetAllRentals;
	const { data, refetch, isLoading, isRefetching, isError } = useGetQuery({
		func: rentalFunc,
		key: rentalKey,
		params: { offset: (currentPage - 1) * limit, limit, ...searchParams },
	});

	// Mutations
	const { queryFn: banRentalFunc } = queryConfigs.useGetRentalBanByID;
	const { queryFn: unbanRentalFunc } = queryConfigs.useGetRentalUnbanByID;

	const { mutate: mutateBan, isPending: isBanPending } = useMutationQuery({
		func: (payload: TBanRentalPayload) => banRentalFunc(payload),
		invalidateKey: rentalKey,
		onSuccess: () => {
			setBanModalOpen(false);
			setReason('');
			setSelectedRentalId(null);
			refetch();
		},
	});

	const { mutate: mutateUnban, isPending: isUnbanPending } = useMutationQuery({
		func: (payload: TUnbanRentalPayload) => unbanRentalFunc(payload),
		invalidateKey: rentalKey,
		onSuccess: () => {
			setUnbanModalOpen(false);
			setReason('');
			setSelectedRentalId(null);
			refetch();
		},
	});

	// Search & Pagination
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setParams((prev) => ({ ...prev, [name]: value }));
	};
	const handleSearch = () => setSearchParams(params);
	const handleClear = () => {
		setParams({ email: '', username: '', mobile: '' });
		setSearchParams({ email: '', username: '', mobile: '' });
	};
	const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => setCurrentPage(value);

	// Navigation
	const handleClickBack = () => navigate(-1);
	const handleNavToView = (id: number) => navigate(`/rentals/${id}`);

	// Open modals
	const openBanModal = (id: number) => {
		setSelectedRentalId(id);
		setReason('');
		setBanModalOpen(true);
	};
	const openUnbanModal = (id: number) => {
		setSelectedRentalId(id);
		setReason('');
		setUnbanModalOpen(true);
	};

	const handleBanSubmit = () => {
		if (!selectedRentalId || !reason.trim()) {
			alert('Rental ID and reason are required');
			return;
		}
		mutateBan({
			id: selectedRentalId,
			rental_id: selectedRentalId, // Added rental_id
			ban_reason: reason.trim(),
		});
	};

	const handleUnbanSubmit = () => {
		if (!selectedRentalId || !reason.trim()) {
			alert('Rental ID and reason are required');
			return;
		}
		mutateUnban({
			id: selectedRentalId,
			rental_id: selectedRentalId, // Added rental_id
			lift_reason: reason.trim(),
		});
	};

	if (isLoading || isRefetching)
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
				<CircularProgress />
			</Box>
		);

	if (isError)
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
				<Typography color="error">Error loading rentals. Please try again.</Typography>
			</Box>
		);

	if (!data?.result?.list || data.result.list.length === 0)
		return (
			<>
				<div className="pb-4">
					<Header
						onBackClick={handleClickBack}
						onReloadClick={refetch}
						showButton
						pageName="Vehicle Rentals"
						buttonTitle="Add Vehicle Rental"
						buttonFunc={() => {}}
					/>
				</div>
				<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh">
					<Typography variant="h6" color="textSecondary" gutterBottom>
						No Vehicle Rental found
					</Typography>
				</Box>
			</>
		);

	return (
		<>
			<Link to="/addrental">Add rental</Link>
			<div className="pb-4">
				<Header onBackClick={handleClickBack} onReloadClick={refetch} showButton={false} pageName="Vehicle Rentals" />
			</div>

			<div className="flex flex-col h-full p-6">
				{/* Search */}
				<div className="my-6 flex gap-2">
					<TextField name="email" label="Email" size="small" value={params.email} onChange={handleSearchChange} sx={{ width: '20%' }} />
					<TextField name="username" label="Username" size="small" value={params.username} onChange={handleSearchChange} sx={{ width: '20%' }} />
					<TextField name="mobile" label="Mobile" size="small" value={params.mobile} onChange={handleSearchChange} sx={{ width: '20%' }} />
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
					<Table>
						<TableHead>
							<TableRow sx={{ backgroundColor: 'black' }}>
								<TableCell sx={{ color: 'white' }}>ID</TableCell>
								<TableCell sx={{ color: 'white' }}>Rental Title</TableCell>
								<TableCell sx={{ color: 'white' }}>Category</TableCell>
								<TableCell sx={{ color: 'white' }}>Insurance Required</TableCell>
								<TableCell sx={{ color: 'white' }}>Status</TableCell>
								<TableCell sx={{ color: 'white' }}>Seller</TableCell>
								<TableCell sx={{ color: 'white' }}>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data?.result.list.map((rental: TRentalItem) => (
								<TableRow key={rental.id}>
									<TableCell>{rental.id}</TableCell>
									<TableCell>{rental.name}</TableCell>
									<TableCell>{rental.category_name}</TableCell>
									<TableCell align="center">{rental.insurance_required ? 'No' : 'Yes'}</TableCell>
									<TableCell>
										<Chip
											label={rental.is_active === 0 ? 'Active' : 'Disabled'}
											color={rental.is_active === 0 ? 'success' : 'error'}
											size="small"
											variant="outlined"
											sx={{ fontWeight: 500, borderWidth: 1.5, '& .MuiChip-label': { px: 0.75 } }}
										/>
									</TableCell>
									<TableCell>{rental.seller_fullname}</TableCell>
									<TableCell>
										<section className="flex gap-2">
											<Tooltip title="View">
												<button onClick={() => handleNavToView(rental.id)} className="action-button">
													<FaEye size={14} />
												</button>
											</Tooltip>

											<Tooltip title="Edit">
												<button onClick={() => navigate(`/rental/${rental.id}`)} className="blue-action-button">
													✎
												</button>
											</Tooltip>

											{rental.is_active === 0 ? (
												<Tooltip title="Ban Vehicle Rental">
													<button onClick={() => openBanModal(rental.id)} className="red-action-button" disabled={isBanPending}>
														<FaBan size={14} />
													</button>
												</Tooltip>
											) : (
												<Tooltip title="UnBan Vehicle Rental">
													<button onClick={() => openUnbanModal(rental.id)} className="green-action-button" disabled={isUnbanPending}>
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

			{/* Ban Modal */}
			<Modal open={banModalOpen} onClose={() => setBanModalOpen(false)}>
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
						Ban Vehicle Rental
					</Typography>
					<TextField fullWidth label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} sx={{ mb: 2 }} />
					<Box display="flex" justifyContent="flex-end" gap={2}>
						<Button variant="outlined" onClick={() => setBanModalOpen(false)}>
							Cancel
						</Button>
						<Button variant="contained" onClick={handleBanSubmit} disabled={isBanPending}>
							{isBanPending ? <CircularProgress size={20} /> : 'Submit'}
						</Button>
					</Box>
				</Box>
			</Modal>

			{/* Unban Modal */}
			<Modal open={unbanModalOpen} onClose={() => setUnbanModalOpen(false)}>
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
						Unban Vehicle Rental
					</Typography>
					<TextField fullWidth label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} sx={{ mb: 2 }} />
					<Box display="flex" justifyContent="flex-end" gap={2}>
						<Button variant="outlined" onClick={() => setUnbanModalOpen(false)}>
							Cancel
						</Button>
						<Button variant="contained" onClick={handleUnbanSubmit} disabled={isUnbanPending}>
							{isUnbanPending ? <CircularProgress size={20} /> : 'Submit'}
						</Button>
					</Box>
				</Box>
			</Modal>
		</>
	);
}
