import React, { useState } from 'react';
import {
	Box,
	Button,
	Container,
	Paper,
	Typography,
	Grid,
	Divider,
	Chip,
	Card,
	CardContent,
	CardMedia,
	IconButton,
	Stack,
	Dialog,
	DialogContent,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom'; // Fixed import
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Phone, MapPin, Mail, Tag } from 'lucide-react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import Loading from '../common/Loader';
import { queryConfigs } from '../../query/queryConfig';
import { useGetSingleQuery } from '../../query/hooks/queryHook';

/* ───────────────── TYPES ───────────────── */

type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

/* ───────────────── HELPERS ───────────────── */

const getStatusColor = (status: string): ChipColor => {
	switch (
		status?.toLowerCase() // Added safe access
	) {
		case 'success':
		case 'confirmed':
			return 'success';
		case 'pending':
		case 'created':
			return 'warning';
		case 'failed':
		case 'cancelled':
			return 'error';
		case 'completed':
			return 'info';
		default:
			return 'default';
	}
};

const getStatusIcon = (status: string): React.ReactElement | null => {
	// Return null instead of undefined
	switch (
		status?.toLowerCase() // Added safe access
	) {
		case 'success':
		case 'confirmed':
			return <CheckCircleIcon fontSize="small" />;
		case 'pending':
		case 'created':
			return <AccessTimeIcon fontSize="small" />;
		case 'failed':
		case 'cancelled':
			return <ErrorOutlineIcon fontSize="small" />;
		default:
			return null; // Return null for React
	}
};

/* ───────────────── COMPONENT ───────────────── */

