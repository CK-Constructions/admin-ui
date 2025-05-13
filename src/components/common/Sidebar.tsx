import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Box,
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
  styled,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ListAlt as ListAltIcon,
  Person as PersonIcon,
  Store as StoreIcon,
  HowToReg as ApprovalIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
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

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
  width: open ? 240 : 56,
  flexShrink: 0,
  whiteSpace: "nowrap",
  "& .MuiDrawer-paper": {
    width: open ? 240 : 56,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    // Add the cooling neutral gradient background
    background:
      theme.palette.mode === "dark" ? "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)" : "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
    // Add a subtle border on the right side
    borderRight: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"}`,
    // Add a subtle shadow for depth
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)"
        : "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
  },
}));

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle }) => {
  const theme = useTheme();
  const muiTheme = useTheme(); // MUI theme hook
  const { darkMode, toggleDarkMode } = useThemeContext(); // Our custom context
  const location = useLocation();

  const sidebarItems: SidebarItem[] = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Users", icon: <PeopleIcon />, path: "/users" },
    // {
    //   text: "Orders & Analytics",
    //   icon: <AssessmentIcon />,
    //   path: "/orders-analytics",
    // },
    {
      text: "Listings",
      icon: <ListAltIcon />,
      path: "/listings",
    },
    {
      text: "Buyers",
      icon: <PersonIcon />,
      path: "/buyers",
    },
    {
      text: "Vendors",
      icon: <StoreIcon />,
      path: "/vendors",
    },
    {
      text: "Approvals",
      icon: <ApprovalIcon />,
      path: "/listing-approvals",
    },
    {
      text: "CK Inquiries",
      icon: <ApprovalIcon />,
      path: "/ck-inquiry",
    },
    {
      text: "TT Inquiries",
      icon: <ApprovalIcon />,
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
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
            // Add a glass-like effect to the toolbar
            backdropFilter: "blur(8px)",
            backgroundColor: theme.palette.mode === "dark" ? "rgba(15, 23, 42, 0.8)" : "rgba(248, 250, 252, 0.8)",
            borderBottom: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"}`,
          }}
        >
          <IconButton
            onClick={onToggle}
            sx={{
              color: theme.palette.mode === "dark" ? "#94a3b8" : "#64748b",
              "&:hover": {
                backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
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
                  backgroundColor: open ? "rgba(255, 133, 0, 0.1)" : "rgba(8, 129, 148, 0.1)",
                  transition: { duration: 0.3 },
                }}
                style={{ borderRadius: 8 }}
              >
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    mx: 1,
                    my: 0.5,
                    transition: "all 0.2s ease",
                    "&.Mui-selected": {
                      backgroundColor: "rgba(255, 133, 0, 0.2)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 133, 0, 0.25)",
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
