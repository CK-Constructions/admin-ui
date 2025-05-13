import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { FaAdjust } from "react-icons/fa";
import { TLoginBody } from "../components/lib/types/payloads";
import { loginUser } from "../api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/features/authSlice";
import { TAdminResponse } from "../components/lib/types/common";
import { showNotification, storeAdminCredentials } from "../components/utils/utils";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

const bgColor = "#2DD4BF";
const hoverBgColor = "#0D9488";

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowUI(true);
    }, 3000); // Simulate loading delay (1 second)
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

  if (!showUI) {
    return (
      <motion.div
        className="bg-[#111827] flex items-center justify-center w-full h-[100vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
          <FaAdjust size={80} color="#2DD4BF" />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="bg-[#111827] flex items-center justify-center w-full h-[100vh]">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-[700px] bg-[#1F2937] rounded-xl p-12 h-[80vh] text-center shadow-2xl"
      >
        <form onSubmit={handleSubmit}>
          <div>
            <div className="flex items-center justify-center mb-10">
              <FaAdjust size={120} className="text-white text-center" />
            </div>
            <Typography variant="h5" fontWeight="bold" sx={{ color: "white" }} gutterBottom>
              Admin Login
            </Typography>

            {/* Username */}
            <TextField
              label="Username"
              name="username"
              fullWidth
              margin="normal"
              variant="outlined"
              value={formData.username}
              onChange={handleChange}
              sx={textFieldStyle}
            />

            {/* Password */}
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              sx={textFieldStyle}
            />

            {/* Error */}
            {error && (
              <Typography color="error" sx={{ marginTop: 1 }}>
                {error}
              </Typography>
            )}

            <Box sx={{ mb: 4 }} />

            {/* Login Button */}
            <Button type="submit" variant="contained" fullWidth disabled={isLoading} sx={loginButtonStyle}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            {/* Forgot Password */}
            <Button variant="text" fullWidth sx={forgotButtonStyle}>
              Forgot Password?
            </Button>
          </div>
        </form>
      </motion.section>
    </div>
  );
};

// MUI Styles
const textFieldStyle = {
  borderRadius: 2,
  "& .MuiOutlinedInput-input": { color: "#f5f5f5" },
  "& .MuiInputLabel-root": {
    color: "white",
    "&.Mui-focused": { color: "white" },
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "white" },
    "&:hover fieldset": { borderColor: "white" },
    "&.Mui-focused fieldset": { borderColor: "white" },
  },
};

const loginButtonStyle = {
  bgcolor: "#2DD4BF",
  color: "white",
  marginTop: 2,
  borderRadius: 2,
  fontWeight: "bold",
  textTransform: "none",
  padding: "12px 0",
  fontSize: "1rem",
  "&:hover": {
    bgcolor: "#0D9488",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
  transition: "all 0.2s ease",
};

const forgotButtonStyle = {
  color: "white",
  marginTop: 2,
  borderRadius: 2,
  fontWeight: "bold",
  textTransform: "none",
  padding: "12px 0",
  fontSize: "1rem",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
};

export default Login;
