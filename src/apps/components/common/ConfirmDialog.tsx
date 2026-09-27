import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";

interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog = ({
    open,
    title = "Confirm Delete",
    message = "Are you sure you want to delete this record?",
    confirmText = "Delete",
    cancelText = "Cancel",
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onCancel}
            fullWidth
            maxWidth="xs"
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                    },
                },
            }}
        >
            {/* TITLE */}

            <DialogTitle
                sx={{
                    pb: 1,
                    color: "#1e293b",
                    fontSize: "1rem",
                    fontWeight: 700,
                }}
            >
                {title}
            </DialogTitle>

            {/* MESSAGE */}

            <DialogContent>
                <Typography
                    sx={{
                        color: "#64748b",
                        fontSize: "0.875rem",
                        lineHeight: 1.6,
                    }}
                >
                    {message}
                </Typography>
            </DialogContent>

            {/* ACTIONS */}

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2.5,
                    gap: 1,
                }}
            >
                <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={loading}
                    sx={{
                        minWidth: 85,
                        color: "#475569",
                        borderColor: "#cbd5e1",

                        "&:hover": {
                            borderColor: "#94a3b8",
                            backgroundColor: "#f8fafc",
                        },
                    }}
                >
                    {cancelText}
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={onConfirm}
                    disabled={loading}
                    sx={{
                        minWidth: 85,
                    }}
                >
                    {loading
                        ? "Deleting..."
                        : confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;