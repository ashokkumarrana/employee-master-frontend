import { type ChangeEvent, type MouseEvent, type ReactNode, } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
export interface EmployeeTableColumn<T> {
    id: keyof T | string;
    label: string;
    minWidth?: number;
    align?: "left" | "center" | "right";
    sortable?: boolean;
    render?: (row: T) => ReactNode;
}
interface EmployeeTableProps<T> {
    columns: EmployeeTableColumn<T>[];
    rows: T[];
    page: number;
    rowsPerPage: number;
    totalCount: number;
    sortBy: string;
    direction: "asc" | "desc";
    onPageChange: (event: MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onRowsPerPageChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onSortChange: (column: string) => void;
    emptyMessage?: string;
    topContent?: ReactNode;
    onRowClick?: (row: T) => void;
}

const HEADER_BG = "#e8f1ff";
const APP_HEADER_HEIGHT = 64;
const APP_FOOTER_HEIGHT = 34;

const ReactTable = <T,>({
    columns,
    rows,
    page,
    rowsPerPage,
    totalCount,
    sortBy,
    direction,
    onPageChange,
    onRowsPerPageChange,
    onSortChange,
    emptyMessage = "No employees found",
    topContent,
    onRowClick,
}: EmployeeTableProps<T>) => {
    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                maxWidth: "100%",
                border: "1px solid #dbe3ef",
                borderRadius: "10px",
                overflow: "hidden",
                backgroundColor: "#fff",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                position: "sticky",
                top: APP_HEADER_HEIGHT,
                maxHeight: `calc(100vh - ${APP_HEADER_HEIGHT}px - ${APP_FOOTER_HEIGHT}px - 16px)`,
            }}>
            {/* TOP CONTENT */}
            {topContent && (
                <Box
                    sx={{
                        flexShrink: 0,
                        borderBottom: "1px solid #dbe3ef",
                        backgroundColor: "#f8fafc",
                    }}>
                    {topContent}
                </Box>
            )}

            {/* TABLE CONTAINER — the only part that scrolls internally */}
            <TableContainer
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflowX: "auto",
                    overflowY: "auto",
                    backgroundColor: "#fff",
                    "&::-webkit-scrollbar": { height: "6px", width: "6px", },
                    "&::-webkit-scrollbar-track": { backgroundColor: "#eef2f7", },
                    "&::-webkit-scrollbar-thumb": { backgroundColor: "#b8c2d1", borderRadius: "10px", },
                }}
            >
                <Table
                    stickyHeader
                    sx={{
                        width: "max-content",
                        minWidth: "100%",
                        tableLayout: "auto",
                        borderCollapse: "separate",
                        "& .MuiTableCell-root": { boxSizing: "border-box", },
                    }}
                >
                    {/* ================= HEADER ================= */}
                    <TableHead>
                        <TableRow
                            sx={{ height: 44, }}
                        >
                            {columns.map((column) => {
                                const columnId = String(column.id);
                                const align = column.align ?? "center";
                                const isActions = columnId === "actions";
                                const isSorted = sortBy === columnId;
                                const isSortable = !isActions && column.sortable !== false;
                                return (
                                    <TableCell
                                        key={columnId}
                                        align={align}
                                        sx={{
                                            width: isActions ? "1%" : column.minWidth ? `${column.minWidth}px` : "auto",
                                            minWidth: isActions ? 0 : column.minWidth ? `${column.minWidth}px` : 0,
                                            py: 1,
                                            px: isActions ? 1 : 1.5,
                                            position: "sticky",
                                            top: 0,
                                            backgroundColor: HEADER_BG,
                                            color: isSorted ? "#0f4c81" : "#1e3a5f",
                                            fontSize: "12.5px",
                                            fontWeight: 700,
                                            lineHeight: 1.2,
                                            whiteSpace: "nowrap",
                                            wordBreak: "normal",
                                            borderBottom: "2px solid #bfdbfe",
                                            zIndex: isActions ? 21 : 20,
                                            ...(isActions && {
                                                left: 0,
                                                backgroundColor: "#dbeafe",
                                                boxShadow: "4px 0 8px rgba(30,64,175,0.12)",
                                            }),
                                        }}
                                    >
                                        <Box
                                            onClick={() => {
                                                if (isSortable) { onSortChange(columnId); }
                                            }}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
                                                gap: 0.5,
                                                cursor: isSortable ? "pointer" : "default",
                                                userSelect: "none",
                                                borderRadius: "5px",
                                                px: 0.4,
                                                py: 0.2,
                                                transition: "all 0.15s ease",
                                                "&:hover": isSortable ? { color: "#1d4ed8", backgroundColor: "#dbeafe", } : {},
                                            }}
                                        >
                                            <Box
                                                component="span"
                                                sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", }}>
                                                {column.label}
                                            </Box>

                                            {isSortable && (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        flexShrink: 0,
                                                        color: isSorted ? "#2563eb" : "#64748b",
                                                    }} >
                                                    {isSorted ? (direction === "asc" ? (
                                                        <ArrowUpwardIcon sx={{ fontSize: 15, }} />
                                                    ) : (
                                                        <ArrowDownwardIcon sx={{ fontSize: 15, }} />
                                                    )
                                                    ) : (
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                lineHeight: 0.5,
                                                                opacity: 0.45,
                                                            }}>
                                                            <ArrowUpwardIcon
                                                                sx={{ fontSize: 8, }} />
                                                            <ArrowDownwardIcon
                                                                sx={{ fontSize: 8, }} />
                                                        </Box>
                                                    )}
                                                </Box>
                                            )}
                                        </Box>
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    {/* ================= BODY ================= */}
                    <TableBody>
                        {rows.length > 0 ? (
                            rows.map((row, rowIndex) => (
                                <TableRow
                                    hover
                                    key={rowIndex}
                                    onClick={() => onRowClick?.(row)}
                                    sx={{
                                        height: 40,
                                        cursor: onRowClick ? "pointer" : "default",
                                        transition: "background-color 0.15s ease",
                                        "&:hover td": { backgroundColor: "#eff6ff", },
                                        "&:last-child td": { borderBottom: 0, },
                                    }}>
                                    {columns.map((column) => {
                                        const isActions = String(column.id) === "actions";
                                        const align = column.align ?? "center";
                                        return (
                                            <TableCell
                                                key={String(column.id)}
                                                align={align}
                                                sx={{
                                                    width: isActions ? "1%" : column.minWidth ? `${column.minWidth}px` : "auto",
                                                    minWidth: isActions ? 0 : column.minWidth ? `${column.minWidth}px` : 0,
                                                    py: isActions ? 0.5 : 1,
                                                    px: isActions ? 1 : 1.5,
                                                    fontSize: "12.5px",
                                                    lineHeight: 1.3,
                                                    color: "#334155",
                                                    whiteSpace: isActions ? "nowrap" : "normal",
                                                    wordBreak: isActions ? "normal" : "break-word",
                                                    overflowWrap: isActions ? "normal" : "anywhere",
                                                    borderBottom: "1px solid #eef2f7",
                                                    backgroundColor: "#fff",
                                                    transition: "background-color 0.15s ease",
                                                    ...(isActions && {
                                                        position: "sticky",
                                                        left: 0,
                                                        zIndex: 5,
                                                        backgroundColor: "#fff",
                                                        boxShadow: "4px 0 8px rgba(15,23,42,0.10)",
                                                    }),
                                                }}>
                                                {column.render ? (
                                                    isActions ? (
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                flexDirection: "row",
                                                                flexWrap: "nowrap",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                gap: 0.25,
                                                                "& .MuiIconButton-root": { p: 0.5, },
                                                                "& .MuiSvgIcon-root": { fontSize: 18, },
                                                                "& .MuiButton-root": {
                                                                    minWidth: 0,
                                                                    py: 0.2,
                                                                    px: 1,
                                                                    fontSize: "11px",
                                                                    lineHeight: 1.2,
                                                                },
                                                            }}>
                                                            {column.render(row)}
                                                        </Box>
                                                    ) : (
                                                        column.render(row)
                                                    )
                                                ) : (
                                                    String(row[column.id as keyof T] ?? "").trim() || "N/A"
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    align="center"
                                    sx={{
                                        py: 4,
                                        color: "#94a3b8",
                                        fontSize: "12.5px",
                                        borderBottom: 0,
                                    }}
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={totalCount}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25, 50,]}
                sx={{
                    flexShrink: 0,
                    borderTop: "1px solid #dbe3ef",
                    backgroundColor: "#f8fafc",
                    ".MuiTablePagination-toolbar": { minHeight: 52, px: 2, },
                    ".MuiTablePagination-spacer": { flex: "1 1 auto", },
                    ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#64748b",
                        m: 0,
                    },
                    ".MuiTablePagination-displayedRows": { fontWeight: 600, color: "#334155", ml: 2, },
                    ".MuiTablePagination-input": {
                        ml: 1,
                        mr: 1,
                        width: 45,
                        height: 30,
                        border: "1px solid #dbe3ef",
                        borderRadius: "6px",
                        backgroundColor: "#fff",
                        transition: "all 0.15s ease",
                        "&:hover": { borderColor: "#93c5fd", backgroundColor: "#eff6ff", },
                    },
                    ".MuiTablePagination-select": { fontSize: "12px", fontWeight: 600, color: "#334155", py: 0.5, },
                    ".MuiTablePagination-selectIcon": { color: "#64748b", },
                    ".MuiTablePagination-actions": { ml: 1.5, display: "flex", gap: 0.5, },
                    ".MuiTablePagination-actions .MuiIconButton-root": {
                        width: 30,
                        height: 30,
                        border: "1px solid #dbe3ef",
                        borderRadius: "8px",
                        color: "#475569",
                        backgroundColor: "#fff",
                        transition: "all 0.15s ease",
                        "&:hover": { backgroundColor: "#dbeafe", borderColor: "#93c5fd", color: "#1d4ed8", },
                        "&.Mui-disabled": { backgroundColor: "#f1f5f9", borderColor: "#e2e8f0", color: "#cbd5e1", },
                    },
                }}
            />
        </Paper>
    );
};

export default ReactTable;