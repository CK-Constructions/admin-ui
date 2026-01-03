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
	Tooltip,
	CircularProgress,
	Box,
	Typography,
} from '@mui/material';
import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery } from '../../query/hooks/queryHook';
import { TServiceItem } from '../lib/types/response';
import { sanitizeValue } from '../utils/utils';
import { countStyle } from '../vendors/Vendors';
import { FaBan, FaEye, FaEdit } from 'react-icons/fa';
import { BsUniversalAccessCircle } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router';
import Header from '../common/Header';

export default function Services() {
	const navigate = useNavigate();
	const [currentPage, setCurrentPage] = useState(1);
	const [serviceName, setServiceName] = useState('');

	const limit = 10;
	const { queryFn: serviceFunc, queryKeys: serviceKey } = queryConfigs.useGetAllService;

	const { data, refetch, isLoading, isRefetching, isError } = useGetQuery({
		func: serviceFunc,
		key: serviceKey,
		params: {
			offset: (currentPage - 1) * limit,
			limit,
			name: serviceName,
		},
	});

	// Navigation Functions
	const handleNavToView = (id: number) => navigate(`/services/${id}`);
	const handleNavToUpdate = (id: number) => navigate(`/service/${id}`); // 👈 Update Page Route
	const handleClickBack = () => navigate(-1);

	const handlePageChange = (_: any, value: number) => {
		setCurrentPage(value);
	};

	// Loading / Error / Empty States
	if (isLoading || isRefetching)
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
				<CircularProgress />
			</Box>
		);

	if (isError)
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
				<Typography color="error">Error loading services. Please try again.</Typography>
			</Box>
		);

	if (!data?.result?.list?.length)
		return (
			<>
				<Header
					onBackClick={handleClickBack}
					onReloadClick={refetch}
					showButton={true}
					buttonTitle="Add Service"
					pageName="Services"
					buttonFunc={() => navigate('/addservice')}
				/>

				<Box display="flex" flexDirection="column" alignItems="center" minHeight="50vh">
					<Typography variant="h6" color="textSecondary">
						No Services Found
					</Typography>
				</Box>
			</>
		);

	// UI Render
	return (
		<>
			<Header onBackClick={handleClickBack} onReloadClick={refetch} showButton={false} buttonTitle="Add Service" pageName="Services" />

			<div className="flex flex-col h-full p-6">
				{/* Search */}
				<div className="mb-6 flex gap-2">
					<TextField
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
							<TableRow sx={{ background: 'black' }}>
								<TableCell sx={{ color: 'white' }}>ID</TableCell>
								<TableCell sx={{ color: 'white' }}>Title</TableCell>
								<TableCell sx={{ color: 'white' }}>Category</TableCell>
								<TableCell sx={{ color: 'white' }}>Seller</TableCell>
								<TableCell sx={{ color: 'white' }}>Actions</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{data?.result.list.map((service: TServiceItem) => (
								<TableRow key={service.id}>
									<TableCell>{service.id}</TableCell>
									<TableCell>{service.name}</TableCell>
									<TableCell>{service.category_name}</TableCell>
									<TableCell>{service.seller_fullname}</TableCell>

									<TableCell>
										<div className="flex gap-2">
											{/* View */}
											<Tooltip title="View Details">
												<button onClick={() => handleNavToView(service.id)} className="action-button">
													<FaEye size={15} />
												</button>
											</Tooltip>

											{/* Update / Edit */}
											<Tooltip title="Edit Service">
												<button onClick={() => handleNavToUpdate(service.id)} className="action-button">
													<FaEdit size={15} />
												</button>
											</Tooltip>

											{/* Ban / Unban */}
											{service.is_active === 0 ? (
												<Tooltip title="Ban Service">
													<button className="red-action-button">
														<FaBan size={15} />
													</button>
												</Tooltip>
											) : (
												<Tooltip title="Unban Service">
													<button className="green-action-button">
														<BsUniversalAccessCircle size={16} />
													</button>
												</Tooltip>
											)}
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

				{/* Pagination */}
				<div className="flex justify-center mt-5">
					<Pagination count={Math.ceil(sanitizeValue(data?.result?.count) / limit)} page={currentPage} onChange={handlePageChange} />
				</div>

				<p className="mt-3 text-center font-medium">
					Total Results: <span className={countStyle}>{sanitizeValue(data?.result?.count)}</span>
				</p>
			</div>
		</>
	);
}
