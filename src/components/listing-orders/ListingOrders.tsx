import { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Pagination,
	Chip,
	Box,
	Typography,
	Tooltip,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from '@mui/material';
import { FaEye, FaTimes, FaShare, FaEdit } from 'react-icons/fa';
import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery, useMutationQuery } from '../../query/hooks/queryHook';
import { Order, OrderItem } from '../lib/types/response';
import Header from '../common/Header';
import { useNavigate } from 'react-router';
import Loading from '../common/Loader';
import { showNotification } from '../utils/utils';

export const countStyle = 'flex items-center justify-center px-2 py-1 text-lg font-bold text-black rounded-full bg-gray-200';

// Status options for the dropdown

// Status options for the dropdown
const LISTING_STATUS_OPTIONS = [
	'pending',
	'confirmed',
	'processing',
	'dispatched',
	'out_for_delivery',
	'completed',
	'cancelled',
	'partial_paid',
	'payment_due',
];

export default function ListingOrders() {
	const navigate = useNavigate();
	const limit = 10;
	const [currentPage, setCurrentPage] = useState(1);

	// View Dialog State
	const [openViewDialog, setOpenViewDialog] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

	// Cancel Dialog State
	const [openCancelDialog, setOpenCancelDialog] = useState(false);
	const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
	const [isCancelling, setIsCancelling] = useState(false);

	// Update Status Dialog State
	const [openStatusDialog, setOpenStatusDialog] = useState(false);
	const [orderToUpdate, setOrderToUpdate] = useState<Order | null>(null);
	const [newStatus, setNewStatus] = useState('');
	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

	// Redirect State
	const [isRedirecting, setIsRedirecting] = useState(false);
	const [orderToRedirect, setOrderToRedirect] = useState<number | null>(null);

	// Query Configurations
	const { queryFn: orderFunc, queryKeys: orderKey } = queryConfigs.useGetAllOrders;
	const { queryFn: cancelOrderFunc } = queryConfigs.useCancelListingOrder;
	const { queryFn: updateStatusFunc } = queryConfigs.useUpdateListingOrder;
	const { queryFn: redirectOrderFunc } = queryConfigs.useRedirectListingOrder;

	// Fetch listing orders
	const { data, isLoading, isLoadingError, isFetching, isRefetching, isRefetchError, refetch } = useGetQuery({
		func: orderFunc,
		key: [...orderKey, currentPage.toString()],
		params: {
			limit,
			offset: (currentPage - 1) * limit,
		},
	});

	// Cancel order mutation
	const { mutate: cancelOrder } = useMutationQuery({
		func: cancelOrderFunc,
		invalidateKey: orderKey,
		onSuccess: () => {
			showNotification('success', `Order ${orderToCancel?.id} cancelled successfully`);
			setIsCancelling(false);
			setOpenCancelDialog(false);
			setOrderToCancel(null);
			refetch();
		},
	});

	// Update order status mutation
	const { mutate: updateOrderStatus } = useMutationQuery({
		func: updateStatusFunc,
		invalidateKey: orderKey,
		onSuccess: () => {
			showNotification('success', `Order status updated successfully`);
			setIsUpdatingStatus(false);
			setOpenStatusDialog(false);
			setOrderToUpdate(null);
			setNewStatus('');
			refetch();
		},
	});

	// Redirect order mutation (only this part was updated)
	const { mutate: redirectOrder } = useMutationQuery({
		func: redirectOrderFunc,
		invalidateKey: orderKey,
		onSuccess: () => {
			showNotification('success', `Vendor order(s) generated for order #${orderToRedirect}`);
			setIsRedirecting(false);
			setOrderToRedirect(null);
			refetch();
		},
		onError: () => {
			showNotification('error', 'Failed to generate vendor order');
			setIsRedirecting(false);
			setOrderToRedirect(null);
		},
	});

	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		event.preventDefault();
		setCurrentPage(value);
	};

	// View Dialog Handlers
	const handleOpenViewDialog = (order: Order) => {
		setSelectedOrder(order);
		setOpenViewDialog(true);
	};
	const handleCloseDialog = () => {
		setOpenViewDialog(false);
		setSelectedOrder(null);
	};

	// Cancel Dialog Handlers
	const handleOpenCancelDialog = (order: Order) => {
		setOrderToCancel(order);
		setOpenCancelDialog(true);
	};
	const handleCloseCancelDialog = () => {
		if (!isCancelling) {
			setOpenCancelDialog(false);
			setOrderToCancel(null);
		}
	};
	const handleConfirmCancel = () => {
		if (!orderToCancel) return;
		setIsCancelling(true);
		cancelOrder({ id: orderToCancel.id });
	};

	// Update Status Dialog Handlers
	const handleOpenStatusDialog = (order: Order) => {
		setOrderToUpdate(order);
		setNewStatus(order.order_status);
		setOpenStatusDialog(true);
	};
	const handleCloseStatusDialog = () => {
		if (!isUpdatingStatus) {
			setOpenStatusDialog(false);
			setOrderToUpdate(null);
			setNewStatus('');
		}
	};
	const handleConfirmStatusUpdate = () => {
		if (!orderToUpdate || !newStatus) return;
		setIsUpdatingStatus(true);
		updateOrderStatus({
			id: orderToUpdate.id,
			new_status: newStatus,
		});
	};

	// Redirect action – only this part changed
	const handleRedirectOrder = (order: Order) => {
		if (isRedirecting) return;

		setIsRedirecting(true);
		setOrderToRedirect(order.id);

		// Use order.id as order_id (main client_orders.id)
		redirectOrder({ order_id: order.id });
	};

	// Helper function to format status display
	const formatStatus = (status: string) => {
		return status.replace(/_/g, ' ').toUpperCase();
	};

	// Get chip color for status
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'completed':
				return 'success';
			case 'cancelled':
				return 'error';
			case 'pending':
			case 'payment_due':
			case 'partial_paid':
				return 'warning';
			case 'confirmed':
			case 'processing':
			case 'dispatched':
			case 'out_for_delivery':
				return 'info';
			default:
				return 'default';
		}
	};

	// Loader and error states
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

	if (!data || !data.result || data.result.length === 0) {
		return (
			<Box display="flex" flexDirection="column" height="100%">
				<div className="pb-4">
					<Header onBackClick={() => navigate(-1)} pageName="Listing-Order" />
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
				<Header onBackClick={() => navigate(-1)} pageName="Orders" />
			</div>

			<TableContainer sx={{ maxHeight: 540 }} component={Paper}>
				<Table stickyHeader aria-label="orders table">
					<TableHead>
						<TableRow>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Order ID</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Total Amount</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Final Amount</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Payment Status</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Order Status</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Items Count</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Created On</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.result.map((order: Order) => (
							<TableRow key={order.id} hover>
								<TableCell>{order.id}</TableCell>
								<TableCell>₹{order.total_amount}</TableCell>
								<TableCell>₹{order.final_amount}</TableCell>
								<TableCell>
									<Chip
										label={order.payment_status}
										color={order.payment_status === 'success' ? 'success' : order.payment_status === 'pending' ? 'warning' : 'error'}
										size="small"
										variant="outlined"
									/>
								</TableCell>
								<TableCell>
									<Chip label={formatStatus(order.order_status)} color={getStatusColor(order.order_status)} size="small" variant="outlined" />
								</TableCell>
								<TableCell>{order.items.length}</TableCell>
								<TableCell>{new Date(order.created_on).toLocaleString()}</TableCell>
								<TableCell>
									<div style={{ display: 'flex', gap: '8px' }}>
										<Tooltip title="View Order">
											<IconButton onClick={() => handleOpenViewDialog(order)} size="small">
												<FaEye />
											</IconButton>
										</Tooltip>
										<Tooltip title="Update Status">
											<IconButton onClick={() => handleOpenStatusDialog(order)} size="small" color="primary">
												<FaEdit />
											</IconButton>
										</Tooltip>
										<Tooltip title="Generate Vendor Order">
											<IconButton
												onClick={() => handleRedirectOrder(order)}
												size="small"
												disabled={isRedirecting && orderToRedirect === order.id}
											>
												<FaShare color={isRedirecting && orderToRedirect === order.id ? 'gray' : undefined} />
											</IconButton>
										</Tooltip>
										<Tooltip title="Cancel Order">
											<span>
												<IconButton
													onClick={() => handleOpenCancelDialog(order)}
													size="small"
													disabled={order.order_status === 'cancelled'}
												>
													<FaTimes color={order.order_status === 'cancelled' ? 'gray' : 'red'} />
												</IconButton>
											</span>
										</Tooltip>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Pagination */}
			<div className="flex items-center justify-center mt-5">
				<div className="flex items-center justify-end space-x-3">
					{data?.result.length > 0 && (
						<Pagination count={Math.ceil(data.result?.count / limit)} size="medium" page={currentPage} onChange={handlePageChange} />
					)}
					<p className="flex items-center space-x-2 font-medium text-slate-700">
						<span>Total result:</span>
						<span className={countStyle}>{data?.result?.count || data?.result.length}</span>
					</p>
				</div>
			</div>

			{/* View Order Dialog */}
			<Dialog open={openViewDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
				<DialogTitle>
					<Box display="flex" justifyContent="space-between" alignItems="center">
						<Typography variant="h6">Order Details</Typography>
						<Box display="flex" gap={1}>
							<Chip
								label={formatStatus(selectedOrder?.order_status || '')}
								color={getStatusColor(selectedOrder?.order_status || '')}
								size="small"
							/>
							<Chip
								label={selectedOrder?.payment_status || ''}
								color={
									selectedOrder?.payment_status === 'success' ? 'success' : selectedOrder?.payment_status === 'pending' ? 'warning' : 'error'
								}
								size="small"
							/>
						</Box>
					</Box>
				</DialogTitle>
				<DialogContent dividers>
					<Box mb={2}>
						<Typography variant="subtitle1" fontWeight="bold" gutterBottom>
							Order Information
						</Typography>
						<Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
							<Box>
								<Typography variant="body2" color="textSecondary">
									Order ID
								</Typography>
								<Typography variant="body1" fontWeight="bold">
									{selectedOrder?.id}
								</Typography>
							</Box>
							<Box>
								<Typography variant="body2" color="textSecondary">
									Total Amount
								</Typography>
								<Typography variant="body1" fontWeight="bold">
									₹{selectedOrder?.total_amount}
								</Typography>
							</Box>
							<Box>
								<Typography variant="body2" color="textSecondary">
									Final Amount
								</Typography>
								<Typography variant="body1" fontWeight="bold" color="primary">
									₹{selectedOrder?.final_amount}
								</Typography>
							</Box>
							<Box>
								<Typography variant="body2" color="textSecondary">
									Created On
								</Typography>
								<Typography variant="body1">{selectedOrder && new Date(selectedOrder.created_on).toLocaleString()}</Typography>
							</Box>
						</Box>
					</Box>

					<Box mt={3}>
						<Typography variant="subtitle1" fontWeight="bold" gutterBottom>
							Order Items ({selectedOrder?.items?.length || 0})
						</Typography>
						{selectedOrder?.items && selectedOrder.items.length > 0 ? (
							<Table size="small" sx={{ mt: 1 }}>
								<TableHead>
									<TableRow>
										<TableCell>Product</TableCell>
										<TableCell>Category</TableCell>
										<TableCell align="center">Quantity</TableCell>
										<TableCell align="right">Unit Price (₹)</TableCell>
										<TableCell align="right">Total Price (₹)</TableCell>
										<TableCell>Est. Delivery (days)</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{selectedOrder.items.map((item: OrderItem) => (
										<TableRow key={item.id} hover>
											<TableCell>
												<Box display="flex" alignItems="center" gap={1}>
													{item.product_image && (
														<img
															src={item.product_image}
															alt={item.product_name}
															style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
														/>
													)}
													<Box>
														<Typography variant="body2" fontWeight="medium">
															{item.product_name}
														</Typography>
														<Typography variant="caption" color="textSecondary">
															ID: {item.listing_id}
														</Typography>
													</Box>
												</Box>
											</TableCell>
											<TableCell>{item.category_name || 'N/A'}</TableCell>
											<TableCell align="center">{item.quantity}</TableCell>
											<TableCell align="right">₹{item.unit_price}</TableCell>
											<TableCell align="right">₹{item.total_price}</TableCell>
											<TableCell>{item.estimated_delivery_days || 'N/A'}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						) : (
							<Typography color="textSecondary" align="center" py={2}>
								No items found for this order
							</Typography>
						)}
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} variant="outlined">
						Close
					</Button>
				</DialogActions>
			</Dialog>

			{/* Update Status Dialog */}
			<Dialog open={openStatusDialog} onClose={handleCloseStatusDialog} maxWidth="sm" fullWidth>
				<DialogTitle>Update Order Status</DialogTitle>
				<DialogContent>
					<Box mt={2}>
						<Typography variant="body1" gutterBottom>
							Update status for Order <strong>#{orderToUpdate?.id}</strong>
						</Typography>
						<Box mb={2}>
							<Typography variant="body2" color="textSecondary">
								Current Status:{' '}
								<Chip
									label={formatStatus(orderToUpdate?.order_status || '')}
									size="small"
									color={getStatusColor(orderToUpdate?.order_status || '')}
									sx={{ ml: 1 }}
								/>
							</Typography>
						</Box>
						<FormControl fullWidth>
							<InputLabel>New Status</InputLabel>
							<Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} label="New Status" size="small">
								{LISTING_STATUS_OPTIONS.map((status) => (
									<MenuItem key={status} value={status}>
										{formatStatus(status)}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseStatusDialog} variant="outlined" disabled={isUpdatingStatus}>
						Cancel
					</Button>
					<Button
						onClick={handleConfirmStatusUpdate}
						variant="contained"
						color="primary"
						disabled={isUpdatingStatus || !newStatus || newStatus === orderToUpdate?.order_status}
					>
						{isUpdatingStatus ? 'Updating...' : 'Update Status'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Cancel Confirmation Dialog */}
			<Dialog open={openCancelDialog && !!orderToCancel} onClose={handleCloseCancelDialog}>
				<DialogTitle>Cancel Order</DialogTitle>
				<DialogContent dividers>
					<Typography>
						Are you sure you want to cancel order <strong>{orderToCancel?.id}</strong>?
					</Typography>
					<Typography variant="body2" color="textSecondary" mt={1}>
						This action cannot be undone.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseCancelDialog} variant="outlined" disabled={isCancelling}>
						No
					</Button>
					<Button onClick={handleConfirmCancel} variant="contained" color="error" disabled={isCancelling}>
						{isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
