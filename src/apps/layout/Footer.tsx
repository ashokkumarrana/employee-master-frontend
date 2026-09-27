import { Box, Typography } from "@mui/material";

interface FooterProps {
    sidebarOpen: boolean;
}

const Footer = ({
    sidebarOpen,
}: FooterProps) => {
    return (
        <Box
            component="footer"
            sx={{
                position: "fixed",

                bottom: 0,
                right: 0,

                left: {
                    xs: 0,
                    md: sidebarOpen
                        ? "240px"
                        : "64px",
                },

                height: {
                    xs: "40px",
                    sm: "42px",
                },

                minHeight: {
                    xs: "40px",
                    sm: "42px",
                },

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                boxSizing: "border-box",

                px: {
                    xs: 1,
                    sm: 2,
                },

                backgroundColor: "#ffffff",

                borderTop:
                    "1px solid #e2e8f0",

                color: "#64748b",

                gap: {
                    xs: 0.75,
                    sm: 1,
                },

                zIndex: 1100,

                boxShadow:
                    "0 -2px 8px rgba(15, 23, 42, 0.03)",

                transition:
                    "left 0.25s ease",

                whiteSpace: "nowrap",
            }}
        >
            {/* Copyright */}
            <Typography
                component="span"
                sx={{
                    m: 0,

                    fontSize: {
                        xs: "10px",
                        sm: "11px",
                    },

                    lineHeight: 1,

                    fontWeight: 500,

                    color: "#475569",

                    letterSpacing: "0.1px",
                }}
            >
                © 2026 Employee Master
            </Typography>

            {/* Separator */}
            <Box
                sx={{
                    width: "1px",

                    height: {
                        xs: "10px",
                        sm: "12px",
                    },

                    backgroundColor:
                        "#cbd5e1",

                    flexShrink: 0,
                }}
            />

            {/* Rights */}
            <Typography
                component="span"
                sx={{
                    m: 0,

                    fontSize: {
                        xs: "10px",
                        sm: "11px",
                    },

                    lineHeight: 1,

                    fontWeight: 400,

                    color: "#94a3b8",
                }}
            >
                All Rights Reserved
            </Typography>
        </Box>
    );
};

export default Footer;