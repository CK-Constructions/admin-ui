import React, { useEffect } from 'react';
import { Box, Typography, Divider, IconButton, Paper, Stack, Chip, Button, Container, Alert, CircularProgress, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import { useNavigate, useParams } from 'react-router-dom';
import { queryConfigs } from '../../query/queryConfig';
import { useGetSingleQuery } from '../../query/hooks/queryHook';

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

interface ApiResponse {
	data?: ServiceOrder | { data?: ServiceOrder };
	result?: ServiceOrder;
	[key: string]: any; // Allow other properties
}

/* ---------------- HELPERS ---------------- */

const formatAmount = (val?: number | string | null): string => {
	if (val === null || val === undefined || val === '') return '₹0';

	const n = typeof val === 'string' ? parseFloat(val) : val;
	return isNaN(n) ? '₹0' : `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (date?: string | null): string => {
	if (!date) return 'N/A';

	try {
		return new Date(date).toLocaleString('en-IN', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	} catch (error) {
		return 'Invalid Date';
	}
};

const getStatusColor = (s?: string | null): 'success' | 'warning' | 'error' | 'default' => {
	const v = (s || '').toLowerCase();
	if (v.includes('success') || v === 'completed' || v === 'paid' || v === 'delivered') return 'success';
	if (v.includes('pending') || v === 'processing') return 'warning';
	if (v.includes('fail') || v.includes('cancel') || v.includes('rejected')) return 'error';
	return 'default';
};

const extractOrderData = (data: any): ServiceOrder | null => {
	if (!data) return null;

	// Debug log
	console.log('Extracting order data from:', data);

	// Try different common API response structures
	if (data.data?.data) {
		// Case: { data: { data: {...} } }
		return data.data.data;
	} else if (data.data) {
		// Case: { data: {...} }
		return data.data;
	} else if (data.result) {
		// Case: { result: {...} }
		return data.result;
	} else if (data.id !== undefined) {
		// Case: Direct order object
		return data;
	} else if (typeof data === 'object') {
		// Try to find any nested object that looks like an order
		const possibleOrder = Object.values(data).find((value: any) => value && typeof value === 'object' && value.id !== undefined);
		return (possibleOrder as ServiceOrder) || null;
	}

	return null;
};

/* ---------------- UI COMPONENTS ---------------- */

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
	<Box sx={{ mb: 3 }}>
		<Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
			{title}
		</Typography>
		{children}
	</Box>
);

const Row: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
	<Box
		sx={{
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			py: 1.5,
			borderBottom: '1px solid',
			borderColor: 'divider',
			'&:last-child': {
				borderBottom: 'none',
			},
		}}
	>
		<Typography variant="body2" color="text.secondary">
			{label}
		</Typography>
		<Typography variant="body1" fontWeight={500}>
			{value ?? 'N/A'}
		</Typography>
	</Box>
);

const LoadingState: React.FC = () => (
	<Box
		sx={{
			minHeight: '70vh',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			gap: 2,
		}}
	>
		<CircularProgress size={60} />
		<Typography variant="body1" color="text.secondary">
			Loading order details...
		</Typography>
	</Box>
);

const ErrorState: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
	<Container sx={{ py: 8 }}>
		<Paper sx={{ p: 4, textAlign: 'center' }}>
			<Alert severity="error" sx={{ mb: 3 }}>
				Failed to load service order details. Please try again.
			</Alert>
			<Stack direction="row" spacing={2} justifyContent="center">
				<Button variant="contained" onClick={() => window.history.back()}>
					Go Back
				</Button>
				{onRetry && (
					<Button variant="outlined" onClick={onRetry}>
						Retry
					</Button>
				)}
			</Stack>
		</Paper>
	</Container>
);

/* ---------------- MAIN COMPONENT ---------------- */

const ServiceOrderDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	// Parse and validate ID
	const orderId = React.useMemo(() => {
		if (!id) return 0;
		const parsed = parseInt(id, 10);
		return isNaN(parsed) ? 0 : parsed;
	}, [id]);

	// Get query configuration
	const { queryFn: orderFunc, queryKeys: serviceOrderKey } = queryConfigs.useGetServiceOrder;

	// Fetch data with proper error handling
	const {
		data: apiResponse,
		isLoading,
		isError,
		error,
		refetch,
	} = useGetSingleQuery({
		func: orderFunc,
		key: [...serviceOrderKey, orderId.toString()],
		params: { id: orderId },
		isEnabled: orderId > 0,
	});

	// Extract order data from API response
	const order = React.useMemo(() => {
		return extractOrderData(apiResponse);
	}, [apiResponse]);

	// Debug logging
	useEffect(() => {
		if (apiResponse) {
			console.group('📦 Service Order API Response');
			console.log('Raw API Response:', apiResponse);
			console.log('Extracted Order:', order);
			console.log('Order ID from params:', orderId);
			console.groupEnd();
		}

		if (error) {
			console.error('Service Order Fetch Error:', error);
		}
	}, [apiResponse, order, orderId, error]);

	// Handle invalid ID
	if (!orderId) {
		return <ErrorState onRetry={() => navigate('/service-orders')} />;
	}

	// Loading state
	if (isLoading) {
		return <LoadingState />;
	}

	// Error state
	if (isError || !order) {
		return <ErrorState onRetry={refetch} />;
	}

	return (
		<Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>
			{/* HEADER */}
			<Paper
				square
				elevation={0}
				sx={{
					position: 'sticky',
					top: 0,
					zIndex: 1000,
					borderBottom: 1,
					borderColor: 'divider',
					mb: 3,
				}}
			>
				<Container maxWidth="lg">
					<Stack direction="row" justifyContent="space-between" alignItems="center" py={2} spacing={2}>
						<Stack direction="row" spacing={2} alignItems="center">
							<IconButton onClick={() => navigate(-1)} aria-label="Go back" size="large">
								<ArrowBackIcon />
							</IconButton>
							<Box>
								<Typography variant="h5" fontWeight="bold" noWrap>
									Service Order Details
								</Typography>
								<Stack direction="row" spacing={1} alignItems="center">
									<Chip label={`Order #${order.id}`} color="primary" size="small" />
									<Chip label={order.order_status || 'Unknown'} color={getStatusColor(order.order_status)} size="small" variant="outlined" />
								</Stack>
							</Box>
						</Stack>
						<Stack direction="row" spacing={1}>
							<Button startIcon={<PrintIcon />} variant="outlined" onClick={() => window.print()}>
								Print
							</Button>
							<Button variant="contained" onClick={() => navigate(`/service-orders/${order.id}/edit`)}>
								Edit Order
							</Button>
						</Stack>
					</Stack>
				</Container>
			</Paper>

			{/* MAIN CONTENT */}
			<Container maxWidth="lg">
				<Grid container spacing={3}>
					{/* Left Column - Order Details */}
					<Grid item xs={12} md={8}>
						<Paper sx={{ p: 3, mb: 3 }}>
							<Section title="Service Information">
								<Row label="Service Name" value={order.service_name} />
								<Row label="Service Description" value={order.service_description} />
								<Row label="Service ID" value={order.service_id} />
								<Row label="Rate" value={formatAmount(order.service_rate)} />
								<Row label="Rate Period" value={order.rate_period} />
								<Row label="Delivery Time" value={order.service_delivery_time} />
								<Row label="Contact Phone" value={order.service_contact_phone} />
							</Section>

							<Divider sx={{ my: 3 }} />

							<Section title="Customer Information">
								<Row label="Customer Name" value={order.user_name} />
								<Row label="Email Address" value={order.user_email} />
								<Row label="Customer ID" value={order.user_id} />
								<Row
									label="Delivery Address"
									value={
										<Box sx={{ textAlign: 'right' }}>
											<Typography variant="body1">{order.address}</Typography>
											<Typography variant="body2" color="text.secondary">
												{order.locality}, {order.landmark} - {order.pincode}
											</Typography>
										</Box>
									}
								/>
							</Section>
						</Paper>
					</Grid>

					{/* Right Column - Payment & Status */}
					<Grid item xs={12} md={4}>
						<Paper sx={{ p: 3, mb: 3 }}>
							<Section title="Payment Summary">
								<Row label="Total Amount" value={formatAmount(order.total_amount)} />
								<Row label="Discount Applied" value={formatAmount(order.discount_amount)} />
								<Box sx={{ bgcolor: 'primary.light', p: 2, borderRadius: 1, mt: 1 }}>
									<Row
										label="Final Amount"
										value={
											<Typography variant="h6" color="primary" fontWeight="bold">
												{formatAmount(order.final_amount)}
											</Typography>
										}
									/>
								</Box>
							</Section>

							<Divider sx={{ my: 3 }} />

							<Section title="Order Status">
								<Stack spacing={2}>
									<Box>
										<Typography variant="body2" color="text.secondary" gutterBottom>
											Payment Status
										</Typography>
										<Chip
											label={order.payment_status || 'Unknown'}
											color={getStatusColor(order.payment_status)}
											size="medium"
											sx={{ width: '100%', justifyContent: 'center' }}
										/>
									</Box>
									<Box>
										<Typography variant="body2" color="text.secondary" gutterBottom>
											Order Status
										</Typography>
										<Chip
											label={order.order_status || 'Unknown'}
											color={getStatusColor(order.order_status)}
											size="medium"
											sx={{ width: '100%', justifyContent: 'center' }}
										/>
									</Box>
								</Stack>
							</Section>

							<Divider sx={{ my: 3 }} />

							<Section title="Timeline">
								<Row label="Order Created" value={formatDate(order.created_on)} />
								<Row label="Last Updated" value={formatDate(order.updated_on)} />
							</Section>
						</Paper>

						{/* Quick Actions */}
						<Paper sx={{ p: 3 }}>
							<Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
								Quick Actions
							</Typography>
							<Stack spacing={1}>
								<Button variant="outlined" fullWidth onClick={() => navigate(`/users/${order.user_id}`)}>
									View Customer Profile
								</Button>
								<Button variant="outlined" fullWidth onClick={() => navigate(`/services/${order.service_id}`)}>
									View Service Details
								</Button>
								<Button
									variant="outlined"
									fullWidth
									color="error"
									onClick={() => {
										if (window.confirm('Are you sure you want to cancel this order?')) {
											// Add cancellation logic here
										}
									}}
									disabled={order.order_status === 'cancelled'}
								>
									Cancel Order
								</Button>
							</Stack>
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default ServiceOrderDetailPage;
