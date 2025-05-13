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
          <Route path="/" element={<ThemedDashboard />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/users" element={<Users />} />
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
