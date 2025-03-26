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
    },
}));

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle }) => {
    const theme = useTheme();
    const location = useLocation();

    const sidebarItems: SidebarItem[] = [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
        { text: "Users", icon: <PeopleIcon />, path: "/users" },
        {
            text: "Orders & Analytics",
            icon: <AssessmentIcon />,
            path: "/orders-analytics",
        },
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
            path: "/approvals",
        },
        {
            text: "Settings",
            icon: <SettingsIcon />,
            path: "/settings",
        },
    ];

    return (
        <Box sx={{ display: "flex", bgcolor: "#111827" }}>
            <Drawer variant="permanent" open={open}>
                <Toolbar
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        px: [1],
                    }}
                >
                    <IconButton onClick={onToggle}>{open ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
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
