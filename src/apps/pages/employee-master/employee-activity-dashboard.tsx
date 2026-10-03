import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { Alert, Box, CircularProgress, IconButton, Link, Snackbar, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ReactTable, { type EmployeeTableColumn } from "../../components/common/ReactTable";
import StatusChip from "../../components/common/StatusChip";
import ActionButtons from "../../components/common/ActionButton";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmployeeDialog from "../../components/common/Dialog";
import ExcelUpload, { type ExcelUploadResponse } from "../../components/common/ExcelUpload";
import AddEmployee from "./add-employee-array-form";
import UpdateEmployee from "./update-employee-form";
import { getReportingManagerName, type Dropdown, type Employee, type EmployeeFilterValues } from "./employeeTypes";
import { getDepartments, getDesignations, getStates, getCountries, uploadEmployeeExcel, getCities, downloadEmployeeTemplate, downloadEmployeeAttachment } from "./employeeApi";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { fetchEmployeeCounts, fetchEmployees, deleteEmployee, } from "../store/slices/employee-slice";
import EmployeeFabActions from "../../components/common/FavAction";
import EmployeeFilter from "./employee-filters";
import { AttachmentDownloadButton } from "../../components/common/Attachment";
import EmployeeHistoryDialog from "../../components/common/EmployeeHistoryDialog";
import EmployeeExcelDownloadDialog from "../../components/common/EmployeeExcelDownloadDialog";

const EmployeeActivityBoard = () => {
    const dispatch = useAppDispatch();
    const initialLoadRef = useRef(false);
    const [resetSignal, setResetSignal] = useState(0);
    const [countMode, setCountMode] = useState<"date" | "beginning">("date");
    const { employees, loading, totalEmployees, totalElements, activeEmployees, inactiveEmployees, } = useAppSelector((state) => state.employee);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState("id");
    const [direction, setDirection] = useState<"asc" | "desc">("desc");
    const [hardRefreshing, setHardRefreshing] = useState(false);

    const [appliedFilters, setAppliedFilters] =
        useState<EmployeeFilterValues>({
            search: "",
            dateFrom: dayjs().subtract(7, "day"),
            dateTo: dayjs(),
            department: "",
            designation: "",
            status: "active",
            city: "",
        });
    const [currentFilters, setCurrentFilters] = useState<EmployeeFilterValues>(appliedFilters);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const dateFromKey = appliedFilters.dateFrom ? dayjs(appliedFilters.dateFrom).format("YYYY-MM-DD") : "";
    const dateToKey = appliedFilters.dateTo ? dayjs(appliedFilters.dateTo).format("YYYY-MM-DD") : "";

    useEffect(() => {
        if (countMode === "date") {
            dispatch(fetchEmployeeCounts({
                fromDate: dateFromKey || undefined,
                toDate: dateToKey || undefined,
            }));
        } else {
            dispatch(fetchEmployeeCounts());
        }
    }, [dispatch, countMode, dateFromKey, dateToKey]);

    useEffect(() => {
        if (isSearchActive) {
            return;
        }

        dispatch(fetchEmployees({
            page,
            size: rowsPerPage,
            sortBy,
            direction,
            filters: {
                departmentId: appliedFilters.department ? Number(appliedFilters.department) : undefined,
                designationId: appliedFilters.designation ? Number(appliedFilters.designation) : undefined,
                city: appliedFilters.city?.trim() || undefined,
                status: appliedFilters.status === "active" ? false
                    : appliedFilters.status === "inactive" ? true : undefined,
                fromDate: countMode === "beginning" ? undefined
                    : (appliedFilters.dateFrom ? dayjs(appliedFilters.dateFrom).format("YYYY-MM-DD") : undefined),
                toDate: countMode === "beginning" ? undefined
                    : (appliedFilters.dateTo ? dayjs(appliedFilters.dateTo).format("YYYY-MM-DD") : undefined),
            },
        }));
    }, [
        dispatch,
        page,
        rowsPerPage,
        sortBy,
        direction,
        appliedFilters,
        isSearchActive,
    ]);

    const [, setShowAddEmployee] = useState(false);
    const [showUpdateEmployee, setShowUpdateEmployee] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyEmployee, setHistoryEmployee] = useState<Employee | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showArrayForm, setShowArrayForm] = useState(false);
    const [departments, setDepartments] = useState<Dropdown[]>([]);
    const [designations, setDesignations] = useState<Dropdown[]>([]);
    const [states, setStates] = useState<Dropdown[]>([]);
    const [countries, setCountries] = useState<Dropdown[]>([]);
    const [cities, setCities] = useState<Dropdown[]>([]);
    const [searchResults, setSearchResults] = useState<Employee[]>([]);
    const [excelDialogOpen, setExcelDialogOpen] = useState(false);
    const [excelResultOpen, setExcelResultOpen] = useState(false);
    const [excelResponse, setExcelResponse] = useState<ExcelUploadResponse | null>(null);
    const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
    const [excelSuccessMessage, setExcelSuccessMessage] = useState("");
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    useEffect(() => {
        if (initialLoadRef.current) {
            return;
        }
        initialLoadRef.current = true;
        const loadDropdowns = async () => {
            try {
                const [
                    departmentResponse,
                    designationResponse,
                    stateResponse,
                    countryResponse,
                    cityResponse,
                ] = await Promise.all([
                    getDepartments(),
                    getDesignations(),
                    getStates(),
                    getCountries(),
                    getCities(),
                ]);
                setDepartments(departmentResponse.data);
                setDesignations(designationResponse.data);
                setStates(stateResponse.data);
                setCountries(countryResponse.data);
                setCities(cityResponse.data);
            } catch (error) {
                console.error(error);
            }
        };
        loadDropdowns();
    }, []);

    const blurActiveElement = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    };

    const handleOpenArrayForm = () => {
        blurActiveElement();
        setShowArrayForm(true);
    };

    const handleOpenExcelUpload = () => {
        blurActiveElement();
        setExcelDialogOpen(true);
    };

    const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(Number(event.target.value));
        setPage(0);
    };

    const handleSortChange = (columnId: string) => {
        if (sortBy === columnId) {
            setDirection((prev) => prev === "asc" ? "desc" : "asc");
        } else {
            setSortBy(columnId);
            setDirection("asc");
        }
        setPage(0);
    };

    const handleBackFromForm = () => {
        setShowAddEmployee(false);
        setShowUpdateEmployee(false);
        setSelectedEmployee(null);
    };

    const handleSearch = (filters: EmployeeFilterValues) => {
        setAppliedFilters(filters);
        setIsSearchActive(false);
        setPage(0);
    };

    const handleGlobalSearch = (_filters: EmployeeFilterValues, results: Employee[]) => {
        setSearchResults(results);
        setIsSearchActive(true);
        setPage(0);
    };

    const handleGlobalSearchClear = () => {
        setSearchResults([]);
        setIsSearchActive(false);
        setPage(0);
    };

    const refreshEmployeeData = async (modeOverride?: "date" | "beginning") => {
        const effectiveMode = modeOverride ?? countMode;

        if (effectiveMode === "date") {
            await dispatch(fetchEmployeeCounts({
                fromDate: dateFromKey || undefined,
                toDate: dateToKey || undefined,
            }));
        } else {
            await dispatch(fetchEmployeeCounts());
        }
        await dispatch(
            fetchEmployees({
                page,
                size: rowsPerPage,
                sortBy,
                direction,
                filters: {
                    departmentId: appliedFilters.department
                        ? Number(appliedFilters.department)
                        : undefined,
                    designationId: appliedFilters.designation
                        ? Number(appliedFilters.designation)
                        : undefined,
                    city: appliedFilters.city?.trim() || undefined,
                    status:
                        appliedFilters.status === "active"
                            ? false
                            : appliedFilters.status === "inactive"
                                ? true
                                : undefined,
                    fromDate: effectiveMode === "beginning"
                        ? undefined
                        : (dateFromKey || undefined),
                    toDate: effectiveMode === "beginning"
                        ? undefined
                        : (dateToKey || undefined),
                },
            })
        );
    };

    const handleHardRefresh = () => {
        if (hardRefreshing) return;
        setHardRefreshing(true);
        setResetSignal((s) => s + 1);
        setTimeout(() => setHardRefreshing(false), 1000);
    };

    const handleReset = () => {
        const resetFilters: EmployeeFilterValues = {
            search: "",
            dateFrom: dayjs().subtract(7, "day"),
            dateTo: dayjs(),
            department: "",
            designation: "",
            status: "active",
            city: "",
        };

        setAppliedFilters(resetFilters);
        setSearchResults([]);
        setIsSearchActive(false);
        setPage(0);
    };

    const handleEdit = (row: Employee) => {
        setSelectedEmployee(row);
        setShowAddEmployee(false);
        setShowUpdateEmployee(true);
    };

    const handleDelete = (row: Employee) => {
        blurActiveElement();
        setSelectedEmployee(row);
        setDeleteDialogOpen(true);
    };

    const handleOpenHistory = (row: Employee) => {
        blurActiveElement();
        setHistoryEmployee(row);
        setHistoryOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedEmployee?.id == null) {
            return;
        }
        try {
            setDeleting(true);
            await dispatch(deleteEmployee(selectedEmployee.id)).unwrap();
            setSelectedEmployee(null);
            setSnackbarSeverity("success");
            setSnackbarMessage("Employee deleted successfully.");
            await refreshEmployeeData();
        } catch (error: unknown) {
            const backendError = error as {
                message?: string;
                error?: string;
            };

            setSnackbarSeverity("error");
            setSnackbarMessage(backendError.error || backendError.message || "Failed to delete employee.");
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
        }
    };

    const handleCancelDelete = () => {
        if (deleting) {
            return;
        }
        setDeleteDialogOpen(false);
        setSelectedEmployee(null);
    };

    const handleDownloadTemplate = async () => {
        try {
            const blob = await downloadEmployeeTemplate();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "employee_template.xlsx";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setSnackbarMessage("Employee template downloaded successfully.");
            setSnackbarSeverity("success");
        } catch (error: any) {
            const message = error.response?.data?.error || error.response?.data?.message ||
                "Failed to download employee template.";
            setSnackbarMessage(message);
            setSnackbarSeverity("error");
        }
    };

    const handleDownloadAttachment = async (path: string) => {
        try {
            const { blob, filename } = await downloadEmployeeAttachment(path);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
    };
    const columns: EmployeeTableColumn<Employee>[] = [
        {
            id: "actions",
            label: "Actions",
            minWidth: 130,
            align: "center",
            render: (row) => (
                <ActionButtons
                    onEdit={() => handleEdit(row)}
                    onDelete={row.status === false ? () => handleDelete(row) : undefined}
                />
            ),
        },
        {
            id: "employeeCode",
            label: "Employee Code",
            minWidth: 130,
            align: "center",
            render: (row) => (
                <Link
                    component="button"
                    type="button"
                    underline="hover"
                    onClick={() => handleOpenHistory(row)}
                    sx={{ fontSize: "12.5px", fontWeight: 600, color: "#2563eb", textAlign: "left" }}>
                    {row.employeeCode}
                </Link>
            ),
        },
        {
            id: "employeeName",
            label: "Employee Name",
            minWidth: 170,
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
            id: "communicationName",
            label: "Communication Name",
            minWidth: 180,
            render: (row) => row.communicationName || "N/A",
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
            id: "status",
            label: "Status",
            minWidth: 100,
            align: "center",
            render: (row) => (<StatusChip status={row.status} />),
        },
        {
            id: "profileImage",
            label: "Profile Image",
            minWidth: 130,
            align: "center",
            render: (row) => (
                <AttachmentDownloadButton
                    path={row.profileImage}
                    kind="image"
                    onDownload={handleDownloadAttachment}
                    fetchAttachment={downloadEmployeeAttachment}
                />
            ),
        },
        {
            id: "documents",
            label: "Documents",
            minWidth: 130,
            align: "center",
            render: (row) => (
                <AttachmentDownloadButton
                    path={row.documents}
                    kind="document"
                    onDownload={handleDownloadAttachment}
                    fetchAttachment={downloadEmployeeAttachment}
                    showView={false}
                />
            ),
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

    return (
        <>
            {showUpdateEmployee ? (
                <UpdateEmployee
                    departments={departments}
                    designations={designations}
                    states={states}
                    countries={countries}
                    cities={cities}
                    onBack={handleBackFromForm}
                    onUpdateSuccess={refreshEmployeeData}
                    onUpdateMessage={(message, severity) => {
                        setSnackbarMessage(message);
                        setSnackbarSeverity(severity);
                    }}
                    employee={selectedEmployee}
                />
            ) : (
                <>
                    <Box sx={{ width: "100%", minWidth: 0 }}>
                        {/* Heading */}

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 3,
                                cursor: "default",
                            }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.2,
                                    px: 1.5,
                                    py: 0.7,
                                    borderRadius: "10px",
                                    backgroundColor: "#eff6ff",
                                    transition: "all 0.25s ease",
                                    "&:hover": { backgroundColor: "#dbeafe" },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 38,
                                        height: 38,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "10px",
                                        backgroundColor: "#2563eb",
                                        color: "#fff",
                                    }}
                                >
                                    <PeopleAltOutlinedIcon sx={{ fontSize: 23 }} />
                                </Box>
                                <Typography
                                    component="h2"
                                    sx={{
                                        fontSize: { xs: "20px", sm: "22px", md: "24px" },
                                        fontWeight: 700,
                                        color: "#2563eb",
                                        letterSpacing: "0.2px",
                                    }}>
                                    Employee Master Activity Board
                                </Typography>
                            </Box>

                            <IconButton
                                onClick={handleHardRefresh}
                                disabled={hardRefreshing}
                                sx={{
                                    backgroundColor: "#2563eb",
                                    color: "#fff",
                                    width: 42,
                                    height: 42,
                                    "&:hover": { backgroundColor: "#1d4ed8" },
                                    "&.Mui-disabled": { backgroundColor: "#93c5fd", color: "#fff" },
                                }}
                            >
                                {hardRefreshing ? (
                                    <CircularProgress size={20} sx={{ color: "#fff" }} />
                                ) : (
                                    <RefreshIcon />
                                )}
                            </IconButton>
                        </Box>

                        {/* Filter + Status Summary */}
                        <Box
                            sx={{
                                width: "100%",
                                p: { xs: 1.5, sm: 2, md: 2.5 },
                                borderRadius: "12px",
                                border: "1px solid #e2e8f0",
                                backgroundColor: "#ffffff",
                                boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
                                boxSizing: "border-box",
                            }}>
                            <Box sx={{ width: "100%" }}>
                                <EmployeeFilter
                                    departments={departments}
                                    designations={designations}
                                    cities={cities}
                                    onSearch={handleSearch}
                                    onFiltersChange={setCurrentFilters}
                                    onGlobalSearch={handleGlobalSearch}
                                    onGlobalSearchClear={handleGlobalSearchClear}
                                    onReset={handleReset}
                                    totalEmployees={totalEmployees}
                                    activeEmployees={activeEmployees}
                                    inactiveEmployees={inactiveEmployees}
                                    filteredTotal={totalElements}
                                    countMode={countMode}
                                    onCountModeChange={setCountMode}
                                    onDownloadClick={() => {
                                        blurActiveElement();
                                        setDownloadDialogOpen(true);
                                    }}
                                    resetSignal={resetSignal}
                                />
                            </Box>
                        </Box>

                        <Box
                            sx={{ width: "100%", minWidth: 0, mt: 2, }}>
                            <ReactTable
                                columns={columns}
                                rows={isSearchActive ? searchResults : employees}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                totalCount={totalElements}
                                sortBy={sortBy}
                                direction={direction}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                onSortChange={handleSortChange}
                                emptyMessage={loading ? "Loading employees..." : "No employees found"}
                            />
                            <ConfirmDialog
                                open={deleteDialogOpen}
                                title="Confirm Delete"
                                message={`Are you sure you want to delete ${selectedEmployee?.employeeName}?`}
                                confirmText="Delete"
                                cancelText="Cancel"
                                loading={deleting}
                                onConfirm={handleConfirmDelete}
                                onCancel={handleCancelDelete}
                            />
                        </Box>
                        <EmployeeFabActions
                            onDownloadTemplate={handleDownloadTemplate}
                            onUploadExcel={handleOpenExcelUpload}
                            onAddEmployee={handleOpenArrayForm}
                        />
                    </Box>
                    {/* EMPLOYEE HISTORY DIALOG */}
                    <EmployeeHistoryDialog
                        open={historyOpen}
                        employee={historyEmployee}
                        onClose={() => setHistoryOpen(false)}
                        lookups={{
                            departmentId: departments,
                            designationId: designations,
                            stateId: states,
                            countryId: countries,
                        }}
                    />
                    <EmployeeExcelDownloadDialog
                        open={downloadDialogOpen}
                        onClose={() => setDownloadDialogOpen(false)}
                        fromDate={currentFilters.dateFrom}
                        toDate={currentFilters.dateTo}
                        filters={{
                            departmentId: appliedFilters.department ? Number(appliedFilters.department) : undefined,
                            designationId: appliedFilters.designation ? Number(appliedFilters.designation) : undefined,
                            city: appliedFilters.city?.trim() || undefined,
                            status: appliedFilters.status === "active" ? false : appliedFilters.status === "inactive" ? true : undefined,
                        }}
                        onResult={(message, severity) => {
                            setSnackbarMessage(message);
                            setSnackbarSeverity(severity);
                        }}
                    />

                    {/* ADD EMPLOYEE DIALOG */}
                    <EmployeeDialog
                        open={showArrayForm}
                        onClose={() => setShowArrayForm(false)}
                        title="Add Employee"
                        maxWidth="lg">
                        <AddEmployee
                            departments={departments}
                            designations={designations}
                            states={states}
                            countries={countries}
                            cities={cities}
                            onBack={() => setShowArrayForm(false)}
                            onSaveSuccess={refreshEmployeeData}
                        />
                    </EmployeeDialog>
                    {/* EXCEL UPLOAD DIALOG */}
                    <EmployeeDialog
                        open={excelDialogOpen}
                        onClose={() => setExcelDialogOpen(false)}
                        title="Upload Employee Excel"
                        maxWidth="sm">
                        <ExcelUpload
                            onUpload={async (file) => { return await uploadEmployeeExcel(file); }}
                            onUploadComplete={(result) => {
                                setExcelResponse(result);
                                setExcelDialogOpen(false);
                                setExcelResultOpen(true);
                            }}
                            onCancel={() => setExcelDialogOpen(false)}
                        />
                    </EmployeeDialog>

                    <EmployeeDialog
                        open={excelResultOpen}
                        onClose={() => {
                            setExcelResultOpen(false);
                            setExcelResponse(null);
                        }}
                        title="Employee Excel Upload Result"
                        maxWidth="xl">
                        {excelResponse && (
                            <ExcelUpload
                                responseData={excelResponse}
                                onUpload={async () => { return excelResponse; }}
                                onSaveComplete={async (result) => {
                                    setExcelResultOpen(false);
                                    setExcelResponse(null);
                                    setExcelSuccessMessage(`${result.successCount} employee(s) saved successfully.`);
                                    await refreshEmployeeData();
                                }}
                                onCancel={() => {
                                    setExcelResultOpen(false);
                                    setExcelResponse(null);
                                }}
                            />
                        )}
                    </EmployeeDialog>
                    <Snackbar
                        open={Boolean(excelSuccessMessage)}
                        autoHideDuration={4000}
                        onClose={() => setExcelSuccessMessage("")}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right", }}>
                        <Alert
                            severity="success"
                            variant="filled"
                            onClose={() => setExcelSuccessMessage("")}>
                            {excelSuccessMessage}
                        </Alert>
                    </Snackbar>
                    <Snackbar
                        open={Boolean(snackbarMessage)}
                        autoHideDuration={4000}
                        onClose={() => setSnackbarMessage("")}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right", }}>
                        <Alert
                            severity={snackbarSeverity}
                            variant="filled"
                            onClose={() => setSnackbarMessage("")}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </>
            )}
        </>
    );
}

export default EmployeeActivityBoard;