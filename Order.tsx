'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CubeIcon, CheckCircleIcon, XCircleIcon, ClockIcon, ChevronDownIcon, ChevronUpIcon, ArrowPathIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { Package, CalendarDays } from 'lucide-react';
import { getAllUserOrders } from './api';

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'dispatched' | 'out for delivery' | 'completed' | 'cancelled';

type OrderItem = {
	id: number;
	order_item_id: number;
	listing_id: number;
	quantity: number;
	unit_price: number;
	total_price: number;
	product_name: string;
	product_image: string | null;
	category_name: string;
	estimated_delivery_days?: string;
	order_date: string;
};

type Order = {
	id: number;
	total_amount: number;
	discount_amount: number;
	final_amount: number;
	razorpay_order_id?: string;
	payment_status: string;
	order_status: OrderStatus;
	created_on: string;
	updated_on?: string;
	items: OrderItem[];
};

export default function OrdersScreen() {
	const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
	const queryClient = useQueryClient();

	// === Query for Material Orders Only ===
	const {
		data: materialData,
		isLoading: matLoading,
		isFetching: matFetching,
		refetch: refetchMat,
	} = useQuery({
		queryKey: ['user-orders-material'],
		queryFn: getAllUserOrders,
	});

	// === Transform Function for Material Orders ===
	const transformMaterial = (api: any): Order[] => {
		const list = api?.result?.list ?? api?.result ?? [];
		if (!Array.isArray(list)) return [];

		return list.map((o: any) => ({
			id: Number(o.id),
			total_amount: Number(o.total_amount ?? 0),
			discount_amount: Number(o.discount_amount ?? 0),
			final_amount: Number(o.final_amount ?? o.total_amount ?? 0),
			razorpay_order_id: o.razorpay_order_id ?? '',
			payment_status: o.payment_status ?? 'pending',
			order_status: (o.order_status ?? 'pending') as OrderStatus,
			created_on: o.created_on ?? new Date().toISOString(),
			updated_on: o.updated_on ?? o.created_on,
			items: (o.items || []).map((i: any) => ({
				id: Number(i.id ?? i.order_item_id),
				order_item_id: Number(i.order_item_id ?? i.id),
				listing_id: Number(i.listing_id),
				quantity: Number(i.quantity ?? 1),
				unit_price: Number(i.unit_price ?? 0),
				total_price: Number(i.total_price ?? 0),
				product_name: i.product_name || 'Material Item',
				product_image: i.product_image,
				category_name: i.category_name || 'Material',
				estimated_delivery_days: i.estimated_delivery_days,
				order_date: i.order_date ?? o.created_on,
			})),
		}));
	};

	const materialOrders = materialData ? transformMaterial(materialData) : [];
	const filteredOrders = materialOrders.sort((a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime());

	const handleRefresh = async () => {
		await refetchMat();
	};

	const goToDetail = (order: Order) => {
		window.location.href = `/order/${order.id}`;
	};

	const getStatusColor = (status: OrderStatus) => {
		switch (status) {
			case 'completed':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'dispatched':
			case 'out for delivery':
				return 'bg-blue-100 text-blue-800 border-blue-200';
			case 'processing':
			case 'confirmed':
				return 'bg-purple-100 text-purple-800 border-purple-200';
			case 'cancelled':
				return 'bg-red-100 text-red-800 border-red-200';
			default:
				return 'bg-amber-100 text-amber-800 border-amber-200';
		}
	};

	const getStatusIcon = (status: OrderStatus) => {
		switch (status) {
			case 'completed':
				return <CheckCircleIcon className="w-5 h-5" />;
			case 'cancelled':
				return <XCircleIcon className="w-5 h-5" />;
			default:
				return <ClockIcon className="w-5 h-5" />;
		}
	};

	if (matLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="relative">
						<div className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-green-600 mx-auto mb-4"></div>
						<div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 blur-xl opacity-30"></div>
					</div>
					<p className="text-lg text-gray-700 font-medium animate-pulse">Loading your orders...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
			{/* Sticky Header */}
			<div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button onClick={() => window.history.back()} className="p-2.5 hover:bg-green-50 rounded-xl transition-all duration-200 group">
								<div className="h-6 w-6 text-gray-700 group-hover:text-green-600">←</div>
							</button>
							<h1 className="text-xl font-bold text-gray-900">My Orders</h1>
						</div>
						<div className="flex items-center gap-4">
							<button
								onClick={handleRefresh}
								disabled={matFetching}
								className="p-2.5 hover:bg-green-50 rounded-xl transition-all duration-200 group"
							>
								<motion.div
									animate={{ rotate: matFetching ? 360 : 0 }}
									transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
									className="text-gray-600 group-hover:text-green-600"
								>
									↻
								</motion.div>
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 py-6">
				{/* Stats Summary */}
				<div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Total Orders</p>
								<p className="text-3xl font-bold text-gray-900">{materialOrders.length}</p>
							</div>
							<div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
								<CubeIcon className="h-6 w-6 text-green-600" />
							</div>
						</div>
					</div>
				</div>

				{/* Empty State */}
				{filteredOrders.length === 0 ? (
					<div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
						<ShoppingBagIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
						<h3 className="text-2xl font-bold text-gray-800 mb-3">No orders yet</h3>
						<p className="text-gray-600 mb-8 max-w-md mx-auto">Start shopping to see your material orders here</p>
						<button
							onClick={() => (window.location.href = '/materials')}
							className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-1"
						>
							Browse Materials
						</button>
					</div>
				) : (
					<div className="space-y-6">
						{filteredOrders.map((order) => {
							const isExpanded = expandedOrders.has(order.id);
							const primaryItem = order.items[0];

							return (
								<motion.div
									key={order.id}
									layout
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
								>
									<div className="p-6">
										{/* Order Header */}
										<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
											<div className="flex items-center gap-4">
												<div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
													<CubeIcon className="h-6 w-6 text-green-600" />
												</div>
												<div>
													<h3 className="text-xl font-bold text-gray-900">Order #{order.id}</h3>
													<p className="text-sm text-gray-500">
														Placed on {format(new Date(order.created_on), 'dd MMM yyyy, hh:mm a')}
													</p>
												</div>
											</div>
											<div className="flex items-center gap-4">
												<span
													className={`px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-2 ${getStatusColor(
														order.order_status
													)}`}
												>
													{getStatusIcon(order.order_status)}
													{order.order_status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
												</span>
												<div className="text-right">
													<p className="text-2xl font-bold text-gray-900">₹{order.final_amount.toLocaleString('en-IN')}</p>
													{order.discount_amount > 0 && (
														<p className="text-sm text-green-600 font-medium">
															Saved ₹{order.discount_amount.toLocaleString('en-IN')}
														</p>
													)}
												</div>
											</div>
										</div>

										{/* Order Items */}
										<div className="space-y-4">
											{/* Primary Item */}
											<div className="flex gap-4 p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-2xl border border-green-100">
												{primaryItem.product_image ? (
													<img
														src={primaryItem.product_image}
														alt={primaryItem.product_name}
														className="w-24 h-24 rounded-xl object-cover border-2 border-white shadow-lg"
													/>
												) : (
													<div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
														<Package className="w-10 h-10 text-gray-400" />
													</div>
												)}
												<div className="flex-1">
													<h4 className="font-bold text-gray-900 text-lg">{primaryItem.product_name}</h4>
													<p className="text-gray-600 mt-1">{primaryItem.category_name}</p>
													<div className="flex items-center gap-6 mt-3">
														<p className="text-sm font-medium text-gray-700">
															Quantity: <span className="font-bold">{primaryItem.quantity}</span>
														</p>
														<p className="text-sm font-medium text-gray-700">
															Price: <span className="font-bold">₹{primaryItem.unit_price.toLocaleString('en-IN')} each</span>
														</p>
														<p className="text-sm font-medium text-gray-700">
															Total:{' '}
															<span className="font-bold text-green-600">₹{primaryItem.total_price.toLocaleString('en-IN')}</span>
														</p>
													</div>
												</div>
											</div>

											{/* Additional Items */}
											{order.items.length > 1 && (
												<>
													{isExpanded &&
														order.items.slice(1).map((item) => (
															<div key={item.id} className="flex gap-4 p-4 border-t border-gray-100">
																<div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
																	<Package className="w-8 h-8 text-gray-400" />
																</div>
																<div className="flex-1">
																	<h4 className="font-medium text-gray-800">{item.product_name}</h4>
																	<p className="text-sm text-gray-600">{item.category_name}</p>
																	<div className="flex items-center gap-4 mt-2">
																		<p className="text-sm font-medium text-gray-700">
																			Qty: <span className="font-bold">{item.quantity}</span>
																		</p>
																		<p className="text-sm font-medium text-gray-700">
																			Total:{' '}
																			<span className="font-bold">₹{item.total_price.toLocaleString('en-IN')}</span>
																		</p>
																	</div>
																</div>
															</div>
														))}

													{/* Show More/Less Button */}
													<button
														onClick={() => {
															const newSet = new Set(expandedOrders);
															if (newSet.has(order.id)) newSet.delete(order.id);
															else newSet.add(order.id);
															setExpandedOrders(newSet);
														}}
														className="mt-4 flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm px-4 py-2 hover:bg-green-50 rounded-xl transition-all duration-200"
													>
														{isExpanded ? (
															<>
																Show Less Items <ChevronUpIcon className="w-4 h-4" />
															</>
														) : (
															<>
																View All {order.items.length} Items <ChevronDownIcon className="w-4 h-4" />
															</>
														)}
													</button>
												</>
											)}
										</div>

										{/* Action Buttons */}
										<div className="flex gap-4 mt-8">
											<button
												onClick={() => goToDetail(order)}
												className="flex-1 py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/30"
											>
												{order.order_status === 'completed' ? 'Buy Again' : 'Track Order'}
											</button>
											<button
												onClick={() => goToDetail(order)}
												className="flex-1 py-4 px-6 border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 hover:border-green-300 transition-all duration-300"
											>
												View Details
											</button>
										</div>
									</div>
								</motion.div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
