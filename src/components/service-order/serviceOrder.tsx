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
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';

import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery } from '../../query/hooks/queryHook';
import Loading from '../common/Loader';
import { ServiceOrder } from '../lib/types/response';

export const countStyle = 'flex items-center justify-center px-2 py-1 text-lg font-bold text-black rounded-full bg-gray-200';

const ServiceOrderPage = () => {
	const navigate = useNavigate();
	const limit = 10;
	const [currentPage, setCurrentPage] = useState(1);

	// Dropdown menu state
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [menuOrder, setMenuOrder] = useState<ServiceOrder | null>(null);
	const menuOpen = Boolean(anchorEl);

	// Modal state
	const [viewOpen, setViewOpen] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);

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

	// Menu handlers
	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, order: ServiceOrder) => {
		setAnchorEl(event.currentTarget);
		setMenuOrder(order);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
		setMenuOrder(null);
	};

	// Action handlers
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
				setSelectedOrder(menuOrder);
				setViewOpen(true);
				break;
			case 'print':
				window.print();
				break;
			default:
				break;
		}

		handleMenuClose();
	};

	// Loading / Error states
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

	if (!data?.result || data.result.count === 0) {
		return (
			<Box display="flex" flexDirection="column" height="100%">
				<div className="pb-4">
					<Header onBackClick={() => navigate(-1)} pageName="Service Orders" />
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

			{/* Orders Table */}
			<TableContainer sx={{ maxHeight: 540 }} component={Paper}>
				<Table stickyHeader aria-label="service orders table">
					<TableHead>
						<TableRow>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Order ID</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Name</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Rate ID</TableCell>
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
								<TableCell>{order.service_rate_id}</TableCell>
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

			{/* Total count */}
			<div className="flex items-center justify-center mt-5">
				<p className="flex items-center space-x-2 font-medium text-slate-700">
					<span>Total result:</span>
					<span className={countStyle}>{data.result.count}</span>
				</p>
			</div>

			{/* ===== View Service Order Dialog Inline ===== */}
			{/* ===== View Service Order Dialog Inline ===== */}
			<Dialog open={viewOpen && !!selectedOrder} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth>
				<DialogTitle>Service Order Details</DialogTitle>
				<DialogContent dividers>
					{selectedOrder ? (
						<>
							<Box display="flex" flexDirection="column" gap={1}>
								<Typography variant="subtitle1">
									<strong>Order ID:</strong> {selectedOrder.id}
								</Typography>
								<Typography variant="subtitle1">
									<strong>User ID:</strong> {selectedOrder.user_id}
								</Typography>
								<Typography variant="subtitle1">
									<strong>Service Name:</strong> {selectedOrder.service_name}
								</Typography>
								<Typography variant="subtitle1">
									<strong>Service ID:</strong> {selectedOrder.service_id}
								</Typography>
								<Typography variant="subtitle1">
									<strong>Service Rate ID:</strong> {selectedOrder.service_rate_id}
								</Typography>
								<Typography variant="subtitle1">
									<strong>Address ID:</strong> {selectedOrder.address_id}
								</Typography>
								<Typography variant="subtitle1">
									<strong>Discount ID:</strong> {selectedOrder.discount_id ?? 'N/A'}
								</Typography>

								<Box mt={2} mb={2}>
									<hr />
								</Box>

								<Typography variant="subtitle1">
									<strong>Razorpay Order ID:</strong> {selectedOrder.razorpay_order_id}
								</Typography>
								<Typography variant="subtitle1">
									<strong>Razorpay Payment ID:</strong> {selectedOrder.razorpay_payment_id}
								</Typography>
								<Typography variant="subtitle1">
									<strong>Razorpay Signature:</strong> {selectedOrder.razorpay_signature}
								</Typography>

								<Box mt={2} mb={2}>
									<hr />
								</Box>

								<Typography variant="subtitle1">
									<strong>Total Amount:</strong> ₹{selectedOrder.total_amount}
								</Typography>
								<Typography variant="subtitle1">
									<strong>Discount Amount:</strong> ₹{selectedOrder.discount_amount}
								</Typography>
								<Typography variant="subtitle1">
									<strong>Final Amount:</strong> ₹{selectedOrder.final_amount}
								</Typography>

								<Typography variant="subtitle1">
									<strong>Payment Status:</strong>{' '}
									<Chip
										label={selectedOrder.payment_status}
										color={
											selectedOrder.payment_status === 'success'
												? 'success'
												: selectedOrder.payment_status === 'pending'
												? 'warning'
												: 'error'
										}
										size="small"
									/>
								</Typography>

								<Typography variant="subtitle1">
									<strong>Order Status:</strong>{' '}
									<Chip
										label={selectedOrder.order_status}
										color={
											selectedOrder.order_status === 'completed'
												? 'success'
												: selectedOrder.order_status === 'pending'
												? 'warning'
												: 'info'
										}
										size="small"
									/>
								</Typography>

								{selectedOrder.payment_failure_reason && (
									<Typography variant="subtitle1">
										<strong>Payment Failure Reason:</strong> {selectedOrder.payment_failure_reason}
									</Typography>
								)}

								<Box mt={2} mb={2}>
									<hr />
								</Box>

								<Typography variant="subtitle1">
									<strong>Created On:</strong> {new Date(selectedOrder.created_on).toLocaleString()}
								</Typography>
								<Typography variant="subtitle1">
									<strong>Updated On:</strong> {selectedOrder.updated_on ? new Date(selectedOrder.updated_on).toLocaleString() : 'N/A'}
								</Typography>
							</Box>
						</>
					) : (
						<Typography>No details available.</Typography>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setViewOpen(false)} variant="contained">
						Close
					</Button>
				</DialogActions>
			</Dialog>
			{/* <Dialog open={updateOpen && !!selectedOrder} onClose={() => setUpdateOpen(false)} maxWidth="sm" fullWidth>
				<DialogTitle>Update Order Status</DialogTitle>
				<DialogContent dividers>
					<Typography>Select the new status:</Typography>
					<Box display="flex" flexDirection="column" gap={1} mt={2}>
						{statusFlow.map((status) => {
							const currentIndex = statusFlow.indexOf(selectedOrder!.order_status);
							const statusIndex = statusFlow.indexOf(status);
							const disabled = statusIndex <= currentIndex; // prevent reverse
							return (
								<Button
									key={status}
									variant={status === newStatus ? 'contained' : 'outlined'}
									disabled={disabled}
									onClick={() => setNewStatus(status)}
								>
									{status.charAt(0).toUpperCase() + status.slice(1)}
								</Button>
							);
						})}
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setUpdateOpen(false)}>Cancel</Button>
					<Button
						variant="contained"
						disabled={newStatus === selectedOrder?.order_status}
						onClick={() => {
							if (selectedOrder && newStatus) {
								updateStatus({ orderId: selectedOrder.id, status: newStatus });
								setUpdateOpen(false);
							}
						}}
					>
						Update
					</Button>
				</DialogActions>
			</Dialog> */}
		</div>
	);
};

export default ServiceOrderPage;
