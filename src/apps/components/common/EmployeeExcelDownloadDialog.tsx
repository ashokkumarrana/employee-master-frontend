import { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Alert,
    CircularProgress,
    Stack,
    Divider,
} from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import type { Dayjs } from "dayjs";
import EmployeeDialog from "../../components/common/Dialog";
import { downloadEmployees } from "../../pages/employee-master/employeeApi";
import { useAppDispatch } from "../../pages/hooks/useAppDispatch";
import { addExcelDownloadSummary } from "../../pages/store/slices/employee-slice";

const MAX_DIRECT_DOWNLOAD_DAYS = 7;

interface EmployeeExcelDownloadDialogProps {
    open: boolean;
    onClose: () => void;
    fromDate: Dayjs | null;
    toDate: Dayjs | null;
    onResult: (message: string, severity: "success" | "error") => void;
    filters?: {
        departmentId?: number | string;
        designationId?: number | string;
        city?: string;
        status?: boolean;
    };
}

const EmployeeExcelDownloadDialog = ({
    open,
    onClose,
    fromDate,
    toDate,
    onResult,
    filters,
}: EmployeeExcelDownloadDialogProps) => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    const hasRange = Boolean(fromDate && toDate && fromDate.isValid() && toDate.isValid());
    const selectedDays = hasRange ? toDate!.diff(fromDate!, "day") : 0;
    const isInvalidRange = hasRange && selectedDays < 0;
    const isDirectDownload = hasRange && selectedDays >= 0 && selectedDays <= MAX_DIRECT_DOWNLOAD_DAYS;

    const handleClose = () => {
        if (loading) return;
        onClose();
    };

    const handleAction = async () => {
        if (!fromDate || !toDate || isInvalidRange) return;
        try {
            setLoading(true);
            const from = fromDate.format("YYYY-MM-DD");
            const to = toDate.format("YYYY-MM-DD");
            const result = await downloadEmployees(from, to, filters);

            if (result.emailSent) {
                dispatch(
                    addExcelDownloadSummary({
                        fromDate: from,
                        toDate: to,
                        days: selectedDays,
                        message: result.message,
                        fileName: result.filename,
                        attachmentContent: result.attachmentContent,
                    })
                );
                onResult(
                    "Report emailed successfully. You can also download it from the notification bell.",
                    "success"
                );
            } else if (result.blob) {
                const url = window.URL.createObjectURL(result.blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = result.filename || "employees.xlsx";
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
                onResult("Employees Excel downloaded successfully.", "success");
            }
            onClose();
        } catch (error: any) {
            const message =
                error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                "Failed to process the request.";
            onResult(message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <EmployeeDialog open={open} onClose={handleClose} title="Download Employees" maxWidth="xs">
            <Stack spacing={2.5}>
                {/* Date range summary */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: hasRange ? "primary.100" : "divider",
                        bgcolor: hasRange ? "primary.50" : "grey.50",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            bgcolor: hasRange ? "primary.main" : "grey.300",
                            color: "#fff",
                            flexShrink: 0,
                        }}
                    >
                        <DateRangeOutlinedIcon sx={{ fontSize: 20 }} />
                    </Box>

                    {hasRange ? (
                        <Box sx={{ minWidth: 0 }}>
                            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary", lineHeight: 1.3 }}>
                                {fromDate!.format("DD MMM YYYY")} – {toDate!.format("DD MMM YYYY")}
                            </Typography>
                            <Typography sx={{ fontSize: 12.5, color: "text.secondary", mt: 0.25 }}>
                                {selectedDays} day{selectedDays !== 1 ? "s" : ""} selected
                            </Typography>
                        </Box>
                    ) : (
                        <Typography sx={{ fontSize: 13.5, color: "text.secondary", fontWeight: 500 }}>
                            No date range selected
                        </Typography>
                    )}
                </Box>

                {/* Status messages */}
                {!hasRange && (
                    <Alert
                        severity="warning"
                        variant="outlined"
                        icon={<ErrorOutlineOutlinedIcon fontSize="small" />}
                        sx={{ borderRadius: 2, fontSize: 13.5 }}
                    >
                        Select a "From date" and "To date" in the filters above before downloading.
                    </Alert>
                )}

                {isInvalidRange && (
                    <Alert
                        severity="error"
                        variant="outlined"
                        icon={<ErrorOutlineOutlinedIcon fontSize="small" />}
                        sx={{ borderRadius: 2, fontSize: 13.5 }}
                    >
                        "From date" cannot be after "To date". Please correct the range.
                    </Alert>
                )}

                {hasRange && isDirectDownload && (
                    <Alert
                        severity="success"
                        variant="outlined"
                        icon={<DownloadOutlinedIcon fontSize="small" />}
                        sx={{ borderRadius: 2, fontSize: 13.5 }}
                    >
                        This range is within {MAX_DIRECT_DOWNLOAD_DAYS} days — the file will download directly.
                    </Alert>
                )}

                {hasRange && !isDirectDownload && !isInvalidRange && (
                    <Alert
                        severity="info"
                        variant="outlined"
                        icon={<MarkEmailReadOutlinedIcon fontSize="small" />}
                        sx={{ borderRadius: 2, fontSize: 13.5 }}
                    >
                        This range is more than {MAX_DIRECT_DOWNLOAD_DAYS} days, so it can't be downloaded directly.
                        The complete report will be emailed to you instead.
                    </Alert>
                )}

                <Divider sx={{ mt: 0.5 }} />

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Button onClick={handleClose} disabled={loading} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        disableElevation
                        disabled={!hasRange || isInvalidRange || loading}
                        onClick={handleAction}
                        startIcon={
                            loading ? (
                                <CircularProgress size={16} color="inherit" />
                            ) : isDirectDownload ? (
                                <DownloadOutlinedIcon />
                            ) : (
                                <MarkEmailReadOutlinedIcon />
                            )
                        }
                        sx={{ borderRadius: 2, textTransform: "none", px: 2.5 }}
                    >
                        {loading ? "Processing..." : isDirectDownload ? "Download" : "Send to Email"}
                    </Button>
                </Box>
            </Stack>
        </EmployeeDialog>
    );
};

export default EmployeeExcelDownloadDialog;