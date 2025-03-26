import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import { Dashboard } from "@mui/icons-material";
import Users from "../components/users/Users";
import OrdersAnalyticsPage from "../components/orders/OrdersAnalyticsPage";
import Listings from "../components/listings/Listings";
import Buyer from "../components/buyers/Buyer";
import Vendors from "../components/vendors/Vendors";
import PageNotFound from "./PageNotFound";

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
            <main className="p-5 overflow-auto h-full">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="*" element={<PageNotFound />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/orders-analytics" element={<OrdersAnalyticsPage />} />
                    <Route path="/listings" element={<Listings />} />
                    <Route path="/buyers" element={<Buyer />} />
                    <Route path="/vendors" element={<Vendors />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;
