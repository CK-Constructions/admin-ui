import React, { useState } from "react";
import { AiOutlineArrowLeft, AiOutlineReload } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import { TbReload } from "react-icons/tb";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@mui/material";
import { useGetQuery } from "../../query/hooks/queryHook";
import { queryConfigs } from "../../query/queryConfig";
import { useSelector } from "react-redux";
import { selectCurrentAuth } from "../../redux/features/authSlice";
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
          <button onClick={handleProfileNavigate} className="flex items-center space-x-2 focus:outline-none">
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">{auth?.user?.fullname.charAt(0)}</div>
            {/* <span className="text-gray-700">{profileData?.result.username}</span> */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
