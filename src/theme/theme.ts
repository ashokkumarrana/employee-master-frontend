import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#2563eb",
            light: "#3b82f6",
            dark: "#1e3a8a",
            contrastText: "#ffffff",
        },

        secondary: {
            main: "#64748b",
            light: "#94a3b8",
            dark: "#475569",
            contrastText: "#ffffff",
        },

        background: {
            default: "#f6f8fc",
            paper: "#ffffff",
        },

        text: {
            primary: "#1e293b",
            secondary: "#64748b",
            disabled: "#94a3b8",
        },

        divider: "#e2e8f0",

        error: {
            main: "#dc2626",
        },

        success: {
            main: "#16a34a",
        },

        warning: {
            main: "#f59e0b",
        },

        info: {
            main: "#0284c7",
        },
    },

    typography: {
        fontFamily: "Roboto, Arial, sans-serif",

        h1: {
            fontSize: "2rem",
            fontWeight: 700,
            lineHeight: 1.2,
        },

        h2: {
            fontSize: "1.75rem",
            fontWeight: 700,
            lineHeight: 1.25,
        },

        h3: {
            fontSize: "1.5rem",
            fontWeight: 700,
            lineHeight: 1.3,
        },

        h4: {
            fontSize: "1.25rem",
            fontWeight: 600,
        },

        h5: {
            fontSize: "1.125rem",
            fontWeight: 600,
        },

        h6: {
            fontSize: "1rem",
            fontWeight: 600,
        },

        body1: {
            fontSize: "0.875rem",
        },

        body2: {
            fontSize: "0.8125rem",
        },

        button: {
            fontSize: "0.8125rem",
            fontWeight: 600,
            textTransform: "none",
        },
    },

    shape: {
        borderRadius: 8,
    },

    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },

            styleOverrides: {
                root: {
                    minHeight: 38,
                    borderRadius: 8,
                    textTransform: "none",
                    fontWeight: 600,
                },
            },
        },

        MuiIconButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },

        MuiTextField: {
            defaultProps: {
                size: "small",
            },
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 8,

                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#94a3b8",
                    },

                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2563eb",
                    },
                },

                input: {
                    fontSize: "0.875rem",
                },
            },
        },

        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: "0.875rem",
                },
            },
        },

        MuiSelect: {
            defaultProps: {
                size: "small",
            },

            styleOverrides: {
                select: {
                    fontSize: "0.875rem",
                },
            },
        },

        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderColor: "#e2e8f0",
                    fontSize: "0.8125rem",
                },

                head: {
                    backgroundColor: "#f8fafc",
                    color: "#475569",
                    fontWeight: 600,
                },

                body: {
                    color: "#334155",
                },
            },
        },

        MuiTableRow: {
            styleOverrides: {
                root: {
                    "&:hover": {
                        backgroundColor: "#f8fafc",
                    },
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                    boxShadow:
                        "0 2px 8px rgba(15, 23, 42, 0.04)",
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                },
            },
        },

        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontSize: "0.75rem",
                },
            },
        },

        MuiMenu: {
            styleOverrides: {
                paper: {
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    boxShadow:
                        "0 10px 30px rgba(15, 23, 42, 0.12)",
                },
            },
        },

        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontSize: "0.8125rem",

                    "&:hover": {
                        backgroundColor: "#eff6ff",
                    },

                    "&.Mui-selected": {
                        backgroundColor: "#eff6ff",
                    },
                },
            },
        },

        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundImage: "none",
                },
            },
        },

        MuiAppBar: {
            defaultProps: {
                elevation: 0,
            },
        },
    },
});

export default theme;