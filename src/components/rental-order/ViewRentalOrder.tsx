// pages/RentalOrderDetailPage.tsx
import React from 'react';
import { Box, Typography, Divider, IconButton, Paper, Stack, Chip, Button, Container, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import { useNavigate, useParams } from 'react-router-dom';
import { queryConfigs } from '../../query/queryConfig';
import { useGetSingleQuery } from '../../query/hooks/queryHook';
import Loading from '../common/Loader';

const RentalOrderDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const orderId = id ? parseInt(id, 10) : 0;

	const { queryFn: rentalorderFunc, queryKeys: rentalorderKey } = queryConfigs.useGetRentalOrder;

	const { data, isLoading, isError } = useGetSingleQuery({
		func: rentalorderFunc,
		key: [...rentalorderKey, orderId.toString()], // ← Fixed here
		params: { id: orderId },
		isEnabled: orderId > 0,
	});

	const order = data?.result;

	const handlePrint = () => {
		window.print();
	};

	const handleBack = () => {
		navigate(-1);
	};

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

	// Helper to safely convert number | string | undefined → string
	const toStr = (val: number | string | null | undefined): string => {
		return val != null ? String(val) : 'N/A';
	};

	const formatAmount = (amount: number | string | null | undefined): string => {
		if (amount == null) return '₹0';
		const num = typeof amount === 'string' ? parseFloat(amount) : amount;
		return isNaN(num) ? '₹0' : `₹${num.toLocaleString('en-IN')}`;
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

	return (
		<Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh' }}>
			{/* Sticky Header */}
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
							<Chip label={`#${toStr(order.id)}`} color="primary" size="small" />
						</Stack>
						<Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>
							Print Receipt
						</Button>
					</Stack>
				</Container>
			</Box>

			{/* Main Content */}
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Paper elevation={3} sx={{ borderRadius: 2 }}>
					<Stack spacing={4} p={4}>
						{/* Order Information */}
						<Section title="Order Information">
							<Grid container spacing={3}>
								<Grid item xs={12} sm={6}>
									<DetailRow label="Order ID" value={toStr(order.id)} bold />
									<DetailRow label="User ID" value={toStr(order.user_id) || 'Guest'} />
									<DetailRow label="Rental Name" value={order.rental_name || 'N/A'} />
									<DetailRow label="Rental ID" value={toStr(order.rental_id)} />
								</Grid>
								<Grid item xs={12} sm={6}>
									<DetailRow label="Rental Rate ID" value={toStr(order.rental_rate_id)} />
									<DetailRow label="Address ID" value={toStr(order.address_id)} />
									<DetailRow label="Discount ID" value={toStr(order.discount_id) || 'None'} />
								</Grid>
							</Grid>
						</Section>

						<Divider />

						{/* Payment Details */}
						<Section title="Payment Details">
							<Grid container spacing={3}>
								<Grid item xs={12} sm={6}>
									<DetailRow label="Razorpay Order ID" value={order.razorpay_order_id || 'N/A'} />
									<DetailRow label="Razorpay Payment ID" value={order.razorpay_payment_id || 'N/A'} />
									<DetailRow label="Razorpay Signature" value={order.razorpay_signature || 'N/A'} />
								</Grid>
								<Grid item xs={12} sm={6}>
									<DetailRow label="Total Amount" value={formatAmount(order.total_amount)} bold />
									<DetailRow label="Discount Amount" value={formatAmount(order.discount_amount)} />
									<DetailRow label="Final Amount" value={formatAmount(order.final_amount)} bold color="success.main" />
								</Grid>
							</Grid>

							<Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
								<StatusRow label="Payment Status" status={order.payment_status || 'unknown'} />
								<StatusRow label="Order Status" status={order.order_status || 'unknown'} />
							</Box>

							{order.payment_failure_reason && <DetailRow label="Failure Reason" value={order.payment_failure_reason} color="error.main" />}
						</Section>

						<Divider />

						{/* Rental Period */}
						<Section title="Rental Period">
							<Grid container spacing={3}>
								<Grid item xs={12} sm={6}>
									<DetailRow label="Start Date" value={formatDate(order.rental_start_date)} />
								</Grid>
								<Grid item xs={12} sm={6}>
									<DetailRow label="End Date" value={formatDate(order.rental_end_date)} />
								</Grid>
							</Grid>
							<Box sx={{ mt: 2 }}>
								<DetailRow label="Created On" value={formatDate(order.created_on)} />
								<DetailRow label="Updated On" value={order.updated_on ? formatDate(order.updated_on) : 'Never'} />
							</Box>
						</Section>
					</Stack>
				</Paper>
			</Container>
		</Box>
	);
};

// Reusable Components
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
	value: string;
	bold?: boolean;
	color?: string;
}> = ({ label, value, bold, color }) => (
	<Box display="flex" justifyContent="space-between" sx={{ py: 0.8 }}>
		<Typography variant="body1" color="text.secondary" fontWeight={bold ? 'bold' : 'normal'}>
			{label}:
		</Typography>
		<Typography variant="body1" fontWeight={bold ? 'bold' : 'normal'} color={color || 'text.primary'} sx={{ wordBreak: 'break-word' }}>
			{value}
		</Typography>
	</Box>
);

const StatusRow: React.FC<{ label: string; status: string }> = ({ label, status }) => {
	const getColor = (): 'success' | 'warning' | 'error' | 'info' | 'default' => {
		const s = status.toLowerCase();
		if (s.includes('success') || s === 'completed' || s === 'confirmed') return 'success';
		if (s.includes('pending')) return 'warning';
		if (s.includes('fail') || s === 'cancelled') return 'error';
		if (s.includes('dispatched') || s.includes('delivery')) return 'info';
		return 'default';
	};

	return (
		<Box display="flex" justifyContent="space-between" alignItems="center" sx={{ py: 0.8 }}>
			<Typography variant="body1" color="text.secondary">
				{label}:
			</Typography>
			<Chip label={status} color={getColor()} size="small" />
		</Box>
	);
};

export default RentalOrderDetailPage;
