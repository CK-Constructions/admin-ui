'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Store, ShoppingCart, Users, Wrench, Car, LogOut } from 'lucide-react';
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useGetQuery } from '../query/hooks/queryHook';
import { queryConfigs } from '../query/queryConfig';
import Loading from './common/Loader';
import { logoutUser } from '../api';
import { useDispatch } from 'react-redux';
import { logOut } from '../redux/features/authSlice';
import { IVendor, TUser, Order, ServiceOrder, RentalOrder } from './lib/types/response';

// Utility to sanitize values
const sanitizeValue = (val: any, defaultVal = 0) => (val !== undefined && val !== null ? val : defaultVal);

// --------------------- STAT CARD ---------------------
interface StatCardProps {
	title: string;
	value: number;
	icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
	return (
		<Card className="border-border bg-card hover:bg-card/80 transition-colors">
			<CardContent className="p-6 flex items-center justify-between">
				<div className="flex-1">
					<p className="text-sm text-muted-foreground mb-1">{title}</p>
					<p className="text-3xl font-bold text-foreground">{value}</p>
				</div>
				<div className="text-muted-foreground">{icon}</div>
			</CardContent>
		</Card>
	);
}

// --------------------- DASHBOARD ---------------------
export default function Dashboard() {
	const [logoutModalOpen, setLogoutModalOpen] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	/* --------------------- API QUERIES --------------------- */
	const { queryFn: vendorsFunc, queryKey: vendorsKey } = queryConfigs.useGetVendors;
	const {
		data: vendorsData,
		isLoading: isVendorsLoading,
		isError: isVendorsError,
	} = useGetQuery({
		func: vendorsFunc,
		key: vendorsKey,
		params: { offset: 0, limit: 1000 },
	});

	const { queryFn: ordersFunc, queryKeys: ordersKey } = queryConfigs.useGetAllOrders;
	const {
		data: ordersData,
		isLoading: isOrdersLoading,
		isError: isOrdersError,
	} = useGetQuery({
		func: ordersFunc,
		key: ordersKey,
		params: { offset: 0, limit: 1000 },
	});

	const { queryFn: serviceFunc, queryKeys: serviceKey } = queryConfigs.useGetAllService;
	const {
		data: serviceData,
		isLoading: isServiceLoading,
		isError: isServiceError,
	} = useGetQuery({
		func: serviceFunc,
		key: serviceKey,
		params: { offset: 0, limit: 1000 },
	});

	const { queryFn: rentalOrderFunc, queryKeys: rentalOrderKey } = queryConfigs.useGetAllRentalOrder;
	const {
		data: rentalOrderData,
		isLoading: isRentalOrderLoading,
		isError: isRentalOrderError,
	} = useGetQuery({
		func: rentalOrderFunc,
		key: rentalOrderKey,
		params: { offset: 0, limit: 1000 },
	});

	const { queryFn: userFunc, queryKey: userKey } = queryConfigs.useGetUsers;
	const {
		data: userData,
		isLoading: isUserLoading,
		isError: isUserError,
	} = useGetQuery({
		func: userFunc,
		key: userKey,
		params: { offset: 0, limit: 1000 },
	});

	/* --------------------- LOADING / ERROR --------------------- */
	const isLoading = isOrdersLoading || isVendorsLoading || isServiceLoading || isRentalOrderLoading || isUserLoading;
	const isError = isOrdersError || isVendorsError || isServiceError || isRentalOrderError || isUserError;

	if (isLoading) return <Loading />;
	if (isError) return <Typography color="error">Failed to load dashboard data</Typography>;

	/* --------------------- DATA SANITIZATION --------------------- */
	// Orders - Based on OrdersResponse type
	const ordersResult = ordersData?.result;
	const ordersArray: Order[] = Array.isArray(ordersResult) ? ordersResult : [];
	const totalOrders = sanitizeValue(ordersArray.length);

	// Services - Based on ApiResponse type
	const serviceResult = serviceData?.result;
	const serviceArray: ServiceOrder[] = Array.isArray(serviceResult?.list) ? serviceResult.list : [];
	const totalServiceOrders = sanitizeValue(serviceResult?.count || serviceArray.length);

	// Rentals - Based on RentalOrder type (assuming similar structure to service orders)
	const rentalResult = rentalOrderData?.result;
	const rentalArray: RentalOrder[] = Array.isArray(rentalResult?.list) ? rentalResult.list : Array.isArray(rentalResult) ? rentalResult : [];
	const totalRentalOrders = sanitizeValue(rentalResult?.count || rentalArray.length);

	// Users - Based on TUser type
	const userResult = userData?.result;
	const usersArray: TUser[] = Array.isArray(userResult?.list) ? userResult.list : Array.isArray(userResult) ? userResult : [];
	const totalUsers = sanitizeValue(userResult?.count || usersArray.length);

	// Active users: is_active === 1 means active (based on TUser type)
	const totalActiveUsers = sanitizeValue(usersArray.filter((user) => user.is_active === 0).length);

	// Vendors - Based on IVendor type
	const vendorsResult = vendorsData?.result;
	const vendorsArray: IVendor[] = Array.isArray(vendorsResult?.list) ? vendorsResult.list : Array.isArray(vendorsResult) ? vendorsResult : [];
	const totalVendors = sanitizeValue(vendorsResult?.count || vendorsArray.length);

	// Active vendors: status === 'active' AND is_active === 1 (based on IVendor type)
	const activeVendors = sanitizeValue(vendorsArray.filter((v) => v.status === 'active' && v.is_active === 1).length);

	// Verified vendors: verified === true (based on IVendor type)
	const verifiedVendors = sanitizeValue(vendorsArray.filter((v) => v.verified === true).length);

	// Additional useful stats based on your types
	const successfulOrders = sanitizeValue(ordersArray.filter((order) => order.payment_status === 'success').length);

	const successfulServiceOrders = sanitizeValue(serviceArray.filter((order) => order.payment_status === 'success').length);

	const successfulRentalOrders = sanitizeValue(rentalArray.filter((order) => order.payment_status === 'success').length);

	/* --------------------- LOGOUT HANDLER --------------------- */
	const handleLogout = async () => {
		try {
			await logoutUser();
			dispatch(logOut());
			navigate('/login');
		} catch (error) {
			console.error('Logout failed', error);
			alert('Logout failed. Please try again.');
		}
	};

	/* --------------------- RENDER --------------------- */
	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b border-border bg-card">
				<div className="flex items-center justify-between px-6 py-4">
					<div className="flex items-center gap-3">
						<div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
							<Store className="h-5 w-5 text-primary-foreground" />
						</div>
						<h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
					</div>
					<Button variant="text" size="small" className="gap-2" onClick={() => setLogoutModalOpen(true)}>
						<LogOut className="h-4 w-4" />
						Logout
					</Button>
				</div>
			</header>

			{/* Main content */}
			<main className="p-6 space-y-6">
				{/* Welcome */}
				<div>
					<h2 className="text-2xl font-bold text-foreground mb-1">Welcome back</h2>
					<p className="text-muted-foreground">Here's what's happening with your platform today.</p>
				</div>

				{/* Stats Grid */}
				<div className="space-y-6">
					{/* Orders Section */}
					<div>
						<h3 className="text-lg font-semibold text-foreground mb-4">Orders Overview</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<StatCard title="Total Orders" value={totalOrders} icon={<ShoppingCart className="h-8 w-8" />} />
							<StatCard title="Successful Orders" value={successfulOrders} icon={<ShoppingCart className="h-8 w-8" />} />
							<StatCard title="Rental Orders" value={totalRentalOrders} icon={<Car className="h-8 w-8" />} />
							<StatCard title="Service Orders" value={totalServiceOrders} icon={<Wrench className="h-8 w-8" />} />
							<StatCard title="Successful Rentals" value={successfulRentalOrders} icon={<Car className="h-8 w-8" />} />
							<StatCard title="Successful Services" value={successfulServiceOrders} icon={<Wrench className="h-8 w-8" />} />
						</div>
					</div>

					{/* Users Section */}
					<div>
						<h3 className="text-lg font-semibold text-foreground mb-4">Users Overview</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<StatCard title="Total Users" value={totalUsers} icon={<Users className="h-8 w-8" />} />
							<StatCard title="Active Users" value={totalActiveUsers} icon={<Users className="h-8 w-8" />} />
							<StatCard title="Inactive Users" value={totalUsers - totalActiveUsers} icon={<Users className="h-8 w-8" />} />
						</div>
					</div>

					{/* Vendors Section */}
					<div>
						<h3 className="text-lg font-semibold text-foreground mb-4">Vendors Overview</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<StatCard title="Total Vendors" value={totalVendors} icon={<Users className="h-8 w-8" />} />
							<StatCard title="Active Vendors" value={activeVendors} icon={<Users className="h-8 w-8" />} />
							<StatCard title="Verified Vendors" value={verifiedVendors} icon={<Users className="h-8 w-8" />} />
							<StatCard title="Inactive Vendors" value={totalVendors - activeVendors} icon={<Users className="h-8 w-8" />} />
						</div>
					</div>
				</div>

				{/* Quick Summary */}
				<Card className="border-border bg-card">
					<CardContent className="p-6">
						<h3 className="text-lg font-semibold text-foreground mb-4">Quick Summary</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Total Revenue Orders:</span>
								<span className="font-semibold">{successfulOrders}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">User Activation Rate:</span>
								<span className="font-semibold">{totalUsers > 0 ? Math.round((totalActiveUsers / totalUsers) * 100) : 0}%</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Vendor Activation Rate:</span>
								<span className="font-semibold">{totalVendors > 0 ? Math.round((activeVendors / totalVendors) * 100) : 0}%</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</main>

			{/* Logout Modal */}
			<Dialog open={logoutModalOpen} onClose={() => setLogoutModalOpen(false)}>
				<DialogTitle>Confirm Logout</DialogTitle>
				<DialogContent>
					<Typography>Are you sure you want to logout?</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setLogoutModalOpen(false)}>Cancel</Button>
					<Button color="error" onClick={handleLogout}>
						Logout
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
