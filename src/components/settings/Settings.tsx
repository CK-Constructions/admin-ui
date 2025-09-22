// SettingsPage.tsx
import React from "react";
import DarkModeToggle from "../common/DarkModeToggle";
import { useThemeContext } from "../context/ThemeContext";

const SettingsPage = () => {
  const { darkMode, toggleDarkMode } = useThemeContext();

  return (
    <div className="">
      <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </div>
  );
};

export default SettingsPage;
