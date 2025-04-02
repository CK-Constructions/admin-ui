import {
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import { JSX, useEffect, useState } from "react";

import Admin from "./pages/Admin";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import PrivateRoute from "./components/common/PrivateRoute";
import { useDispatch } from "react-redux";
import { getStoredAdminCredentials } from "./components/utils/utils";
import { setCredentials } from "./redux/features/authSlice";
// Make sure to import your types

function App(): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authData = getStoredAdminCredentials();

        if (authData?.token) {
          dispatch(setCredentials(authData));

          // If on login page, redirect to home or intended path
          if (location.pathname === "/login") {
            const redirectPath =
              location.state?.from?.pathname || "/";
            navigate(redirectPath, { replace: true });
          }
        } else {
          // If not authenticated and not on login page, redirect to login
          if (location.pathname !== "/login") {
            navigate("/login", {
              state: { from: location },
              replace: true,
            });
          }
        }
      } catch (error) {
        console.error(
          "Authentication check failed:",
          error
        );
        navigate("/login", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [dispatch, navigate, location]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/*" element={<Admin />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
