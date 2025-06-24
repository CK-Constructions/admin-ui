// DarkModeToggle.tsx
import React from "react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Switch } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

interface DarkModeToggleProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeToggle = ({ darkMode, toggleDarkMode }: DarkModeToggleProps) => {
  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton
        onClick={toggleDarkMode}
        sx={{
          borderRadius: 1,
          mx: 1,
          my: 0.5,
        }}
      >
        <ListItemIcon>{darkMode ? <Brightness7 /> : <Brightness4 />}</ListItemIcon>
        <ListItemText primary={darkMode ? "Light Mode" : "Dark Mode"} />
        <Switch edge="end" checked={darkMode} onChange={toggleDarkMode} inputProps={{ "aria-label": "toggle dark mode" }} />
      </ListItemButton>
    </ListItem>
  );
};

export default DarkModeToggle;
