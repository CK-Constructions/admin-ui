import React, { useState } from 'react';
import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery } from '../../query/hooks/queryHook';
import dayjs from 'dayjs';
import { HiPencilAlt, HiLockClosed, HiInformationCircle, HiMail, HiPhone, HiLocationMarker, HiCalendar, HiUser, HiShieldCheck } from 'react-icons/hi';
import Header from '../common/Header';
import { useNavigate } from 'react-router';

interface UserData {
	id: number;
	username: string;
	fullname: string;
	address: string;
	phone: string;
	email: string;
	created_on?: string;
}

interface ApiResponse {
	result: UserData;
	success: boolean;
}

const ProfilePage: React.FC = () => {
	const navigate = useNavigate();
	const { queryFn: getProfile, queryKey } = queryConfigs.useGetProfile;

	const handleClickBack = () => {
		navigate(-1);
	};

	const {
		data: profileData,
		refetch,
		isLoading,
		isRefetching,
		isError,
	} = useGetQuery({
		func: getProfile,
		key: queryKey,
	});

	// Loading state
	if (isLoading || isRefetching) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
				<Header onBackClick={handleClickBack} onReloadClick={refetch} showButton={false} pageName="Profile" />
				<div className="flex items-center justify-center h-96">
					<div className="text-center">
						<div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
						<p className="text-gray-600">Loading your profile...</p>
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (isError || !profileData?.success) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
				<Header onBackClick={handleClickBack} onReloadClick={refetch} showButton={false} pageName="Profile" />
				<div className="flex items-center justify-center h-96">
					<div className="text-center p-8 max-w-md bg-white rounded-2xl shadow-lg">
						<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<HiInformationCircle className="h-8 w-8 text-red-500" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load profile</h3>
						<p className="text-gray-500 mb-6">We couldn't load your profile information. Please try again.</p>
						<button
							onClick={() => refetch()}
							className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md"
						>
							Try Again
						</button>
					</div>
				</div>
			</div>
		);
	}

	const userData = profileData?.result || {
		id: 0,
		username: 'Not available',
		fullname: 'Not available',
		address: 'Not available',
		phone: 'Not available',
		email: 'Not available',
		created_on: new Date().toISOString(),
	};

	const firstInitial = userData.fullname?.charAt(0)?.toUpperCase() || '?';

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
			<Header onBackClick={handleClickBack} onReloadClick={refetch} showButton={false} pageName="Profile" />

			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Profile Card */}
				<div className="bg-white rounded-3xl shadow-xl overflow-hidden">
					{/* Profile Header with Gradient */}
					<div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8">
						<div className="absolute inset-0 bg-black/10"></div>
						<div className="relative flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-6">
							{/* Avatar */}
							<div className="relative">
								<div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
									{firstInitial}
								</div>
								<div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white shadow-lg"></div>
							</div>

							{/* User Info */}
							<div className="text-center sm:text-left text-white">
								<h1 className="text-3xl font-bold mb-2">{userData.fullname}</h1>
								<p className="text-white/80 text-lg mb-1">@{userData.username}</p>
								<p className="text-white/70 flex items-center justify-center sm:justify-start gap-2">
									<HiMail className="w-4 h-4" />
									{userData.email}
								</p>
							</div>
						</div>
					</div>

					{/* Profile Content */}
					<div className="p-8">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{/* Personal Information Card */}
							<div className="space-y-6">
								<div className="flex items-center space-x-3">
									<div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
									<h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
								</div>

								<div className="space-y-4">
									<InfoItem icon={<HiUser className="w-5 h-5 text-indigo-500" />} label="Full Name" value={userData.fullname} />
									<InfoItem icon={<HiMail className="w-5 h-5 text-purple-500" />} label="Email" value={userData.email} />
									<InfoItem icon={<HiPhone className="w-5 h-5 text-green-500" />} label="Phone Number" value={userData.phone} />
									<InfoItem icon={<HiLocationMarker className="w-5 h-5 text-red-500" />} label="Address" value={userData.address} />
								</div>
							</div>

							{/* Account Information Card */}
							<div className="space-y-6">
								<div className="flex items-center space-x-3">
									<div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
									<h2 className="text-xl font-semibold text-gray-800">Account Information</h2>
								</div>

								<div className="space-y-4">
									<InfoItem icon={<HiShieldCheck className="w-5 h-5 text-blue-500" />} label="User ID" value={userData.id || 'N/A'} />
									<InfoItem icon={<HiUser className="w-5 h-5 text-gray-500" />} label="Username" value={userData.username} />
									<div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
										<div>
											<p className="text-sm text-gray-500">Account Status</p>
											<div className="flex items-center space-x-2">
												<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
												<span className="font-semibold text-green-700">Active</span>
											</div>
										</div>
										<HiShieldCheck className="w-6 h-6 text-green-500" />
									</div>
									<InfoItem
										icon={<HiCalendar className="w-5 h-5 text-orange-500" />}
										label="Member Since"
										value={userData.created_on ? dayjs(userData.created_on).format('MMMM D, YYYY') : 'N/A'}
									/>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="mt-12 pt-8 border-t border-gray-200">
							<div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
								<button className="group px-8 py-4 bg-white text-gray-700 rounded-2xl border-2 border-gray-200 hover:border-indigo-300 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md hover:shadow-lg flex items-center justify-center">
									<HiLockClosed className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
									Change Password
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// Reusable InfoItem component for consistent styling
const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
	<div className="flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors duration-200 group">
		<div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
			{icon}
		</div>
		<div className="flex-1 min-w-0">
			<p className="text-sm font-medium text-gray-500">{label}</p>
			<p className="text-lg font-semibold text-gray-900 truncate">{value}</p>
		</div>
	</div>
);

export default ProfilePage;
