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
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
	Pagination,
	Divider,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material';
import Loading from '../common/Loader';
import Header from '../common/Header';
import { MoreVerticalIcon } from 'lucide-react';
import { showNotification } from '../utils/utils';

export const countStyle = 'flex items-center justify-center px-2 py-1 text-lg font-bold text-black rounded-full bg-gray-200';

const RentalOrderList: React.FC = () => {
	const navigate = useNavigate();
	const limit = 10;
	const [currentPage, setCurrentPage] = useState(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [menuOrder, setMenuOrder] = useState<RentalOrderType | null>(null);
	const [viewOrder, setViewOrder] = useState<RentalOrderType | null>(null);
	const [isCancelling, setIsCancelling] = useState(false);
	const [isRedirecting, setIsRedirecting] = useState(false);

	const menuOpen = Boolean(anchorEl);

	const { queryFn: rentalOrderFunc, queryKeys: rentalOrderKey } = queryConfigs.useGetAllRentalOrder;

	// Fetch rental orders
	const { data, refetch, isLoading, isFetching, isRefetching, isLoadingError, isRefetchError } = useGetQuery({
		func: rentalOrderFunc,
		key: rentalOrderKey,
		params: {
			limit,
			offset: (currentPage - 1) * limit,
		},
	});

	// Cancel rental order
	const { queryFn: cancelRentalFunc } = queryConfigs.useCancelRentalOrder;

	const { mutate: cancelRental } = useMutationQuery({
		func: cancelRentalFunc,
		invalidateKey: rentalOrderKey,
		onSuccess: () => {
			showNotification('success', `Order ${menuOrder?.rental_order_id} cancelled successfully`);
			refetch();
			setIsCancelling(false);
			handleMenuClose();
		},
		onError: () => {
			showNotification('error', 'Failed to cancel order');
			setIsCancelling(false);
			handleMenuClose();
		},
	});

	// Redirect rental order
	const { queryFn: redirectRentalFn } = queryConfigs.useRedirectRentalOrder; // ✅ correct API
	const { mutate: redirectRental } = useMutationQuery({
		func: redirectRentalFn,
		invalidateKey: rentalOrderKey,
		onSuccess: () => {
			showNotification('success', `Order ${menuOrder?.rental_order_id} redirected successfully`);
			refetch();
			setIsRedirecting(false);
			handleMenuClose();
		},
		onError: () => {
			showNotification('error', 'Failed to redirect order');
			setIsRedirecting(false);
			handleMenuClose();
		},
	});

	const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
		setCurrentPage(value);
	};

	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, order: RentalOrderType) => {
		setAnchorEl(event.currentTarget);
		setMenuOrder(order);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setMenuOrder(null);
	};

	const handleAction = (action: string) => {
		if (!menuOrder) return;

		switch (action) {
			case 'cancel':
				setIsCancelling(true);
				cancelRental({ id: menuOrder.id });
				break;
			case 'redirect':
				setIsRedirecting(true);
				redirectRental({ rental_order_id: menuOrder.id }); // ✅ send rental_order_id
				break;
			case 'update':
				console.log('Update', menuOrder.id);
				handleMenuClose();
				break;
			case 'view':
				navigate(`/rental-orders/${menuOrder.id}`);
				break;
			case 'print':
				window.print();
				handleMenuClose();
				break;
			default:
				handleMenuClose();
				break;
		}
	};

	const isOrderCancelled = (order: RentalOrderType) => {
		const status = order.order_status as string;
		return status === 'cancelled' || status === 'completed';
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'success':
				return 'success';
			case 'pending':
				return 'warning';
			case 'failed':
				return 'error';
			default:
				return 'default';
		}
	};

	const getOrderStatusColor = (status: string) => {
		switch (status) {
			case 'confirmed':
				return 'success';
			case 'pending':
				return 'warning';
			case 'completed':
				return 'info';
			case 'cancelled':
				return 'error';
			default:
				return 'default';
		}
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
				<Typography color="error">Error loading rental orders. Please try again.</Typography>
			</Box>
		);
	}

	const orders: RentalOrderType[] = Array.isArray(data?.result?.list) ? data?.result.list : [];
	const totalCount: number = data?.result?.count ?? 0;
	const totalPages = Math.ceil(totalCount / limit);

	if (orders.length === 0) {
		return (
			<Box display="flex" flexDirection="column" height="100%">
				<div className="pb-4">
					<Header onBackClick={() => navigate(-1)} pageName="Rental Orders" />
				</div>
				<Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
					<Typography variant="h6" color="textSecondary">
						No rental orders found
					</Typography>
				</Box>
			</Box>
		);
	}

	return (
		<div className="flex flex-col h-full">
			<div className="pb-4">
				<Header onBackClick={() => navigate(-1)} pageName="Rental Orders" />
			</div>

			<TableContainer sx={{ maxHeight: 540, flexGrow: 1 }} component={Paper}>
				<Table stickyHeader aria-label="rental orders table">
					<TableHead>
						<TableRow>
							{[
								'Order ID',
								'Rental Order ID',
								'Rental Name',
								'Total Amount',
								'Final Amount',
								'Payment Status',
								'Order Status',
								'Start Date',
								'End Date',
								'Actions',
							].map((header) => (
								<TableCell
									key={header}
									sx={{
										color: 'white',
										backgroundColor: 'black',
										fontWeight: 'bold',
									}}
								>
									{header}
								</TableCell>
							))}
						</TableRow>
					</TableHead>

					<TableBody>
						{orders.map((order) => {
							const cancelled = isOrderCancelled(order);
							const isBeingCancelled = isCancelling && menuOrder?.id === order.id;
							const isBeingRedirected = isRedirecting && menuOrder?.id === order.id;

							return (
								<TableRow
									key={order.id}
									sx={{
										backgroundColor: cancelled ? 'rgba(0,0,0,0.04)' : 'inherit',
										'&:hover': {
											backgroundColor: cancelled ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.02)',
										},
									}}
								>
									<TableCell>{order.id}</TableCell>
									<TableCell>#{order.rental_order_id}</TableCell>
									<TableCell>{order.rental_name || '-'}</TableCell>
									<TableCell>₹{order.total_amount.toLocaleString()}</TableCell>
									<TableCell>₹{order.final_amount.toLocaleString()}</TableCell>
									<TableCell>
										<Chip
											label={order.payment_status}
											color={getStatusColor(order.payment_status) as any}
											size="small"
											variant="outlined"
										/>
									</TableCell>
									<TableCell>
										<Chip
											label={order.order_status}
											color={getOrderStatusColor(order.order_status) as any}
											size="small"
											variant="outlined"
										/>
									</TableCell>
									<TableCell>{new Date(order.rental_start_date).toLocaleDateString()}</TableCell>
									<TableCell>{new Date(order.rental_end_date).toLocaleDateString()}</TableCell>
									<TableCell>
										<Tooltip title={cancelled ? 'This order cannot be modified' : 'Order actions'}>
											<span>
												<IconButton
													size="small"
													onClick={(e) => handleMenuClick(e, order)}
													disabled={cancelled || isBeingCancelled || isBeingRedirected}
												>
													<MoreVerticalIcon size={16} />
												</IconButton>
											</span>
										</Tooltip>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Action Menu */}
			<Menu
				anchorEl={anchorEl}
				open={menuOpen}
				onClose={handleMenuClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			>
				<MenuItem onClick={() => handleAction('cancel')} disabled={isCancelling} sx={{ color: 'error.main' }}>
					{isCancelling ? 'Cancelling...' : 'Cancel Order'}
				</MenuItem>
				<MenuItem onClick={() => handleAction('view')}>View Details</MenuItem>
				<MenuItem onClick={() => handleAction('update')}>Redirect Order</MenuItem>
				<MenuItem onClick={() => handleAction('redirect')} disabled={isRedirecting}>
					{isRedirecting ? 'Redirecting...' : 'Go to Order Page'}
				</MenuItem>
				<MenuItem onClick={() => handleAction('print')}>Print Receipt</MenuItem>
			</Menu>

			{/* Pagination and Count */}
			<Box display="flex" justifyContent="space-between" alignItems="center" mt={2} p={1}>
				<Box display="flex" alignItems="center" gap={1}>
					<Typography variant="body2" color="textSecondary">
						Total orders:
					</Typography>
					<span className={countStyle}>{totalCount}</span>
				</Box>
				{totalPages > 1 && <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" size="small" />}
			</Box>
		</div>
	);
};

export default RentalOrderList;
