import { useState } from "react";
import { Box, Chip, Typography } from "@mui/material";
import EmployeeDialog from "../../components/common/Dialog";
import type { Dropdown, Employee } from "../../pages/employee-master/employeeTypes";
import EmployeeHistoryTable from "./EmployeeHistoryTable";

interface EmployeeHistoryDialogProps {
    open: boolean;
    employee: Employee | null;
    onClose: () => void;
    lookups?: Partial<Record<string, Dropdown[]>>;
}

const EmployeeHistoryDialog = ({ open, employee, onClose, lookups }: EmployeeHistoryDialogProps) => {
    const [recordCount, setRecordCount] = useState(0);
    const employeeId = employee?.id;

    return (
        <EmployeeDialog open={open} onClose={onClose} title="Employee History" maxWidth="lg">
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                    mb: 2,
                    border: "1px solid #dbe3ef",
                    borderRadius: "10px",
                    backgroundColor: "#f8fafc",
                    cursor: "default",
                    transition: "all 0.25s ease",
                    "&:hover": {
                        borderColor: "#93c5fd",
                        backgroundColor: "#eff6ff",
                        boxShadow: "0 2px 8px rgba(37, 99, 235, 0.12)",
                    },
                    "&:hover .history-avatar": { backgroundColor: "#2563eb", color: "#fff", transform: "scale(1.06)" },
                    "&:hover .history-name": { color: "#2563eb" },
                }}>
                <Box
                    className="history-avatar"
                    sx={{
                        width: 42,
                        height: 42,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "10px",
                        backgroundColor: "#dbeafe",
                        color: "#2563eb",
                        fontSize: "18px",
                        fontWeight: 700,
                        transition: "all 0.25s ease",
                    }}>
                    {employee?.employeeName?.charAt(0).toUpperCase() || "E"}
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                        className="history-name"
                        noWrap
                        sx={{ fontSize: "15px", fontWeight: 700, color: "#1f2937", transition: "color 0.25s ease" }}>
                        {employee?.employeeName || "N/A"}
                    </Typography>
                    <Typography sx={{ fontSize: "12.5px", color: "#64748b" }}>
                        Employee Code:{" "}
                        <Box component="span" sx={{ fontWeight: 700, color: "#2563eb" }}>
                            {employee?.employeeCode}
                        </Box>
                    </Typography>
                </Box>
                <Chip
                    size="small"
                    label={`${recordCount} ${recordCount === 1 ? "Record" : "Records"}`}
                    sx={{ fontWeight: 600, fontSize: "11.5px", color: "#1d4ed8", backgroundColor: "#dbeafe" }}
                />
            </Box>
            {employeeId != null && (
                <EmployeeHistoryTable
                    employeeId={employeeId}
                    lookups={lookups}
                    onTotalCountChange={setRecordCount}
                />
            )}
        </EmployeeDialog>
    );
};

export default EmployeeHistoryDialog;