import {
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentAuth } from "../../redux/features/authSlice";

const PrivateRoute = () => {
  const auth = useSelector(selectCurrentAuth);
  const location = useLocation();

  return auth?.token ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      state={{ from: location }}
      replace
    />
  );
};
export default PrivateRoute;
