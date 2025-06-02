import React, { MouseEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TbReload } from "react-icons/tb";
import { FaArrowLeft } from "react-icons/fa";
import { Avatar, Button, IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentAuth } from "../../redux/features/authSlice";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { logoutUser } from "../../api";
import { showNotification } from "../utils/utils";
interface RouteTitles {
  [key: string]: string;
}
const routeTitles: RouteTitles = {
  "/": "Dashboard",
  "/users": "Users",
  "/orders-analytics": "Orders Analytics",
  "/listings": "Listings",
  "/listings/:id": "Listing Detail",
  "/buyers": "Buyers",
  "/vendors": "Vendors",
};
interface HeaderProps {
  buttonTitle?: string;
  onBackClick?: () => void;
  buttonFunc?: () => void;
  onReloadClick?: () => void;
  showBackButton?: boolean;
  showReloadButton?: boolean;
  showButton?: boolean;
  pageName?: string;
}
const Header: React.FC<HeaderProps> = ({ buttonFunc, buttonTitle, onBackClick, onReloadClick, pageName, showBackButton = true, showReloadButton = true, showButton = false }) => {
  const location = useLocation();
  const title = routeTitles[location.pathname] || "Page 404";
  const [isRotating, setIsRotating] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
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
  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogoutClick = () => {
    handleMenuClose();
    handleLogout();
  };
  const handleLogout = () => {
    logoutSeller();
  };
  const navigate = useNavigate();
  const handleProfileNavigate = () => {
    navigate("/profile");
  };
  const handleReloadClick = () => {
    setIsRotating(true);
    setTimeout(() => {
      setIsRotating(false);
    }, 1000);
    onReloadClick?.();
  };
  const auth = useSelector(selectCurrentAuth);
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200">
      <div className="flex items-center">
        {showBackButton && (
          <button className="mr-4" onClick={onBackClick}>
            <FaArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-lg text-black dark:text-white font-bold">{pageName ? pageName : title}</h1>
        {showReloadButton && (
          <button className="ml-4" onClick={handleReloadClick}>
            <TbReload
              size={24}
              className="font-bold"
              style={{
                transition: "transform 1s",
                transform: isRotating ? "rotate(360deg)" : "rotate(0deg)",
              }}
            />
          </button>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {showButton && (
          <Button onClick={buttonFunc} variant="outlined">
            {buttonTitle || "Add"}
          </Button>
        )}
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
        <div className="relative">
          <div>
            <IconButton onClick={handleMenuOpen} size="small">
              <Avatar sx={{ bgcolor: "#6366f1", width: 32, height: 32 }}>{auth?.user?.fullname?.charAt(0) ?? "?"}</Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: { mt: 1.5 },
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleProfileNavigate}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogoutClick}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
