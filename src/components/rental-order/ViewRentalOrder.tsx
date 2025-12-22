import React from 'react';
import { Box, Typography, Divider, IconButton, Paper, Stack, Chip, Button, Container, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import { useNavigate, useParams } from 'react-router-dom';
import { queryConfigs } from '../../query/queryConfig';
import { useGetSingleQuery } from '../../query/hooks/queryHook';
import Loading from '../common/Loader';

// ---------------------
// Types
// ---------------------

type APIResponse<T> = {
	result: T | null;
	success: boolean;
	[key: string]: any;
};

interface RentalOrder {
	order_id: number;
	user_id: number;
	rental_id: number;
	rental_rate_id?: number | null;
	address_id?: number | null;
	discount_id?: number | null;
	razorpay_order_id?: string | null;
	razorpay_payment_id?: string | null;
	razorpay_signature?: string | null;
	payment_failure_reason?: string | null;

	total_amount?: number | string | null;
	discount_amount?: number | string | null;
	final_amount?: number | string | null;

	payment_status?: string | null;
	order_status?: string | null;

	created_on?: string | null;
	updated_on?: string | null;

	// Rental info
	rental_title?: string | null;
	period?: string | null;
	rate?: number | string | null;
	category_id?: number | null;
	category_name?: string | null;

	// Address & contact
	pincode?: string | null;
	landmark?: string | null;
	locality?: string | null;
	mobile?: string | null;
	alternate_mobile?: string | null;
	full_name?: string | null;
	address_type?: string | null;
	address?: string | null;
	is_default?: boolean;

	// extra
	[key: string]: any;
}

// ---------------------
// Helpers
// ---------------------

const toStr = (val: number | string | null | undefined): string => (val != null ? String(val) : 'N/A');

const formatAmount = (amount: number | string | null | undefined): string => {
	if (amount == null) return '₹0';
	const num = typeof amount === 'string' ? parseFloat(amount) : amount;
	return isNaN(Number(num)) ? '₹0' : `₹${Number(num).toLocaleString('en-IN')}`;
};

const formatDate = (date: string | null | undefined): string => {
	if (!date) return 'Not set';
	try {
		return new Date(date).toLocaleString('en-IN', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	} catch {
		return 'Invalid date';
	}
};

const getStatusColor = (s?: string | null): 'success' | 'warning' | 'error' | 'info' | 'default' => {
	const status = (s || '').toLowerCase();
	if (!status) return 'default';
	if (status.includes('success') || status === 'completed' || status === 'confirmed') return 'success';
	if (status.includes('pending')) return 'warning';
	if (status.includes('fail') || status === 'cancelled' || status.includes('not_required')) return 'error';
	if (status.includes('dispatched') || status.includes('delivery') || status.includes('booked')) return 'info';
	return 'default';
};

// ---------------------
// Reusable small components
// ---------------------

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
	<Box>
		<Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
			{title}
		</Typography>
		{children}
	</Box>
);

const DetailRow: React.FC<{
	label: string;
	value?: string | number | null;
	bold?: boolean;
	color?: string;
}> = ({ label, value, bold, color }) => (
	<Box display="flex" justifyContent="space-between" sx={{ py: 0.8 }}>
		<Typography variant="body1" color="text.secondary" fontWeight={bold ? 'bold' : 'normal'}>
			{label}:
		</Typography>
		<Typography variant="body1" fontWeight={bold ? 'bold' : 'normal'} color={color || 'text.primary'} sx={{ wordBreak: 'break-word' }}>
			{value != null ? String(value) : 'N/A'}
		</Typography>
	</Box>
);

const StatusRow: React.FC<{ label: string; status?: string | null }> = ({ label, status }) => (
	<Box display="flex" justifyContent="space-between" alignItems="center" sx={{ py: 0.8 }}>
		<Typography variant="body1" color="text.secondary">
			{label}:
		</Typography>
		<Chip label={status || 'unknown'} color={getStatusColor(status)} size="small" />
	</Box>
);

// ---------------------
// Main component
// ---------------------

const RentalOrderDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const orderId = id ? parseInt(id, 10) : 0;

	const { queryFn: rentalorderFunc, queryKeys: rentalorderKey } = queryConfigs.useGetRentalOrder;

	const { data, isLoading, isError } = useGetSingleQuery({
		func: rentalorderFunc,
		key: [...rentalorderKey, orderId.toString()],
		params: { id: orderId },
		isEnabled: orderId > 0,
	});

	const order = data?.result ?? null;

	const handlePrint = () => window.print();
	const handleBack = () => navigate(-1);

	if (isLoading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
				<Loading />
			</Box>
		);
	}

	if (isError || !order) {
		return (
			<Container maxWidth="md" sx={{ py: 4 }}>
				<Paper sx={{ p: 4, textAlign: 'center' }}>
					<Typography variant="h6" color="error">
						Failed to load order details
					</Typography>
					<Button variant="contained" onClick={handleBack} sx={{ mt: 2 }}>
						Go Back
					</Button>
				</Paper>
			</Container>
		);
	}

	return (
		<Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh' }}>
			{/* Header */}
			<Box
				sx={{
					position: 'sticky',
					top: 0,
					zIndex: 10,
					bgcolor: 'white',
					borderBottom: 1,
					borderColor: 'divider',
					boxShadow: 1,
				}}
			>
				<Container maxWidth="lg">
					<Stack direction="row" justifyContent="space-between" alignItems="center" py={2}>
						<Stack direction="row" alignItems="center" spacing={2}>
							<IconButton onClick={handleBack}>
								<ArrowBackIcon />
							</IconButton>
							<Typography variant="h5" fontWeight="bold">
								Rental Order Details
							</Typography>
							<Chip label={`#${toStr(order.order_id)}`} color="primary" size="small" />
						</Stack>

						<Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>
							Print Receipt
						</Button>
					</Stack>
				</Container>
			</Box>

			{/* Main content */}
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Paper elevation={3} sx={{ borderRadius: 2 }}>
					<Stack spacing={4} p={4}>
						{/* Order Information */}
						<Section title="Order Information">
							<Grid container spacing={3}>
								<Grid item xs={12} sm={6}>
									<DetailRow label="Order ID" value={order.order_id} bold />
									<DetailRow label="User ID" value={order.user_id} />
									<DetailRow label="Rental Title" value={order.rental_title} />
									<DetailRow label="Category" value={order.category_name} />
								</Grid>

								<Grid item xs={12} sm={6}>
									<DetailRow label="Rental ID" value={order.rental_id} />
									<DetailRow label="Rental Rate ID" value={order.rental_rate_id} />
									<DetailRow label="Address ID" value={order.address_id} />
									<DetailRow label="Discount ID" value={order.discount_id ?? 'None'} />
								</Grid>
							</Grid>
						</Section>

						<Divider />

						{/* Payment Details */}
						{/* <Section title="Payment Details">
							<Grid container spacing={3}>
								<Grid item xs={12} sm={6}>
									<DetailRow label="Razorpay Order ID" value={order.razorpay_order_id} />
									<DetailRow label="Razorpay Payment ID" value={order.razorpay_payment_id} />
									<DetailRow label="Razorpay Signature" value={order.razorpay_signature} />
									{order.payment_failure_reason && <DetailRow label="Failure Reason" value={order.payment_failure_reason} />}
								</Grid>

								<Grid item xs={12} sm={6}>
									<DetailRow label="Total Amount" value={formatAmount(order.total_amount)} bold />
									<DetailRow label="Discount Amount" value={formatAmount(order.discount_amount)} />
									<DetailRow label="Final Amount" value={formatAmount(order.final_amount)} bold color="success.main" />
								</Grid>
							</Grid>

							<Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
								<StatusRow label="Payment Status" status={order.payment_status} />
								<StatusRow label="Order Status" status={order.order_status} />
							</Box>
						</Section> */}

						<Divider />

						{/* Rental Info */}
						<Section title="Rental Info">
							<Grid container spacing={3}>
								<Grid item xs={12} sm={6}>
									<DetailRow label="Period" value={order.period} />
									<DetailRow label="Rate" value={order.rate != null ? toStr(order.rate) : 'N/A'} />
								</Grid>
								<Grid item xs={12} sm={6}>
									<DetailRow label="Category ID" value={order.category_id} />
								</Grid>
							</Grid>
						</Section>

						<Divider />

						{/* Address & Contact */}
						<Section title="Address & Contact">
							<Grid container spacing={3}>
								<Grid item xs={12} sm={6}>
									<DetailRow label="Full Name" value={order.full_name} />
									<DetailRow label="Address Type" value={order.address_type} />
									<DetailRow label="Address" value={order.address} />
								</Grid>
								<Grid item xs={12} sm={6}>
									<DetailRow label="Locality" value={order.locality} />
									<DetailRow label="Landmark" value={order.landmark} />
									<DetailRow label="Pincode" value={order.pincode} />
									<DetailRow label="Mobile" value={order.mobile} />
									<DetailRow label="Alternate Mobile" value={order.alternate_mobile} />
								</Grid>
							</Grid>

							<Box sx={{ mt: 2 }}>
								<DetailRow label="Is Default" value={order.is_default ? 'Yes' : 'No'} />
							</Box>
						</Section>

						<Divider />

						{/* Timeline */}
						<Section title="Timeline">
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<DetailRow label="Created On" value={formatDate(order.created_on)} />
								</Grid>
								<Grid item xs={12} sm={6}>
									<DetailRow label="Updated On" value={order.updated_on ? formatDate(order.updated_on) : 'Never'} />
								</Grid>
							</Grid>
						</Section>

						<Divider />

						{/* Raw payload (expandable) - helpful for debugging */}
						{/* <Box>
							<Typography variant="subtitle2" color="text.secondary" gutterBottom>
								Raw payload (for debugging)
							</Typography>
							<Paper variant="outlined" sx={{ p: 2, maxHeight: 240, overflow: 'auto' }}>
								<pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{JSON.stringify(order, null, 2)}</pre>
							</Paper>
						</Box> */}
					</Stack>
				</Paper>
			</Container>
		</Box>
	);
};

export default RentalOrderDetailPage;
