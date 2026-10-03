import { useState } from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import EmployeeActivityBoard from "../pages/employee-master/employee-activity-dashboard";
import Dashboard from "../pages/dashboard/main-dashboard";

const HEADER_HEIGHT = 64;
const SIDEBAR_OPEN_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 64;

interface MainLayoutProps {
    onLogout: () => void;
}

const MainLayout = ({ onLogout }: MainLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activePage, setActivePage] = useState("dashboard");

    const handleMenuClick = () => {
        setSidebarOpen((prev) => !prev);
    };
    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };
    const handleNavigate = (page: string) => {
        setActivePage(page);
    };
    const sidebarWidth = sidebarOpen ? SIDEBAR_OPEN_WIDTH : SIDEBAR_COLLAPSED_WIDTH;
    return (
        <Box
            sx={{
                width: "100%",
                height: "100vh",
                overflow: "hidden",
                backgroundColor: "#f6f8fc",
            }}>
            <Header
                onMenuClick={handleMenuClick}
                onLogout={onLogout} />
            <Sidebar
                open={sidebarOpen}
                onClose={handleSidebarClose}
                onToggle={handleMenuClick}
                onNavigate={handleNavigate}
                activePage={activePage} />
            <Box
                sx={{
                    position: "relative",
                    width: { xs: "100%", md: `calc(100% - ${sidebarWidth}px)`, },
                    height: `calc(100vh - ${HEADER_HEIGHT}px)`,
                    ml: { xs: 0, md: `${sidebarWidth}px`, },
                    mt: `${HEADER_HEIGHT}px`,
                    transition: "width 0.25s ease, margin-left 0.25s ease",
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    minHeight: 0,
                    boxSizing: "border-box",
                }}>
                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        width: "100%",
                        minWidth: 0,
                        minHeight: 0,
                        overflowY: "auto",
                        overflowX: "hidden",
                        boxSizing: "border-box",
                        p: { xs: 1.25, sm: 1.5, md: 2, lg: 2.5, },
                        pb: 3,
                        "&::-webkit-scrollbar": { width: "8px", },
                        "&::-webkit-scrollbar-track": { backgroundColor: "#eef2f7", },
                        "&::-webkit-scrollbar-thumb": { backgroundColor: "#b8c2d1", borderRadius: "10px", },
                        "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#94a3b8", },
                    }}>
                    {activePage === "dashboard" && <Dashboard />}
                    {activePage === "employee-master" && (<EmployeeActivityBoard />)}
                </Box>
                <Footer sidebarOpen={sidebarOpen} />
            </Box>
        </Box>
    );
};

export default MainLayout;