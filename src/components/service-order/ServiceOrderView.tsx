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
	TableHead,
	TableRow,
	Dialog,
	DialogContent,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Phone, MapPin, Mail, Tag, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Loading from '../common/Loader';
import { queryConfigs } from '../../query/queryConfig';
import { useGetSingleQuery } from '../../query/hooks/queryHook';

const ServiceOrderView = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const orderId = id ? parseInt(id, 10) : 0;
	const [currentImage, setCurrentImage] = useState(0);
	const [openImageDialog, setOpenImageDialog] = useState(false);

	const { queryFn: rentalorderFunc, queryKeys: rentalorderKey } = queryConfigs.useGetServiceOrder;

	const { data, isLoading, isError } = useGetSingleQuery({
		func: rentalorderFunc,
		key: [...rentalorderKey, orderId.toString()],
		params: { id: orderId },
		isEnabled: orderId > 0,
	});

	const order = data?.result ?? null;
	const serviceImages = order?.service_images || [];

	const handlePrint = () => window.print();
	const handleBack = () => navigate(-1);

	const nextImage = () => {
		setCurrentImage((prev) => (prev + 1) % serviceImages.length);
	};

	const prevImage = () => {
		setCurrentImage((prev) => (prev - 1 + serviceImages.length) % serviceImages.length);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'success':
				return 'success';
			case 'pending':
				return 'warning';
			case 'failed':
				return 'error';
			case 'created':
				return 'info';
			case 'confirmed':
				return 'success';
			case 'completed':
				return 'info';
			case 'cancelled':
				return 'error';
			default:
				return 'default';
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'success':
			case 'confirmed':
				return <CheckCircle size={16} />;
			case 'pending':
			case 'created':
				return <Clock size={16} />;
			case 'failed':
			case 'cancelled':
				return <AlertCircle size={16} />;
			default:
				return null;
		}
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
					<Button variant="contained" onClick={handleBack} sx={{ mt: 2 }} startIcon={<ArrowLeft size={18} />}>
						Go Back
					</Button>
				</Paper>
			</Container>
		);
	}

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			{/* Header */}
			<Box sx={{ mb: 3 }}>
				<Button variant="outlined" startIcon={<ArrowLeft size={18} />} onClick={handleBack} sx={{ mb: 2 }}>
					Back to Orders
				</Button>
				<Typography variant="h4" component="h1" gutterBottom>
					Service Order #{order.id}
				</Typography>
				<Stack direction="row" spacing={2} alignItems="center">
					<Chip label={order.order_status} color={getStatusColor(order.order_status) as any} icon={getStatusIcon(order.order_status)} size="small" />
					<Chip label={order.payment_status} color={getStatusColor(order.payment_status) as any} variant="outlined" size="small" />
					<Typography variant="body2" color="textSecondary">
						Created: {new Date(order.created_on).toLocaleDateString()} at {new Date(order.created_on).toLocaleTimeString()}
					</Typography>
				</Stack>
			</Box>

			<Grid container spacing={3}>
				{/* Left Column - Service Details */}
				<Grid item xs={12} md={8}>
					{/* Service Card */}
					<Card sx={{ mb: 3 }}>
						<CardContent>
							<Typography variant="h6" gutterBottom>
								Service Details
							</Typography>
							<Divider sx={{ mb: 2 }} />

							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<Typography variant="subtitle2" color="textSecondary">
										Service Name
									</Typography>
									<Typography variant="body1" fontWeight="medium">
										{order.service_name}
									</Typography>
								</Grid>

								<Grid item xs={12} sm={6}>
									<Typography variant="subtitle2" color="textSecondary">
										Service ID
									</Typography>
									<Typography variant="body1">{order.service_id}</Typography>
								</Grid>

								<Grid item xs={12}>
									<Typography variant="subtitle2" color="textSecondary">
										Description
									</Typography>
									<Typography variant="body2" sx={{ mt: 0.5 }}>
										{order.service_description}
									</Typography>
								</Grid>

								<Grid item xs={12} sm={6}>
									<Typography variant="subtitle2" color="textSecondary">
										Contact Phone
									</Typography>
									<Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Phone size={16} />
										{order.service_contact_phone}
									</Typography>
								</Grid>

								<Grid item xs={12} sm={6}>
									<Typography variant="subtitle2" color="textSecondary">
										Delivery Time
									</Typography>
									<Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Calendar size={16} />
										{order.service_delivery_time} hours
									</Typography>
								</Grid>
							</Grid>
						</CardContent>
					</Card>

					{/* Service Images */}
					{serviceImages.length > 0 && (
						<Card sx={{ mb: 3 }}>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Service Images
								</Typography>
								<Divider sx={{ mb: 2 }} />

								<Box sx={{ position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
									<CardMedia
										component="img"
										image={serviceImages[currentImage]?.image}
										alt={`Service image ${currentImage + 1}`}
										sx={{
											height: 300,
											cursor: 'pointer',
											'&:hover': { transform: 'scale(1.02)' },
											transition: 'transform 0.3s',
										}}
										onClick={() => setOpenImageDialog(true)}
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
													bgcolor: 'rgba(0,0,0,0.5)',
													color: 'white',
													'&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
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
													bgcolor: 'rgba(0,0,0,0.5)',
													color: 'white',
													'&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
												}}
											>
												<ChevronRight />
											</IconButton>

											<Box
												sx={{
													position: 'absolute',
													bottom: 10,
													left: '50%',
													transform: 'translateX(-50%)',
													display: 'flex',
													gap: 1,
												}}
											>
												{serviceImages.map((_, index) => (
													<Box
														key={index}
														sx={{
															width: 8,
															height: 8,
															borderRadius: '50%',
															bgcolor: index === currentImage ? 'white' : 'rgba(255,255,255,0.5)',
															cursor: 'pointer',
														}}
														onClick={() => setCurrentImage(index)}
													/>
												))}
											</Box>

											<Typography
												variant="caption"
												sx={{
													position: 'absolute',
													top: 10,
													right: 10,
													bgcolor: 'rgba(0,0,0,0.7)',
													color: 'white',
													px: 1,
													py: 0.5,
													borderRadius: 1,
												}}
											>
												{currentImage + 1} / {serviceImages.length}
											</Typography>
										</>
									)}
								</Box>

								{serviceImages.some((img) => img.is_primary === 1) && (
									<Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
										* Primary image marked
									</Typography>
								)}
							</CardContent>
						</Card>
					)}

					{/* Address Details */}
					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom>
								Delivery Address
							</Typography>
							<Divider sx={{ mb: 2 }} />

							<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
								<MapPin size={20} style={{ color: '#666', flexShrink: 0, marginTop: 2 }} />
								<Box>
									<Typography variant="body1" fontWeight="medium">
										{order.address}
									</Typography>
									<Typography variant="body2" color="textSecondary">
										{order.locality}
									</Typography>
									{order.landmark && (
										<Typography variant="body2" color="textSecondary">
											Landmark: {order.landmark}
										</Typography>
									)}
									<Typography variant="body2" color="textSecondary">
										Pincode: {order.pincode}
									</Typography>
								</Box>
							</Box>
						</CardContent>
					</Card>
				</Grid>

				{/* Right Column - Order & Payment Details */}
				<Grid item xs={12} md={4}>
					{/* Order Summary */}
					<Card sx={{ mb: 3 }}>
						<CardContent>
							<Typography variant="h6" gutterBottom>
								Order Summary
							</Typography>
							<Divider sx={{ mb: 2 }} />

							<TableContainer>
								<Table size="small">
									<TableBody>
										<TableRow>
											<TableCell>Service Rate</TableCell>
											<TableCell align="right">₹{order.service_rate}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Rate Period</TableCell>
											<TableCell align="right">{order.rate_period}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Service Rate ID</TableCell>
											<TableCell align="right">{order.service_rate_id}</TableCell>
										</TableRow>
										<TableRow sx={{ borderTop: 2 }}>
											<TableCell>
												<strong>Total Amount</strong>
											</TableCell>
											<TableCell align="right">
												<strong>₹{order.total_amount}</strong>
											</TableCell>
										</TableRow>
										{order.discount_amount > 0 && (
											<TableRow>
												<TableCell sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
													<Tag size={14} />
													Discount
												</TableCell>
												<TableCell align="right">-₹{order.discount_amount}</TableCell>
											</TableRow>
										)}
										<TableRow sx={{ bgcolor: 'action.hover' }}>
											<TableCell>
												<strong>Final Amount</strong>
											</TableCell>
											<TableCell align="right">
												<strong>₹{order.final_amount}</strong>
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						</CardContent>
					</Card>

					{/* Customer Details */}
					<Card sx={{ mb: 3 }}>
						<CardContent>
							<Typography variant="h6" gutterBottom>
								Customer Details
							</Typography>
							<Divider sx={{ mb: 2 }} />

							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
								<Mail size={18} style={{ color: '#666' }} />
								<Box>
									<Typography variant="body1" fontWeight="medium">
										{order.user_name}
									</Typography>
									<Typography variant="body2" color="textSecondary">
										{order.user_email}
									</Typography>
								</Box>
							</Box>

							<Typography variant="body2" color="textSecondary">
								User ID: {order.user_id}
							</Typography>
							<Typography variant="body2" color="textSecondary">
								Address ID: {order.address_id}
							</Typography>
						</CardContent>
					</Card>

					{/* Payment Information */}
					<Card sx={{ mb: 3 }}>
						<CardContent>
							<Typography variant="h6" gutterBottom>
								Payment Information
							</Typography>
							<Divider sx={{ mb: 2 }} />

							{order.razorpay_order_id ? (
								<>
									<Typography variant="body2" sx={{ mb: 1 }}>
										<strong>Razorpay Order ID:</strong>
										<br />
										{order.razorpay_order_id}
									</Typography>
									{order.razorpay_payment_id && (
										<Typography variant="body2" sx={{ mb: 1 }}>
											<strong>Payment ID:</strong>
											<br />
											{order.razorpay_payment_id}
										</Typography>
									)}
									{order.razorpay_signature && (
										<Typography variant="body2">
											<strong>Signature:</strong>
											<br />
											{order.razorpay_signature.substring(0, 30)}...
										</Typography>
									)}
								</>
							) : (
								<Typography variant="body2" color="textSecondary">
									No Razorpay details available
								</Typography>
							)}

							{order.payment_failure_reason && (
								<Box sx={{ mt: 2, p: 1, bgcolor: 'error.light', borderRadius: 1 }}>
									<Typography variant="body2" color="error">
										<strong>Failure Reason:</strong> {order.payment_failure_reason}
									</Typography>
								</Box>
							)}
						</CardContent>
					</Card>

					{/* Actions */}
					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom>
								Actions
							</Typography>
							<Divider sx={{ mb: 2 }} />

							<Stack spacing={2}>
								<Button variant="contained" fullWidth onClick={handlePrint}>
									Print Receipt
								</Button>

								<Button variant="outlined" fullWidth onClick={handleBack} startIcon={<ArrowLeft size={18} />}>
									Back to Orders
								</Button>
							</Stack>

							<Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
								Last updated: {order.updated_on ? new Date(order.updated_on).toLocaleString() : 'Not updated yet'}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			{/* Full Screen Image Dialog */}
			<Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)} maxWidth="lg" fullWidth>
				<DialogContent sx={{ p: 0, position: 'relative' }}>
					{serviceImages.length > 0 && (
						<>
							<img src={serviceImages[currentImage]?.image} alt={`Service image ${currentImage + 1}`} style={{ width: '100%', height: 'auto' }} />

							{serviceImages.length > 1 && (
								<>
									<IconButton
										onClick={prevImage}
										sx={{
											position: 'absolute',
											left: 10,
											top: '50%',
											transform: 'translateY(-50%)',
											bgcolor: 'rgba(0,0,0,0.5)',
											color: 'white',
											'&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
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
											bgcolor: 'rgba(0,0,0,0.5)',
											color: 'white',
											'&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
										}}
									>
										<ChevronRight />
									</IconButton>
								</>
							)}
						</>
					)}
				</DialogContent>
			</Dialog>
		</Container>
	);
};

export default ServiceOrderView;
