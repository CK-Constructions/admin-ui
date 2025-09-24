import React from 'react';
import { Modal, Box, Typography, Divider, IconButton, Paper, Stack, Chip, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery } from '../../query/hooks/queryHook';
import { ServiceOrder } from '../lib/types/response';

interface ViewServiceOrderProps {
	open: boolean;
	onClose: () => void;
	orderId: number;
}

const ViewServiceOrder: React.FC<ViewServiceOrderProps> = ({ open, onClose, orderId }) => {
	const { queryFn: serviceorderFunc, queryKeys: serviceorderKey } = queryConfigs.useGetServiceOrder;

	const { data } = useGetQuery({
		func: serviceorderFunc,
		key: serviceorderKey,
		params: { id: orderId },
		isEnabled: !!orderId,
	});

	const order: ServiceOrder | undefined = data?.result;

	const handlePrint = () => window.print();

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
				{/* Header */}
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
					<Typography variant="h5">Service Order Details</Typography>
					<Box>
						<Button variant="contained" size="small" onClick={handlePrint} sx={{ mr: 1 }}>
							Print
						</Button>
						<IconButton aria-label="close" onClick={onClose} sx={{ color: (theme) => theme.palette.grey[600] }}>
							<CloseIcon />
						</IconButton>
					</Box>
				</Box>

				{/* Body */}
				<Stack spacing={3} p={4}>
					{order ? (
						<Stack spacing={2} width="100%">
							<DetailRow label="Order ID" value={order.id.toString()} />
							<DetailRow label="User ID" value={order.user_id?.toString()} />
							<DetailRow label="Service Name" value={order.service_name} />
							<DetailRow label="Service ID" value={order.service_id.toString()} />
							<DetailRow label="Service Rate ID" value={order.service_rate_id.toString()} />
							<DetailRow label="Address ID" value={order.address_id.toString()} />
							<DetailRow label="Discount ID" value={order.discount_id?.toString() ?? 'N/A'} />

							<Divider />

							<DetailRow label="Razorpay Order ID" value={order.razorpay_order_id || 'N/A'} />
							<DetailRow label="Razorpay Payment ID" value={order.razorpay_payment_id || 'N/A'} />
							<DetailRow label="Razorpay Signature" value={order.razorpay_signature || 'N/A'} />

							<Divider />

							<DetailRow label="Total Amount" value={`₹${order.total_amount}`} />
							<DetailRow label="Discount Amount" value={`₹${order.discount_amount}`} />
							<DetailRow label="Final Amount" value={`₹${order.final_amount}`} />

							<StatusRow label="Payment Status" status={order.payment_status} success="success" warning="pending" error="failed" />
							<StatusRow label="Order Status" status={order.order_status} success="completed" warning="pending" info="confirmed" />

							{order.payment_failure_reason && <DetailRow label="Payment Failure Reason" value={order.payment_failure_reason} />}

							<Divider />

							<DetailRow label="Created On" value={order.created_on ? new Date(order.created_on).toLocaleString() : 'N/A'} />
							<DetailRow label="Updated On" value={order.updated_on ? new Date(order.updated_on).toLocaleString() : 'N/A'} />
						</Stack>
					) : (
						<Typography align="center">No0000 order details found.</Typography>
					)}
				</Stack>
			</Box>
		</Modal>
	);
};

// ---------- Helper Components ----------
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

export default ViewServiceOrder;
