import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { FaAdjust } from "react-icons/fa";
import { TLoginBody } from "../components/lib/types/payloads";
import { loginUser } from "../api";

import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/features/authSlice";
import { TAdminResponse } from "../components/lib/types/common";
import {
  showNotification,
  storeAdminCredentials,
} from "../components/utils/utils";
import { useNavigate } from "react-router";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error when user types
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
      const response: TAdminResponse = await loginUser(
        formData
      );
      if (response.success) {
        dispatch(setCredentials(response.result));
        storeAdminCredentials(response.result); // Store in localStorage
        showNotification(
          "success",
          `Welcome, ${response.result.username}`
        );
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

  return (
    <div className="bg-[#111827] flex items-center justify-center w-full h-[100vh]">
      <section className="w-[700px] bg-[#1F2937] rounded-xl p-12 h-[80vh] text-center shadow-2xl">
        <form onSubmit={handleSubmit}>
          <div>
            <div className="flex items-center justify-center mb-10">
              <FaAdjust
                size={120}
                className="text-white text-center"
              />
            </div>
            <Typography
              variant="h5"
              fontWeight="bold"
              color="primary"
              sx={{
                color: "white",
              }}
              gutterBottom
            >
              Admin Login
            </Typography>
            <TextField
              label="Username"
              name="username"
              fullWidth
              margin="normal"
              variant="outlined"
              value={formData.username}
              onChange={handleChange}
              sx={{
                borderRadius: 2,
                "& .MuiOutlinedInput-input": {
                  color: "#f5f5f5",
                },
                "& .MuiInputLabel-root": {
                  color: "white",
                  "&.Mui-focused": {
                    color: "white",
                  },
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
              }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              sx={{
                borderRadius: 2,
                "& .MuiOutlinedInput-input": {
                  color: "#f5f5f5",
                },
                "& .MuiInputLabel-root": {
                  color: "white",
                  "&.Mui-focused": {
                    color: "white",
                  },
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
              }}
            />
            {error && (
              <Typography
                color="error"
                sx={{ marginTop: 1 }}
              >
                {error}
              </Typography>
            )}
            <Box sx={{ mb: 4 }} />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                bgcolor: bgColor,
                color: "white",
                marginTop: 2,
                borderRadius: 2,
                fontWeight: "bold",
                textTransform: "none",
                padding: "12px 0",
                fontSize: "1rem",
                "&:hover": {
                  bgcolor: hoverBgColor,
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
                transition: "all 0.2s ease",
              }}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <Button
              variant="text"
              fullWidth
              sx={{
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
              }}
            >
              Forgot Password?
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Login;
