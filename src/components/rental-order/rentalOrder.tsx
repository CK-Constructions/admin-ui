import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Button,
	Chip,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
	IconButton,
	InputLabel,
	Menu,
	MenuItem,
	Pagination,
	Paper,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';
import { MoreVerticalIcon } from 'lucide-react';

import { RentalOrder as RentalOrderType } from '../lib/types/response';
import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery, useMutationQuery } from '../../query/hooks/queryHook';
import Header from '../common/Header';
import Loading from '../common/Loader';
import { showNotification } from '../utils/utils';

const LIMIT = 10;

const RentalOrderList: React.FC = () => {
	const navigate = useNavigate();

	/* ------------------------- Pagination ------------------------- */
	const [page, setPage] = useState(1);

	/* ------------------------- Menu ------------------------- */
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const [menuOrder, setMenuOrder] = useState<RentalOrderType | null>(null);

	/* ------------------------- Status Dialog ------------------------- */
	const [statusDialogOpen, setStatusDialogOpen] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<RentalOrderType | null>(null);
	const [newStatus, setNewStatus] = useState('');
	const [reason, setReason] = useState('');

	/* ------------------------- Cancel ------------------------- */
	const [isCancelling, setIsCancelling] = useState(false);

	/* ------------------------- Queries ------------------------- */
	const { queryFn, queryKeys } = queryConfigs.useGetAllRentalOrder;

	const { data, isLoading, isFetching, refetch, isLoadingError } = useGetQuery({
		func: queryFn,
		key: queryKeys,
		params: {
			limit: LIMIT,
			offset: (page - 1) * LIMIT,
		},
	});

	/* ------------------------- Update Status ------------------------- */
	const { queryFn: updateStatusFn } = queryConfigs.useUpdateRentalOrder;

	const { mutate: updateOrderStatus, isPending: isUpdating } = useMutationQuery({
		func: updateStatusFn,
		invalidateKey: queryKeys,
		onSuccess: () => {
			showNotification('success', 'Order status updated successfully');
			closeStatusDialog();
			refetch();
		},
		onError: (err: any) => {
			showNotification('error', err?.response?.data?.message || 'Failed to update order status');
		},
	});

	/* ------------------------- Cancel Order ------------------------- */
	const { queryFn: cancelFn } = queryConfigs.useCancelRentalOrder;

	const { mutate: cancelOrder } = useMutationQuery({
		func: cancelFn,
		invalidateKey: queryKeys,
		onSuccess: () => {
			showNotification('success', `Order #${menuOrder?.id} cancelled`);
			setIsCancelling(false);
			handleMenuClose();
			refetch();
		},
		onError: () => {
			showNotification('error', 'Failed to cancel order');
			setIsCancelling(false);
		},
	});

	/* ------------------------- Helpers ------------------------- */
	const isTerminal = (status: string) => status === 'completed' || status === 'cancelled';

	const statusColor = (status: string) => {
		switch (status) {
			case 'pending':
				return 'warning';
			case 'booked':
				return 'success';
			case 'completed':
				return 'info';
			case 'cancelled':
				return 'error';
			default:
				return 'default';
		}
	};

	/* ------------------------- Menu Handlers ------------------------- */
	const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>, order: RentalOrderType) => {
		setAnchorEl(e.currentTarget);
		setMenuOrder(order);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setMenuOrder(null);
	};

	/* ------------------------- Status Dialog ------------------------- */
	const openStatusDialog = (order: RentalOrderType) => {
		setSelectedOrder(order);
		setNewStatus('');
		setReason('');
		setStatusDialogOpen(true);
		handleMenuClose();
	};

	const closeStatusDialog = () => {
		setStatusDialogOpen(false);
		setSelectedOrder(null);
		setNewStatus('');
		setReason('');
	};

	const submitStatusUpdate = () => {
		if (!selectedOrder || !newStatus) return;

		updateOrderStatus({
			id: selectedOrder.id,
			new_status: newStatus,
			reason: newStatus === 'cancelled' ? reason : undefined,
		});
	};

	/* ------------------------- Cancel Handler ------------------------- */
	const handleCancelOrder = () => {
		if (!menuOrder) return;
		setIsCancelling(true);
		cancelOrder({ id: menuOrder.id });
	};

	/* ------------------------- Render Guards ------------------------- */
	if (isLoading || isFetching) return <Loading />;
	if (isLoadingError) return <Typography color="error">Failed to load orders</Typography>;

	const orders: RentalOrderType[] = data?.result?.list || [];
	const total = data?.result?.count || 0;
	const pages = Math.ceil(total / LIMIT);

	/* ------------------------- Render ------------------------- */
	return (
		<div className="flex flex-col h-full">
			<Header onBackClick={() => navigate(-1)} pageName="Rental Orders" />

			<TableContainer component={Paper} sx={{ mt: 2, flexGrow: 1 }}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							{['Order ID', 'Rental ID', 'User', 'Name', 'Payment', 'Status', 'Actions'].map((h) => (
								<TableCell key={h} sx={{ backgroundColor: 'black', color: 'white', fontWeight: 600 }}>
									{h}
								</TableCell>
							))}
						</TableRow>
					</TableHead>

					<TableBody>
						{orders.map((order) => (
							<TableRow
								key={order.id}
								sx={{
									opacity: isTerminal(order.order_status) ? 0.6 : 1,
									backgroundColor: order.order_status === 'cancelled' ? '#ffebee' : 'inherit',
								}}
							>
								<TableCell>#{order.id}</TableCell>
								<TableCell>#{order.admin_rental_id}</TableCell>
								<TableCell>#{order.user_id}</TableCell>
								<TableCell>{order.rental_name || '-'}</TableCell>
								<TableCell>
									<Chip size="small" label={order.payment_status} />
								</TableCell>
								<TableCell>
									<Chip size="small" label={order.order_status} color={statusColor(order.order_status)} />
								</TableCell>
								<TableCell>
									<IconButton size="small" onClick={(e) => handleMenuOpen(e, order)} disabled={isTerminal(order.order_status)}>
										<MoreVerticalIcon size={18} />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* ------------------------- Menu ------------------------- */}
			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
				<MenuItem onClick={() => navigate(`/rental-orders/${menuOrder?.id}`)}>View Details</MenuItem>
				<MenuItem onClick={() => openStatusDialog(menuOrder!)} disabled={isTerminal(menuOrder?.order_status || '')}>
					Update Status
				</MenuItem>
				<MenuItem onClick={handleCancelOrder} disabled={isCancelling || isTerminal(menuOrder?.order_status || '')} sx={{ color: 'error.main' }}>
					{isCancelling ? 'Cancelling…' : 'Cancel Order'}
				</MenuItem>
			</Menu>

			{/* ------------------------- Status Dialog ------------------------- */}
			<Dialog open={statusDialogOpen} onClose={closeStatusDialog} fullWidth maxWidth="sm">
				<DialogTitle>Update Order Status</DialogTitle>

				<DialogContent>
					<DialogContentText sx={{ mb: 2 }}>
						Order <strong>#{selectedOrder?.id}</strong> — Current: <Chip size="small" label={selectedOrder?.order_status} />
					</DialogContentText>

					<FormControl fullWidth>
						<InputLabel>New Status</InputLabel>
						<Select value={newStatus} label="New Status" onChange={(e) => setNewStatus(e.target.value)}>
							<MenuItem value="booked">Booked</MenuItem>
							<MenuItem value="completed">Completed</MenuItem>
							<MenuItem value="cancelled">Cancelled</MenuItem>
						</Select>
					</FormControl>

					{newStatus === 'cancelled' && (
						<TextField
							fullWidth
							multiline
							rows={3}
							label="Reason (optional)"
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							sx={{ mt: 2 }}
						/>
					)}
				</DialogContent>

				<DialogActions>
					<Button onClick={closeStatusDialog} disabled={isUpdating}>
						Cancel
					</Button>
					<Button
						variant="contained"
						color={newStatus === 'cancelled' ? 'error' : 'primary'}
						onClick={submitStatusUpdate}
						disabled={!newStatus || isUpdating}
					>
						{isUpdating ? <CircularProgress size={20} /> : 'Update'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* ------------------------- Pagination ------------------------- */}
			<Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
				<Typography variant="body2">
					Total: <strong>{total}</strong>
				</Typography>
				{pages > 1 && <Pagination count={pages} page={page} onChange={(_, v) => setPage(v)} />}
			</Box>
		</div>
	);
};

export default RentalOrderList;
