import { Box, Typography } from "@mui/material";

interface FooterProps {
    sidebarOpen: boolean;
}

const Footer = ({ sidebarOpen }: FooterProps) => {
    return (
        <Box
            component="footer"
            sx={{
                position: "fixed",
                bottom: 0,
                right: 0,
                left: {
                    xs: 0,
                    lg: sidebarOpen ? "240px" : "64px",
                },
                height: { xs: "30px", sm: "32px" },
                minHeight: { xs: "30px", sm: "32px" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                px: { xs: 1, sm: 2 },
                gap: { xs: 0.75, sm: 1 },
                background: "linear-gradient(90deg, #3156a3 0%, #263b6b 55%, #1e293b 100%)",
                borderTop: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 -2px 10px rgba(15,23,42,0.12)",
                color: "#dbeafe",
                zIndex: 1100,
                transition: "left 0.25s ease",
                whiteSpace: "nowrap",
            }}
        >
            {/* Copyright */}
            <Typography
                component="span"
                sx={{
                    m: 0,
                    fontSize: { xs: "10px", sm: "11px" },
                    lineHeight: 1,
                    fontWeight: 500,
                    color: "#ffffff",
                    letterSpacing: "0.1px",
                }}
            >
                © 2026 Employee Master
            </Typography>

            {/* Separator */}
            <Box
                sx={{
                    width: "1px",
                    height: { xs: "10px", sm: "12px" },
                    backgroundColor: "rgba(255,255,255,0.3)",
                    flexShrink: 0,
                }}
            />

            {/* Rights */}
            <Typography
                component="span"
                sx={{
                    m: 0,
                    fontSize: { xs: "10px", sm: "11px" },
                    lineHeight: 1,
                    fontWeight: 400,
                    color: "#bfdbfe",
                }}
            >
                All Rights Reserved
            </Typography>
        </Box>
    );
};

export default Footer;