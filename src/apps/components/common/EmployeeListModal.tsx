import { useEffect, useRef, useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, CircularProgress, Box, Chip, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReactTable, { type EmployeeTableColumn } from "./ReactTable";
import { getCountries, getDepartments, getDesignations, getEmployees, getStates } from "../../pages/employee-master/employeeApi";
import { getReportingManagerName, type Dropdown, type Employee } from "../../pages/employee-master/employeeTypes";
import dayjs from "dayjs";

interface EmployeeListModalProps {
    departmentId: number;
    departmentName: string;
    open: boolean;
    onClose: () => void;
}

const getEmployeeColumns = (
    departments: Dropdown[],
    designations: Dropdown[],
    states: Dropdown[],
    countries: Dropdown[]
): EmployeeTableColumn<Employee>[] => [
        {
            id: "status",
            label: "Status",
            minWidth: 100,
            render: (row) => (
                <Chip
                    label={row.status ? "Inactive" : "Active"}
                    size="small"
                    sx={{
                        backgroundColor: row.status ? "#FEE2E2" : "#DCFCE7",
                        color: row.status ? "#991B1B" : "#166534",
                        fontWeight: 600,
                    }}
                />
            ),
        },
        {
            id: "employeeCode",
            label: "Employee Code",
            minWidth: 130,
        },
        {
            id: "employeeName",
            label: "Employee Name",
            minWidth: 170,
        },
        {
            id: "communicationName",
            label: "Communication Name",
            minWidth: 180,
            render: (row) => row.communicationName || "N/A",
        },
        {
            id: "mobile",
            label: "Mobile",
            minWidth: 130,
        },
        {
            id: "email",
            label: "Email",
            minWidth: 220,
        },
        {
            id: "departmentId",
            label: "Department",
            minWidth: 150,
            render: (row) => departments.find((department) => department.id === row.departmentId
            )?.name || "N/A",
        },
        {
            id: "designationId",
            label: "Designation",
            minWidth: 170,
            render: (row) => designations.find((designation) => designation.id === row.designationId
            )?.name || "-",
        },
        {
            id: "gender",
            label: "Gender",
            minWidth: 100,
        },
        {
            id: "dob",
            label: "Date of Birth",
            minWidth: 130,
            render: (row) => row.dob ? dayjs(row.dob).format("DD-MM-YYYY") : "N/A",
        },
        {
            id: "employeeType",
            label: "Employee Type",
            minWidth: 130,
        },
        {
            id: "reportingManager",
            label: "Reporting Manager",
            minWidth: 140,
            render: (row) => getReportingManagerName(row.reportingManager),
        },
        {
            id: "maritalStatus",
            label: "Marital Status",
            minWidth: 130,
            render: (row) => row.maritalStatus || "N/A",
        },
        {
            id: "skills",
            label: "Skills",
            minWidth: 180,
            render: (row) => row.skills?.length ? row.skills.join(", ") : "N/A",
        },
        {
            id: "languages",
            label: "Languages",
            minWidth: 140,
            render: (row) => row.languages || "N/A",
        },
        {
            id: "alternateMobile",
            label: "Alternate Mobile",
            minWidth: 150,
            render: (row) => row.alternateMobile || "N/A",
        },
        {
            id: "alternateEmail",
            label: "Alternate Email",
            minWidth: 220,
            render: (row) => row.alternateEmail || "N/A",
        },
        {
            id: "joiningDate",
            label: "Joining Date",
            minWidth: 130,
            render: (row) => row.joiningDate ? dayjs(row.joiningDate).format("DD-MM-YYYY") : "N/A",
        },
        {
            id: "address",
            label: "Address",
            minWidth: 250,
            render: (row) => row.address || "N/A",
        },
        {
            id: "city",
            label: "City",
            minWidth: 120,
            render: (row) => row.city || "N/A",
        },
        {
            id: "stateId",
            label: "State",
            minWidth: 150,
            render: (row) =>
                states.find((state) => state.id === row.stateId)?.name || "N/A",
        },
        {
            id: "countryId",
            label: "Country",
            minWidth: 150,
            render: (row) =>
                countries.find((country) => country.id === row.countryId)?.name || "N/A",
        },
        {
            id: "zipCode",
            label: "Zip Code",
            minWidth: 110,
            render: (row) => row.zipCode || "N/A",
        },
        {
            id: "bloodGroup",
            label: "Blood Group",
            minWidth: 110,
            render: (row) => row.bloodGroup || "N/A",
        },
        {
            id: "remarks",
            label: "Remarks",
            minWidth: 250,
            render: (row) => row.remarks || "N/A",
        },
        {
            id: "createdByName",
            label: "Created By",
            minWidth: 100,
            render: (row) => row.createdByName || "N/A",
        },
        {
            id: "createdAt",
            label: "Created At",
            minWidth: 180,
            render: (row) => row.createdAt ? dayjs(row.createdAt).format("DD-MM-YYYY, hh:mm:ss A") : "N/A",
        },
        {
            id: "updatedByName",
            label: "Updated By",
            minWidth: 100,
            render: (row) => row.updatedByName || "N/A",
        },
        {
            id: "updatedAt",
            label: "Updated At",
            minWidth: 180,
            render: (row) => row.updatedAt ? dayjs(row.updatedAt).format("DD-MM-YYYY, hh:mm:ss A") : "N/A",
        },


    ];
const EmployeeListModal = ({ departmentId, departmentName, open, onClose }: EmployeeListModalProps) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [sortBy, setSortBy] = useState("id");
    const [direction, setDirection] = useState<"asc" | "desc">("desc");
    const lastRequestRef = useRef("");
    const [departments, setDepartments] = useState<Dropdown[]>([]);
    const [designations, setDesignations] = useState<Dropdown[]>([]);
    const [states, setStates] = useState<Dropdown[]>([]);
    const [countries, setCountries] = useState<Dropdown[]>([]);

    const employeeColumns = getEmployeeColumns(departments, designations, states, countries);

    useEffect(() => {
        if (!open) {
            return;
        }
        const loadLookups = async () => {
            try {
                const [departmentResponse, designationResponse, stateResponse, countryResponse] =
                    await Promise.all([
                        getDepartments(),
                        getDesignations(),
                        getStates(),
                        getCountries(),
                    ]);
                setDepartments(departmentResponse.data);
                setDesignations(designationResponse.data);
                setStates(stateResponse.data);
                setCountries(countryResponse.data);
            } catch (error) {
                console.error("Failed to load lookups", error);
            }
        };
        loadLookups();
    }, [open]);

    useEffect(() => {
        if (!open) {
            lastRequestRef.current = "";
            return;
        }
        const requestKey = `${departmentId}-${page}-${rowsPerPage}-${sortBy}-${direction}`;
        if (lastRequestRef.current === requestKey) {
            return;
        }
        lastRequestRef.current = requestKey;
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await getEmployees(
                    page,
                    rowsPerPage,
                    sortBy,
                    direction,
                    { departmentId }
                );
                setEmployees(res.data.content);
                setTotalCount(res.data.totalElements);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [open, departmentId, page, rowsPerPage, sortBy, direction]);

    const handleSortChange = (column: string) => {
        if (sortBy === column) {
            setDirection(direction === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setDirection("asc");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {departmentName} — Employees
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <ReactTable
                        columns={employeeColumns}
                        rows={employees}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        totalCount={totalCount}
                        sortBy={sortBy}
                        direction={direction}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                        onSortChange={handleSortChange}
                        emptyMessage="No employees found in this department"
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default EmployeeListModal;