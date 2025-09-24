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

export const countStyle = 'flex items-center justify-center px-2 py-1 text-lg font-bold text-black rounded-full bg-gray-200';

interface ServiceOrder {
	id: number;
	service_name: string;
	service_rate_id: number;
	payment_status: string;
	order_status: string;
}

const dummyOrders: ServiceOrder[] = [
	{ id: 1, service_name: 'Plumbing', service_rate_id: 101, payment_status: 'pending', order_status: 'pending' },
	{ id: 2, service_name: 'Electrical', service_rate_id: 102, payment_status: 'success', order_status: 'dispatch' },
	{ id: 3, service_name: 'Cleaning', service_rate_id: 103, payment_status: 'failed', order_status: 'out for delivery' },
];

const statusFlow = ['pending', 'dispatch', 'out for delivery', 'completed'];

const TestService = () => {
	const navigate = useNavigate();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [menuOrder, setMenuOrder] = useState<ServiceOrder | null>(null);
	const menuOpen = Boolean(anchorEl);

	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, order: ServiceOrder) => {
		setAnchorEl(event.currentTarget);
		setMenuOrder(order);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
		setMenuOrder(null);
	};

	// Get next possible status (non-reversible)
	const getNextStatus = (order: ServiceOrder) => {
		const index = statusFlow.indexOf(order.order_status);
		return index < statusFlow.length - 1 ? statusFlow[index + 1] : order.order_status;
	};

	const handleAction = (action: string) => {
		if (!menuOrder) return;

		switch (action) {
			case 'cancel':
				alert(`Order ${menuOrder.id} cancelled!`);
				break;
			case 'redirect':
				navigate(`/orders/${menuOrder.id}`);
				break;
			case 'update':
				const nextStatus = getNextStatus(menuOrder);
				if (nextStatus === menuOrder.order_status) {
					alert(`Order ${menuOrder.id} is already completed`);
				} else {
					// Update status inline (for demo, we just modify the dummyOrders array)
					menuOrder.order_status = nextStatus;
					alert(`Order ${menuOrder.id} status updated to ${nextStatus}`);
				}
				break;
			case 'view':
				alert(`View order ${menuOrder.id} details`);
				break;
			case 'print':
				window.print();
				break;
		}
		handleMenuClose();
	};

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
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Rate ID</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Payment Status</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Order Status</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{dummyOrders.map((order) => (
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

			<Menu
				anchorEl={anchorEl}
				open={menuOpen}
				onClose={handleMenuClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			>
				<MenuItem onClick={() => handleAction('cancel')}>Cancel</MenuItem>
				<MenuItem onClick={() => handleAction('redirect')}>Redirect</MenuItem>

				{/* Update menu item with hover tooltip */}
				{menuOrder && (
					<Tooltip title={`Next status: ${getNextStatus(menuOrder)}`} placement="right">
						<MenuItem onClick={() => handleAction('update')}>Update</MenuItem>
					</Tooltip>
				)}

				<MenuItem onClick={() => handleAction('view')}>View</MenuItem>
				<MenuItem onClick={() => handleAction('print')}>Print</MenuItem>
			</Menu>

			<div className="flex items-center justify-center mt-5">
				<p className="flex items-center space-x-2 font-medium text-slate-700">
					<span>Total result:</span>
					<span className={countStyle}>{dummyOrders.length}</span>
				</p>
			</div>
		</div>
	);
};

export default TestService;
