import React, { useRef } from 'react';
import { Modal, Box, Typography, Divider, IconButton, Paper, Stack, Chip, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery } from '../../query/hooks/queryHook';
import { Order, OrderItem } from '../lib/types/response';

interface ViewOrderProps {
	open: boolean;
	onClose: () => void;
	orderId: number;
}

const ViewOrder: React.FC<ViewOrderProps> = ({ open, onClose, orderId }) => {
	const { queryFn: orderFunc, queryKey: orderKey } = queryConfigs.useGetOrderById;

	const { data } = useGetQuery({
		func: orderFunc,
		key: orderKey,
		params: { id: orderId ?? null },
		isEnabled: !!orderId,
	});

	const order: Order | undefined = data?.result;

	const handlePrint = () => {
		window.print();
	};

	return (
		<Modal open={open} onClose={onClose} aria-labelledby="order-view-modal" aria-describedby="order-details-view">
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: { xs: '95%', sm: 800 },
					maxHeight: '90vh',
					overflowY: 'auto',
					bgcolor: 'background.paper',
					boxShadow: 24,
					borderRadius: 2,
					outline: 'none',
				}}
				component={Paper}
			>
				{/* ---------- Sticky Header with Close & Print ---------- */}
				<Box
					sx={{
						position: 'sticky',
						top: 0,
						zIndex: 10,
						bgcolor: 'background.paper',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						px: 2,
						py: 1,
						borderBottom: 1,
						borderColor: 'divider',
					}}
				>
					<Typography variant="h5" component="h2">
						Tomthin Order Invoice
					</Typography>

					<Box>
						<Button variant="contained" size="small" onClick={handlePrint} sx={{ mr: 1 }}>
							Print
						</Button>

						<IconButton aria-label="close" onClick={onClose} sx={{ color: (theme) => theme.palette.grey[600] }}>
							<CloseIcon />
						</IconButton>
					</Box>
				</Box>

				{/* ---------- Body ---------- */}
				<Stack spacing={3} p={4}>
					{order ? (
						<>
							{/* -------- Order Info -------- */}
							<Stack spacing={2} width="100%">
								<DetailRow label="Order ID" value={order.id.toString()} />
								<DetailRow label="User ID" value={order.user_id.toString()} />
								<DetailRow label="Total Amount" value={`₹${order.total_amount}`} />
								<DetailRow label="Discount Amount" value={`₹${order.discount_amount}`} />
								<DetailRow label="Final Amount" value={`₹${order.final_amount}`} />

								<StatusRow label="Payment Status" status={order.payment_status} success="success" warning="pending" error="failed" />

								<StatusRow label="Order Status" status={order.order_status} success="completed" warning="pending" info="confirmed" />

								<DetailRow label="Created On" value={new Date(order.created_on).toLocaleString()} />
								<DetailRow label="Updated On" value={new Date(order.updated_on).toLocaleString()} />
							</Stack>

							<Divider sx={{ my: 2 }} />

							{/* -------- Items Table -------- */}
							<Typography variant="h6" gutterBottom>
								Items in this Order
							</Typography>

							<Table size="small" stickyHeader>
								<TableHead>
									<TableRow>
										<TableCell>Product Name</TableCell>
										<TableCell>Category</TableCell>
										<TableCell>Quantity</TableCell>
										<TableCell>Unit Price</TableCell>
										<TableCell>Total Price</TableCell>
										<TableCell>Estimated Delivery (days)</TableCell>
										<TableCell>Order Date</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{order.items.map((item: OrderItem) => (
										<TableRow key={item.order_item_id}>
											<TableCell>{item.product_name}</TableCell>
											<TableCell>{item.category_name}</TableCell>
											<TableCell>{item.quantity}</TableCell>
											<TableCell>₹{item.unit_price}</TableCell>
											<TableCell>₹{item.total_price}</TableCell>
											<TableCell>{item.estimated_delivery_days}</TableCell>
											<TableCell>{new Date(item.order_date).toLocaleDateString()}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</>
					) : (
						<Typography align="center">No order details found.</Typography>
					)}
				</Stack>
			</Box>
		</Modal>
	);
};

// Helper for consistent detail rows
interface DetailRowProps {
	label: string;
	value?: string | null;
}
const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
	<Box display="flex" justifyContent="space-between">
		<Typography variant="body2" color="text.secondary">
			{label}:
		</Typography>
		<Typography variant="body2">{value || 'N/A'}</Typography>
	</Box>
);

interface StatusRowProps {
	label: string;
	status: string;
	success: string;
	warning: string;
	error?: string;
	info?: string;
}
const StatusRow: React.FC<StatusRowProps> = ({ label, status, success, warning, error, info }) => {
	const color = status === success ? 'success' : status === warning ? 'warning' : status === error ? 'error' : 'info';
	return (
		<Box display="flex" justifyContent="space-between">
			<Typography variant="body2" color="text.secondary">
				{label}:
			</Typography>
			<Chip label={status} color={color as any} size="small" />
		</Box>
	);
};

export default ViewOrder;
