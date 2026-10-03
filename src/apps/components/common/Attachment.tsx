import { useRef, useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormHelperText,
    IconButton,
    Tooltip,
    Typography,
    CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import CloseIcon from "@mui/icons-material/Close";

export interface AttachmentProps {
    value?: File | null;
    onChange?: (file: File | null) => void;
    label?: string;
    buttonText?: string;
    accept?: string;
    maxSizeInMB?: number;
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    fullWidth?: boolean;
    name?: string;
    id?: string;
}

const Attachment = ({
    value = null,
    onChange,
    label = "Attachment",
    buttonText = "Choose File",
    accept,
    maxSizeInMB = 5,
    required = false,
    disabled = false,
    error = false,
    helperText,
    fullWidth = true,
    name,
    id = "attachment",
}: AttachmentProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;

        if (!file) {
            onChange?.(null);
            return;
        }

        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

        if (file.size > maxSizeInBytes) {
            onChange?.(null);
            return;
        }

        onChange?.(file);
    };

    const handleChooseFile = () => {
        inputRef.current?.click();
    };

    const handleRemoveFile = () => {
        if (inputRef.current) {
            inputRef.current.value = "";
        }

        onChange?.(null);
    };

    return (
        <Box sx={{ width: fullWidth ? "100%" : "auto" }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                {label}
                {required && " *"}
            </Typography>

            <input
                ref={inputRef}
                id={id}
                name={name}
                type="file"
                hidden
                accept={accept}
                disabled={disabled}
                onChange={handleFileChange}
            />

            <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={handleChooseFile}
                disabled={disabled}
            >
                {buttonText}
            </Button>

            {value && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                    <Typography variant="body2" sx={{ wordBreak: "break-word", flex: 1 }}>
                        {value.name}
                    </Typography>

                    <Button size="small" color="error" onClick={handleRemoveFile} disabled={disabled}>
                        Remove
                    </Button>
                </Box>
            )}

            {helperText ? (
                <FormHelperText error={error}>{helperText}</FormHelperText>
            ) : (
                <FormHelperText>Maximum file size: {maxSizeInMB} MB</FormHelperText>
            )}
        </Box>
    );
};

export default Attachment;

export type AttachmentKind = "image" | "document";

interface FetchedAttachment {
    blob: Blob;
    filename: string;
}

interface AttachmentDownloadButtonProps {
    path?: string | null;
    kind?: AttachmentKind;
    tooltip?: string;
    onDownload: (path: string) => void;
    fetchAttachment: (path: string) => Promise<FetchedAttachment>;
    showView?: boolean;
}

export const AttachmentDownloadButton = ({
    path,
    kind = "document",
    tooltip,
    onDownload,
    fetchAttachment,
    showView = true,
}: AttachmentDownloadButtonProps) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                window.URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    if (!path) {
        return (
            <Typography variant="body2" color="text.secondary">
                N/A
            </Typography>
        );
    }

    const Icon = kind === "image" ? ImageOutlinedIcon : DescriptionOutlinedIcon;
    const viewLabel = kind === "image" ? "View profile image" : "View document";
    const downloadLabel = tooltip ?? (kind === "image" ? "Download profile image" : "Download document");

    const handleView = async (event: React.MouseEvent) => {
        event.stopPropagation();
        setPreviewOpen(true);
        setPreviewError(null);
        setPreviewLoading(true);
        setPreviewUrl(null);

        try {
            const { blob } = await fetchAttachment(path);
            const url = window.URL.createObjectURL(blob);
            setPreviewUrl(url);
        } catch (err) {
            console.error(err);
            setPreviewError("Unable to load preview.");
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleClosePreview = () => {
        setPreviewOpen(false);
        if (previewUrl) {
            window.URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setPreviewError(null);
    };

    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 0.5, justifyContent: "center" }}>
                {showView && (
                    <Tooltip title={viewLabel}>
                        <IconButton
                            type="button"
                            size="small"
                            onClick={handleView}
                            sx={{
                                width: 32,
                                height: 32,
                                color: "#2563eb",
                                "&:hover": { backgroundColor: "#eff6ff" },
                            }}
                        >
                            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Tooltip>
                )}

                {/* DOWNLOAD BUTTON — always shown */}
                <Tooltip title={downloadLabel}>
                    <IconButton
                        type="button"
                        size="small"
                        onClick={(event) => {
                            event.stopPropagation();
                            onDownload(path);
                        }}
                        sx={{
                            width: 32,
                            height: 32,
                            color: "#16a34a",
                            "&:hover": { backgroundColor: "#f0fdf4" },
                        }}
                    >
                        <DownloadOutlinedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* PREVIEW DIALOG */}
            {showView && (
                <Dialog open={previewOpen} onClose={handleClosePreview} maxWidth="md" fullWidth>
                    <DialogTitle
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Icon sx={{ fontSize: 20, color: "#2563eb" }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {kind === "image" ? "Profile Image Preview" : "Document Preview"}
                            </Typography>
                        </Box>
                        <IconButton size="small" onClick={handleClosePreview}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent
                        dividers
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: 400,
                            backgroundColor: "#f8fafc",
                        }}
                    >
                        {previewLoading && <CircularProgress size={32} />}

                        {!previewLoading && previewError && (
                            <Typography variant="body2" color="error">
                                {previewError}
                            </Typography>
                        )}

                        {!previewLoading && !previewError && previewUrl && (
                            kind === "image" ? (
                                <Box
                                    component="img"
                                    src={previewUrl}
                                    alt="Attachment preview"
                                    sx={{
                                        maxWidth: "100%",
                                        maxHeight: "70vh",
                                        objectFit: "contain",
                                        borderRadius: "8px",
                                    }}
                                />
                            ) : (
                                <Box
                                    component="iframe"
                                    src={previewUrl}
                                    title="Document preview"
                                    sx={{
                                        width: "100%",
                                        height: "70vh",
                                        border: "none",
                                        borderRadius: "8px",
                                    }}
                                />
                            )
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};