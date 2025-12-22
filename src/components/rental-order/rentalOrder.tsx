import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RentalOrder as RentalOrderType } from '../lib/types/response';
import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery, useMutationQuery } from '../../query/hooks/queryHook';
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
	TableHead,
	TableRow,
	TableContainer,
	Tooltip,
	Typography,
	Pagination,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	DialogContentText,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem as MuiMenuItem,
	CircularProgress,
} from '@mui/material';
import Loading from '../common/Loader';
import Header from '../common/Header';
import { MoreVerticalIcon } from 'lucide-react';
import { showNotification } from '../utils/utils';

const countStyle = 'flex items-center justify-center px-2 py-1 text-lg font-bold text-black rounded-full bg-gray-200';

const RentalOrderList: React.FC = () => {
	const navigate = useNavigate();
	const limit = 10;
	const [currentPage, setCurrentPage] = useState(1);

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [menuOrder, setMenuOrder] = useState<RentalOrderType | null>(null);
	const [statusDialogOpen, setStatusDialogOpen] = useState(false);
	const [newStatus, setNewStatus] = useState('');
	const [reason, setReason] = useState('');
	const [updatingStatus, setUpdatingStatus] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);

	const menuOpen = Boolean(anchorEl);

	const { queryFn: rentalOrderFunc, queryKeys: rentalOrderKey } = queryConfigs.useGetAllRentalOrder;

	const { data, refetch, isLoading, isFetching, isRefetching, isLoadingError, isRefetchError } = useGetQuery({
		func: rentalOrderFunc,
		key: rentalOrderKey,
		params: { limit, offset: (currentPage - 1) * limit },
	});

	// CORRECT: Use the right config key
	const { queryFn: updateStatusFn } = queryConfigs.useUpdateRentalOrder;

	const { mutate: updateOrderStatus } = useMutationQuery({
		func: updateStatusFn,
		invalidateKey: rentalOrderKey,
		onSuccess: () => {
			showNotification('success', `Status updated to ${getStatusLabel(newStatus)}`);
			refetch();
			handleCloseDialog();
		},
		// onError: (err: any) => {
		// 	showNotification('error', err?.response?.data?.message || 'Failed to update status');
		// 	setUpdatingStatus(false);
		// },
	});

	// Cancel order (existing working endpoint)
	const { queryFn: cancelRentalFunc } = queryConfigs.useCancelRentalOrder;
	const { mutate: cancelRental } = useMutationQuery({
		func: cancelRentalFunc,
		invalidateKey: rentalOrderKey,
		onSuccess: () => {
			showNotification('success', `Order #${menuOrder?.id} cancelled`);
			refetch();
			setIsCancelling(false);
			handleMenuClose();
		},
		onError: () => {
			showNotification('error', 'Failed to cancel order');
			setIsCancelling(false);
		},
	});

	const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>, order: RentalOrderType) => {
		setAnchorEl(e.currentTarget);
		setMenuOrder(order);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setMenuOrder(null);
	};

	const handleOpenStatusDialog = () => {
		setNewStatus('');
		setReason('');
		setStatusDialogOpen(true);
		handleMenuClose();
	};

	const handleCloseDialog = () => {
		setStatusDialogOpen(false);
		setUpdatingStatus(false);
		setNewStatus('');
		setReason('');
	};

	const handleUpdateStatus = () => {
		if (!menuOrder || !newStatus) return;

		setUpdatingStatus(true);

		// FIXED: Send correct field name → `id`, not `order_id`
		updateOrderStatus({
			id: menuOrder.id,
			new_status: newStatus,
			reason: newStatus === 'cancelled' ? reason : undefined,
		});
	};

	const handleCancelOrder = () => {
		if (!menuOrder) return;
		setIsCancelling(true);
		cancelRental({ id: menuOrder.id });
	};

	const isTerminal = (status: string) => status === 'completed' || status === 'cancelled';

	const getStatusColor = (status: string) => {
		const map: Record<string, any> = {
			pending: 'warning',
			booked: 'success',
			completed: 'info',
			cancelled: 'error',
		};
		return map[status] || 'default';
	};

	const getStatusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

	if (isLoading || isFetching || isRefetching) return <Loading />;
	if (isLoadingError || isRefetchError) return <Typography color="error">Error loading orders</Typography>;

	const orders = (data?.result?.list as RentalOrderType[]) || [];
	const totalCount = data?.result?.count ?? 0;
	const totalPages = Math.ceil(totalCount / limit);

	if (orders.length === 0) {
		return (
			<Box sx={{ p: 4, textAlign: 'center' }}>
				<Header onBackClick={() => navigate(-1)} pageName="Rental Orders" />
				<Typography variant="h6" color="textSecondary" mt={4}>
					No rental orders found
				</Typography>
			</Box>
		);
	}

	return (
		<div className="flex flex-col h-full">
			<Header onBackClick={() => navigate(-1)} pageName="Rental Orders" />

			<TableContainer component={Paper} sx={{ flexGrow: 1, maxHeight: 'calc(100vh - 200px)', mt: 2 }}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							{['Order ID', 'Rental ID', 'User', 'Name', 'Payment', 'Status', 'Actions'].map((h) => (
								<TableCell key={h} sx={{ bgcolor: 'black', color: 'white', fontWeight: 'bold' }}>
									{h}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{orders.map((order) => {
							const terminal = isTerminal(order.order_status);
							return (
								<TableRow
									key={order.id}
									sx={{
										opacity: terminal ? 0.6 : 1,
										bgcolor: order.order_status === 'cancelled' ? '#ffebee' : 'inherit',
									}}
								>
									<TableCell>#{order.id}</TableCell>
									<TableCell>#{order.rental_id}</TableCell>
									<TableCell>#{order.user_id}</TableCell>
									<TableCell>{order.rental_name || '-'}</TableCell>
									<TableCell>
										<Chip label={order.payment_status} size="small" />
									</TableCell>
									<TableCell>
										<Chip label={getStatusLabel(order.order_status)} color={getStatusColor(order.order_status)} size="small" />
									</TableCell>
									<TableCell>
										<IconButton size="small" onClick={(e) => handleMenuClick(e, order)} disabled={terminal}>
											<MoreVerticalIcon size={18} />
										</IconButton>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Actions Menu */}
			<Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
				<MenuItem onClick={() => navigate(`/rental-orders/${menuOrder?.id}`)}>View Details</MenuItem>
				<MenuItem onClick={handleOpenStatusDialog} disabled={isTerminal(menuOrder?.order_status || '')}>
					Update Status
				</MenuItem>
				<MenuItem onClick={handleCancelOrder} disabled={isCancelling || isTerminal(menuOrder?.order_status || '')} sx={{ color: 'error.main' }}>
					{isCancelling ? 'Cancelling...' : 'Cancel Order'}
				</MenuItem>
				<MenuItem onClick={() => window.print()}>Print Receipt</MenuItem>
			</Menu>

			{/* Status Update Dialog */}
			<Dialog open={statusDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
				<DialogTitle>Update Order Status</DialogTitle>
				<DialogContent>
					<DialogContentText mb={2}>
						Order: <strong>#{menuOrder?.rental_order_id}</strong> | Current:{' '}
						<Chip label={getStatusLabel(menuOrder?.order_status || '')} size="small" />
					</DialogContentText>

					<FormControl fullWidth margin="normal">
						<InputLabel>New Status</InputLabel>
						<Select value={newStatus} label="New Status" onChange={(e) => setNewStatus(e.target.value)}>
							{!isTerminal(menuOrder?.order_status || '') && (
								<>
									{menuOrder?.order_status !== 'booked' && <MuiMenuItem value="booked">Booked</MuiMenuItem>}
									{menuOrder?.order_status !== 'completed' && <MuiMenuItem value="completed">Completed</MuiMenuItem>}
									<MuiMenuItem value="cancelled">Cancelled</MuiMenuItem>
								</>
							)}
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
					<Button onClick={handleCloseDialog} disabled={updatingStatus}>
						Cancel
					</Button>
					<Button
						onClick={handleUpdateStatus}
						variant="contained"
						color={newStatus === 'cancelled' ? 'error' : 'primary'}
						disabled={!newStatus || updatingStatus}
					>
						{updatingStatus ? <CircularProgress size={20} /> : 'Update'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Pagination */}
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
				<Typography variant="body2">
					Total: <strong>{totalCount}</strong>
				</Typography>
				{totalPages > 1 && <Pagination count={totalPages} page={currentPage} onChange={(_, v) => setCurrentPage(v)} />}
			</Box>
		</div>
	);
};

export default RentalOrderList;
