import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    type DialogProps,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { ReactNode } from "react";

interface EmployeeDialogProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    maxWidth?: DialogProps["maxWidth"];
}

const EmployeeDialog = ({
    open,
    onClose,
    children,
    title,
    maxWidth = "lg",
}: EmployeeDialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth={maxWidth}
            scroll="paper"
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: "12px",
                        overflow: "hidden",
                        maxHeight: "92vh",
                        position: "relative",
                        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.18)",
                    },
                },
            }}
        >
            {title && (
                <DialogTitle
                    sx={{
                        px: { xs: 2, sm: 2.5 },
                        py: 1.5,
                        pr: 6,
                        fontSize: "17px",
                        fontWeight: 600,
                        color: "#1f2937",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    {title}

                    <IconButton
                        onClick={onClose}
                        size="small"
                        aria-label="close"
                        sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            color: "#6b7280",
                            backgroundColor: "#f3f4f6",
                            "&:hover": {
                                color: "#dc2626",
                                backgroundColor: "#fef2f2",
                            },
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>
            )}

            <DialogContent
                sx={{
                    p: {
                        xs: 2,
                        sm: 2.5,
                    },
                }}
            >
                {children}
            </DialogContent>
        </Dialog>
    );
};

export default EmployeeDialog;