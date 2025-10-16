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
} from '@mui/material';
import { FaEye, FaTimes, FaShare } from 'react-icons/fa';
import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery, useMutationQuery } from '../../query/hooks/queryHook';
import { Order, OrderItem } from '../lib/types/response';
import Header from '../common/Header';
import { useNavigate } from 'react-router';
import Loading from '../common/Loader';
import { showNotification } from '../utils/utils';

export const countStyle = 'flex items-center justify-center px-2 py-1 text-lg font-bold text-black rounded-full bg-gray-200';

export default function ListingOrders() {
	const navigate = useNavigate();
	const limit = 10;
	const [currentPage, setCurrentPage] = useState(1);

	const [openViewDialog, setOpenViewDialog] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

	const [openCancelDialog, setOpenCancelDialog] = useState(false);
	const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
	const [isCancelling, setIsCancelling] = useState(false);

	const [isRedirecting, setIsRedirecting] = useState(false);
	const [orderToRedirect, setOrderToRedirect] = useState<Order | null>(null);

	const { queryFn: orderFunc, queryKeys: orderKey } = queryConfigs.useGetAllOrders;
	const { queryFn: cancelOrderFunc } = queryConfigs.useCancelListingOrder;
	const { queryFn: redirectOrderFunc } = queryConfigs.useRedirectListingOrder;

	// Fetch listing orders
	const { data, isLoading, isLoadingError, isFetching, isRefetching, isRefetchError, refetch } = useGetQuery({
		func: orderFunc,
		key: orderKey,
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
		onError: () => {
			showNotification('error', 'Failed to cancel order');
			setIsCancelling(false);
		},
	});

	// Redirect order mutation
	const { mutate: redirectOrder } = useMutationQuery({
		func: redirectOrderFunc,
		invalidateKey: orderKey,
		onSuccess: () => {
			showNotification('success', `Order ${orderToRedirect?.id} redirected successfully`);
			setIsRedirecting(false);
			setOrderToRedirect(null);
			refetch();
		},
		onError: () => {
			showNotification('error', 'Failed to redirect order');
			setIsRedirecting(false);
		},
	});

	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		event.preventDefault();
		setCurrentPage(value);
	};

	// View dialog
	const handleOpenViewDialog = (order: Order) => {
		setSelectedOrder(order);
		setOpenViewDialog(true);
	};
	const handleCloseDialog = () => {
		setOpenViewDialog(false);
		setSelectedOrder(null);
	};

	// Cancel dialog
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

	// Redirect action
	const handleRedirectOrder = (order: Order) => {
		setIsRedirecting(true);
		setOrderToRedirect(order);
		redirectOrder({ listing_order_id: order.id }); // ✅ correct payload
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
							<TableRow key={order.id}>
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
									<Chip
										label={order.order_status}
										color={
											order.order_status === 'completed'
												? 'success'
												: order.order_status === 'pending'
												? 'warning'
												: order.order_status === 'info'
												? 'info'
												: 'default'
										}
										size="small"
										variant="outlined"
									/>
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
										<Tooltip title="Redirect Order">
											<IconButton
												onClick={() => handleRedirectOrder(order)}
												size="small"
												disabled={isRedirecting && orderToRedirect?.id === order.id}
											>
												<FaShare color={isRedirecting && orderToRedirect?.id === order.id ? 'gray' : undefined} />
											</IconButton>
										</Tooltip>
										<Tooltip title="Cancel Order">
											<span>
												<IconButton
													onClick={() => handleOpenCancelDialog(order)}
													size="small"
													disabled={order.order_status === 'cancelled'}
												>
													<FaTimes color="red" />
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
						<Pagination count={Math.ceil(data.result.length / limit)} size="medium" page={currentPage} onChange={handlePageChange} />
					)}
					<p className="flex items-center space-x-2 font-medium text-slate-700">
						<span>Total result:</span>
						<span className={countStyle}>{data?.result.length}</span>
					</p>
				</div>
			</div>

			{/* View Order Dialog */}
			<Dialog open={openViewDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
				<DialogTitle>Order Details</DialogTitle>
				<DialogContent dividers>
					<Typography variant="h6" gutterBottom>
						Order ID: {selectedOrder?.id}
					</Typography>
					<Typography>Total Amount: ₹{selectedOrder?.total_amount}</Typography>
					<Typography>Final Amount: ₹{selectedOrder?.final_amount}</Typography>
					<Typography>Payment Status: {selectedOrder?.payment_status}</Typography>
					<Typography>Order Status: {selectedOrder?.order_status}</Typography>
					<Typography>Created On: {selectedOrder && new Date(selectedOrder.created_on).toLocaleString()}</Typography>

					<Box mt={3}>
						<Typography variant="subtitle1" fontWeight="bold" gutterBottom>
							Items:
						</Typography>
						<Table size="small" sx={{ mt: 1 }}>
							<TableHead>
								<TableRow>
									<TableCell>Product</TableCell>
									<TableCell>Category</TableCell>
									<TableCell align="center">Quantity</TableCell>
									<TableCell align="right">Unit Price (₹)</TableCell>
									<TableCell align="right">Total Price (₹)</TableCell>
									<TableCell>Est. Delivery (days)</TableCell>
									<TableCell>Order Date</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{selectedOrder?.items.map((item: OrderItem) => (
									<TableRow key={item.id}>
										<TableCell>
											<Box display="flex" alignItems="center" gap={1}>
												{item.product_image && (
													<img
														src={item.product_image}
														alt={item.product_name}
														style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
													/>
												)}
												{item.product_name}
											</Box>
										</TableCell>
										<TableCell>{item.category_name}</TableCell>
										<TableCell align="center">{item.quantity}</TableCell>
										<TableCell align="right">{item.unit_price}</TableCell>
										<TableCell align="right">{item.total_price}</TableCell>
										<TableCell>{item.estimated_delivery_days}</TableCell>
										<TableCell>{new Date(item.order_date).toLocaleDateString()}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} variant="outlined">
						Close
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
