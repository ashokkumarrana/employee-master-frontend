import { useEffect, useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, DashboardOutlined, GroupOutlined, PeopleOutlined } from "@mui/icons-material";

import {
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";

interface SidebarProps {
    open: boolean;
    onClose: () => void;
    onToggle: () => void;
    onNavigate: (page: string) => void;
    activePage: string;
}

interface MenuItem {
    label: string;
    icon: ReactNode;
    page: string;
}

const Sidebar = ({
    open,
    onClose,
    onToggle,
    onNavigate,
    activePage,
}: SidebarProps) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

    const menuItems: MenuItem[] = [
        {
            label: "Dashboard",
            icon: <DashboardOutlined />,
            page: "dashboard",
        },
        {
            label: "Employee",
            icon: <PeopleOutlined />,
            page: "employee-master",
        },
    ];
    const blurActiveElement = () => {
        if (
            document.activeElement instanceof HTMLElement &&
            document.activeElement !== document.body
        ) {
            document.activeElement.blur();
        }
    };

    const closeDrawerSafely = () => {
        blurActiveElement();
        onClose();
    };
    const wasOpen = useRef(open);

    useEffect(() => {
        if (wasOpen.current && !open) {
            blurActiveElement();
        }
        wasOpen.current = open;
    }, [open]);

    const handleNavigation = (page: string) => {
        onNavigate(page);

        if (!isDesktop) {
            closeDrawerSafely();
        }
    };

    const isActive = (page: string) => activePage === page;

    const sidebarContent = (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                minHeight: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxSizing: "border-box",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    height: "64px",
                    minHeight: "64px",
                    display: "flex",
                    alignItems: "center",
                    px: open ? 2 : 1,
                    borderBottom: "1px solid rgba(255,255,255,0.12)",
                    boxSizing: "border-box",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        width: 34,
                        height: 34,
                        minWidth: 34,
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(255,255,255,0.14)",
                        flexShrink: 0,
                    }}
                >
                    <GroupOutlined sx={{ fontSize: 20, color: "#ffffff" }} />
                </Box>

                {open && (
                    <Typography
                        sx={{
                            ml: 1.2,
                            color: "#ffffff",
                            fontSize: "14px",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        Employee Master
                    </Typography>
                )}
            </Box>

            {/* Menu */}
            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    overflowX: "hidden",
                    "&::-webkit-scrollbar": { width: "4px" },
                    "&::-webkit-scrollbar-track": { background: "transparent" },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "rgba(148,163,184,0.35)",
                        borderRadius: "10px",
                    },
                    scrollbarWidth: "thin",
                }}
            >
                <List sx={{ width: "100%", p: "14px 8px", boxSizing: "border-box" }}>
                    {menuItems.map((item) => {
                        const active = isActive(item.page);

                        return (
                            <ListItemButton
                                key={item.label}
                                onClick={() => handleNavigation(item.page)}
                                sx={{
                                    position: "relative",
                                    width: open || !isDesktop ? "100%" : "48px",
                                    minHeight: "48px",
                                    margin: "5px 0",
                                    padding: open || !isDesktop ? "0 8px" : 0,
                                    borderRadius: "10px",
                                    boxSizing: "border-box",
                                    color: active ? "#ffffff" : "#dbeafe",
                                    background: active
                                        ? "linear-gradient(90deg, #6d5bd0, #5b4bb7)"
                                        : "transparent",
                                    boxShadow: active
                                        ? "0 5px 14px rgba(91,75,183,0.25)"
                                        : "none",
                                    transition: "background 0.2s ease, color 0.2s ease, transform 0.2s ease",
                                    "&:hover": {
                                        background: active
                                            ? "linear-gradient(90deg, #6d5bd0, #5b4bb7)"
                                            : "rgba(147,197,253,0.14)",
                                        color: "#ffffff",
                                        transform: active ? "none" : "translateX(2px)",
                                    },
                                    "&::before": active
                                        ? {
                                            content: '""',
                                            position: "absolute",
                                            left: 0,
                                            width: "3px",
                                            height: "28px",
                                            borderRadius: "0 4px 4px 0",
                                            backgroundColor: "#c4b5fd",
                                        }
                                        : {},
                                    ...(!open && isDesktop
                                        ? { marginLeft: 0, justifyContent: "center" }
                                        : {}),
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: open || !isDesktop ? "42px" : "0",
                                        width: open || !isDesktop ? "auto" : "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: active ? "#ffffff" : "#bfdbfe",
                                        flexShrink: 0,
                                        "& svg": { fontSize: "21px" },
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>

                                {open && (
                                    <ListItemText
                                        primary={item.label}
                                        sx={{ minWidth: 0, overflow: "hidden" }}
                                        slotProps={{
                                            primary: {
                                                sx: {
                                                    color: active ? "#ffffff" : "#dbeafe",
                                                    fontSize: "13.5px",
                                                    fontWeight: active ? 600 : 500,
                                                    letterSpacing: "0.1px",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                },
                                            },
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        );
                    })}
                </List>
            </Box>

            {/* Collapse Button - Desktop only */}
            {isDesktop && (
                <Box
                    sx={{
                        width: "100%",
                        flexShrink: 0,
                        borderTop: "1px solid rgba(255,255,255,0.12)",
                        p: 1,
                        boxSizing: "border-box",
                    }}
                >
                    <ListItemButton
                        onClick={onToggle}
                        sx={{
                            minHeight: 42,
                            width: "100%",
                            borderRadius: "10px",
                            px: open ? 1.25 : 1,
                            justifyContent: open ? "initial" : "center",
                            color: "rgba(255,255,255,0.8)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.1)",
                                color: "#ffffff",
                            },
                        }} >
                        <ListItemIcon
                            sx={{
                                minWidth: open ? 36 : 0,
                                width: open ? "auto" : "100%",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "inherit",
                                flexShrink: 0,
                            }}>
                            {open ? <ChevronLeft /> : <ChevronRight />}
                        </ListItemIcon>

                        {open && (
                            <ListItemText
                                primary="Collapse"
                                slotProps={{
                                    primary: {
                                        sx: {
                                            fontSize: "13px",
                                        },
                                    },
                                }}
                            />
                        )}
                    </ListItemButton>
                </Box>
            )}
        </Box>
    );

    // Desktop Sidebar
    if (isDesktop) {
        return (
            <Box
                component="aside"
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: open ? "240px" : "64px",
                    height: "100vh",
                    background: "linear-gradient(180deg, #1e293b 0%, #263b6b 55%, #3156a3 100%)",
                    color: "#ffffff",
                    overflow: "hidden",
                    boxSizing: "border-box",
                    zIndex: 1200,
                    borderRight: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "4px 0 16px rgba(15,23,42,0.12)",
                    transition: "width 0.25s ease",
                }}
            >
                {sidebarContent}
            </Box>
        );
    }

    // Tablet / Mobile Drawer
    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={closeDrawerSafely}
            ModalProps={{ keepMounted: true }}
            slotProps={{
                paper: {
                    sx: {
                        width: { xs: "240px", sm: "260px" },
                        maxWidth: "85vw",
                        height: "100vh",
                        background: "linear-gradient(180deg, #1e293b 0%, #263b6b 55%, #3156a3 100%)",
                        color: "#ffffff",
                        borderRight: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: "5px 0 20px rgba(15,23,42,0.16)",
                        overflow: "hidden",
                        boxSizing: "border-box",
                    },
                },
            }}
        >
            {sidebarContent}
        </Drawer>
    );
};

export default Sidebar;