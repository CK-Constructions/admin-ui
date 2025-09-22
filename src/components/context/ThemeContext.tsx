import { createContext, useContext, ReactNode, useMemo } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import useDarkMode from "../common/useDarkMode";

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          background: {
            default: darkMode ? "#121212" : "#f5f5f5",
            paper: darkMode ? "#1e1e1e" : "#ffffff",
          },
          text: {
            primary: darkMode ? "#ffffff" : "rgba(0, 0, 0, 0.87)",
            secondary: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
          },
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: darkMode ? "#1e1e1e" : "#3f51b5",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                // White text in dark mode
                color: darkMode ? "#ffffff" : "inherit",
                // White border in dark mode for outlined buttons
                borderColor: darkMode ? "#ffffff" : "currentColor",
                "&:hover": {
                  borderColor: darkMode ? "#ffffff" : "currentColor",
                  backgroundColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                },
              },
              // Specific styles for outlined buttons
              outlined: {
                border: darkMode ? "1px solid #ffffff" : "1px solid currentColor",
              },
            },
            variants: [
              {
                props: { variant: "outlined" },
                style: {
                  border: darkMode ? "1px solid #ffffff" : "1px solid currentColor",
                },
              },
            ],
          },
          // Also style IconButton for consistency
          MuiIconButton: {
            styleOverrides: {
              root: {
                color: darkMode ? "#ffffff" : "inherit",
                "&:hover": {
                  backgroundColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                },
              },
            },
          },
        },
      }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
