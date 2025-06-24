import React, { useState } from "react";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery } from "../../query/hooks/queryHook";
import dayjs from "dayjs";
import { HiPencilAlt, HiLockClosed, HiInformationCircle } from "react-icons/hi";
import Header from "../common/Header";
import { useNavigate } from "react-router";

interface UserData {
  id: number;
  username: string;
  fullname: string;
  address: string;
  phone: string;
  email: string;
  created_on?: string; // Added as it's used in the component
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
      <div className="h-screen">
        <Header onBackClick={handleClickBack} onReloadClick={refetch} showButton={false} pageName="Profile" />
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !profileData?.success) {
    return (
      <div className="h-screen">
        <Header onBackClick={handleClickBack} onReloadClick={refetch} showButton={false} pageName="Profile" />
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6 max-w-md">
            <HiInformationCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Failed to load profile</h3>
            <p className="mt-1 text-sm text-gray-500">We couldn't load your profile information. Please try again.</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for missing data
  const userData = profileData?.result || {
    id: 0,
    username: "Not available",
    fullname: "Not available",
    address: "Not available",
    phone: "Not available",
    email: "Not available",
    created_on: new Date().toISOString(),
  };

  const firstInitial = userData.fullname?.charAt(0) || "?";

  return (
    <div className="h-screen">
      {/* Main Content */}
      <div className="pb-4">
        <Header onBackClick={handleClickBack} onReloadClick={refetch} showButton={false} pageName="Profile" />
      </div>
      <div className="flex-1 overflow-y-auto">
        {/* Profile Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-xl shadow overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-6 sm:p-8 text-white">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">{firstInitial}</div>
                  </div>
                  <div className="text-center sm:text-left">
                    <h1 className="text-2xl font-bold">{userData.fullname}</h1>
                    <p className="text-blue-100">@{userData.username}</p>
                    <p className="mt-2 text-blue-100">{userData.email}</p>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-900">{userData.fullname}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{userData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium text-gray-900">{userData.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium text-gray-900">{userData.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Account Information</h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">User ID</p>
                        <p className="font-medium text-gray-900">{userData.id || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Username</p>
                        <p className="font-medium text-gray-900">{userData.username}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Status</p>
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <svg className="h-2 w-2 mr-2" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3" />
                          </svg>
                          Active
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="font-medium text-gray-900">{userData.created_on ? dayjs(userData.created_on).format("MMMM D, YYYY") : "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-12 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center">
                    <HiPencilAlt className="h-5 w-5 mr-2" />
                    Edit Profile
                  </button>

                  <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center">
                    <HiLockClosed className="h-5 w-5 mr-2" />
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
