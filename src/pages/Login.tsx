import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";

import { FaAdjust } from "react-icons/fa";
interface LoginForm {
    username: string;
    password: string;
}
const bgColor = "#2DD4BF";
const Login: React.FC = () => {
    const [formData, setFormData] = useState<LoginForm>({ username: "", password: "" });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = () => {
        if (formData.username === "admin" && formData.password === "password") {
            alert("Login successful!");
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="bg-[#111827] flex  items-center justify-center w-full h-[100vh]">
            <section className="w-[700px] bg-[#1F2937] rounded-xl p-12   h-[80vh] text-center shadow-2xl">
                <div>
                    <div className="flex items-center justify-center mb-10">
                        <FaAdjust size={120} className="text-white text-center" />
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
                        <Typography color="error" sx={{ marginTop: 1 }}>
                            {error}
                        </Typography>
                    )}
                    <div className="mb-12"></div>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleLogin}
                        sx={{
                            bgcolor: bgColor,
                            color: "white",
                            marginTop: 2,
                            borderRadius: 2,
                            fontWeight: "bold",
                            textTransform: "none",
                            padding: "10px 0",
                            background: `linear-gradient(45deg, ${bgColor}, ${bgColor})`,
                            "&:hover": { background: `linear-gradient(45deg, ${bgColor}, ${bgColor})` },
                        }}
                    >
                        Login
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleLogin}
                        sx={{
                            bgcolor: bgColor,
                            color: "white",
                            marginTop: 2,
                            borderRadius: 2,
                            fontWeight: "bold",
                            textTransform: "none",
                            padding: "10px 0",
                            background: `linear-gradient(45deg, ${bgColor}, ${bgColor})`,
                            "&:hover": { background: `linear-gradient(45deg, ${bgColor}, ${bgColor})` },
                        }}
                    >
                        Forgot Password
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default Login;
