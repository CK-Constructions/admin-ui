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
import { TServiceItem } from '../lib/types/response';
import { FaBan, FaEye } from 'react-icons/fa';
import { BsUniversalAccessCircle } from 'react-icons/bs';
import { sanitizeValue } from '../utils/utils';
import { countStyle } from '../vendors/Vendors';
import { TUserFormData } from '../lib/types/payloads';
import { useNavigate } from 'react-router';
import Header from '../common/Header';

export default function Services() {
	const navigate = useNavigate();

	// State variables
	const [currentPage, setCurrentPage] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<TServiceItem | null>(null);
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

	// ✅ Only one search field now: service name
	const [serviceName, setServiceName] = useState('');

	const [openBanDialog, setOpenBanDialog] = useState(false);
	const [openViewDialog, setOpenViewDialog] = useState(false);
	const [editingUserId, setEditingUserId] = useState<number | null>(null);

	// Query and data fetching
	const limit = 10;
	const { queryFn: serviceFunc, queryKeys: serviceKey } = queryConfigs.useGetAllService;
	const { data, refetch, isLoading, isRefetching, isError } = useGetQuery({
		func: serviceFunc,
		key: serviceKey,
		params: {
			offset: (currentPage - 1) * limit,
			limit,
			// ✅ send the service name as search param (adjust key if API expects different name)
			name: serviceName,
		},
	});

	// Pagination
	const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
		setCurrentPage(value);
	};

	// Dialog and modal functions
	const handleOpenBanDialog = (rental: TServiceItem) => {
		setSelectedUser(rental);
		setOpenBanDialog(true);
	};
	const handleOpenViewDialog = (rental: TServiceItem) => {
		setSelectedUserId(rental?.id);
		setOpenViewDialog(true);
	};

	const handleClickBack = () => {
		navigate(-1);
	};

	const handleNavToView = (id: number) => {
		if (id) navigate(`/services/${id}`);
	};

	// Loading and error states
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
				<Typography color="error">Error loading services. Please try again.</Typography>
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
						buttonTitle="Add Vehicle Rental"
						pageName="Services"
						buttonFunc={() => setIsModalOpen(true)}
					/>
				</div>

				<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh">
					<Typography variant="h6" color="textSecondary" gutterBottom>
						No Service found
					</Typography>
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
					showButton={false}
					buttonTitle="Add Service"
					pageName="Services"
					buttonFunc={() => setIsModalOpen(true)}
				/>
			</div>

			<div className="flex flex-col h-full p-6">
				{/* ✅ Single search box */}
				<div className="my-6 flex gap-2">
					<TextField
						name="name"
						label="Service Name"
						variant="outlined"
						size="small"
						value={serviceName}
						onChange={(e) => setServiceName(e.target.value)}
						sx={{ width: '25%' }}
					/>
					<Button
						variant="outlined"
						onClick={() => {
							setCurrentPage(1);
							refetch();
						}}
					>
						Search
					</Button>
					<Button
						variant="outlined"
						onClick={() => {
							setServiceName('');
							setCurrentPage(1);
							refetch();
						}}
					>
						Clear
					</Button>
				</div>

				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow sx={{ backgroundColor: 'black' }}>
								<TableCell sx={{ color: 'white' }}>ID</TableCell>
								<TableCell sx={{ color: 'white' }}>Service Title</TableCell>
								<TableCell sx={{ color: 'white' }}>Category</TableCell>
								<TableCell sx={{ color: 'white' }}>Seller</TableCell>
								<TableCell sx={{ color: 'white' }}>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data?.result.list.map((rental: TServiceItem) => (
								<TableRow key={rental?.id}>
									<TableCell>{rental?.id}</TableCell>
									<TableCell>{rental?.name}</TableCell>
									<TableCell>{rental?.category_name}</TableCell>

									<TableCell>{rental?.seller_fullname}</TableCell>
									<TableCell>
										<section className="w-full flex gap-2">
											<Tooltip title="View">
												<button onClick={() => handleNavToView(rental.id)} className="action-button">
													<FaEye size={14} />
												</button>
											</Tooltip>
											{rental?.is_active === 0 && (
												<Tooltip title="Ban Service">
													<button onClick={() => handleOpenBanDialog(rental)} className="red-action-button">
														<FaBan size={14} />
													</button>
												</Tooltip>
											)}
											{rental?.is_active === 1 && (
												<Tooltip title="UnBan Services">
													<button onClick={() => handleOpenBanDialog(rental)} className="green-action-button">
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
		</>
	);
}
