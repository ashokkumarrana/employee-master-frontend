import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Divider,
    Paper,
    Typography,
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

import type { EmployeeTableColumn } from "./ReactTable";
import ReactTable from "./ReactTable";

import { useAppDispatch } from "../../pages/hooks/useAppDispatch";
import { addExcelUploadSummary } from "../../pages/store/slices/employee-slice";
import { saveEmployeeExcel } from "../../pages/employee-master/employeeApi";

export interface EmployeeExcelData {
    rowNumber: number;
    errorMessage: string;
    employeeCode: string;
    employeeName: string;
    communicationName: string;
    departmentName: string;
    designationName: string;
    reportingManagerCode: string;
    employeeType: string;
    gender: string;
    maritalStatus: string;
    skills: string;
    languages: string;
    mobile: string;
    alternateMobile: string;
    email: string;
    alternateEmail: string;
    dob: string;
    joiningDate: string;
    address: string;
    city: string;
    stateName: string;
    countryName: string;
    zipCode: string;
    bloodGroup: string;
    status: string;
}

export interface ExcelUploadResponse {
    totalRows: number;
    successCount: number;
    failureCount: number;
    duplicateCount: number;
    correctData: EmployeeExcelData[];
    incorrectData: EmployeeExcelData[];
    duplicateData: EmployeeExcelData[];
    attachmentName?: string;
    attachmentContent?: string;
}

interface ExcelUploadProps {
    onUpload: (file: File) => Promise<ExcelUploadResponse>;
    onUploadComplete?: (response: ExcelUploadResponse) => void;
    onSaveComplete?: (response: ExcelUploadResponse) => void;
    responseData?: ExcelUploadResponse | null;
    onCancel: () => void;
    onExcelMessage?: (
        message: string,
        severity: "success" | "error"
    ) => void;
}

const outlinedButtonSx = {
    textTransform: "none",
    borderRadius: "8px",
    borderColor: "#dbe3ef",
    color: "#334155",
    "&:hover": {
        borderColor: "#94a3b8",
        backgroundColor: "#f8fafc",
    },
};

const primaryButtonSx = {
    textTransform: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    boxShadow: "none",
    "&:hover": {
        backgroundColor: "#1e3a8a",
        boxShadow: "none",
    },
};

