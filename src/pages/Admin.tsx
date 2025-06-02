import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import AnimatedRoute from "../components/common/AnimatedRoute";

import OrdersAnalyticsPage from "../components/orders/OrdersAnalyticsPage";
import Listings from "../components/listings/Listings";
import Vendors from "../components/vendors/Vendors";
import PageNotFound from "./PageNotFound";
import Buyers from "../components/buyers/Buyers";
import Users from "../components/users/Users";
import ListingDetailPage from "../components/listings/ListingDetailPage";
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
import Brands from "../components/brands/Brands";
import SubCategory from "../components/subCategory/SubCategory";
import BrandImages from "../components/brands/BrandImages";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
          <Route
            path="/"
            element={
              <AnimatedRoute>
                <ThemedDashboard />
              </AnimatedRoute>
            }
          />
          <Route
            path="*"
            element={
              <AnimatedRoute>
                <PageNotFound />
              </AnimatedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <AnimatedRoute>
                <Users />
              </AnimatedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <AnimatedRoute>
                <ProfilePage />
              </AnimatedRoute>
            }
          />
          <Route
            path="/sub-category"
            element={
              <AnimatedRoute>
                <SubCategory />
              </AnimatedRoute>
            }
          />
          <Route
            path="/brands"
            element={
              <AnimatedRoute>
                <Brands />
              </AnimatedRoute>
            }
          />
          <Route
            path="/brands/images/:id"
            element={
              <AnimatedRoute>
                <BrandImages />
              </AnimatedRoute>
            }
          />
          <Route
            path="/listing-categories"
            element={
              <AnimatedRoute>
                <ListingCategory />
              </AnimatedRoute>
            }
          />
          <Route
            path="/rental-categories"
            element={
              <AnimatedRoute>
                <RentalCategory />
              </AnimatedRoute>
            }
          />
          <Route
            path="/service-categories"
            element={
              <AnimatedRoute>
                <ServiceCategory />
              </AnimatedRoute>
            }
          />
          <Route
            path="/rental-approvals"
            element={
              <AnimatedRoute>
                <RentalApproval />
              </AnimatedRoute>
            }
          />
          <Route
            path="/service-approvals"
            element={
              <AnimatedRoute>
                <ServiceApproval />
              </AnimatedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <AnimatedRoute>
                <Services />
              </AnimatedRoute>
            }
          />
          <Route
            path="/services/:id"
            element={
              <AnimatedRoute>
                <ServiceDetails />
              </AnimatedRoute>
            }
          />
          <Route
            path="/rental-approvals/:id"
            element={
              <AnimatedRoute>
                <RentalApprovalDetails />
              </AnimatedRoute>
            }
          />
          <Route
            path="/rentals"
            element={
              <AnimatedRoute>
                <Rentals />
              </AnimatedRoute>
            }
          />
          <Route
            path="/rentals/:id"
            element={
              <AnimatedRoute>
                <RentalView />
              </AnimatedRoute>
            }
          />
          <Route
            path="/orders-analytics"
            element={
              <AnimatedRoute>
                <OrdersAnalyticsPage />
              </AnimatedRoute>
            }
          />
          <Route
            path="/listings"
            element={
              <AnimatedRoute>
                <Listings />
              </AnimatedRoute>
            }
          />
          <Route
            path="/add-listing"
            element={
              <AnimatedRoute>
                <AddListing />
              </AnimatedRoute>
            }
          />
          <Route
            path="/listings/:id"
            element={
              <AnimatedRoute>
                <ListingDetailPage />
              </AnimatedRoute>
            }
          />
          <Route
            path="/buyers"
            element={
              <AnimatedRoute>
                <Buyers />
              </AnimatedRoute>
            }
          />
          <Route
            path="/vendors"
            element={
              <AnimatedRoute>
                <Vendors />
              </AnimatedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <AnimatedRoute>
                <Settings />
              </AnimatedRoute>
            }
          />
          <Route
            path="/ck-inquiry"
            element={
              <AnimatedRoute>
                <CkInquiry />
              </AnimatedRoute>
            }
          />
          <Route
            path="/tomthin-inquiry"
            element={
              <AnimatedRoute>
                <TomthinInquiry />
              </AnimatedRoute>
            }
          />
          <Route
            path="/listing-approvals"
            element={
              <AnimatedRoute>
                <Approval />
              </AnimatedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