const ServiceOrderView: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const orderId = id ? parseInt(id, 10) : 0; // Use parseInt with base
	const [currentImage, setCurrentImage] = useState(0);
	const [openImageDialog, setOpenImageDialog] = useState(false);

	const { queryFn, queryKeys } = queryConfigs.useGetServiceOrder;

	const { data, isLoading, isError, error } = useGetSingleQuery({
		// Added error for debugging
		func: queryFn,
		key: [...queryKeys, orderId.toString()],
		params: { id: orderId },
		isEnabled: orderId > 0, // Changed from isEnabled to enabled (check your hook implementation)
	});

	const order = data?.result ?? null;
	const serviceImages = order?.service_images ?? [];

	const handleBack = () => navigate(-1);
	const handlePrint = () => window.print();

	const nextImage = () => {
		if (serviceImages.length > 0) {
			setCurrentImage((p) => (p + 1) % serviceImages.length);
		}
	};

	const prevImage = () => {
		if (serviceImages.length > 0) {
			setCurrentImage((p) => (p - 1 + serviceImages.length) % serviceImages.length);
		}
	};

	/* ───────────────── STATES ───────────────── */

	if (isLoading) {
		return (
			<Box minHeight="70vh" display="flex" justifyContent="center" alignItems="center">
				<Loading />
			</Box>
		);
	}

	if (isError || !order) {
		console.error('Error loading order:', error); // Debug logging
		return (
			<Container maxWidth="md" sx={{ py: 4 }}>
				<Paper sx={{ p: 4, textAlign: 'center' }}>
					<Typography variant="h6" color="error">
						Failed to load order details
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
						{error?.message || 'Order not found'}
					</Typography>
					<Button sx={{ mt: 2 }} variant="contained" onClick={handleBack}>
						Go Back
					</Button>
				</Paper>
			</Container>
		);
	}

	/* ───────────────── RENDER ───────────────── */

	// Safe access to order properties
	const {
		id: orderIdNum = '',
		order_status = '',
		payment_status = '',
		created_on = '',
		service_name = '',
		service_id = '',
		service_description = '',
		service_contact_phone = '',
		service_delivery_time = '',
	} = order;

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			{/* Header */}
			<Box mb={3}>
				<Button startIcon={<ArrowLeft size={18} />} onClick={handleBack}>
					Back to Orders
				</Button>

				<Typography variant="h4" gutterBottom>
					Service Order #{orderIdNum}
				</Typography>

				<Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
					<Chip label={order_status} color={getStatusColor(order_status)} icon={getStatusIcon(order_status)} size="small" />

					<Chip label={payment_status} color={getStatusColor(payment_status)} variant="outlined" size="small" />

					<Typography variant="body2" color="text.secondary">
						Created: {created_on ? new Date(created_on).toLocaleDateString() : 'N/A'} at{' '}
						{created_on ? new Date(created_on).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
					</Typography>
				</Stack>
			</Box>

			<Grid container spacing={3}>
				{/* LEFT */}
				<Grid item xs={12} md={8}>
					{/* Service Details */}
					<Card sx={{ mb: 3 }}>
						<CardContent>
							<Typography variant="h6">Service Details</Typography>
							<Divider sx={{ my: 2 }} />

							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<Typography variant="subtitle2" color="text.secondary">
										Service Name
									</Typography>
									<Typography>{service_name}</Typography>
								</Grid>

								<Grid item xs={12} sm={6}>
									<Typography variant="subtitle2" color="text.secondary">
										Service ID
									</Typography>
									<Typography>{service_id}</Typography>
								</Grid>

								<Grid item xs={12}>
									<Typography variant="subtitle2" color="text.secondary">
										Description
									</Typography>
									<Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
										{service_description || 'No description provided'}
									</Typography>
								</Grid>

								<Grid item xs={12} sm={6}>
									<Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Phone size={16} />
										{service_contact_phone || 'N/A'}
									</Typography>
								</Grid>

								<Grid item xs={12} sm={6}>
									<Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Calendar size={16} />
										{service_delivery_time || '0'} hours
									</Typography>
								</Grid>
							</Grid>
						</CardContent>
					</Card>

					{/* Images */}
					{serviceImages.length > 0 && (
						<Card>
							<CardContent>
								<Typography variant="h6">Service Images</Typography>
								<Divider sx={{ my: 2 }} />

								{serviceImages[currentImage]?.image ? (
									<CardMedia
										component="img"
										image={serviceImages[currentImage].image}
										alt={`Service image ${currentImage + 1}`}
										sx={{
											height: 300,
											objectFit: 'cover',
											cursor: 'pointer',
											borderRadius: 1,
										}}
										onClick={() => setOpenImageDialog(true)}
									/>
								) : (
									<Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
										<Typography color="text.secondary">No image available</Typography>
									</Box>
								)}

								{serviceImages.length > 1 && (
									<Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
										<IconButton onClick={prevImage} size="small">
											<ChevronLeft size={20} />
										</IconButton>
										<Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
											{currentImage + 1} / {serviceImages.length}
										</Typography>
										<IconButton onClick={nextImage} size="small">
											<ChevronRight size={20} />
										</IconButton>
									</Stack>
								)}
							</CardContent>
						</Card>
					)}
				</Grid>

				{/* RIGHT */}
				<Grid item xs={12} md={4}>
					<Card>
						<CardContent>
							<Typography variant="h6">Actions</Typography>
							<Divider sx={{ my: 2 }} />

							<Stack spacing={2}>
								<Button variant="contained" onClick={handlePrint} fullWidth>
									Print Receipt
								</Button>

								<Button variant="outlined" onClick={handleBack} fullWidth>
									Back to Orders
								</Button>
							</Stack>
						</CardContent>
					</Card>

					{/* Additional Info Card - Optional */}
					<Card sx={{ mt: 3 }}>
						<CardContent>
							<Typography variant="h6" gutterBottom>
								Order Information
							</Typography>
							<Divider sx={{ mb: 2 }} />
							<Stack spacing={1}>
								<Typography variant="body2">
									<strong>Order ID:</strong> {orderIdNum}
								</Typography>
								<Typography variant="body2">
									<strong>Created:</strong> {created_on ? new Date(created_on).toLocaleString() : 'N/A'}
								</Typography>
								{order.updated_on && (
									<Typography variant="body2">
										<strong>Last Updated:</strong> {new Date(order.updated_on).toLocaleString()}
									</Typography>
								)}
							</Stack>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			{/* Image Dialog */}
			<Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)} maxWidth="lg" fullWidth>
				<DialogContent sx={{ p: 0, position: 'relative' }}>
					{serviceImages[currentImage]?.image ? (
						<>
							<img
								src={serviceImages[currentImage].image}
								style={{ width: '100%', height: 'auto', display: 'block' }}
								alt={`Service image ${currentImage + 1}`}
							/>
							{serviceImages.length > 1 && (
								<>
									<IconButton
										onClick={prevImage}
										sx={{
											position: 'absolute',
											left: 10,
											top: '50%',
											transform: 'translateY(-50%)',
											bgcolor: 'rgba(255,255,255,0.8)',
											'&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
										}}
									>
										<ChevronLeft />
									</IconButton>
									<IconButton
										onClick={nextImage}
										sx={{
											position: 'absolute',
											right: 10,
											top: '50%',
											transform: 'translateY(-50%)',
											bgcolor: 'rgba(255,255,255,0.8)',
											'&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
										}}
									>
										<ChevronRight />
									</IconButton>
								</>
							)}
						</>
					) : (
						<Box sx={{ p: 4, textAlign: 'center' }}>
							<Typography>Image not available</Typography>
						</Box>
					)}
				</DialogContent>
			</Dialog>
		</Container>
	);
};

export default ServiceOrderView;
