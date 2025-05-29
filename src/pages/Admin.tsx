import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

import OrdersAnalyticsPage from "../components/orders/OrdersAnalyticsPage";
import Listings from "../components/listings/Listings";

import Vendors from "../components/vendors/Vendors";
import PageNotFound from "./PageNotFound";
import Buyers from "../components/buyers/Buyers";
import Users from "../components/users/Users";
import ListingDetailPage from "../components/listings/ListingDetailPage";
import Header from "../components/common/Header";
import AddListing from "../components/listings/AddListing";
import Approval from "../components/approval/Approval";
import Settings from "../components/settings/Settings";
import ThemedDashboard from "../components/Dashboard";
import CkInquiry from "../components/inquiry/ckinquiry/CkInquiry";
import TomthinInquiry from "../components/inquiry/tomthininquiry/TomthinInquiry";
import Rentals from "../components/rentals/Rentals";
import RentalView from "../components/rentals/RentailView";
import RentalApproval from "../components/rentalapprovals/RentalApprovals";
import RentalApprovalDetails from "../components/rentalapprovals/RentalApprovalDetails";
import ServiceApproval from "../components/serviceapproval/ServiceApproval";
import Services from "../components/services/Services";
import ServiceDetails from "../components/services/ServiceDetails";
import ServiceCategory from "../components/services/ServiceCategory";
import RentalCategory from "../components/rentals/RentalCategory";
import ListingCategory from "../components/listings/ListingCategory";
import { queryConfigs } from "../query/queryConfig";
import { useMutationQuery } from "../query/hooks/queryHook";
import { showNotification } from "../components/utils/utils";
import { useDispatch } from "react-redux";
import { logOut } from "../redux/features/authSlice";
import { logoutUser } from "../api";
import ProfilePage from "../components/profile/ProfilePage";

const App = () => {
  const dispatch = useDispatch();
  const logoutSeller = async () => {
    try {
      const response = await logoutUser();
      if (response.success) {
        showNotification("success", "Logged Out Successfully");
        dispatch(logOut());
      } else {
        showNotification("success", "Logged Out Successfully");
        dispatch(logOut());
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { queryFn: logout, queryKey: logoutKey } = queryConfigs.useLogoutUser;
  const { mutate: useLogout } = useMutationQuery({
    func: logout,
    key: logoutKey,
    onSuccess: () => {
      showNotification("success", "Logged Out Successfully");
      dispatch(logOut());
    },
  });
  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div
      className="grid grid-flow-col h-screen w-full"
      style={{
        gridTemplateColumns: sidebarOpen ? "240px 1fr" : "56px 1fr",
        transition: "grid-template-columns 225ms cubic-bezier(0.4, 0, 0.6, 1)",
      }}
    >
      <Sidebar open={sidebarOpen} onToggle={handleDrawerToggle} />
      <main className="p-5 overflow-auto h-full bg-gray-100 dark:bg-gray-900">
        <Routes>
          <Route path="/" element={<ThemedDashboard />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/users" element={<Users />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/listing-categories" element={<ListingCategory />} />
          <Route path="/rental-categories" element={<RentalCategory />} />
          <Route path="/service-categories" element={<ServiceCategory />} />
          <Route path="/rental-approvals" element={<RentalApproval />} />
          <Route path="/service-approvals" element={<ServiceApproval />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/rental-approvals/:id" element={<RentalApprovalDetails />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/rentals/:id" element={<RentalView />} />
          <Route path="/orders-analytics" element={<OrdersAnalyticsPage />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/add-listing" element={<AddListing />} />
          <Route path="/listings/:id" element={<ListingDetailPage />} />
          <Route path="/buyers" element={<Buyers />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/ck-inquiry" element={<CkInquiry />} />
          <Route path="/tomthin-inquiry" element={<TomthinInquiry />} />
          {/* <Route path="/vendor-verification" element={<VendorVerification />} /> */}
          <Route path="/listing-approvals" element={<Approval />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
