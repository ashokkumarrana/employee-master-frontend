import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";

interface ResponseDialogProps {
    open: boolean;
    success: boolean;
    message: string;
    onClose: () => void;
    onSuccess?: () => void;
}

const ResponseDialog = ({
    open,
    success,
    message,
    onClose,
    onSuccess,
}: ResponseDialogProps) => {
    const handleOk = () => {
        onClose();

        if (success) {
            onSuccess?.();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            disableRestoreFocus
            sx={{
                "& .MuiDialog-paper": {
                    width: "100%",
                    maxWidth: 400,
                    borderRadius: "12px",
                    p: 1,
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: success ? "#15803d" : "#dc2626",
                }}
            >
                {success ? "Success" : "Error"}
            </DialogTitle>

            <DialogContent>
                <Typography
                    sx={{
                        fontSize: "14px",
                        color: "#475569",
                        lineHeight: 1.6,
                        textAlign: "center",
                    }}
                >
                    {message}
                </Typography>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2,
                    justifyContent: "center",
                }}
            >
                <Button
                    variant="contained"
                    onClick={handleOk}
                    sx={{
                        minWidth: 90,
                        minHeight: 36,
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: 500,
                        backgroundColor: success
                            ? "#15803d"
                            : "#dc2626",
                        "&:hover": {
                            backgroundColor: success
                                ? "#166534"
                                : "#b91c1c",
                        },
                    }}
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ResponseDialog;