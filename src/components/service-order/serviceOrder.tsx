import React, { useState } from 'react';
import Header from '../common/Header';
import {
	Box,
	Chip,
	IconButton,
	Menu,
	MenuItem,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';

import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery } from '../../query/hooks/queryHook';
import Loading from '../common/Loader';
import { ServiceOrder } from '../lib/types/response'; // <-- type only

export const countStyle = 'flex items-center justify-center px-2 py-1 text-lg font-bold text-black rounded-full bg-gray-200';

const ServiceOrderPage = () => {
	const navigate = useNavigate();
	const limit = 10;
	const [currentPage, setCurrentPage] = useState(1);

	// dropdown state
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [menuOrder, setMenuOrder] = useState<ServiceOrder | null>(null);
	const menuOpen = Boolean(anchorEl);

	const { queryFn: serviceorderFunc, queryKeys: serviceorderKey } = queryConfigs.useGetAllServiceOrder;

	const { data, isLoading, isLoadingError, isFetching, isRefetching, isRefetchError } = useGetQuery({
		func: serviceorderFunc,
		key: serviceorderKey,
		params: {
			limit,
			offset: (currentPage - 1) * limit,
		},
	});

	const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
		setCurrentPage(value);
	};

	// --- menu handlers ---
	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, order: ServiceOrder) => {
		setAnchorEl(event.currentTarget);
		setMenuOrder(order);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
		setMenuOrder(null);
	};

	// ----- actions -----
	const handleAction = (action: string) => {
		if (!menuOrder) return;
		switch (action) {
			case 'cancel':
				console.log('Cancel', menuOrder.id);
				break;
			case 'redirect':
				navigate(`/orders/${menuOrder.id}`);
				break;
			case 'update':
				console.log('Update', menuOrder.id);
				break;
			case 'view':
				console.log('View', menuOrder.id);
				break;
			case 'print':
				window.print();
				break;
			default:
				break;
		}
		handleMenuClose();
	};

	if (isLoading || isFetching || isRefetching) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
				<Loading />
			</Box>
		);
	}

	if (isLoadingError || isRefetchError) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
				<Typography color="error">Error loading orders. Please try again.</Typography>
			</Box>
		);
	}

	if (!data || !data.result || data.result.count === 0) {
		return (
			<Box display="flex" flexDirection="column" height="100%">
				<div className="pb-4">
					<Header onBackClick={() => navigate(-1)} pageName="Service-Order" />
				</div>
				<Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
					<Typography>No orders found</Typography>
				</Box>
			</Box>
		);
	}

	return (
		<div className="flex flex-col h-full">
			<div className="pb-4">
				<Header onBackClick={() => navigate(-1)} pageName="Service Orders" />
			</div>

			<TableContainer sx={{ maxHeight: 540 }} component={Paper}>
				<Table stickyHeader aria-label="service orders table">
					<TableHead>
						<TableRow>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Order ID</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Name</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Rate</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Payment Status</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Order Status</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.result.list.map((order: ServiceOrder) => (
							<TableRow key={order.id}>
								<TableCell>{order.id}</TableCell>
								<TableCell>{order.service_name}</TableCell>
								<TableCell>₹{order.service_rate_id}</TableCell>
								<TableCell>
									<Chip
										label={order.payment_status}
										color={order.payment_status === 'success' ? 'success' : order.payment_status === 'pending' ? 'warning' : 'error'}
										size="small"
										variant="outlined"
									/>
								</TableCell>
								<TableCell>
									<Chip
										label={order.order_status}
										color={order.order_status === 'completed' ? 'success' : order.order_status === 'pending' ? 'warning' : 'info'}
										size="small"
										variant="outlined"
									/>
								</TableCell>
								<TableCell>
									<Tooltip title="Actions">
										<IconButton size="small" onClick={(e) => handleMenuClick(e, order)}>
											<MoreVertIcon />
										</IconButton>
									</Tooltip>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Dropdown Menu */}
			<Menu
				anchorEl={anchorEl}
				open={menuOpen}
				onClose={handleMenuClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			>
				<MenuItem onClick={() => handleAction('cancel')}>Cancel</MenuItem>
				<MenuItem onClick={() => handleAction('redirect')}>Redirect</MenuItem>
				<MenuItem onClick={() => handleAction('update')}>Update</MenuItem>
				<MenuItem onClick={() => handleAction('view')}>View</MenuItem>
				<MenuItem onClick={() => handleAction('print')}>Print</MenuItem>
			</Menu>

			<div className="flex items-center justify-center mt-5">
				<p className="flex items-center space-x-2 font-medium text-slate-700">
					<span>Total result:</span>
					<span className={countStyle}>{data.result.count}</span>
				</p>
			</div>
		</div>
	);
};

export default ServiceOrderPage;
