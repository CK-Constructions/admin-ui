import type React from "react";
import { useState, useEffect } from "react";
import { TextField, Button, Typography, Box, Paper, Container, Alert, CircularProgress, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff, Settings } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { loginUser } from "../api";
import { setCredentials } from "../redux/features/authSlice";
import { showNotification, storeAdminCredentials } from "../components/utils/utils";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { TAdminResponse } from "../components/lib/types/common";

// Types (you can move these to a separate types file)
type TLoginBody = {
  username: string;
  password: string;
};

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2DD4BF",
    },
    secondary: {
      main: "#0D9488",
    },
    background: {
      default: "#111827",
      paper: "#1F2937",
    },
    text: {
      primary: "#f5f5f5",
      secondary: "#94a3b8",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.23)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 255, 255, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2DD4BF",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "0.375rem",
        },
      },
    },
  },
});

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TLoginBody>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowUI(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response: TAdminResponse = await loginUser(formData);
      if (response.success) {
        dispatch(setCredentials(response.result));
        storeAdminCredentials(response.result);
        showNotification("success", `Welcome, ${response.result.username}`);
        navigate("/");
      } else {
        setError(response?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login failed", error);
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Loading screen
  if (!showUI) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "background.default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "linear" }}
              style={{
                padding: "16px",
                borderRadius: "50%",
                backgroundColor: "rgba(45, 212, 191, 0.2)",
              }}
            >
              <Settings sx={{ fontSize: 48, color: "#2DD4BF" }} />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Loading...
              </Typography>
            </motion.div>
          </motion.div>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Container maxWidth="sm">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ width: "100%" }}>
            <Paper
              elevation={8}
              sx={{
                bgcolor: "background.paper",
                borderRadius: 2,
                overflow: "hidden",
                p: { xs: 3, sm: 4 },
              }}
            >
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}
                >
                  <Box
                    sx={{
                      width: { xs: 120, sm: 160 },
                      height: { xs: 120, sm: 160 },
                      position: "relative",
                    }}
                  >
                    <img src="/logo.png" alt="Tomthin Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </Box>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                    Tomthin Admin Login
                  </Typography>
                </motion.div>
              </Box>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                  <TextField
                    fullWidth
                    id="username"
                    name="username"
                    label="Username"
                    value={formData.username}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    disabled={isLoading}
                    placeholder="Enter your username"
                    sx={{ mb: 2 }}
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                  <TextField
                    fullWidth
                    id="password"
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    disabled={isLoading}
                    placeholder="Enter your password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton aria-label="toggle password visibility" onClick={handleTogglePassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ marginBottom: "16px" }}
                    >
                      <Alert severity="error" sx={{ bgcolor: "rgba(211, 47, 47, 0.15)" }}>
                        {error}
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} style={{ marginTop: "16px" }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      bgcolor: "#2DD4BF",
                      color: "white",
                      py: 1.5,
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: "#0D9488",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                      },
                      "&:active": {
                        transform: "translateY(0)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isLoading ? (
                      <>
                        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>

                  <Button
                    fullWidth
                    variant="text"
                    disabled={isLoading}
                    sx={{
                      color: "text.secondary",
                      mt: 2,
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.05)",
                        color: "text.primary",
                      },
                    }}
                  >
                    Forgot Password?
                  </Button>
                </motion.div>
              </Box>
            </Paper>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ textAlign: "center", marginTop: "24px" }}>
              <Typography variant="body2" color="text.secondary">
                Secure admin access for Tomthin platform
              </Typography>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
