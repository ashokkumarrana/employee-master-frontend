import { useMemo, useState, type ReactNode } from "react";

import {
    Box,
    Card,
    CardContent,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import ReactTable, { type EmployeeTableColumn } from "../common/ReactTable";

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

type ChartRow = Record<string, any>;

const ChartCard = ({
    title,
    description,
    graph,
    data,
    columns,
    onRowClick,
}: ChartCardProps) => {
    const [view, setView] = useState<"graph" | "table">("graph");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortBy, setSortBy] = useState("");
    const [direction, setDirection] = useState<"asc" | "desc">("asc");

    const tableColumns: EmployeeTableColumn<ChartRow>[] = columns.map((column) => ({
        id: column.key,
        label: column.label,
    }));

    const sortedData = useMemo(() => {
        if (!sortBy) {
            return data;
        }
        return [...data].sort((a, b) => {
            const first = a[sortBy];
            const second = b[sortBy];
            const result =
                typeof first === "number" && typeof second === "number"
                    ? first - second
                    : String(first ?? "").localeCompare(String(second ?? ""), undefined, { numeric: true });
            return direction === "asc" ? result : -result;
        });
    }, [data, sortBy, direction]);

    const lastPage = Math.max(0, Math.ceil(sortedData.length / rowsPerPage) - 1);
    const currentPage = Math.min(page, lastPage);
    const pagedRows = sortedData.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

    const handleSortChange = (columnId: string) => {
        if (sortBy === columnId) {
            setDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(columnId);
            setDirection("asc");
        }
        setPage(0);
    };

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
                    <Box
                        sx={{
                            "& .MuiPaper-root": {
                                position: "static !important",
                                top: "auto !important",
                                maxHeight: "400px !important",
                            },
                        }}
                    >
                        <ReactTable
                            columns={tableColumns}
                            rows={pagedRows}
                            page={currentPage}
                            rowsPerPage={rowsPerPage}
                            totalCount={sortedData.length}
                            sortBy={sortBy}
                            direction={direction}
                            onPageChange={(_e, newPage) => setPage(newPage)}
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setPage(0);
                            }}
                            onSortChange={handleSortChange}
                            onRowClick={onRowClick}
                            emptyMessage="No data available"
                        />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ChartCard;