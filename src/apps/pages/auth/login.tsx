import { useState, type KeyboardEvent } from "react";
import { Box, Button, TextField, Typography, InputAdornment, IconButton, Paper, Alert, CircularProgress, GlobalStyles, } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { login, getUserByUsername } from "./authApi";

const Login = ({ onLogin }: { onLogin: (token: string) => void }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            setError("Please enter both username and password");
            return;
        }

        try {
            setError("");
            setLoading(true);

            const response = await login({ username, password });
            const token = response.token;

            localStorage.setItem("token", token);

            const userResponse = await getUserByUsername(username, token);
            localStorage.setItem("userName", userResponse.name);

            onLogin(token);
            navigate("/");

        } catch (error) {
            console.error(error);
            setError("Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <>
            <GlobalStyles styles={{ body: { margin: 0, backgroundColor: "#1e293b" } }} />
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden",
                    background: "linear-gradient(160deg, #1e293b 0%, #263b6b 55%, #3156a3 100%)",
                    p: 2,
                }}
            >
                {/* Background design */}
                <Box
                    sx={{
                        position: "absolute",
                        top: -140,
                        right: -140,
                        width: 380,
                        height: 380,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.05)",
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        bottom: -160,
                        left: -120,
                        width: 420,
                        height: 420,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.04)",
                    }}
                />

                <Paper
                    elevation={0}
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        width: "100%",
                        maxWidth: 420,
                        p: { xs: 3.5, sm: 5 },
                        borderRadius: "16px",
                        border: "1px solid rgba(255,255,255,0.2)",
                        boxShadow: "0 20px 50px rgba(15, 23, 42, 0.35)",
                    }}
                >
                    {/* Logo / Icon */}
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "14px",
                            backgroundColor: "#eff6ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            mb: 2.5,
                        }}
                    >
                        <Groups2OutlinedIcon sx={{ fontSize: 28, color: "#2563eb" }} />
                    </Box>

                    {/* Heading */}
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            textAlign: "center",
                            color: "#1e293b",
                            mb: 0.5,
                        }}
                    >
                        Welcome Back
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            textAlign: "center",
                            color: "#64748b",
                            mb: 4,
                        }}
                    >
                        Sign in to Employee Master to continue
                    </Typography>

                    {/* Username */}
                    <TextField
                        fullWidth
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={handleKeyDown}
                        margin="normal"
                        autoFocus
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon sx={{ fontSize: 20, color: "#94a3b8" }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                            },
                        }}
                    />

                    {/* Password */}
                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        margin="normal"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon sx={{ fontSize: 20, color: "#94a3b8" }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            edge="end"
                                            size="small"
                                        >
                                            {showPassword ? (
                                                <VisibilityOff sx={{ fontSize: 20, color: "#94a3b8" }} />
                                            ) : (
                                                <Visibility sx={{ fontSize: 20, color: "#94a3b8" }} />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                            },
                        }}
                    />

                    {/* Error message */}
                    {error && (
                        <Alert
                            severity="error"
                            variant="outlined"
                            sx={{
                                mt: 2,
                                borderRadius: "8px",
                                fontSize: "13px",
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    {/* Submit */}
                    <Button
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{
                            mt: 3.5,
                            py: 1.3,
                            borderRadius: "8px",
                            textTransform: "none",
                            fontSize: "15px",
                            fontWeight: 600,
                            boxShadow: "none",
                            "&:hover": {
                                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                            },
                        }}
                        onClick={handleLogin}
                    >
                        {loading ? (
                            <CircularProgress size={22} sx={{ color: "#fff" }} />
                        ) : (
                            "Sign In"
                        )}
                    </Button>

                    {/* Footer note */}
                    <Typography
                        variant="caption"
                        sx={{
                            display: "block",
                            textAlign: "center",
                            color: "#94a3b8",
                            mt: 3,
                        }}
                    >
                        © {new Date().getFullYear()} Employee Master. All rights reserved.
                    </Typography>
                </Paper>
            </Box>
        </>
    );
};

export default Login;