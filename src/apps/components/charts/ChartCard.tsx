import { useState, type ReactNode } from "react";

import {
    Box,
    Card,
    CardContent,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";

interface ChartColumn {
    key: string;
    label: string;
}
interface ChartCardProps {
    title: string;
    description?: string;
    graph: ReactNode;
    data: Record<string, any>[];
    columns: ChartColumn[];
    onRowClick?: (row: Record<string, any>) => void;
}

const ChartCard = ({
    title,
    description,
    graph,
    data,
    columns,
    onRowClick,
}: ChartCardProps) => {
    const [view, setView] = useState<"graph" | "table">("graph");
    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 2,
                height: "100%",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
            }}
        >
            <CardContent>
                {/* ================= TITLE ================= */}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: "#17375E",
                        mb: 0.5,
                    }}
                >
                    {title}
                </Typography>

                {description && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1.5 }}
                    >
                        {description}
                    </Typography>
                )}

                {/* ================= GRAPH / TABLE ================= */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: 1.5,
                    }}
                >
                    <ToggleButtonGroup
                        value={view}
                        exclusive
                        onChange={(_, newView) => {
                            if (newView !== null) {
                                setView(newView);
                            }
                        }}
                        size="small"
                        sx={{
                            backgroundColor: "#F4F7FA",
                            borderRadius: "10px",
                            padding: "3px",

                            "& .MuiToggleButton-root": {
                                border: "none",
                                borderRadius: "8px",
                                px: 2,
                                py: 0.6,
                                textTransform: "none",
                                fontWeight: 600,
                                color: "#64748B",
                            },

                            "& .MuiToggleButton-root.Mui-selected": {
                                backgroundColor: "#287F76",
                                color: "#FFFFFF",

                                "&:hover": {
                                    backgroundColor: "#236D66",
                                },
                            },
                        }}
                    >
                        <ToggleButton value="graph">
                            ◆ Graph
                        </ToggleButton>

                        <ToggleButton value="table">
                            ▤ Table
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {/* ================= GRAPH ================= */}

                {view === "graph" && (
                    <Box sx={{ width: "100%" }}>
                        {graph}
                    </Box>
                )}

                {/* ================= TABLE ================= */}

                {view === "table" && (
                    <TableContainer
                        component={Paper}
                        variant="outlined"
                        sx={{
                            borderRadius: 1.5,
                            maxHeight: 300,
                            overflow: "auto",
                            border: "1px solid #D5E5E2",
                            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
                        }}
                    >
                        <Table
                            size="small"
                            stickyHeader
                            sx={{
                                "& .MuiTableCell-root": {
                                    borderBottom: "1px solid #DCE7E5",
                                },
                            }}
                        >
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.key}
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: "12px",
                                                color: "#FFFFFF",
                                                backgroundColor: "#145A54",
                                                whiteSpace: "nowrap",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.5px",
                                                py: 1.5,
                                                px: 2,
                                            }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {data.length > 0 ? (
                                    data.map((row, index) => (
                                        <TableRow
                                            key={index}
                                            hover
                                            onClick={() => onRowClick?.(row)}
                                            sx={{
                                                cursor: onRowClick ? "pointer" : "default",
                                                backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F3F8F7",
                                                "&:hover": { backgroundColor: "#E4F1EF", },
                                                transition: "background-color 0.2s ease",
                                            }}
                                        >
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={column.key}
                                                    sx={{
                                                        whiteSpace: "nowrap",
                                                        fontSize: "13px",
                                                        color: "#334155",
                                                        fontWeight: column.key === "name" ? 600 : 500,
                                                        py: 1.4,
                                                        px: 2,
                                                    }}
                                                >
                                                    {row[column.key]}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            align="center"
                                            sx={{
                                                py: 3,
                                                color: "#64748B",
                                                fontSize: "13px",
                                            }}
                                        >
                                            No data available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </CardContent>
        </Card>
    );
};

export default ChartCard;