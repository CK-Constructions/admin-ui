import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Container } from "@mui/material";

// Define types for login form state
interface LoginForm {
    username: string;
    password: string;
}

const Login: React.FC = () => {
    const [formData, setFormData] = useState<LoginForm>({ username: "", password: "" });
    const [error, setError] = useState<string | null>(null);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Simulated login function
    const handleLogin = () => {
        if (formData.username === "admin" && formData.password === "password") {
            alert("Login successful!");
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="bg-[#171717] flex  items-center justify-center w-full h-[100vh]">
            <Card
                sx={{
                    width: 400,
                    padding: 3,
                    textAlign: "center",
                    backgroundColor: "#ffffff",
                    borderRadius: 4,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    transition: "0.3s",
                    "&:hover": { boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)" },
                }}
            >
                <CardContent>
                    <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
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
                        sx={{ borderRadius: 2 }}
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
                        sx={{ borderRadius: 2 }}
                    />
                    {error && (
                        <Typography color="error" sx={{ marginTop: 1 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleLogin}
                        sx={{
                            marginTop: 2,
                            borderRadius: 2,
                            fontWeight: "bold",
                            textTransform: "none",
                            padding: "10px 0",
                            background: "linear-gradient(45deg, #1976d2, #2196f3)",
                            "&:hover": { background: "linear-gradient(45deg, #1565c0, #1e88e5)" },
                        }}
                    >
                        Login
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
