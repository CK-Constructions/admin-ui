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
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Dialog,
	DialogContent,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router';
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
	switch (status) {
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

const getStatusIcon = (status: string): React.ReactElement | undefined => {
	switch (status) {
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
			return undefined; // ✅ IMPORTANT
	}
};

/* ───────────────── COMPONENT ───────────────── */

const ServiceOrderView: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const orderId = id ? Number(id) : 0;
	const [currentImage, setCurrentImage] = useState(0);
	const [openImageDialog, setOpenImageDialog] = useState(false);

	const { queryFn, queryKeys } = queryConfigs.useGetServiceOrder;

	const { data, isLoading, isError } = useGetSingleQuery({
		func: queryFn,
		key: [...queryKeys, orderId.toString()],
		params: { id: orderId },
		isEnabled: orderId > 0,
	});

	const order = data?.result;
	const serviceImages = order?.service_images ?? [];

	const handleBack = () => navigate(-1);
	const handlePrint = () => window.print();

	const nextImage = () => setCurrentImage((p) => (p + 1) % serviceImages.length);

	const prevImage = () => setCurrentImage((p) => (p - 1 + serviceImages.length) % serviceImages.length);

	/* ───────────────── STATES ───────────────── */

	if (isLoading) {
		return (
			<Box minHeight="70vh" display="flex" justifyContent="center" alignItems="center">
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
					<Button sx={{ mt: 2 }} variant="contained" onClick={handleBack}>
						Go Back
					</Button>
				</Paper>
			</Container>
		);
	}

	/* ───────────────── RENDER ───────────────── */

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			{/* Header */}
			<Box mb={3}>
				<Button startIcon={<ArrowLeft size={18} />} onClick={handleBack}>
					Back to Orders
				</Button>

				<Typography variant="h4" gutterBottom>
					Service Order #{order.id}
				</Typography>

				<Stack direction="row" spacing={2} alignItems="center">
					<Chip label={order.order_status} color={getStatusColor(order.order_status)} icon={getStatusIcon(order.order_status)} size="small" />

					<Chip label={order.payment_status} color={getStatusColor(order.payment_status)} variant="outlined" size="small" />

					<Typography variant="body2" color="text.secondary">
						Created: {new Date(order.created_on).toLocaleDateString()} at {new Date(order.created_on).toLocaleTimeString()}
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
									<Typography>{order.service_name}</Typography>
								</Grid>

								<Grid item xs={12} sm={6}>
									<Typography variant="subtitle2" color="text.secondary">
										Service ID
									</Typography>
									<Typography>{order.service_id}</Typography>
								</Grid>

								<Grid item xs={12}>
									<Typography variant="subtitle2" color="text.secondary">
										Description
									</Typography>
									<Typography variant="body2">{order.service_description}</Typography>
								</Grid>

								<Grid item xs={12} sm={6}>
									<Typography sx={{ display: 'flex', gap: 1 }}>
										<Phone size={16} />
										{order.service_contact_phone}
									</Typography>
								</Grid>

								<Grid item xs={12} sm={6}>
									<Typography sx={{ display: 'flex', gap: 1 }}>
										<Calendar size={16} />
										{order.service_delivery_time} hours
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

								<CardMedia
									component="img"
									image={serviceImages[currentImage]?.image}
									sx={{ height: 300, cursor: 'pointer' }}
									onClick={() => setOpenImageDialog(true)}
								/>
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
								<Button variant="contained" onClick={handlePrint}>
									Print Receipt
								</Button>

								<Button variant="outlined" onClick={handleBack}>
									Back to Orders
								</Button>
							</Stack>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			{/* Image Dialog */}
			<Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)} maxWidth="lg">
				<DialogContent sx={{ p: 0 }}>
					<img src={serviceImages[currentImage]?.image} style={{ width: '100%' }} alt="Service" />
					{serviceImages.length > 1 && (
						<>
							<IconButton onClick={prevImage} sx={{ position: 'absolute', left: 10, top: '50%' }}>
								<ChevronLeft />
							</IconButton>
							<IconButton onClick={nextImage} sx={{ position: 'absolute', right: 10, top: '50%' }}>
								<ChevronRight />
							</IconButton>
						</>
					)}
				</DialogContent>
			</Dialog>
		</Container>
	);
};

export default ServiceOrderView;
