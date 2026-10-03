import { useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
    AppBar,
    Avatar,
    Box,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ExcelUploadNotification from "../components/common/ExcelUploadNotification";

interface HeaderProps {
    onMenuClick: () => void;
    onLogout: () => void;
}

const HEADER_BG = "linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)";
const AVATAR_GRADIENT = "linear-gradient(135deg, #1e3a8a, #2563eb)";
const HOVER_BG = "rgba(255, 255, 255, 0.14)";

const Header = ({ onMenuClick, onLogout }: HeaderProps) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [userName] = useState(localStorage.getItem("userName") || "User");
    const [userRole] = useState(localStorage.getItem("userRole") || "Administrator");

    const menuOpen = Boolean(anchorEl);
    const userInitial = userName.trim().charAt(0).toUpperCase() || "U";

    const handleProfileClick = (event: MouseEvent<HTMLElement>) => {
        event.currentTarget.blur();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");
        setAnchorEl(null);
        onLogout();
        navigate("/login");
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                height: "64px",
                background: HEADER_BG,
                color: "#ffffff",
                boxShadow: "0 4px 14px rgba(30, 58, 138, 0.25)",
                zIndex: 1300,
            }}
        >
            <Toolbar
                sx={{
                    minHeight: "64px !important",
                    height: "64px",
                    px: { xs: 1, sm: 2, md: 2.5 },
                    display: "flex",
                    alignItems: "center",
                }}
            >
                {/* MENU BUTTON */}
                <IconButton
                    onClick={(event) => {
                        event.currentTarget.blur();
                        onMenuClick();
                    }}
                    edge="start"
                    sx={{
                        width: 42,
                        height: 42,
                        mr: { xs: 0.5, sm: 1.5 },
                        color: "#ffffff",
                        borderRadius: "8px",
                        transition: "background-color 0.18s ease",
                        "&:hover": { backgroundColor: HOVER_BG },
                    }}
                >
                    <MenuIcon />
                </IconButton>

                {/* BRAND */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px",
                            backgroundColor: "rgba(255, 255, 255, 0.18)",
                            border: "1px solid rgba(255, 255, 255, 0.35)",
                        }}
                    >
                        <BusinessCenterIcon sx={{ fontSize: 20, color: "#ffffff" }} />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                            sx={{
                                fontSize: { xs: "14px", sm: "16px" },
                                fontWeight: 700,
                                color: "#ffffff",
                                lineHeight: 1.2,
                                whiteSpace: "nowrap",
                            }}
                        >
                            Employee Master
                        </Typography>
                        <Typography
                            sx={{
                                display: { xs: "none", sm: "block" },
                                fontSize: "10px",
                                color: "rgba(255, 255, 255, 0.75)",
                                mt: "2px",
                                lineHeight: 1.2,
                            }}
                        >
                            Management System
                        </Typography>
                    </Box>
                </Box>

                {/* RIGHT SIDE */}
                <Box
                    sx={{
                        ml: "auto",
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 0.5, sm: 1.2 },
                    }}
                >
                    {/* NOTIFICATION */}
                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "10px",
                            color: "#ffffff",
                            transition: "background-color 0.18s ease",
                            "&:hover": { backgroundColor: HOVER_BG },
                            "& .MuiIconButton-root": { color: "inherit" },
                            "& .MuiSvgIcon-root": { color: "inherit" },
                        }}
                    >
                        <ExcelUploadNotification />
                    </Box>

                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{
                            display: { xs: "none", sm: "block" },
                            my: 1,
                            borderColor: "rgba(255, 255, 255, 0.28)",
                        }}
                    />

                    {/* PROFILE */}
                    <IconButton
                        onClick={handleProfileClick}
                        disableRipple
                        sx={{
                            height: 46,
                            pl: { xs: 0.5, sm: 0.8 },
                            pr: { xs: 0.5, sm: 1.2 },
                            display: "flex",
                            alignItems: "center",
                            gap: { xs: 0.5, sm: 1 },
                            borderRadius: "999px",
                            border: "1px solid transparent",
                            color: "#ffffff",
                            backgroundColor: menuOpen ? HOVER_BG : "transparent",
                            transition: "background-color 0.18s ease, border-color 0.18s ease",
                            "&:hover": {
                                backgroundColor: HOVER_BG,
                                borderColor: "rgba(255, 255, 255, 0.3)",
                            },
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 34,
                                height: 34,
                                fontSize: "13px",
                                fontWeight: 700,
                                backgroundColor: "#ffffff",
                                color: "#1e3a8a",
                            }}
                        >
                            {userInitial}
                        </Avatar>

                        <Box
                            sx={{
                                display: { xs: "none", sm: "flex" },
                                flexDirection: "column",
                                alignItems: "flex-start",
                                minWidth: "95px",
                            }}
                        >
                            <Typography
                                sx={{ fontSize: "13px", fontWeight: 600, color: "#ffffff", lineHeight: "18px" }}
                            >
                                {userName}
                            </Typography>
                            <Typography
                                sx={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.75)", lineHeight: "15px" }}
                            >
                                {userRole}
                            </Typography>
                        </Box>

                        <KeyboardArrowDownIcon
                            sx={{
                                fontSize: 19,
                                color: "rgba(255, 255, 255, 0.85)",
                                transition: "transform 0.18s ease",
                                transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
                            }}
                        />
                    </IconButton>

                    {/* PROFILE MENU */}
                    <Menu
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                        slotProps={{
                            paper: {
                                sx: {
                                    minWidth: 210,
                                    mt: 1,
                                    borderRadius: "12px",
                                    border: "1px solid #e5e7eb",
                                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
                                    overflow: "hidden",
                                },
                            },
                        }}
                    >
                        {/* USER CARD */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.2,
                                px: 2,
                                py: 1.6,
                                backgroundColor: "#f8fafc",
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 38,
                                    height: 38,
                                    fontSize: "14px",
                                    fontWeight: 700,
                                    background: AVATAR_GRADIENT,
                                    color: "#ffffff",
                                }}
                            >
                                {userInitial}
                            </Avatar>
                            <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                                <Typography
                                    sx={{
                                        fontSize: "13px",
                                        fontWeight: 700,
                                        color: "#1e293b",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {userName}
                                </Typography>
                                <Typography sx={{ fontSize: "11px", color: "#64748b" }}>
                                    {userRole}
                                </Typography>
                            </Box>
                        </Box>

                        {/* LOGOUT */}
                        <MenuItem
                            onClick={handleLogout}
                            sx={{
                                minHeight: "44px !important",
                                px: 1.8,
                                py: 1.2,
                                gap: 1.2,
                                fontSize: "13px",
                                color: "#dc2626",
                                transition: "background-color 0.15s ease",
                                "& .icon-wrap": {
                                    width: 28,
                                    height: 28,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "8px",
                                    backgroundColor: "#fef2f2",
                                },
                                "& svg": { fontSize: 17, color: "#dc2626" },
                                "&:hover": { backgroundColor: "#fef2f2" },
                            }}
                        >
                            <span className="icon-wrap">
                                <LogoutIcon />
                            </span>
                            <span>Logout</span>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
