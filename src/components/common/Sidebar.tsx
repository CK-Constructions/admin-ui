import React from "react";
import { Link, useLocation } from "react-router-dom";
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
  Theme,
  Toolbar,
  useTheme,
  styled,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
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
            <ListItem
              key={item.text}
              disablePadding
              sx={{
                display: "block",
                "& .MuiListItemButton-root": {
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                },
                "& .MuiListItemIcon-root": {
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                },
              }}
            >
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                    "&:hover": {
                      backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
                    },
                  },
                  "&:hover": {
                    backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
                  },
                  borderRadius: 1,
                  mx: 1,
                  my: 0.5,
                  transition: "all 0.2s ease",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.mode === "dark" ? "#94a3b8" : "#64748b",
                    transition: "color 0.2s ease",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: open ? 1 : 0,
                    color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.mode === "dark" ? "#e2e8f0" : "#334155",
                    "& .MuiTypography-root": {
                      fontWeight: location.pathname === item.path ? 500 : 400,
                    },
                    transition: "opacity 0.3s ease, color 0.2s ease",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
