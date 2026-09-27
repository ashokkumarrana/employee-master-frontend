import { useState } from "react";
import {
    Badge,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Popover,
    Typography,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DownloadIcon from "@mui/icons-material/Download";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import { useAppDispatch } from "../../pages/hooks/useAppDispatch";
import { markExcelUploadNotificationsRead, markExcelDownloadNotificationsRead, } from "../../pages/store/slices/employee-slice";
import { useAppSelector } from "../../pages/hooks/useAppSelector";
import type { EmployeeExcelDownloadSummary, EmployeeExcelSummary } from "../../pages/employee-master/employeeTypes";

const ROWS_PER_PAGE = 4;
const BLUE_GRADIENT = "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)";

type MergedItem =
    | { kind: "upload"; timestamp: string; isRead: boolean; data: EmployeeExcelSummary }
    | { kind: "download"; timestamp: string; isRead: boolean; data: EmployeeExcelDownloadSummary };

const getUploadStatus = (upload: EmployeeExcelSummary) => {
    if (upload.failureCount > 0) {
        return { Icon: CancelOutlinedIcon, color: "#dc2626", bg: "#fef2f2" };
    }
    if (upload.duplicateCount > 0) {
        return { Icon: ContentCopyOutlinedIcon, color: "#b45309", bg: "#fffbeb" };
    }
    return { Icon: CheckCircleIcon, color: "#16a34a", bg: "#f0fdf4" };
};

const getUploadSummaryText = (upload: EmployeeExcelSummary) => {
    const parts = [`${upload.successCount} saved`];
    if (upload.failureCount > 0) parts.push(`${upload.failureCount} failed`);
    if (upload.duplicateCount > 0) parts.push(`${upload.duplicateCount} duplicate`);
    return parts.join(" · ");
};

const formatDateTime = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

const ExcelUploadNotification = () => {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selectedItem, setSelectedItem] = useState<MergedItem | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [page, setPage] = useState(0);

    const uploadHistory = useAppSelector((state) => state.employee.excelUploadHistory);
    const downloadHistory = useAppSelector((state) => state.employee.excelDownloadHistory);

    const merged: MergedItem[] = [
        ...uploadHistory.map((data) => ({
            kind: "upload" as const,
            timestamp: data.uploadedAt,
            isRead: data.isRead,
            data,
        })),
        ...downloadHistory.map((data) => ({
            kind: "download" as const,
            timestamp: data.downloadedAt,
            isRead: data.isRead,
            data,
        })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const unreadCount = merged.filter((item) => !item.isRead).length;
    const totalPages = Math.ceil(merged.length / ROWS_PER_PAGE);
    const currentItems = merged.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        if (uploadHistory.some((upload) => !upload.isRead)) {
            dispatch(markExcelUploadNotificationsRead());
        }
        if (downloadHistory.some((download) => !download.isRead)) {
            dispatch(markExcelDownloadNotificationsRead());
        }
    };

    const handleClose = () => setAnchorEl(null);

    const handleItemClick = (item: MergedItem) => {
        setSelectedItem(item);
        setDetailOpen(true);
        setAnchorEl(null);
    };

    const handleDetailClose = () => {
        setDetailOpen(false);
        setSelectedItem(null);
    };

    const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 0));
    const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));

    const downloadAttachment = (base64: string, fileName: string) => {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleDownloadAttachment = () => {
        if (!selectedItem) return;
        if (selectedItem.kind === "upload" && selectedItem.data.attachmentContent) {
            downloadAttachment(
                selectedItem.data.attachmentContent,
                selectedItem.data.attachmentName || "employee-import-result.xlsx"
            );
        }
        if (selectedItem.kind === "download" && selectedItem.data.attachmentContent) {
            downloadAttachment(
                selectedItem.data.attachmentContent,
                selectedItem.data.fileName || "employees.xlsx"
            );
        }
    };

    const uploadSuccessPercentage =
        selectedItem?.kind === "upload" && selectedItem.data.totalRows > 0
            ? Math.round((selectedItem.data.successCount / selectedItem.data.totalRows) * 100)
            : 0;

    return (
        <>
            {/* Notification Icon (white, for the blue header) */}
            <IconButton
                onClick={handleOpen}
                sx={{
                    display: { xs: "none", sm: "flex" },
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    color: "#ffffff",
                    backgroundColor: anchorEl ? "rgba(255, 255, 255, 0.18)" : "transparent",
                    transition: "background-color 0.2s ease",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.14)" },
                }}
            >
                <Badge badgeContent={unreadCount} color="error" overlap="circular">
                    <EmailOutlinedIcon sx={{ fontSize: 22 }} />
                </Badge>
            </IconButton>

            {/* Notification Popover (merged list) */}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                    paper: {
                        sx: {
                            width: { xs: 300, sm: 340 },
                            maxWidth: "calc(100vw - 24px)",
                            mt: 1,
                            borderRadius: "12px",
                            overflow: "hidden",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
                        },
                    },
                }}
            >
                {/* Title */}
                <Box
                    sx={{
                        px: 2,
                        py: 1.3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #f1f5f9",
                    }}
                >
                    <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>
                        Notifications
                    </Typography>
                    {unreadCount > 0 && (
                        <Chip
                            label={`${unreadCount} new`}
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: "10px",
                                fontWeight: 700,
                                color: "#ffffff",
                                background: BLUE_GRADIENT,
                            }}
                        />
                    )}
                </Box>

                {/* List */}
                {merged.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: "center" }}>
                        <InsertDriveFileOutlinedIcon sx={{ fontSize: 30, color: "#cbd5e1", mb: 0.5 }} />
                        <Typography sx={{ fontSize: "13px", color: "#94a3b8" }}>
                            No notifications yet.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {currentItems.map((item) => {
                            if (item.kind === "upload") {
                                const { Icon, color, bg } = getUploadStatus(item.data);
                                return (
                                    <Box
                                        key={item.data.id}
                                        onClick={() => handleItemClick(item)}
                                        sx={{
                                            px: 2,
                                            py: 1.2,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1.2,
                                            cursor: "pointer",
                                            borderBottom: "1px solid #f1f5f9",
                                            "&:hover": { backgroundColor: "#f8fafc" },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 30,
                                                height: 30,
                                                flexShrink: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: "8px",
                                                backgroundColor: bg,
                                            }}
                                        >
                                            <Icon sx={{ fontSize: 17, color }} />
                                        </Box>

                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography noWrap sx={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
                                                Excel Upload Completed
                                            </Typography>
                                            <Typography noWrap sx={{ fontSize: "11.5px", color: "#64748b" }}>
                                                {getUploadSummaryText(item.data)}
                                            </Typography>
                                        </Box>

                                        <Typography sx={{ fontSize: "10px", color: "#94a3b8", flexShrink: 0 }}>
                                            {formatDateTime(item.data.uploadedAt)}
                                        </Typography>
                                    </Box>
                                );
                            }
                            return (
                                <Box
                                    key={item.data.id}
                                    onClick={() => handleItemClick(item)}
                                    sx={{
                                        px: 2,
                                        py: 1.2,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.2,
                                        cursor: "pointer",
                                        borderBottom: "1px solid #f1f5f9",
                                        "&:hover": { backgroundColor: "#f8fafc" },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 30,
                                            height: 30,
                                            flexShrink: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "8px",
                                            backgroundColor: "#eff6ff",
                                        }}
                                    >
                                        <CloudDownloadOutlinedIcon sx={{ fontSize: 17, color: "#2563eb" }} />
                                    </Box>

                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography noWrap sx={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
                                            Employee Report Emailed
                                        </Typography>
                                        <Typography noWrap sx={{ fontSize: "11.5px", color: "#64748b" }}>
                                            {item.data.fromDate} to {item.data.toDate} · {item.data.days} days
                                        </Typography>
                                    </Box>

                                    <Typography sx={{ fontSize: "10px", color: "#94a3b8", flexShrink: 0 }}>
                                        {formatDateTime(item.data.downloadedAt)}
                                    </Typography>
                                </Box>
                            );
                        })}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 1,
                                    py: 0.6,
                                }}
                            >
                                <IconButton
                                    size="small"
                                    disabled={page === 0}
                                    onClick={handlePreviousPage}
                                >
                                    <ChevronLeftIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                                <Typography sx={{ fontSize: "12px", color: "#64748b" }}>
                                    {page + 1} / {totalPages}
                                </Typography>
                                <IconButton
                                    size="small"
                                    disabled={page === totalPages - 1}
                                    onClick={handleNextPage}
                                >
                                    <ChevronRightIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                            </Box>
                        )}
                    </>
                )}
            </Popover>

            {/* Detail Dialog */}
            <Dialog
                open={detailOpen}
                onClose={handleDetailClose}
                fullWidth
                maxWidth="sm"
                slotProps={{
                    paper: {
                        sx: { borderRadius: "14px", overflow: "hidden" },
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        p: 1.8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        background: BLUE_GRADIENT,
                    }}
                >
                    <Box>
                        <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", lineHeight: 1.3 }}>
                            {selectedItem?.kind === "upload" ? "Mail Details" : "Report Details"}
                        </Typography>
                        <Typography sx={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", lineHeight: 1.3 }}>
                            {selectedItem?.kind === "upload" ? "Excel Upload Notification" : "Excel Download Notification"}
                        </Typography>
                    </Box>

                    <IconButton size="small" onClick={handleDetailClose} sx={{ color: "#ffffff" }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 2, backgroundColor: "#f8fafc" }}>
                    {selectedItem?.kind === "upload" && (
                        <>
                            {/* Mail Content */}
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 1.8,
                                    borderRadius: "10px",
                                    backgroundColor: "#ffffff",
                                    borderColor: "#e2e8f0",
                                }}
                            >
                                <Typography variant="body2" sx={{ color: "#334155", lineHeight: 1.7 }}>
                                    Hello,
                                </Typography>

                                <Typography variant="body2" sx={{ mt: 1, color: "#334155", lineHeight: 1.7 }}>
                                    The employee Excel upload has been completed successfully.
                                </Typography>

                                <Typography variant="body2" sx={{ mt: 1.5, color: "#334155", lineHeight: 1.8 }}>
                                    Total Records: <strong>{selectedItem.data.totalRows}</strong>
                                    <br />
                                    Saved Records: <strong>{selectedItem.data.successCount}</strong>
                                    <br />
                                    Failed Records: <strong>{selectedItem.data.failureCount}</strong>
                                    <br />
                                    Duplicate Records: <strong>{selectedItem.data.duplicateCount}</strong>
                                </Typography>

                                <Typography variant="body2" sx={{ mt: 1.5, color: "#334155", lineHeight: 1.7 }}>
                                    Regards,
                                    <br />
                                    Employee Master Team
                                </Typography>
                            </Paper>

                            {/* Import Summary */}
                            <Typography sx={{ mt: 2.5, mb: 1, fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                                Import Summary
                            </Typography>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" },
                                    gap: 1.2,
                                }}
                            >
                                {/* Total */}
                                <Paper
                                    variant="outlined"
                                    sx={{ p: 1.6, borderRadius: "10px", borderColor: "#dbeafe", backgroundColor: "#eff6ff" }}
                                >
                                    <Typography sx={{ fontSize: "10px", color: "#1e40af", fontWeight: 700 }}>
                                        TOTAL RECORDS
                                    </Typography>
                                    <Typography sx={{ mt: 0.5, fontSize: "24px", fontWeight: 800, color: "#1e3a8a" }}>
                                        {selectedItem.data.totalRows}
                                    </Typography>
                                </Paper>

                                {/* Success */}
                                <Paper
                                    variant="outlined"
                                    sx={{ p: 1.6, borderRadius: "10px", borderColor: "#bbf7d0", backgroundColor: "#f0fdf4" }}
                                >
                                    <Typography sx={{ fontSize: "10px", color: "#15803d", fontWeight: 700 }}>
                                        SAVED RECORDS
                                    </Typography>
                                    <Typography sx={{ mt: 0.5, fontSize: "24px", fontWeight: 800, color: "#15803d" }}>
                                        {selectedItem.data.successCount}
                                    </Typography>
                                </Paper>

                                {/* Failed */}
                                <Paper
                                    variant="outlined"
                                    sx={{ p: 1.6, borderRadius: "10px", borderColor: "#fecaca", backgroundColor: "#fef2f2" }}
                                >
                                    <Typography sx={{ fontSize: "10px", color: "#b91c1c", fontWeight: 700 }}>
                                        FAILED RECORDS
                                    </Typography>
                                    <Typography sx={{ mt: 0.5, fontSize: "24px", fontWeight: 800, color: "#dc2626" }}>
                                        {selectedItem.data.failureCount}
                                    </Typography>
                                </Paper>

                                {/* Duplicate */}
                                <Paper
                                    variant="outlined"
                                    sx={{ p: 1.6, borderRadius: "10px", borderColor: "#fde68a", backgroundColor: "#fffbeb" }}
                                >
                                    <Typography sx={{ fontSize: "10px", color: "#92400e", fontWeight: 700 }}>
                                        DUPLICATE RECORDS
                                    </Typography>
                                    <Typography sx={{ mt: 0.5, fontSize: "24px", fontWeight: 800, color: "#b45309" }}>
                                        {selectedItem.data.duplicateCount}
                                    </Typography>
                                </Paper>
                            </Box>

                            {/* Success Rate */}
                            <Paper
                                variant="outlined"
                                sx={{
                                    mt: 1.4,
                                    p: 1.6,
                                    borderRadius: "10px",
                                    borderColor: "#e2e8f0",
                                    backgroundColor: "#ffffff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Box>
                                    <Typography sx={{ fontSize: "10px", color: "#64748b", fontWeight: 700 }}>
                                        SUCCESS RATE
                                    </Typography>
                                    <Typography sx={{ mt: 0.3, fontSize: "12px", color: "#64748b" }}>
                                        Upload completed
                                    </Typography>
                                </Box>

                                <Typography
                                    sx={{
                                        fontSize: "26px",
                                        fontWeight: 800,
                                        color:
                                            selectedItem.data.failureCount > 0 || selectedItem.data.duplicateCount > 0
                                                ? "#d97706"
                                                : "#15803d",
                                    }}
                                >
                                    {uploadSuccessPercentage}%
                                </Typography>
                            </Paper>

                            {/* Attachment */}
                            {selectedItem.data.attachmentContent && (
                                <>
                                    <Typography sx={{ mt: 2.5, mb: 1, fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                                        Attachment
                                    </Typography>

                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 1.4,
                                            borderRadius: "10px",
                                            borderColor: "#bfdbfe",
                                            backgroundColor: "#eff6ff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 1.5,
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                                            <AttachFileIcon sx={{ fontSize: 20, color: "#1e3a8a", flexShrink: 0 }} />
                                            <Typography noWrap sx={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
                                                {selectedItem.data.attachmentName || "employee-import-result.xlsx"}
                                            </Typography>
                                        </Box>

                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<DownloadIcon />}
                                            onClick={handleDownloadAttachment}
                                            sx={{
                                                flexShrink: 0,
                                                borderRadius: "8px",
                                                textTransform: "none",
                                                fontWeight: 600,
                                                background: BLUE_GRADIENT,
                                            }}
                                        >
                                            Download
                                        </Button>
                                    </Paper>
                                </>
                            )}
                        </>
                    )}

                    {selectedItem?.kind === "download" && (
                        <>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 1.8,
                                    borderRadius: "10px",
                                    backgroundColor: "#ffffff",
                                    borderColor: "#e2e8f0",
                                }}
                            >
                                <Typography variant="body2" sx={{ color: "#334155", lineHeight: 1.7 }}>
                                    Hello,
                                </Typography>

                                <Typography variant="body2" sx={{ mt: 1, color: "#334155", lineHeight: 1.7 }}>
                                    Your requested employee report has been emailed successfully.
                                </Typography>

                                <Typography variant="body2" sx={{ mt: 1.5, color: "#334155", lineHeight: 1.8 }}>
                                    Date Range: <strong>{selectedItem.data.fromDate} to {selectedItem.data.toDate}</strong>
                                    <br />
                                    Total Days: <strong>{selectedItem.data.days}</strong>
                                </Typography>

                                <Typography variant="body2" sx={{ mt: 1.5, color: "#334155", lineHeight: 1.7 }}>
                                    Regards,
                                    <br />
                                    Employee Master Team
                                </Typography>
                            </Paper>

                            {selectedItem.data.attachmentContent && (
                                <>
                                    <Typography sx={{ mt: 2.5, mb: 1, fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                                        Attachment
                                    </Typography>

                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 1.4,
                                            borderRadius: "10px",
                                            borderColor: "#bfdbfe",
                                            backgroundColor: "#eff6ff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 1.5,
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                                            <AttachFileIcon sx={{ fontSize: 20, color: "#1e3a8a", flexShrink: 0 }} />
                                            <Typography noWrap sx={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
                                                {selectedItem.data.fileName || "employees.xlsx"}
                                            </Typography>
                                        </Box>

                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<DownloadIcon />}
                                            onClick={handleDownloadAttachment}
                                            sx={{
                                                flexShrink: 0,
                                                borderRadius: "8px",
                                                textTransform: "none",
                                                fontWeight: 600,
                                                background: BLUE_GRADIENT,
                                            }}
                                        >
                                            Download
                                        </Button>
                                    </Paper>
                                </>
                            )}
                        </>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 2, py: 1.8, backgroundColor: "#f8fafc" }}>
                    <Button variant="outlined" onClick={handleDetailClose} sx={{ borderRadius: "8px", textTransform: "none" }}>
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleDetailClose}
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            background: BLUE_GRADIENT,
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ExcelUploadNotification;