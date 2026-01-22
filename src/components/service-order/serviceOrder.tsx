import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Select,
} from '@mui/material';
import { MoreVerticalIcon } from 'lucide-react';

import Header from '../common/Header';
import Loading from '../common/Loader';
import { ServiceOrder } from '../lib/types/response';
import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery, useMutationQuery } from '../../query/hooks/queryHook';
import { showNotification } from '../utils/utils';

export const countStyle = 'flex items-center justify-center px-2 py-1 text-lg font-bold text-black rounded-full bg-gray-200';

/* ---------------- STATUS FLOW ---------------- */
const SERVICE_ORDER_STATUS_FLOW: Record<string, string[]> = {
	created: ['confirmed', 'cancelled'],
	confirmed: ['completed', 'cancelled'],
	completed: [],
	cancelled: [],
};

const ServiceOrderPage: React.FC = () => {
	const navigate = useNavigate();
	const limit = 10;

	/* ---------------- STATE ---------------- */
	const [currentPage, setCurrentPage] = useState(1);
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const [menuOrder, setMenuOrder] = useState<ServiceOrder | null>(null);

	const [statusDialogOpen, setStatusDialogOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState('');

	const menuOpen = Boolean(anchorEl);

	/* ---------------- FETCH ORDERS ---------------- */
	const { queryFn, queryKeys } = queryConfigs.useGetAllServiceOrder;

	const { data, isLoading, isFetching, isRefetching, isLoadingError } = useGetQuery({
		func: queryFn,
		key: queryKeys,
		params: {
			limit,
			offset: (currentPage - 1) * limit,
		},
	});

	/* ---------------- CANCEL ORDER ---------------- */
	const { queryFn: cancelFn } = queryConfigs.useCancelServiceOrder;

	const { mutate: cancelOrder, isPending: isCancelling } = useMutationQuery({
		func: cancelFn,
		invalidateKey: queryKeys,
		onSuccess: () => {
			showNotification('success', 'Order cancelled successfully');
			resetMenu();
		},
		onError: () => showNotification('error', 'Failed to cancel order'),
	});

	/* ---------------- REDIRECT ORDER ---------------- */
	const { queryFn: redirectFn } = queryConfigs.useRedirectServiceOrder;

	const { mutate: redirectOrder, isPending: isRedirecting } = useMutationQuery({
		func: redirectFn,
		invalidateKey: queryKeys,
		onSuccess: () => {
			showNotification('success', 'Order redirected successfully');
			resetMenu();
		},
		onError: () => showNotification('error', 'Failed to redirect order'),
	});

	/* ---------------- UPDATE STATUS ---------------- */
	const { queryFn: updateStatusFn } = queryConfigs.useUpdateServiceOrder;

	const { mutate: updateStatus, isPending: isUpdatingStatus } = useMutationQuery({
		func: updateStatusFn,
		invalidateKey: queryKeys,
		onSuccess: () => {
			showNotification('success', 'Order status updated');
			setStatusDialogOpen(false);
			setMenuOrder(null);
		},
		onError: () => showNotification('error', 'Failed to update status'),
	});

	/* ---------------- MENU HANDLERS ---------------- */
	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, order: ServiceOrder) => {
		setAnchorEl(event.currentTarget);
		setMenuOrder(order);
	};

	const closeMenuOnly = () => {
		setAnchorEl(null);
	};

	const resetMenu = () => {
		setAnchorEl(null);
		setMenuOrder(null);
	};

	const handleAction = (action: string) => {
		if (!menuOrder) return;

		switch (action) {
			case 'update':
				setSelectedStatus('');
				setStatusDialogOpen(true);
				closeMenuOnly(); // IMPORTANT: keep menuOrder
				break;

			case 'cancel':
				cancelOrder({ id: menuOrder.id });
				break;

			case 'redirect':
				redirectOrder({ service_order_id: menuOrder.id });
				break;

			case 'view':
				navigate(`/service-orders/${menuOrder?.id}`);
				resetMenu();
				break;

			default:
				resetMenu();
		}
	};

	const handleStatusUpdate = () => {
		if (!menuOrder || !selectedStatus) return;

		updateStatus({
			id: menuOrder.id,
			new_status: selectedStatus,
		});
	};

	/* ---------------- HELPERS ---------------- */
	const getPaymentColor = (status: string) => {
		switch (status) {
			case 'paid':
				return 'success';
			case 'pending':
				return 'warning';
			case 'failed':
				return 'error';
			default:
				return 'default';
		}
	};

	const getOrderColor = (status: string) => {
		switch (status) {
			case 'confirmed':
				return 'success';
			case 'completed':
				return 'info';
			case 'cancelled':
				return 'error';
			default:
				return 'warning';
		}
	};

	/* ---------------- DATA ---------------- */
	const orders: ServiceOrder[] = data?.result?.list ?? [];
	const totalCount = data?.result?.count ?? 0;
	const totalPages = Math.ceil(totalCount / limit);

	/* ---------------- LOADING & ERROR ---------------- */
	if (isLoading || isFetching || isRefetching) {
		return (
			<Box display="flex" justifyContent="center" minHeight={200}>
				<Loading />
			</Box>
		);
	}

	if (isLoadingError) {
		return (
			<Typography align="center" color="error">
				Failed to load service orders
			</Typography>
		);
	}

	/* ---------------- UI ---------------- */
	return (
		<div className="flex flex-col h-full">
			<Header onBackClick={() => navigate(-1)} pageName="Service Orders" />

			<TableContainer component={Paper} sx={{ flexGrow: 1 }}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							{['ID', 'Service', 'Rate ID', 'Total', 'Final', 'Payment', 'Status', 'Actions'].map((h) => (
								<TableCell key={h} sx={{ backgroundColor: 'black', color: 'white', fontWeight: 'bold' }}>
									{h}
								</TableCell>
							))}
						</TableRow>
					</TableHead>

					<TableBody>
						{orders.map((order) => {
							const disabled = order.order_status === 'completed' || order.order_status === 'cancelled';

							return (
								<TableRow key={order.id}>
									<TableCell>{order.id}</TableCell>
									<TableCell>{order.service_name}</TableCell>
									<TableCell>{order.service_rate_id}</TableCell>
									<TableCell>₹{order.total_amount}</TableCell>
									<TableCell>₹{order.final_amount}</TableCell>
									<TableCell>
										<Chip label={order.payment_status} color={getPaymentColor(order.payment_status) as any} size="small" />
									</TableCell>
									<TableCell>
										<Chip label={order.order_status} color={getOrderColor(order.order_status) as any} size="small" />
									</TableCell>
									<TableCell>
										<Tooltip title="Order actions">
											<span>
												<IconButton disabled={disabled} onClick={(e) => handleMenuClick(e, order)}>
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

			{/* ACTION MENU */}
			<Menu anchorEl={anchorEl} open={menuOpen} onClose={resetMenu}>
				<MenuItem onClick={() => handleAction('update')}>Update Status</MenuItem>
				<MenuItem onClick={() => handleAction('cancel')} disabled={isCancelling}>
					Cancel
				</MenuItem>
				<MenuItem onClick={() => handleAction('redirect')} disabled={isRedirecting}>
					Redirect
				</MenuItem>
				<MenuItem onClick={() => handleAction('view')}>View</MenuItem>
			</Menu>

			{/* STATUS UPDATE DIALOG */}
			<Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} fullWidth>
				<DialogTitle>Update Order Status</DialogTitle>
				<DialogContent>
					<Select fullWidth value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} displayEmpty>
						<MenuItem value="" disabled>
							Select new status
						</MenuItem>

						{menuOrder &&
							SERVICE_ORDER_STATUS_FLOW[menuOrder.order_status]?.map((status) => (
								<MenuItem key={status} value={status}>
									{status}
								</MenuItem>
							))}
					</Select>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
					<Button variant="contained" onClick={handleStatusUpdate} disabled={!selectedStatus || isUpdatingStatus}>
						Update
					</Button>
				</DialogActions>
			</Dialog>

			{/* PAGINATION */}
			<Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
				<span className={countStyle}>{totalCount}</span>
				{totalPages > 1 && <Pagination count={totalPages} page={currentPage} onChange={(_, v) => setCurrentPage(v)} size="small" />}
			</Box>
		</div>
	);
};

export default ServiceOrderPage;
