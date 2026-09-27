import { useEffect, useState } from "react";
import { Box, Chip } from "@mui/material";
import ReactTable, { type EmployeeTableColumn } from "../../components/common/ReactTable";
import type { Dropdown, EmployeeHistory } from "../../pages/employee-master/employeeTypes";
import { getEmployeeHistory } from "../../pages/employee-master/employeeApi";

interface EmployeeHistoryTableProps {
    employeeId: number;
    lookups?: Partial<Record<string, Dropdown[]>>;
    onTotalCountChange?: (count: number) => void;
}

const actionColor: Record<string, "success" | "info" | "error"> = {
    CREATE: "success",
    UPDATE: "info",
    DELETE: "error",
};

const formatDate = (value?: string | null) => (value ? new Date(value).toLocaleDateString() : "N/A");
const formatDateTime = (value?: string | null) => (value ? new Date(value).toLocaleString() : "N/A");
type HistoryRow = EmployeeHistory & { _previous?: EmployeeHistory };

const EmployeeHistoryTable = ({ employeeId, lookups, onTotalCountChange }: EmployeeHistoryTableProps) => {
    const [history, setHistory] = useState<EmployeeHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [sortBy, setSortBy] = useState("changedAt");
    const [direction, setDirection] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        if (!employeeId) return;
        let cancelled = false;

        const fetchHistory = async () => {
            setLoading(true);

            try {
                const res = await getEmployeeHistory(
                    employeeId,
                    page,
                    rowsPerPage,
                    sortBy,
                    direction
                );
                console.log("History response:", res);
                if (cancelled) return;
                setHistory(res.data?.content ?? []);
                setTotalCount(res.data?.totalElements ?? 0);
                onTotalCountChange?.(res.data?.totalElements ?? 0);
            } catch (err) {
                if (!cancelled) {
                    setHistory([]);
                    setTotalCount(0);
                    onTotalCountChange?.(0);
                }
                console.error("Failed to fetch employee history", err);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };
        fetchHistory();
        return () => { cancelled = true; };
    }, [employeeId, page, rowsPerPage, sortBy, direction]);

    const nameOrId = (name: string | undefined, id?: number | null): string => name ?? (id != null ? String(id) : "N/A");
    const departmentName = (id?: number | null) => nameOrId(lookups?.departmentId?.find((d) => d.id === id)?.name, id);
    const designationName = (id?: number | null) => nameOrId(lookups?.designationId?.find((d) => d.id === id)?.name, id);
    const stateName = (id?: number | null) => nameOrId(lookups?.stateId?.find((s) => s.id === id)?.name, id);
    const countryName = (id?: number | null) => nameOrId(lookups?.countryId?.find((c) => c.id === id)?.name, id);

    const rows: HistoryRow[] = history.map((row, idx) => ({ ...row, _previous: history[idx + 1] }));

    const diffCell = (row: HistoryRow, formatted: string, previousFormatted: string | undefined) => {
        const changed = row._previous !== undefined && previousFormatted !== formatted;
        if (!changed) {
            return formatted;
        }
        return (
            <Box
                component="span"
                sx={{
                    display: "inline-block",
                    color: "#15803d",
                    fontWeight: 700,
                    backgroundColor: "#f0fdf4",
                    px: 0.75,
                    py: 0.25,
                    borderRadius: "4px",
                }}>
                {formatted}
            </Box>
        );
    };

    const cell = (
        row: HistoryRow,
        value: unknown,
        previousValue: unknown,
        format: (value: any) => string = (v) => (v === null || v === undefined || v === "" ? "N/A" : String(v))
    ) => diffCell(row, format(value), row._previous ? format(previousValue) : undefined);

    const columns: EmployeeTableColumn<HistoryRow>[] = [
        {
            id: "action",
            label: "Action",
            minWidth: 100,
            render: (row) => (
                <Chip
                    label={row.action}
                    size="small"
                    color={actionColor[row.action] ?? "default"}
                    sx={{ fontWeight: 600, fontSize: "11px", }}
                />
            ),
        },
        {
            id: "employeeCode",
            label: "Employee Code",
            minWidth: 120,
            render: (row) => cell(row, row.employeeCode, row._previous?.employeeCode)
        },
        {
            id: "employeeName",
            label: "Employee Name",
            minWidth: 150,
            render: (row) => cell(row, row.employeeName, row._previous?.employeeName)
        },
        {
            id: "communicationName",
            label: "Communication Name",
            minWidth: 150,
            render: (row) => cell(row, row.communicationName, row._previous?.communicationName)
        },
        {
            id: "departmentId",
            label: "Department",
            minWidth: 130,
            render: (row) => cell(row, row.departmentId, row._previous?.departmentId, departmentName)
        },

        {
            id: "designationId",
            label: "Designation",
            minWidth: 130,
            render: (row) => cell(row, row.designationId, row._previous?.designationId, designationName)
        },
        {
            id: "reportingManager",
            label: "Reporting Manager",
            minWidth: 130,
            render: (row) => cell(row, row.reportingManager, row._previous?.reportingManager)
        },
        {
            id: "employeeType",
            label: "Employee Type",
            minWidth: 110,
            render: (row) => cell(row, row.employeeType, row._previous?.employeeType)
        },
        {
            id: "gender",
            label: "Gender",
            minWidth: 90,
            render: (row) => cell(row, row.gender, row._previous?.gender)
        },
        {
            id: "maritalStatus",
            label: "Marital Status",
            minWidth: 110,
            render: (row) => cell(row, row.maritalStatus, row._previous?.maritalStatus)
        },
        {
            id: "skills",
            label: "Skills",
            minWidth: 160,
            render: (row) => cell(row, row.skills, row._previous?.skills, (v) => (v && v.length > 0 ? v.join(", ") : "N/A")),
        },
        {
            id: "languages",
            label: "Languages",
            minWidth: 130,
            render: (row) => cell(row, row.languages, row._previous?.languages)
        },
        {
            id: "mobile",
            label: "Mobile",
            minWidth: 110,
            render: (row) => cell(row, row.mobile, row._previous?.mobile)
        },
        {
            id: "alternateMobile",
            label: "Alternate Mobile",
            minWidth: 130,
            render: (row) => cell(row, row.alternateMobile, row._previous?.alternateMobile)
        },
        {
            id: "email",
            label: "Email",
            minWidth: 180,
            render: (row) => cell(row, row.email, row._previous?.email)
        },
        {
            id: "alternateEmail",
            label: "Alternate Email",
            minWidth: 180,
            render: (row) => cell(row, row.alternateEmail, row._previous?.alternateEmail)
        },
        {
            id: "dob",
            label: "DOB",
            minWidth: 100,
            render: (row) => cell(row, row.dob, row._previous?.dob, formatDate)
        },
        {
            id: "joiningDate",
            label: "Joining Date",
            minWidth: 110,
            render: (row) => cell(row, row.joiningDate, row._previous?.joiningDate, formatDate)
        },
        {
            id: "address",
            label: "Address",
            minWidth: 180,
            render: (row) => cell(row, row.address, row._previous?.address)
        },
        {
            id: "city",
            label: "City", minWidth: 110,
            render: (row) => cell(row, row.city, row._previous?.city)
        },
        {
            id: "stateId",
            label: "State", minWidth: 110,
            render: (row) => cell(row, row.stateId, row._previous?.stateId, stateName)
        },
        {
            id: "countryId",
            label: "Country", minWidth: 110,
            render: (row) => cell(row, row.countryId, row._previous?.countryId, countryName)
        },
        {
            id: "zipCode",
            label: "Zip Code", minWidth: 100,
            render: (row) => cell(row, row.zipCode, row._previous?.zipCode)
        },
        {
            id: "bloodGroup",
            label: "Blood Group",
            minWidth: 100,
            render: (row) => cell(row, row.bloodGroup, row._previous?.bloodGroup)
        },
        {
            id: "status",
            label: "Status",
            minWidth: 90,
            render: (row) => cell(row, row.status, row._previous?.status, (v) => (v ? "Inactive" : "Active")),
        },
        // {
        //     id: "profileImage",
        //     label: "Profile Image",
        //     minWidth: 140, render: (row) => cell(row, row.profileImage, row._previous?.profileImage)
        // },
        // {
        //     id: "documents",
        //     label: "Documents",
        //     minWidth: 140, render: (row) => cell(row, row.documents, row._previous?.documents)
        // },
        {
            id: "remarks",
            label: "Remarks",
            minWidth: 160, render: (row) => cell(row, row.remarks, row._previous?.remarks)
        },
        {
            id: "createdBy",
            label: "Created By",
            minWidth: 120,
            render: (row) => row.createdByName ?? "—",
        },
        {
            id: "createdAt",
            label: "Created At",
            minWidth: 160, render: (row) => formatDateTime(row.createdAt)
        },
        {
            id: "changedBy",
            label: "Changed By",
            minWidth: 120,
            render: (row) => row.changedByName ?? "—",
        },
        {
            id: "changedAt",
            label: "Changed At",
            minWidth: 160, render: (row) => formatDateTime(row.changedAt)
        },
    ];

    return (
        <Box
            sx={{
                "& .MuiPaper-root": {
                    position: "static !important",
                    top: "auto !important",
                    maxHeight: "480px !important",
                },
            }}>
            <ReactTable
                columns={columns}
                rows={rows}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={totalCount}
                sortBy={sortBy}
                direction={direction}
                onPageChange={(_e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
                onSortChange={(column) => {
                    if (column === sortBy) {
                        setDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                    } else {
                        setSortBy(column);
                        setDirection("desc");
                    }
                    setPage(0);
                }}
                emptyMessage={loading ? "Loading history..." : "No history found"}
            />
        </Box>
    );
};

export default EmployeeHistoryTable;