import React, { useState } from "react";
import { AiOutlineArrowLeft, AiOutlineReload } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import { TbReload } from "react-icons/tb";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@mui/material";
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

const Header: React.FC<HeaderProps> = ({
  buttonFunc,
  buttonTitle,
  onBackClick,
  onReloadClick,
  pageName,
  showBackButton = true,
  showReloadButton = true,
  showButton = false,
}) => {
  const location = useLocation();
  const title = routeTitles[location.pathname] || "Page 404";
  const [isRotating, setIsRotating] = useState(false);

  const handleReloadClick = () => {
    setIsRotating(true);
    setTimeout(() => {
      setIsRotating(false);
    }, 1000);
    onReloadClick?.();
  };

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
      {showButton && (
        <Button onClick={buttonFunc} variant="outlined">
          {buttonTitle || "Add"}
        </Button>
      )}
    </div>
  );
};

export default Header;
