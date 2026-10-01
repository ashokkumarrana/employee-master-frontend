import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

export interface SummaryCard {
    label: string;
    count: number;
    filter: string;
    background: string;
    color: string;
    icon?: React.ReactNode;
}

interface StatusSummaryProps {
    totalEmployees: number;
    activeEmployees: number;
    inactiveEmployees: number;
    handleSummaryFilter?: (filter: string) => void;
    selectedStatus: string;
    clickable?: boolean;

    showModeToggle?: boolean;
    countMode?: "date" | "beginning";
    onCountModeChange?: (mode: "date" | "beginning") => void;
}

const cardSx = {
    width: "100%",
    height: "100%",
    borderRadius: 2,
    border: "1px solid",
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
};

const StatusSummary = ({
    totalEmployees,
    activeEmployees,
    inactiveEmployees,
    handleSummaryFilter,
    selectedStatus,
    clickable = true,

    showModeToggle = false,
    countMode = "date",
    onCountModeChange,
}: StatusSummaryProps) => {
    const summaryCards: SummaryCard[] = [
        {
            label: "All Employees",
            count: totalEmployees,
            filter: "all",
            background: "#0f766e",
            color: "#ffffff",
            icon: <PeopleAltOutlinedIcon sx={{ fontSize: 24 }} />,
        },
        {
            label: "Active",
            count: activeEmployees,
            filter: "active",
            background: "#15803d",
            color: "#ffffff",
            icon: <CheckCircleIcon sx={{ fontSize: 24 }} />,
        },
        {
            label: "Inactive",
            count: inactiveEmployees,
            filter: "inactive",
            background: "#b91c1c",
            color: "#ffffff",
            icon: <CancelOutlinedIcon sx={{ fontSize: 24 }} />,
        },
    ];

    return (
        <Card elevation={0} sx={cardSx}>
            <CardContent
                sx={{
                    p: { xs: "12px !important", sm: "16px !important" },
                }}
            >
                {/* ================= STATUS SUMMARY HEADER ================= */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: showModeToggle
                            ? "space-between"
                            : "center",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 1.5,
                    }}
                >
                    <Typography
                        component="h2"
                        sx={{
                            fontSize: { xs: 13, sm: 14 },
                            fontWeight: 700,
                            color: "#334155",
                        }}
                    >
                        Status Summary
                    </Typography>

                    {showModeToggle && (
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                            <Button
                                size="small"
                                variant={
                                    countMode === "date"
                                        ? "contained"
                                        : "outlined"
                                }
                                onClick={() => onCountModeChange?.("date")}
                                sx={{
                                    textTransform: "none",
                                    fontSize: 11,
                                    px: 1.3,
                                    py: 0.3,
                                    borderRadius: "999px",
                                    minWidth: 0,
                                }}
                            >
                                As Per Date Filter
                            </Button>

                            <Button
                                size="small"
                                variant={
                                    countMode === "beginning"
                                        ? "contained"
                                        : "outlined"
                                }
                                onClick={() => onCountModeChange?.("beginning")}
                                sx={{
                                    textTransform: "none",
                                    fontSize: 11,
                                    px: 1.3,
                                    py: 0.3,
                                    borderRadius: "999px",
                                    minWidth: 0,
                                }}
                            >
                                Since Beginning
                            </Button>
                        </Box>
                    )}
                </Box>

                {/* ================= SUMMARY CARDS ================= */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(3, minmax(0, 1fr))",
                        },
                        gap: { xs: 1, sm: 1.5 },
                        width: "100%",
                    }}
                >
                    {summaryCards.map((card) => {
                        const isSelected =
                            clickable && card.filter === selectedStatus;

                        const handleClick = () => {
                            if (clickable && handleSummaryFilter) {
                                handleSummaryFilter(card.filter);
                            }
                        };

                        return (
                            <Box
                                key={card.label}
                                role={clickable ? "button" : undefined}
                                tabIndex={clickable ? 0 : undefined}
                                onClick={clickable ? handleClick : undefined}
                                onKeyDown={
                                    clickable
                                        ? (event) => {
                                            if (
                                                event.key === "Enter" ||
                                                event.key === " "
                                            ) {
                                                event.preventDefault();
                                                handleClick();
                                            }
                                        }
                                        : undefined
                                }
                                sx={{
                                    width: "100%",
                                    minWidth: 0,
                                    minHeight: { xs: 85, sm: 100 },
                                    borderRadius: 1.5,
                                    backgroundColor: isSelected
                                        ? "#f8fafc"
                                        : card.background,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: clickable ? "pointer" : "default",
                                    color: isSelected
                                        ? card.background
                                        : card.color,
                                    border: isSelected
                                        ? `2px solid ${card.background}`
                                        : "1px solid transparent",
                                    position: "relative",
                                    overflow: "hidden",
                                    boxSizing: "border-box",
                                    transform: isSelected
                                        ? "translateY(-2px)"
                                        : "none",
                                    boxShadow: isSelected
                                        ? `0 0 0 2px ${card.background}22, 0 6px 14px rgba(15, 23, 42, 0.12)`
                                        : "0 2px 6px rgba(15, 23, 42, 0.08)",
                                    transition:
                                        "transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease, background-color 0.2s ease",

                                    ...(clickable && {
                                        "&:hover": {
                                            transform: "translateY(-2px)",
                                            boxShadow:
                                                "0 6px 14px rgba(15, 23, 42, 0.15)",
                                        },

                                        "&:focus-visible": {
                                            outline: `2px solid ${card.background}`,
                                            outlineOffset: 2,
                                        },
                                    }),
                                }}
                            >
                                {/* Icon */}
                                <Box
                                    sx={{
                                        width: { xs: 34, sm: 40 },
                                        height: { xs: 34, sm: 40 },
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: isSelected
                                            ? card.background
                                            : "#ffffff",
                                        color: isSelected
                                            ? "#ffffff"
                                            : card.background,
                                        boxShadow:
                                            "0 2px 7px rgba(15, 23, 42, 0.15)",
                                        mb: 0.5,
                                        transition: "all 0.2s ease",

                                        "& svg": {
                                            fontSize: { xs: 19, sm: 22 },
                                        },
                                    }}
                                >
                                    {card.icon}
                                </Box>

                                {/* Label */}
                                <Typography
                                    component="span"
                                    sx={{
                                        fontSize: { xs: 11, sm: 12 },
                                        fontWeight: 600,
                                        color: isSelected
                                            ? card.background
                                            : "#ffffff",
                                        textAlign: "center",
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {card.label}
                                </Typography>

                                {/* Count */}
                                <Typography
                                    component="span"
                                    sx={{
                                        fontSize: { xs: 18, sm: 21 },
                                        lineHeight: 1.2,
                                        fontWeight: 700,
                                        color: isSelected
                                            ? "#1e293b"
                                            : "#ffffff",
                                        mt: 0.2,
                                    }}
                                >
                                    {card.count}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </CardContent>
        </Card>
    );
};

export default StatusSummary;