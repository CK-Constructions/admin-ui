import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    styled,
    Theme,
    Toolbar,
    useTheme,
} from "@mui/material";
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    ShoppingCart as ShoppingCartIcon,
    Settings as SettingsIcon,
    Assessment as AssessmentIcon,
    ListAlt as ListAltIcon,
    Person as PersonIcon,
    Store as StoreIcon,
    HowToReg as ApprovalIcon,
} from "@mui/icons-material";

// Define the type for sidebar items
interface SidebarItem {
    text: string;
    icon: React.ReactNode;
    path: string;
}

const drawerWidth = 240;

const Sidebar: React.FC = () => {
    const theme = useTheme();
    const location = useLocation();
    const [open, setOpen] = useState(true);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const sidebarItems: SidebarItem[] = [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
        { text: "Users", icon: <PeopleIcon />, path: "/users" },
        {
            text: "Orders & Analytics",
            icon: <AssessmentIcon />, // Analytics icon
            path: "/orders-analytics",
        },
        {
            text: "Listings",
            icon: <ListAltIcon />, // List icon
            path: "/listings",
        },
        {
            text: "Buyers",
            icon: <PersonIcon />, // Single person icon
            path: "/buyers",
        },
        {
            text: "Vendors",
            icon: <StoreIcon />, // Store/shop icon
            path: "/sellers",
        },
        {
            text: "Approvals",
            icon: <ApprovalIcon />, // Checkmark/approval icon
            path: "/approvals",
        },
        {
            text: "PromoCodes",
            icon: <ApprovalIcon />, // Checkmark/approval icon
            path: "/promo-codes",
        },
        {
            text: "Settings",
            icon: <SettingsIcon />,
            path: "/settings",
        },
    ];

    return (
        <Box sx={{ display: "flex" }}>
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    width: open ? drawerWidth : theme.spacing(7),
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                    boxSizing: "border-box",
                    "& .MuiDrawer-paper": {
                        width: open ? drawerWidth : theme.spacing(7),
                        transition: theme.transitions.create("width", {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                        overflowX: "hidden",
                        backgroundColor: theme.palette.background.default,
                    },
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        px: [1],
                    }}
                >
                    <IconButton onClick={handleDrawerToggle}>{open ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
                </Toolbar>
                <Divider />
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
                                        backgroundColor: theme.palette.action.selected,
                                        "&:hover": {
                                            backgroundColor: theme.palette.action.selected,
                                        },
                                    },
                                    borderRadius: 1,
                                    mx: 1,
                                    my: 0.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{
                                        opacity: open ? 1 : 0,
                                        color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.primary,
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
