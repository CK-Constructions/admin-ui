import React from "react";
import Sidebar from "../components/common/Sidebar";
import { Route, Routes } from "react-router";
import Dashboard from "../components/Dashboard";
import { Users } from "../components/users/Users";

const Admin = () => {
    return (
        <div className="flex items-center  w-full h-full">
            <Sidebar />
            <main className="p-5">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/users" element={<Users />} />
                    {/* <Route path="/orders-analytics" element={<OrdersAnalyticsPage />} />
                    <Route path="/listings" element={<ListingsPage />} />
                    <Route path="/buyers" element={<BuyersPage />} />
                    <Route path="/sellers" element={<SellersPage />} />
                    <Route path="/approvals" element={<ApprovalsPage />} />
                    <Route path="/settings" element={<SettingsPage />} /> */}
                </Routes>
            </main>
        </div>
    );
};

export default Admin;
