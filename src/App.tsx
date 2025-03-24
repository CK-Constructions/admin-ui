import React from "react";
import { Route, Routes } from "react-router";
import PrivateRoute from "./components/common/PrivateRoute";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";

const App = () => {
    return (
        <div>
            <Routes>
                {/* <Route element={<PrivateRoute />}> */}
                <Route path="/*" element={<Admin />} />
                {/* </Route> */}
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </div>
    );
};

export default App;
