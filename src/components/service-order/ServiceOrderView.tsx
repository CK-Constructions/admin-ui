import React from 'react';
import { Box, Typography, Divider, IconButton, Paper, Stack, Chip, Button, Container, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import { useNavigate, useParams } from 'react-router-dom';
import { queryConfigs } from '../../query/queryConfig';
import { useGetSingleQuery } from '../../query/hooks/queryHook';
import Loading from '../common/Loader';

/* ---------------- TYPES ---------------- */

interface ServiceOrder {
	id: number;
	user_id: number;
	service_id: number;

	service_name?: string | null;
	service_description?: string | null;
	service_rate?: number | string | null;
	rate_period?: string | null;
	service_contact_phone?: string | null;
	service_delivery_time?: string | null;

	user_name?: string | null;
	user_email?: string | null;
	address?: string | null;
	locality?: string | null;
	landmark?: string | null;
	pincode?: string | null;

	total_amount?: number | string | null;
	discount_amount?: number | string | null;
	final_amount?: number | string | null;

	payment_status?: string | null;
	order_status?: string | null;

	created_on?: string | null;
	updated_on?: string | null;
}

/* ---------------- HELPERS ---------------- */

const formatAmount = (val?: number | string | null) => {
	if (!val) return '₹0';
	const n = typeof val === 'string' ? parseFloat(val) : val;
	return isNaN(n) ? '₹0' : `₹${n.toLocaleString('en-IN')}`;
};

const formatDate = (date?: string | null) => (date ? new Date(date).toLocaleString('en-IN') : 'N/A');

const getStatusColor = (s?: string | null) => {
	const v = (s || '').toLowerCase();
	if (v.includes('success') || v === 'completed') return 'success';
	if (v.includes('pending')) return 'warning';
	if (v.includes('fail') || v.includes('cancel')) return 'error';
	return 'default';
};

/* ---------------- UI HELPERS ---------------- */

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
	<Box>
		<Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
			{title}
		</Typography>
		{children}
	</Box>
);

const Row = ({ label, value }: { label: string; value?: React.ReactNode }) => (
	<Box display="flex" justifyContent="space-between" py={0.8}>
		<Typography color="text.secondary">{label}</Typography>
		<Typography fontWeight={500}>{value ?? 'N/A'}</Typography>
	</Box>
);

/* ---------------- COMPONENT ---------------- */

const ServiceOrderDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const orderId = Number(id);

	const { queryFn, queryKeys } = queryConfigs.useGetServiceOrder;

	const { data, isLoading, isError } = useGetSingleQuery({
		func: queryFn,
		key: [...queryKeys, orderId.toString()],
		params: { id: orderId },
		isEnabled: orderId > 0,
	});

	// FIXED: Access data.data instead of data.result
	const order = data?.data ?? null;

	// Optional: Add console.log to debug
	console.log('API Response:', data);
	console.log('Order Data:', order);

	if (isLoading) {
		return (
			<Box minHeight="70vh" display="flex" justifyContent="center" alignItems="center">
				<Loading />
			</Box>
		);
	}

	if (isError || !order) {
		return (
			<Container sx={{ py: 4 }}>
				<Paper sx={{ p: 4, textAlign: 'center' }}>
					<Typography color="error">Failed to load service order</Typography>
					<Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate(-1)}>
						Go Back
					</Button>
				</Paper>
			</Container>
		);
	}

	return (
		<Box sx={{ bgcolor: '#f7f7f7', minHeight: '100vh' }}>
			{/* HEADER */}
			<Box position="sticky" top={0} bgcolor="white" borderBottom={1} borderColor="divider">
				<Container maxWidth="lg">
					<Stack direction="row" justifyContent="space-between" alignItems="center" py={2}>
						<Stack direction="row" spacing={2} alignItems="center">
							<IconButton onClick={() => navigate(-1)}>
								<ArrowBackIcon />
							</IconButton>
							<Typography variant="h5" fontWeight="bold">
								Service Order
							</Typography>
							<Chip label={`#${order.id}`} color="primary" />
						</Stack>
						<Button startIcon={<PrintIcon />} variant="contained" onClick={() => window.print()}>
							Print
						</Button>
					</Stack>
				</Container>
			</Box>

			{/* CONTENT */}
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Paper sx={{ p: 4 }}>
					<Stack spacing={4}>
						<Section title="Service Details">
							<Row label="Service Name" value={order.service_name} />
							<Row label="Service ID" value={order.service_id} />
							<Row label="Rate" value={formatAmount(order.service_rate)} />
							<Row label="Rate Period" value={order.rate_period} />
							<Row label="Delivery Time" value={order.service_delivery_time} />
						</Section>

						<Divider />

						<Section title="Customer Details">
							<Row label="Name" value={order.user_name} />
							<Row label="Email" value={order.user_email} />
							<Row label="Address" value={`${order.address}, ${order.locality}, ${order.landmark} - ${order.pincode}`} />
						</Section>

						<Divider />

						<Section title="Payment Summary">
							<Row label="Total Amount" value={formatAmount(order.total_amount)} />
							<Row label="Discount" value={formatAmount(order.discount_amount)} />
							<Row label="Final Amount" value={formatAmount(order.final_amount)} />
							<Row
								label="Payment Status"
								value={<Chip label={order.payment_status} color={getStatusColor(order.payment_status)} size="small" />}
							/>
							<Row label="Order Status" value={<Chip label={order.order_status} color={getStatusColor(order.order_status)} size="small" />} />
						</Section>

						<Divider />

						<Section title="Timeline">
							<Row label="Created On" value={formatDate(order.created_on)} />
							<Row label="Updated On" value={formatDate(order.updated_on)} />
						</Section>
					</Stack>
				</Paper>
			</Container>
		</Box>
	);
};

export default ServiceOrderDetailPage;
