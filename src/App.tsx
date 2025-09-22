import { Route, Routes, useLocation, useNavigate } from "react-router";
import { JSX, useEffect, useState } from "react";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import PrivateRoute from "./components/common/PrivateRoute";
import { useDispatch } from "react-redux";
import { getStoredAdminCredentials } from "./components/utils/utils";
import { setCredentials } from "./redux/features/authSlice";
import { ThemeProvider, useThemeContext } from "./components/context/ThemeContext";
import Loading from "./components/common/Loader";
interface AppProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}
const App: React.FC<AppProps> = ({ darkMode, toggleDarkMode }) => {
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
          if (location.pathname === "/login") {
            const redirectPath = location.state?.from?.pathname || "/";
            navigate(redirectPath, { replace: true });
          }
        } else {
          if (location.pathname !== "/login") {
            navigate("/login", {
              state: { from: location },
              replace: true,
            });
          }
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        navigate("/login", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [dispatch, navigate, location]);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <ThemeProvider>
      <div className="min-h-screen dark:bg-[#1e1e1e] text-gray-900 dark:text-white transition-colors duration-200">
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/*" element={<Admin />} />
            {}
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
};
export default App;
