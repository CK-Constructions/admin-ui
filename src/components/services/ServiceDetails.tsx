import { useState, useEffect, useCallback } from 'react';
import {
	ChevronLeft,
	ChevronRight,
	Phone,
	Tag,
	Clock,
	Calendar,
	User,
	Info,
	Truck,
	DollarSign,
	Star,
	Share2,
	Heart,
	MessageSquare,
	Check,
	AlertCircle,
	MapPin,
	Shield,
	CreditCard,
	ThumbsUp,
	BadgeCheck,
} from 'lucide-react';
import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery } from '../../query/hooks/queryHook';
import { useNavigate, useParams } from 'react-router';
import { TRentalImage, TRentalRate, TRentalSpecification } from '../lib/types/response';

export default function ServiceDetails() {
	const navigate = useNavigate();
	const params = useParams();
	const { id } = params;

	// State for interactive features
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isFavorite, setIsFavorite] = useState(false);
	const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
	const [showShareModal, setShowShareModal] = useState(false);
	const [showContactModal, setShowContactModal] = useState(false);
	const [showBookingModal, setShowBookingModal] = useState(false);
	const [bookingQuantity, setBookingQuantity] = useState(1);
	const [showImageModal, setShowImageModal] = useState(false);
	const [isImageLoading, setIsImageLoading] = useState(true);
	const [copied, setCopied] = useState(false);

	// Fetch service data
	const { queryFn: serviceFunc, queryKeys: serviceKey } = queryConfigs.useGetServiceDetails;
	const { data, refetch, isLoading, isRefetching, isError } = useGetQuery({
		func: serviceFunc,
		key: serviceKey,
		params: {
			id: id,
		},
		isEnabled: !!id,
	});

	const serviceData = data?.result;

	// Auto-rotate images
	useEffect(() => {
		if (!serviceData?.images_list?.length) return;

		const interval = setInterval(() => {
			setCurrentImageIndex((prev) => (prev === serviceData.images_list.length - 1 ? 0 : prev + 1));
		}, 5000);

		return () => clearInterval(interval);
	}, [serviceData?.images_list?.length]);

	// Interactive functions
	const nextImage = useCallback(() => {
		if (!serviceData?.images_list?.length) return;
		setCurrentImageIndex((prev) => (prev === serviceData.images_list.length - 1 ? 0 : prev + 1));
	}, [serviceData?.images_list?.length]);

	const prevImage = useCallback(() => {
		if (!serviceData?.images_list?.length) return;
		setCurrentImageIndex((prev) => (prev === 0 ? serviceData.images_list.length - 1 : prev - 1));
	}, [serviceData?.images_list?.length]);

	const handleNavBack = () => {
		navigate(-1);
	};

	const toggleFavorite = () => {
		setIsFavorite(!isFavorite);
		// Here you would typically make an API call to save favorite
	};

	const handleShare = async () => {
		const shareData = {
			title: serviceData?.name,
			text: `Check out this service: ${serviceData?.name}`,
			url: window.location.href,
		};

		if (navigator.share) {
			try {
				await navigator.share(shareData);
			} catch (err) {
				console.log('Error sharing:', err);
			}
		} else {
			setShowShareModal(true);
		}
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(window.location.href);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleBookNow = () => {
		if (!selectedPeriod) {
			alert('Please select a service period first');
			return;
		}
		setShowBookingModal(true);
	};

	const calculateTotal = () => {
		if (!selectedPeriod || !serviceData?.rates_list) return 0;
		const selectedRate = serviceData.rates_list.find((rate) => rate.period === selectedPeriod);
		return selectedRate ? selectedRate.rate * bookingQuantity : 0;
	};

	const getStars = (rating: number) => {
		return Array(5)
			.fill(0)
			.map((_, i) => <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />);
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="container py-8 mx-auto">
				<div className="animate-pulse">
					<div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
					<div className="grid gap-8 md:grid-cols-[2fr_1fr]">
						<div className="space-y-8">
							<div className="h-96 bg-gray-200 rounded-lg"></div>
							<div className="h-64 bg-gray-200 rounded-lg"></div>
						</div>
						<div className="space-y-6">
							<div className="h-48 bg-gray-200 rounded-lg"></div>
							<div className="h-48 bg-gray-200 rounded-lg"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="container py-8 mx-auto">
				<div className="p-8 text-center bg-red-50 rounded-lg">
					<AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
					<h2 className="mb-2 text-xl font-bold text-red-700">Error loading service details</h2>
					<p className="mb-4 text-red-600">Please try again later</p>
					<button onClick={() => refetch()} className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700">
						Retry
					</button>
				</div>
			</div>
		);
	}

	if (!serviceData) {
		return (
			<div className="container py-8 mx-auto">
				<div className="p-8 text-center">
					<h2 className="mb-2 text-xl font-bold">Service not found</h2>
					<p className="mb-4">The service you're looking for doesn't exist or has been removed.</p>
					<button onClick={() => navigate('/services')} className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
						Browse Services
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="container py-8 mx-auto">
			{/* Navigation */}
			<div className="flex items-center justify-between mb-6">
				<button onClick={handleNavBack} className="flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900">
					<ChevronLeft className="w-4 h-4 mr-1" />
					Back to Services
				</button>

				<div className="flex gap-2">
					<button
						onClick={handleShare}
						className="flex items-center gap-2 px-3 py-2 text-sm transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
					>
						<Share2 className="w-4 h-4" />
						Share
					</button>
					<button
						onClick={toggleFavorite}
						className="flex items-center gap-2 px-3 py-2 text-sm transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
					>
						<Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
						{isFavorite ? 'Saved' : 'Save'}
					</button>
				</div>
			</div>

			{/* Main Content */}
			<div className="grid gap-8 md:grid-cols-[2fr_1fr]">
				{/* Left Column */}
				<div className="space-y-8">
					{/* Image Gallery */}
					<div className="overflow-hidden bg-white rounded-xl shadow-lg">
						<div className="relative aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200">
							{serviceData.images_list?.length > 0 ? (
								<>
									<div className="absolute inset-0">
										{isImageLoading && (
											<div className="absolute inset-0 flex items-center justify-center">
												<div className="w-8 h-8 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
											</div>
										)}
										<img
											src={serviceData.images_list[currentImageIndex]?.image}
											alt={`${serviceData.name}-${currentImageIndex + 1}`}
											className={`object-cover w-full h-full transition-opacity duration-300 cursor-zoom-in ${
												isImageLoading ? 'opacity-0' : 'opacity-100'
											}`}
											onClick={() => setShowImageModal(true)}
											onLoad={() => setIsImageLoading(false)}
										/>
									</div>

									{/* Navigation Arrows */}
									<div className="absolute inset-0 flex items-center justify-between p-4">
										<button
											className="p-3 transition-all bg-white rounded-full shadow-lg opacity-80 hover:opacity-100 hover:scale-105"
											onClick={prevImage}
										>
											<ChevronLeft className="w-6 h-6" />
										</button>
										<button
											className="p-3 transition-all bg-white rounded-full shadow-lg opacity-80 hover:opacity-100 hover:scale-105"
											onClick={nextImage}
										>
											<ChevronRight className="w-6 h-6" />
										</button>
									</div>

									{/* Image Indicators */}
									<div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
										{serviceData.images_list.map((_, index) => (
											<button
												key={index}
												className={`w-3 h-3 rounded-full transition-all ${
													index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
												}`}
												onClick={() => setCurrentImageIndex(index)}
											>
												<span className="sr-only">Go to image {index + 1}</span>
											</button>
										))}
									</div>

									{/* Image Counter */}
									<div className="absolute top-4 right-4 px-3 py-1 text-sm text-white bg-black/50 rounded-full backdrop-blur-sm">
										{currentImageIndex + 1} / {serviceData.images_list.length}
									</div>
								</>
							) : (
								<div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
									<div className="w-16 h-16 mb-4"></div>
									<p>No images available</p>
								</div>
							)}
						</div>

						{/* Thumbnail Strip */}
						{serviceData.images_list?.length > 1 && (
							<div className="flex gap-2 p-4 overflow-x-auto bg-gray-50">
								{serviceData.images_list.map((image: TRentalImage, index: number) => (
									<button
										key={index}
										className={`relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg transition-all duration-200 ${
											index === currentImageIndex
												? 'ring-4 ring-blue-500 scale-105'
												: 'ring-1 ring-gray-200 hover:ring-2 hover:ring-blue-300'
										}`}
										onClick={() => setCurrentImageIndex(index)}
									>
										<img src={image.image} alt={`Thumbnail ${index + 1}`} className="object-cover w-full h-full" />
										{index === currentImageIndex && <div className="absolute inset-0 bg-blue-500/20"></div>}
									</button>
								))}
							</div>
						)}
					</div>

					{/* Service Details */}
					<div className="bg-white rounded-xl shadow-lg">
						<div className="p-8">
							<div className="flex flex-col gap-4 mb-6 md:flex-row md:items-start md:justify-between">
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-2">
										<h1 className="text-3xl font-bold text-gray-900">{serviceData.name}</h1>
										<span
											className={`px-3 py-1 text-sm font-medium rounded-full ${
												serviceData.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
											}`}
										>
											{serviceData.is_active ? '✓ Active' : '✗ Inactive'}
										</span>
									</div>

									<div className="flex flex-wrap items-center gap-4 mt-4">
										<div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
											<Tag className="w-4 h-4 text-blue-600" />
											<span className="text-sm font-medium text-blue-700">{serviceData.category_name}</span>
										</div>

										<div className="flex items-center gap-1">
											{getStars(4)} {/* Assuming 4-star rating */}
											<span className="ml-1 text-sm text-gray-600">(4.2)</span>
										</div>

										<div className="flex items-center gap-1 text-gray-600">
											<ThumbsUp className="w-4 h-4" />
											<span className="text-sm">98% satisfaction</span>
										</div>
									</div>
								</div>

								<div className="flex gap-2">
									<button onClick={handleShare} className="p-2 text-gray-600 transition-colors hover:text-blue-600">
										<Share2 className="w-5 h-5" />
									</button>
									<button onClick={toggleFavorite} className="p-2 text-gray-600 transition-colors hover:text-red-500">
										<Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
									</button>
								</div>
							</div>

							<div className="prose max-w-none">
								<h3 className="mb-4 text-xl font-semibold">Description</h3>
								<p className="text-gray-700 whitespace-pre-line">{serviceData.description || 'No description provided.'}</p>
							</div>
						</div>

						{/* Service Features */}
						<div className="p-8 border-t border-gray-100">
							<h3 className="mb-6 text-xl font-semibold">Service Features</h3>
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
									<div className="p-2 bg-white rounded-lg">
										<Shield className="w-5 h-5 text-green-600" />
									</div>
									<div>
										<p className="font-medium">Insured & Bonded</p>
										<p className="text-sm text-gray-600">Fully protected service</p>
									</div>
								</div>

								<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
									<div className="p-2 bg-white rounded-lg">
										<Check className="w-5 h-5 text-green-600" />
									</div>
									<div>
										<p className="font-medium">Quality Guaranteed</p>
										<p className="text-sm text-gray-600">Satisfaction or re-clean</p>
									</div>
								</div>

								<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
									<div className="p-2 bg-white rounded-lg">
										<Clock className="w-5 h-5 text-blue-600" />
									</div>
									<div>
										<p className="font-medium">Flexible Scheduling</p>
										<p className="text-sm text-gray-600">Book at your convenience</p>
									</div>
								</div>
							</div>
						</div>

						{/* Specifications */}
						<div className="p-8 border-t border-gray-100">
							<h3 className="mb-6 text-xl font-semibold">Service Specifications</h3>
							{serviceData.specifications && serviceData.specifications.length > 0 ? (
								<div className="overflow-hidden border border-gray-200 rounded-xl">
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Specification
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{serviceData.specifications.map((spec: TRentalSpecification, index: number) => (
												<tr key={index} className="hover:bg-gray-50">
													<td className="px-6 py-4 font-medium text-gray-900">
														<div className="flex items-center gap-2">
															<div className="w-1 h-4 bg-blue-500 rounded"></div>
															{spec.label}
														</div>
													</td>
													<td className="px-6 py-4 text-gray-700">{spec.value}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							) : (
								<div className="p-6 text-center text-gray-500 bg-gray-50 rounded-xl">No specifications available for this service.</div>
							)}
						</div>

						{/* Service Rates with Booking Selection */}
						<div className="p-8 border-t border-gray-100">
							<h3 className="mb-6 text-xl font-semibold">Pricing & Booking</h3>
							<div className="overflow-hidden border border-gray-200 rounded-xl">
								<div className="grid md:grid-cols-4">
									{serviceData.rates_list?.map((rate: TRentalRate, index: number) => (
										<button
											key={index}
											onClick={() => setSelectedPeriod(rate.period)}
											className={`p-6 text-center transition-all ${
												selectedPeriod === rate.period ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
											} ${index !== 0 ? 'border-l border-gray-200' : ''}`}
										>
											<div className="text-lg font-semibold text-gray-900">{rate.period}</div>
											<div className="flex items-center justify-center gap-1 mt-2 text-2xl font-bold text-blue-600">
												<DollarSign className="w-5 h-5" />
												<span>{rate.rate.toLocaleString()}</span>
											</div>
											<div className="mt-1 text-sm text-gray-600">per service</div>
											{selectedPeriod === rate.period && (
												<div className="mt-3">
													<div className="inline-flex items-center gap-1 px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full">
														<Check className="w-3 h-3" />
														Selected
													</div>
												</div>
											)}
										</button>
									))}
								</div>

								{selectedPeriod && (
									<div className="p-6 bg-gray-50 border-t border-gray-200">
										<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
											<div>
												<p className="font-medium">Selected Plan: {selectedPeriod}</p>
												<p className="text-2xl font-bold text-blue-600">
													${calculateTotal().toLocaleString()}
													<span className="text-sm font-normal text-gray-600">
														{bookingQuantity > 1 ? ` (${bookingQuantity} sessions)` : ''}
													</span>
												</p>
											</div>

											<div className="flex items-center gap-4">
												<div className="flex items-center gap-2">
													<span className="text-sm font-medium">Quantity:</span>
													<div className="flex items-center border border-gray-300 rounded-lg">
														<button
															onClick={() => setBookingQuantity(Math.max(1, bookingQuantity - 1))}
															className="px-3 py-1 text-gray-600 hover:bg-gray-100"
														>
															-
														</button>
														<span className="w-12 py-1 text-center">{bookingQuantity}</span>
														<button
															onClick={() => setBookingQuantity(bookingQuantity + 1)}
															className="px-3 py-1 text-gray-600 hover:bg-gray-100"
														>
															+
														</button>
													</div>
												</div>

												<button
													onClick={handleBookNow}
													className="px-6 py-3 font-medium text-white transition-all bg-green-600 rounded-lg hover:bg-green-700 hover:shadow-lg"
												>
													Book Now
												</button>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Right Column */}
				<div className="space-y-6">
					{/* Seller Information */}
					<div className="bg-white rounded-xl shadow-lg">
						<div className="p-6 border-b border-gray-100">
							<h2 className="text-lg font-semibold">Seller Information</h2>
						</div>
						<div className="p-6 space-y-4">
							<div className="flex items-center gap-3">
								<div className="relative">
									<div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
										<User className="w-6 h-6 text-blue-600" />
									</div>
									{serviceData.seller_fullname && <BadgeCheck className="absolute -bottom-1 -right-1 w-5 h-5 text-blue-500" />}
								</div>
								<div>
									<p className="font-semibold">{serviceData.seller_fullname || serviceData.seller_name || 'Anonymous Seller'}</p>
									<p className="text-sm text-gray-600">Verified Seller</p>
								</div>
							</div>

							<div className="space-y-3">
								<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
									<Phone className="w-4 h-4 text-gray-600" />
									<span className="font-medium">{serviceData.contact_phone}</span>
								</div>

								<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
									<MapPin className="w-4 h-4 text-gray-600" />
									<span className="text-sm">Serving Kathmandu Valley</span>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-2">
								<button
									onClick={() => setShowContactModal(true)}
									className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
								>
									Contact
								</button>
								<button
									onClick={() => (window.location.href = `tel:${serviceData.contact_phone}`)}
									className="px-4 py-2 text-blue-600 transition-colors border border-blue-600 rounded-lg hover:bg-blue-50"
								>
									Call Now
								</button>
							</div>
						</div>
					</div>

					{/* Delivery Information */}
					<div className="bg-white rounded-xl shadow-lg">
						<div className="p-6 border-b border-gray-100">
							<h2 className="text-lg font-semibold">Service Details</h2>
						</div>
						<div className="p-6 space-y-4">
							<div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
								<Clock className="w-5 h-5 mt-0.5 text-blue-600" />
								<div>
									<p className="font-medium">Service Duration</p>
									<p className="text-sm text-gray-700">
										{serviceData.delivery_time} day{serviceData.delivery_time > 1 ? 's' : ''}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
								<Truck className="w-5 h-5 mt-0.5 text-green-600" />
								<div>
									<p className="font-medium">Delivery Fee</p>
									<p className="text-sm text-gray-700">{serviceData.delivery_fee ? `$${serviceData.delivery_fee}` : 'Free delivery'}</p>
								</div>
							</div>

							<div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
								<CreditCard className="w-5 h-5 mt-0.5 text-purple-600" />
								<div>
									<p className="font-medium">Payment Options</p>
									<p className="text-sm text-gray-700">Cash, Card, Mobile Banking</p>
								</div>
							</div>
						</div>
					</div>

					{/* Service Stats */}
					<div className="bg-white rounded-xl shadow-lg">
						<div className="p-6 border-b border-gray-100">
							<h2 className="text-lg font-semibold">Service Stats</h2>
						</div>
						<div className="p-6">
							<div className="grid grid-cols-2 gap-4">
								<div className="p-4 text-center bg-gray-50 rounded-lg">
									<div className="text-2xl font-bold text-blue-600">98%</div>
									<div className="text-sm text-gray-600">Satisfaction</div>
								</div>
								<div className="p-4 text-center bg-gray-50 rounded-lg">
									<div className="text-2xl font-bold text-green-600">24h</div>
									<div className="text-sm text-gray-600">Response Time</div>
								</div>
								<div className="p-4 text-center bg-gray-50 rounded-lg">
									<div className="text-2xl font-bold text-purple-600">50+</div>
									<div className="text-sm text-gray-600">Jobs Done</div>
								</div>
								<div className="p-4 text-center bg-gray-50 rounded-lg">
									<div className="text-2xl font-bold text-orange-600">5y</div>
									<div className="text-sm text-gray-600">Experience</div>
								</div>
							</div>
						</div>
					</div>

					{/* Quick Actions */}
					<div className="bg-white rounded-xl shadow-lg">
						<div className="p-6 border-b border-gray-100">
							<h2 className="text-lg font-semibold">Quick Actions</h2>
						</div>
						<div className="p-6 space-y-3">
							<button
								onClick={handleBookNow}
								disabled={!selectedPeriod}
								className={`w-full px-4 py-3 font-medium text-white rounded-lg transition-all ${
									selectedPeriod
										? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg'
										: 'bg-gray-400 cursor-not-allowed'
								}`}
							>
								Book This Service
							</button>

							<button
								onClick={() => setShowContactModal(true)}
								className="w-full px-4 py-3 font-medium text-blue-600 transition-colors border-2 border-blue-600 rounded-lg hover:bg-blue-50"
							>
								<MessageSquare className="inline w-4 h-4 mr-2" />
								Send Message
							</button>
						</div>
					</div>

					{/* Admin Actions */}
					{serviceData.is_banned !== undefined && (
						<div className="bg-white rounded-xl shadow-lg">
							<div className="p-6 border-b border-gray-100">
								<h2 className="text-lg font-semibold">Admin Actions</h2>
							</div>
							<div className="p-6">
								<div className="grid grid-cols-2 gap-3">
									{serviceData.is_banned === 0 ? (
										<button className="px-4 py-2 text-white transition-colors bg-red-600 rounded-md hover:bg-red-700">Ban Service</button>
									) : (
										<button className="px-4 py-2 text-green-600 transition-colors border border-green-600 rounded-md hover:bg-green-50">
											Unban Service
										</button>
									)}
									<button className="px-4 py-2 text-gray-600 transition-colors border border-gray-300 rounded-md hover:bg-gray-50">
										Edit Details
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Modals */}
			{showShareModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="w-full max-w-md p-6 bg-white rounded-xl">
						<h3 className="mb-4 text-xl font-semibold">Share Service</h3>
						<div className="flex gap-2 mb-4">
							<input type="text" readOnly value={window.location.href} className="flex-1 px-3 py-2 border rounded-lg" />
							<button onClick={copyToClipboard} className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
								{copied ? 'Copied!' : 'Copy'}
							</button>
						</div>
						<div className="flex justify-end gap-2">
							<button onClick={() => setShowShareModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{showImageModal && serviceData.images_list?.length > 0 && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setShowImageModal(false)}>
					<div className="relative w-full max-w-6xl">
						<img
							src={serviceData.images_list[currentImageIndex]?.image}
							alt="Full size preview"
							className="w-full h-auto max-h-[90vh] object-contain"
						/>
						<button
							className="absolute top-4 right-4 p-2 text-white bg-black/50 rounded-full hover:bg-black/70"
							onClick={() => setShowImageModal(false)}
						>
							✕
						</button>
					</div>
				</div>
			)}

			{showBookingModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="w-full max-w-md p-6 bg-white rounded-xl">
						<h3 className="mb-4 text-xl font-semibold">Confirm Booking</h3>
						<div className="space-y-4 mb-6">
							<div className="p-4 bg-gray-50 rounded-lg">
								<p className="font-medium">{serviceData.name}</p>
								<p className="text-sm text-gray-600">Selected: {selectedPeriod} Plan</p>
								<p className="text-lg font-bold text-blue-600">Total: ${calculateTotal().toLocaleString()}</p>
							</div>

							<div>
								<label className="block mb-2 text-sm font-medium">Your Name</label>
								<input type="text" className="w-full px-3 py-2 border rounded-lg" />
							</div>

							<div>
								<label className="block mb-2 text-sm font-medium">Phone Number</label>
								<input type="tel" className="w-full px-3 py-2 border rounded-lg" />
							</div>

							<div>
								<label className="block mb-2 text-sm font-medium">Preferred Date</label>
								<input type="date" className="w-full px-3 py-2 border rounded-lg" />
							</div>
						</div>

						<div className="flex justify-end gap-2">
							<button onClick={() => setShowBookingModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
								Cancel
							</button>
							<button
								onClick={() => {
									setShowBookingModal(false);
									alert('Booking confirmed! The seller will contact you soon.');
								}}
								className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
							>
								Confirm Booking
							</button>
						</div>
					</div>
				</div>
			)}

			{showContactModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="w-full max-w-md p-6 bg-white rounded-xl">
						<h3 className="mb-4 text-xl font-semibold">Contact Seller</h3>
						<div className="space-y-4 mb-6">
							<div>
								<label className="block mb-2 text-sm font-medium">Message</label>
								<textarea rows={4} className="w-full px-3 py-2 border rounded-lg" placeholder="Type your message here..." />
							</div>

							<div className="p-4 bg-blue-50 rounded-lg">
								<p className="text-sm">The seller will receive your message and contact you at your preferred time.</p>
							</div>
						</div>

						<div className="flex justify-end gap-2">
							<button onClick={() => setShowContactModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
								Cancel
							</button>
							<button
								onClick={() => {
									setShowContactModal(false);
									alert('Message sent! The seller will respond soon.');
								}}
								className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
							>
								Send Message
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