const ExcelUpload = ({
    onUpload,
    onUploadComplete,
    onSaveComplete,
    responseData,
    onCancel,
    onExcelMessage,
}: ExcelUploadProps) => {
    const dispatch = useAppDispatch();

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] =
        useState<ExcelUploadResponse | null>(responseData ?? null);
    const [error, setError] = useState("");

    const [incorrectPage, setIncorrectPage] = useState(0);
    const [incorrectRowsPerPage, setIncorrectRowsPerPage] = useState(10);

    // Selected summary card
    const [selectedCard, setSelectedCard] = useState<"total" | "correct" | "incorrect" | "duplicate">("total");

    useEffect(() => {
        setResponse(responseData ?? null);
    }, [responseData]);

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        if (!/\.xlsx$/i.test(selectedFile.name)) {
            setError("Please select a valid Excel file (.xlsx).");
            setFile(null);
            setResponse(null);
            return;
        }

        setError("");
        setFile(selectedFile);
        setResponse(null);
        setIncorrectPage(0);
        setSelectedCard("total");
    };

    const handleUpload = async () => {
        if (!file) {
            return;
        }

        try {
            setLoading(true);
            setError("");

            const result = await onUpload(file);

            setResponse(result);
            setIncorrectPage(0);
            setSelectedCard("total");

            onUploadComplete?.(result);
        } catch (error: any) {
            const message = error.response?.data?.error || error.response?.data?.message ||
                "Excel upload failed. Please try again.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!response?.correctData?.length) {
            return;
        }

        try {
            setLoading(true);
            setError("");

            const result = await saveEmployeeExcel(response);

            dispatch(
                addExcelUploadSummary({
                    totalRows: result.totalRows,
                    successCount: result.successCount,
                    failureCount: result.failureCount,
                    duplicateCount: result.duplicateCount,
                    attachmentName: result.attachmentName,
                    attachmentContent: result.attachmentContent,
                })
            );

            onSaveComplete?.(result);

            onExcelMessage?.(
                `${result.successCount} employee(s) saved successfully.`,
                "success"
            );
        } catch (error: any) {
            const message = error.response?.data?.error || error.response?.data?.message ||
                "Failed to save employee records. Please try again.";

            setError(message);
            onExcelMessage?.(message, "error");
        } finally {
            setLoading(false);
        }
    };

    const incorrectDataColumns: EmployeeTableColumn<EmployeeExcelData>[] = [
        {
            id: "rowNumber",
            label: "Row",
            minWidth: 60,
            align: "center",
            sortable: false,
        },
        {
            id: "employeeCode",
            label: "Employee Code",
            minWidth: 130,
            sortable: false,
        },
        {
            id: "employeeName",
            label: "Employee Name",
            minWidth: 150,
            sortable: false,
        },
        {
            id: "communicationName",
            label: "Communication Name",
            minWidth: 160,
            sortable: false,
        },
        {
            id: "departmentName",
            label: "Department Name",
            minWidth: 140,
            sortable: false,
        },
        {
            id: "designationName",
            label: "Designation Name",
            minWidth: 140,
            sortable: false,
        },
        {
            id: "reportingManagerCode",
            label: "Reporting Manager Code",
            minWidth: 170,
            sortable: false,
        },
        {
            id: "employeeType",
            label: "Employee Type",
            minWidth: 120,
            sortable: false,
        },
        {
            id: "gender",
            label: "Gender",
            minWidth: 90,
            sortable: false,
        },
        {
            id: "maritalStatus",
            label: "Marital Status",
            minWidth: 120,
            sortable: false,
        },
        {
            id: "skills",
            label: "Skills",
            minWidth: 150,
            sortable: false,
        },
        {
            id: "languages",
            label: "Languages",
            minWidth: 120,
            sortable: false,
        },
        {
            id: "mobile",
            label: "Mobile",
            minWidth: 120,
            sortable: false,
        },
        {
            id: "alternateMobile",
            label: "Alternate Mobile",
            minWidth: 140,
            sortable: false,
        },
        {
            id: "email",
            label: "Email",
            minWidth: 180,
            sortable: false,
        },
        {
            id: "alternateEmail",
            label: "Alternate Email",
            minWidth: 180,
            sortable: false,
        },
        {
            id: "dob",
            label: "DOB",
            minWidth: 110,
            sortable: false,
        },
        {
            id: "joiningDate",
            label: "Joining Date",
            minWidth: 120,
            sortable: false,
        },
        {
            id: "address",
            label: "Address",
            minWidth: 200,
            sortable: false,
        },
        {
            id: "city",
            label: "City",
            minWidth: 100,
            sortable: false,
        },
        {
            id: "stateName",
            label: "State Name",
            minWidth: 120,
            sortable: false,
        },
        {
            id: "countryName",
            label: "Country Name",
            minWidth: 120,
            sortable: false,
        },
        {
            id: "zipCode",
            label: "Zip Code",
            minWidth: 100,
            sortable: false,
        },
        {
            id: "bloodGroup",
            label: "Blood Group",
            minWidth: 110,
            sortable: false,
        },
        {
            id: "status",
            label: "Status",
            minWidth: 90,
            sortable: false,
        },
        {
            id: "errorMessage",
            label: "Reason / Error",
            minWidth: 300,
            sortable: false,
            render: (row) => (
                <Typography
                    variant="body2"
                    sx={{
                        minWidth: 280,
                        fontWeight: 600,
                        color:
                            row.errorMessage === "Valid"
                                ? "success.main"
                                : "error.main",
                    }}
                >
                    {row.errorMessage}
                </Typography>
            ),
        },
    ];


    const correctData: EmployeeExcelData[] = response
        ? response.correctData.map((row) => ({
            ...row,
            errorMessage: "Valid",
        }))
        : [];

    const incorrectData: EmployeeExcelData[] =
        response?.incorrectData ?? [];

    const duplicateData: EmployeeExcelData[] =
        response?.duplicateData ?? [];

    const combinedData: EmployeeExcelData[] = [
        ...correctData,
        ...incorrectData,
        ...duplicateData,
    ];

    const selectedData: EmployeeExcelData[] =
        selectedCard === "correct"
            ? correctData
            : selectedCard === "incorrect"
                ? incorrectData
                : selectedCard === "duplicate"
                    ? duplicateData
                    : combinedData;

    const tableRows = selectedData.slice(
        incorrectPage * incorrectRowsPerPage,
        incorrectPage * incorrectRowsPerPage +
        incorrectRowsPerPage
    );

    const summaryCards = response
        ? [
            {
                key: "total" as const,
                label: "Total Rows",
                count: response.totalRows,
                background: "#dbeafe",
                color: "#1e40af",
                icon: (
                    <TableRowsOutlinedIcon sx={{ fontSize: 22 }} />
                ),
            },
            {
                key: "correct" as const,
                label: "Valid Records",
                count: response.successCount,
                background: "#dcfce7",
                color: "#166534",
                icon: (
                    <CheckCircleIcon sx={{ fontSize: 22 }} />
                ),
            },
            {
                key: "incorrect" as const,
                label: "Invalid Records",
                count: response.failureCount,
                background: "#fee2e2",
                color: "#991b1b",
                icon: (
                    <CancelOutlinedIcon sx={{ fontSize: 22 }} />
                ),
            },
            {
                key: "duplicate" as const,
                label: "Duplicate Records",
                count: response.duplicateCount,
                background: "#fef3c7",
                color: "#92400e",
                icon: (
                    <ContentCopyOutlinedIcon sx={{ fontSize: 22 }} />
                ),
            },
        ]
        : [];

    return (
        <Box sx={{ p: 0.5 }}>
            {!response && (
                <>
                    <Typography
                        sx={{
                            mb: 0.5,
                            fontWeight: 700,
                            fontSize: "18px",
                            color: "#1e293b",
                            textAlign: "center",
                        }}
                    >
                        Upload Employees via Excel
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            mb: 3,
                            textAlign: "center",
                            color: "#64748b",
                        }}
                    >
                        Select an Excel file to upload employee records
                    </Typography>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2, borderRadius: "8px" }}
                        >
                            {error}
                        </Alert>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<UploadFileIcon />}
                            sx={outlinedButtonSx}
                        >
                            Select Excel File

                            <input
                                type="file"
                                hidden
                                accept=".xlsx"
                                onChange={handleFileChange}
                            />
                        </Button>
                    </Box>

                    {file && (
                        <Paper
                            variant="outlined"
                            sx={{
                                mt: 2,
                                p: 1.5,
                                textAlign: "center",
                                borderRadius: "8px",
                                borderColor: "#dbe3ef",
                                backgroundColor: "#f8fafc",
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{ color: "#64748b" }}
                            >
                                Selected File
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    mt: 0.5,
                                    fontWeight: 600,
                                    color: "#1e293b",
                                }}
                            >
                                {file.name}
                            </Typography>
                        </Paper>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 3,
                        }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<UploadFileIcon />}
                            disabled={!file || loading}
                            onClick={handleUpload}
                            sx={{
                                ...primaryButtonSx,
                                minWidth: 130,
                            }}
                        >
                            {loading ? "Uploading..." : "Upload"}
                        </Button>
                    </Box>
                </>
            )}

            {response && (
                <Box sx={{ mt: 1 }}>
                    <Divider sx={{ mb: 2 }} />

                    <Typography
                        sx={{
                            mb: 2,
                            fontWeight: 700,
                            fontSize: "18px",
                            color: "#1e293b",
                            textAlign: "center",
                        }}
                    >
                        Excel Upload Result
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(4, minmax(0, 1fr))",
                            },
                            gap: {
                                xs: 1,
                                sm: 1.5,
                            },
                            mb: 3,
                        }}
                    >
                        {summaryCards.map((card) => {
                            const isSelected =
                                selectedCard === card.key;

                            return (
                                <Box
                                    key={card.label}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => {
                                        setSelectedCard(card.key);
                                        setIncorrectPage(0);
                                    }}
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === "Enter" || event.key === " "
                                        ) {
                                            setSelectedCard(card.key);
                                            setIncorrectPage(0);
                                        }
                                    }}
                                    sx={{
                                        width: "100%",
                                        minWidth: 0,
                                        minHeight: { xs: 82, sm: 96, },
                                        borderRadius: 1.5,
                                        backgroundColor: card.background,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: card.color,
                                        position: "relative",
                                        overflow: "hidden",
                                        boxSizing: "border-box",
                                        cursor: "pointer",

                                        border: isSelected
                                            ? `2px solid ${card.color}`
                                            : "2px solid transparent",

                                        boxShadow: isSelected
                                            ? "0 4px 12px rgba(15, 23, 42, 0.15)"
                                            : "none",

                                        transform: isSelected
                                            ? "translateY(-2px)"
                                            : "none",

                                        transition:
                                            "all 0.2s ease",

                                        "&:hover": {
                                            transform:
                                                "translateY(-2px)",
                                            boxShadow:
                                                "0 4px 12px rgba(15, 23, 42, 0.12)",
                                        },

                                        "&:focus-visible": {
                                            outline: `2px solid ${card.color}`,
                                            outlineOffset: 2,
                                        },

                                        "&::before": {
                                            content: '""',
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 3,
                                            backgroundColor:
                                                card.color,
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: {
                                                xs: 32,
                                                sm: 38,
                                            },
                                            height: {
                                                xs: 32,
                                                sm: 38,
                                            },
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor:
                                                "#ffffff",
                                            color: card.color,
                                            boxShadow:
                                                "0 2px 7px rgba(15, 23, 42, 0.10)",
                                            mb: 0.5,
                                        }}
                                    >
                                        {card.icon}
                                    </Box>

                                    <Typography
                                        component="span"
                                        sx={{
                                            fontSize: {
                                                xs: 11,
                                                sm: 12,
                                            },
                                            fontWeight: 600,
                                            color: card.color,
                                            textAlign: "center",
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {card.label}
                                    </Typography>

                                    <Typography
                                        component="span"
                                        sx={{
                                            fontSize: {
                                                xs: 18,
                                                sm: 21,
                                            },
                                            lineHeight: 1.2,
                                            fontWeight: 700,
                                            color: "#1e293b",
                                            mt: 0.2,
                                        }}
                                    >
                                        {card.count}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>

                    {response.successCount > 0 && (
                        <Alert
                            severity="success"
                            sx={{
                                borderRadius: "8px",
                                mb:
                                    response.failureCount > 0 ||
                                        response.duplicateCount > 0
                                        ? 1.5
                                        : 0,
                            }}
                        >
                            {response.successCount} employee(s) are
                            ready to be saved. Please click the{" "}
                            <strong>Save</strong> button below to
                            confirm and save these employees.
                        </Alert>
                    )}

                    {/* {response.failureCount > 0 && (
                        <Alert
                            severity="error"
                            sx={{
                                borderRadius: "8px",
                                mb:
                                    response.duplicateCount > 0
                                        ? 1.5
                                        : 0,
                            }}
                        >
                            {response.failureCount} employee(s) have
                            validation errors and will not be saved.
                            Please review the incorrect records below.
                        </Alert>
                    )}

                    {response.duplicateCount > 0 && (
                        <Alert
                            severity="warning"
                            sx={{ borderRadius: "8px" }}
                        >
                            {response.duplicateCount} employee(s) are
                            duplicates and will not be saved. Please
                            review the duplicate records below.
                        </Alert>
                    )} */}

                    <Box sx={{ mt: 2 }}>
                        <Box
                            sx={{
                                mb: 1.5,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    fontSize: "14px",
                                    color: "#1e293b",
                                }}
                            >
                                {selectedCard === "total"
                                    ? "All Uploaded Data"
                                    : selectedCard === "correct"
                                        ? "Correct Records"
                                        : selectedCard === "incorrect"
                                            ? "Incorrect Records"
                                            : "Duplicate Records"}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ color: "#64748b" }}
                            >
                                {selectedData.length} row(s)
                            </Typography>
                        </Box>

                        <ReactTable
                            columns={incorrectDataColumns}
                            rows={tableRows}
                            page={incorrectPage}
                            rowsPerPage={incorrectRowsPerPage}
                            totalCount={selectedData.length}
                            sortBy=""
                            direction="asc"
                            onPageChange={(_event, newPage) => {
                                setIncorrectPage(newPage);
                            }}
                            onRowsPerPageChange={(event) => {
                                setIncorrectRowsPerPage(
                                    parseInt(
                                        event.target.value,
                                        10
                                    )
                                );
                                setIncorrectPage(0);
                            }}
                            onSortChange={() => { }}
                            emptyMessage="No data found"
                        />
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1.5,
                            mt: 2,
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={onCancel}
                            disabled={loading}
                            sx={outlinedButtonSx}
                        >
                            Back
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={
                                loading ||
                                !response?.correctData?.length
                            }
                            sx={primaryButtonSx}
                        >
                            {loading
                                ? "Saving..."
                                : response?.correctData?.length
                                    ? `Confirm & Save ${response.correctData.length} Employees`
                                    : "Save Employees"}
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default ExcelUpload;
