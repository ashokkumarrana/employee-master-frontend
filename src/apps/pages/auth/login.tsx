import { useState, type KeyboardEvent } from "react";
import { Box, Button, TextField, Typography, InputAdornment, IconButton, Paper, Alert, CircularProgress, GlobalStyles, } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { login, getUserByUsername } from "./authApi";

const inputSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        color: "#ffffff",
        backgroundColor: "rgba(255,255,255,0.06)",
        transition: "all 0.2s ease",
        "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
        "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
        "&.Mui-focused": { backgroundColor: "rgba(255,255,255,0.09)" },
        "&.Mui-focused fieldset": { borderColor: "#60a5fa", borderWidth: "1.5px" },
    },
    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#93c5fd" },
    "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus": {
        WebkitBoxShadow: "0 0 0 100px #2b4379 inset",
        WebkitTextFillColor: "#ffffff",
        caretColor: "#ffffff",
        borderRadius: "inherit",
    },
};

const adornmentIconColor = "rgba(255,255,255,0.6)";

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
                        overflow: "hidden",
                        width: "100%",
                        maxWidth: 420,
                        p: { xs: 3.5, sm: 5 },
                        borderRadius: "20px",
                        color: "#ffffff",
                        backgroundColor: "rgba(15, 23, 42, 0.45)",
                        backdropFilter: "blur(18px)",
                        WebkitBackdropFilter: "blur(18px)",
                        border: "1px solid rgba(255,255,255,0.16)",
                        boxShadow: "0 25px 60px rgba(8, 15, 40, 0.5)",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            background: "linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd)",
                        },
                    }}
                >
                    {/* Logo / Icon */}
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: "16px",
                            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                            boxShadow: "0 8px 22px rgba(37, 99, 235, 0.45)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            mb: 2.5,
                        }}
                    >
                        <Groups2OutlinedIcon sx={{ fontSize: 30, color: "#ffffff" }} />
                    </Box>

                    {/* Heading */}
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            textAlign: "center",
                            color: "#ffffff",
                            letterSpacing: "0.2px",
                            mb: 0.5,
                        }}
                    >
                        Welcome Back
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            textAlign: "center",
                            color: "rgba(255,255,255,0.65)",
                            mb: 4,
                        }}>
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
                                        <PersonIcon sx={{ fontSize: 20, color: adornmentIconColor }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={inputSx}
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
                                        <LockOutlinedIcon sx={{ fontSize: 20, color: adornmentIconColor }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            edge="end"
                                            size="small"
                                            sx={{ "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" } }}
                                        >
                                            {showPassword ? (
                                                <VisibilityOff sx={{ fontSize: 20, color: adornmentIconColor }} />
                                            ) : (
                                                <Visibility sx={{ fontSize: 20, color: adornmentIconColor }} />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={inputSx}
                    />

                    {/* Error message */}
                    {error && (
                        <Alert
                            severity="error"
                            variant="outlined"
                            sx={{
                                mt: 2,
                                borderRadius: "10px",
                                fontSize: "13px",
                                color: "#fecaca",
                                borderColor: "rgba(248,113,113,0.5)",
                                backgroundColor: "rgba(239,68,68,0.12)",
                                "& .MuiAlert-icon": { color: "#f87171" },
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
                            py: 1.35,
                            borderRadius: "10px",
                            textTransform: "none",
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "#ffffff",
                            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                            boxShadow: "0 6px 18px rgba(37, 99, 235, 0.35)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                                boxShadow: "0 8px 22px rgba(37, 99, 235, 0.5)",
                            },
                            "&.Mui-disabled": {
                                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                                color: "#ffffff",
                                opacity: 0.6,
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
                            color: "rgba(255,255,255,0.45)",
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
