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
import { FaEye, FaTimes, FaShare } from 'react-icons/fa';
import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery, useMutationQuery } from '../../query/hooks/queryHook';
import { Order, OrderItem } from '../lib/types/response';
import Header from '../common/Header';
import { useNavigate } from 'react-router';
import Loading from '../common/Loader';
import { showNotification } from '../utils/utils';

export const countStyle = 'flex items-center justify-center px-2 py-1 text-lg font-bold text-black rounded-full bg-gray-200';

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

	/* -------------------- Pagination -------------------- */
	const [currentPage, setCurrentPage] = useState(1);

	/* -------------------- View Dialog -------------------- */
	const [openViewDialog, setOpenViewDialog] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

	/* -------------------- Cancel Dialog -------------------- */
	const [openCancelDialog, setOpenCancelDialog] = useState(false);
	const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
	const [isCancelling, setIsCancelling] = useState(false);

	/* -------------------- Redirect -------------------- */
	const [isRedirecting, setIsRedirecting] = useState(false);
	const [orderToRedirect, setOrderToRedirect] = useState<Order | null>(null);

	/* -------------------- Update Status -------------------- */
	const [openStatusDialog, setOpenStatusDialog] = useState(false);
	const [orderToUpdateStatus, setOrderToUpdateStatus] = useState<Order | null>(null);
	const [newStatus, setNewStatus] = useState('');
	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

	/* -------------------- Queries -------------------- */
	const { queryFn: orderFunc, queryKeys: orderKey } = queryConfigs.useGetAllOrders;
	const { queryFn: cancelOrderFunc } = queryConfigs.useCancelListingOrder;
	const { queryFn: redirectOrderFunc } = queryConfigs.useRedirectListingOrder;
	const { queryFn: updateStatusFunc } = queryConfigs.useUpdateListingOrder;

	const { data, isLoading, isFetching, isLoadingError, isRefetching, isRefetchError, refetch } = useGetQuery({
		func: orderFunc,
		key: orderKey,
		params: {
			limit,
			offset: (currentPage - 1) * limit,
		},
	});

	/* -------------------- Mutations -------------------- */

	const { mutate: cancelOrder } = useMutationQuery({
		func: cancelOrderFunc,
		invalidateKey: orderKey,
		onSuccess: () => {
			showNotification('success', `Order ${orderToCancel?.id} cancelled`);
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

	const { mutate: redirectOrder } = useMutationQuery({
		func: redirectOrderFunc,
		invalidateKey: orderKey,
		onSuccess: () => {
			showNotification('success', `Order ${orderToRedirect?.id} redirected`);
			setIsRedirecting(false);
			setOrderToRedirect(null);
			refetch();
		},
		onError: () => {
			showNotification('error', 'Failed to redirect order');
			setIsRedirecting(false);
		},
	});

	const { mutate: updateListingStatus } = useMutationQuery({
		func: updateStatusFunc,
		invalidateKey: orderKey,
		onSuccess: () => {
			showNotification('success', 'Order status updated');
			setIsUpdatingStatus(false);
			setOpenStatusDialog(false);
			setOrderToUpdateStatus(null);
			setNewStatus('');
			refetch();
		},
		onError: () => {
			showNotification('error', 'Failed to update order status');
			setIsUpdatingStatus(false);
		},
	});

	/* -------------------- Handlers -------------------- */

	const handlePageChange = (_: unknown, value: number) => {
		setCurrentPage(value);
	};

	const handleOpenViewDialog = (order: Order) => {
		setSelectedOrder(order);
		setOpenViewDialog(true);
	};

	const handleOpenCancelDialog = (order: Order) => {
		setOrderToCancel(order);
		setOpenCancelDialog(true);
	};

	const handleConfirmCancel = () => {
		if (!orderToCancel) return;
		setIsCancelling(true);
		cancelOrder({ id: orderToCancel.id });
	};

	const handleRedirectOrder = (order: Order) => {
		setIsRedirecting(true);
		setOrderToRedirect(order);
		redirectOrder({ listing_order_id: order.id });
	};

	const handleOpenStatusDialog = (order: Order) => {
		setOrderToUpdateStatus(order);
		setNewStatus(order.order_status);
		setOpenStatusDialog(true);
	};

	const handleConfirmStatusUpdate = () => {
		if (!orderToUpdateStatus || !newStatus) return;
		setIsUpdatingStatus(true);
		updateListingStatus({
			id: orderToUpdateStatus.id,
			new_status: newStatus,
		});
	};

	/* -------------------- Load / Error -------------------- */

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
				<Typography color="error">Failed to load orders</Typography>
			</Box>
		);
	}

	/* -------------------- UI -------------------- */

	return (
		<div className="flex flex-col h-full">
			<div className="pb-4">
				<Header onBackClick={() => navigate(-1)} pageName="Listing Orders" />
			</div>

			<TableContainer component={Paper} sx={{ maxHeight: 540 }}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell>Order ID</TableCell>
							<TableCell>Total</TableCell>
							<TableCell>Final</TableCell>
							<TableCell>Payment Status</TableCell>
							<TableCell>Order Status</TableCell>
							<TableCell>Items</TableCell>
							<TableCell>Created</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{data?.result?.map((order: Order) => (
							<TableRow key={order.id}>
								<TableCell>{order.id}</TableCell>
								<TableCell>₹{order.total_amount}</TableCell>
								<TableCell>₹{order.final_amount}</TableCell>
								<TableCell>
									<Chip label={order.payment_status} size="small" />
								</TableCell>
								<TableCell>
									<Chip label={order.order_status} size="small" />
								</TableCell>
								<TableCell>{order.items.length}</TableCell>
								<TableCell>{new Date(order.created_on).toLocaleString()}</TableCell>
								<TableCell>
									<Tooltip title="View">
										<IconButton onClick={() => handleOpenViewDialog(order)}>
											<FaEye />
										</IconButton>
									</Tooltip>

									<Tooltip title="Update Status">
										<IconButton onClick={() => handleOpenStatusDialog(order)}>
											<Chip label="Update" size="small" />
										</IconButton>
									</Tooltip>

									<Tooltip title="Redirect">
										<IconButton onClick={() => handleRedirectOrder(order)}>
											<FaShare />
										</IconButton>
									</Tooltip>

									<Tooltip title="Cancel">
										<IconButton disabled={order.order_status === 'cancelled'} onClick={() => handleOpenCancelDialog(order)}>
											<FaTimes color="red" />
										</IconButton>
									</Tooltip>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* -------------------- Update Status Dialog -------------------- */}
			<Dialog open={openStatusDialog} onClose={() => !isUpdatingStatus && setOpenStatusDialog(false)}>
				<DialogTitle>Update Order Status</DialogTitle>
				<DialogContent>
					<FormControl fullWidth>
						<InputLabel>Status</InputLabel>
						<Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
							{LISTING_STATUS_OPTIONS.map((status) => (
								<MenuItem key={status} value={status}>
									{status}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
					<Button onClick={handleConfirmStatusUpdate} disabled={isUpdatingStatus} variant="contained">
						{isUpdatingStatus ? 'Updating...' : 'Update'}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
