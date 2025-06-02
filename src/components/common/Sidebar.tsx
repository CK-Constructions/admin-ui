import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { Box, Divider, Drawer as MuiDrawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, useTheme, styled } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as ListingsIcon,
  Category as CategoryIcon,
  ShoppingCart as BuyersIcon,
  Store as StoreIcon,
  DirectionsCar as CarRentalIcon,
  Build as ServicesIcon,
  CheckCircle as ApprovalIcon,
  ContactSupport as InquiryIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useThemeContext } from "../context/ThemeContext";

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

interface SidebarItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
  width: open ? 250 : 66,
  flexShrink: 0,
  whiteSpace: "nowrap",
  "& .MuiDrawer-paper": {
    width: open ? 250 : 66,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    background: theme.palette.mode === "dark" ? "linear-gradient(180deg, #1e293b 0%, #0f172a 50%, #020617 100%)" : "linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)",
    borderRight: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
        : "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(12px) saturate(180%)",
  },
}));

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle }) => {
  const theme = useTheme();
  const muiTheme = useTheme();
  const { darkMode, toggleDarkMode } = useThemeContext();
  const location = useLocation();
  const navigate = useNavigate();
  const handleProfileNavigate = () => {
    navigate("/profile");
  };
  const sidebarItems: SidebarItem[] = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Users", icon: <PeopleIcon />, path: "/users" },
    { text: "Profile", icon: <PeopleIcon />, path: "/profile" },
    {
      text: "Listings",
      icon: <ListingsIcon />,
      path: "/listings",
    },
    {
      text: "Brands",
      icon: <ListingsIcon />,
      path: "/brands",
    },

    {
      text: "Listing Categories",
      icon: <CategoryIcon />,
      path: "/listing-categories",
    },
    {
      text: "Sub Listing Category",
      icon: <ListingsIcon />,
      path: "/sub-category",
    },
    {
      text: "Rental Categories",
      icon: <CategoryIcon />,
      path: "/rental-categories",
    },
    {
      text: "Service Categories",
      icon: <CategoryIcon />,
      path: "/service-categories",
    },
    {
      text: "Buyers",
      icon: <BuyersIcon />,
      path: "/buyers",
    },
    {
      text: "Vendors",
      icon: <StoreIcon />,
      path: "/vendors",
    },
    {
      text: "Vehicle Rentals",
      icon: <CarRentalIcon />,
      path: "/rentals",
    },
    {
      text: "Services",
      icon: <ServicesIcon />,
      path: "/services",
    },
    {
      text: "Listing Approvals",
      icon: <ApprovalIcon />,
      path: "/listing-approvals",
    },
    {
      text: "Service Approvals",
      icon: <ApprovalIcon />,
      path: "/service-approvals",
    },
    {
      text: "Vehicle Rental Approvals",
      icon: <ApprovalIcon />,
      path: "/rental-approvals",
    },
    {
      text: "CK Inquiries",
      icon: <InquiryIcon />,
      path: "/ck-inquiry",
    },
    {
      text: "TT Inquiries",
      icon: <InquiryIcon />,
      path: "/tomthin-inquiry",
    },
    {
      text: "Settings",
      icon: <SettingsIcon />,
      path: "/settings",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            minHeight: 64,
            alignItems: "center",
            justifyContent: "space-between",
            px: [1],
            backdropFilter: "blur(16px) saturate(180%)",
            backgroundColor: theme.palette.mode === "dark" ? "rgba(15, 23, 42, 0.9)" : "rgba(248, 250, 252, 0.9)",
            borderBottom: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
            boxShadow: theme.palette.mode === "dark" ? "inset 0 -1px 0 rgba(255, 255, 255, 0.05)" : "inset 0 -1px 0 rgba(0, 0, 0, 0.05)",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(90deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.02) 100%)"
                  : "linear-gradient(90deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0.02) 100%)",
              pointerEvents: "none",
            },
          }}
        >
          {open && <div style={{ width: "40px" }}></div>}

          {open && (
            <img
              src="/logo.png"
              alt="Logo"
              style={{
                height: "80px",
                maxWidth: "100%",
                objectFit: "contain",
                filter: theme.palette.mode === "dark" ? "brightness(0.9)" : "none",
              }}
            />
          )}

          <IconButton
            onClick={onToggle}
            sx={{
              color: theme.palette.mode === "dark" ? "#94a3b8" : "#64748b",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              borderRadius: "12px",
              padding: "8px",
              "&:hover": {
                backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                color: theme.palette.mode === "dark" ? "#e2e8f0" : "#475569",
                transform: "scale(1.05)",
                boxShadow: theme.palette.mode === "dark" ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.1)",
              },
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Toolbar>
        <Divider
          sx={{
            opacity: 0.5,
            borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          }}
        />
        <List>
          {sidebarItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <motion.div
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
                whileTap={{
                  scale: 0.98,
                  transition: { duration: 0.1 },
                }}
                style={{
                  borderRadius: 12,
                  margin: "2px 8px",
                }}
              >
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    borderRadius: "12px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(90deg, transparent 0%, rgba(255, 133, 0, 0.1) 50%, transparent 100%)",
                      transform: "translateX(-100%)",
                      transition: "transform 0.6s ease",
                    },
                    "&:hover": {
                      backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                      transform: "translateX(4px)",
                      boxShadow: theme.palette.mode === "dark" ? "0 4px 12px rgba(0, 0, 0, 0.2)" : "0 4px 12px rgba(0, 0, 0, 0.08)",
                      "&::before": {
                        transform: "translateX(0)",
                      },
                    },
                    "&.Mui-selected": {
                      backgroundColor: "rgba(255, 133, 0, 0.15)",
                      boxShadow: theme.palette.mode === "dark" ? "0 4px 12px rgba(255, 133, 0, 0.2)" : "0 4px 12px rgba(255, 133, 0, 0.15)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 133, 0, 0.2)",
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        right: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "3px",
                        height: "60%",
                        background: "linear-gradient(180deg, #ff8500 0%, #088194 100%)",
                        borderRadius: "2px 0 0 2px",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: location.pathname === item.path ? "#ff8500" : theme.palette.mode === "dark" ? "#94a3b8" : "#64748b",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: open ? 1 : 0,
                      color: location.pathname === item.path ? "#088194" : theme.palette.mode === "dark" ? "#e2e8f0" : "#334155",
                      "& .MuiTypography-root": {
                        fontWeight: location.pathname === item.path ? 500 : 400,
                      },
                      transition: "opacity 0.3s ease, color 0.2s ease",
                    }}
                  />
                </ListItemButton>
              </motion.div>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
