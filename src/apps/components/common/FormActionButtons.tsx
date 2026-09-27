import type { ReactNode } from "react";
import { Box, Button } from "@mui/material";

interface FormActionButtonsProps {
    onBack?: () => void;
    onReset?: () => void;
    onAddMore?: () => void;
    addMoreDisabled?: boolean;
    saveDisabled?: boolean;
    backText?: string;
    resetText?: string;
    addMoreText?: string;
    saveText?: string;
    backIcon?: ReactNode;
    resetIcon?: ReactNode;
    addMoreIcon?: ReactNode;
    saveIcon?: ReactNode;
}

const FormActionButtons = ({
    onBack,
    onReset,
    onAddMore,
    addMoreDisabled = false,
    saveDisabled = false,
    backText = "Back",
    resetText = "Reset",
    addMoreText = "Add More",
    saveText = "Save",
    backIcon,
    resetIcon,
    addMoreIcon,
    saveIcon,
}: FormActionButtonsProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                mt: 2,
                backgroundColor: "#ffffff",
                border: "1px solid #dbe3ef",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(15,23,42,0.08)",
            }}
        >
            {/* ADD MORE */}
            {onAddMore && (
                <Button
                    type="button"
                    variant="outlined"
                    startIcon={addMoreIcon}
                    disabled={addMoreDisabled}
                    onClick={onAddMore}
                    sx={{
                        minHeight: 38,
                        minWidth: 120,
                        fontSize: "12px",
                        borderRadius: "6px",
                        color: "#7c3aed",
                        borderColor: "#7c3aed",
                        "&:hover": {
                            color: "#6d28d9",
                            borderColor: "#6d28d9",
                            backgroundColor: "#f5f3ff",
                        },
                    }}>
                    {addMoreText}
                </Button>
            )}

            {/* BACK / RESET / SAVE */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                }}
            >
                {/* BACK */}
                {onBack && (
                    <Button
                        type="button"
                        variant="outlined"
                        startIcon={backIcon}
                        onClick={onBack}
                        sx={{
                            minHeight: 38,
                            minWidth: 90,
                            fontSize: "12px",
                            borderRadius: "6px",
                        }}
                    >
                        {backText}
                    </Button>
                )}

                {/* RESET */}
                {onReset && (
                    <Button
                        type="button"
                        variant="outlined"
                        startIcon={resetIcon}
                        onClick={onReset}
                        sx={{
                            minHeight: 38,
                            minWidth: 90,
                            fontSize: "12px",
                            borderRadius: "6px",
                            color: "#f97316",
                            borderColor: "#f97316",
                            "&:hover": {
                                color: "#ea580c", borderColor: "#ea580c",
                                backgroundColor: "#fff7ed",
                            },
                        }}
                    >
                        {resetText}
                    </Button>
                )}

                {/* SAVE */}
                <Button
                    type="submit"
                    variant="contained"
                    startIcon={saveIcon}
                    disabled={saveDisabled}
                    sx={{
                        minHeight: 38,
                        minWidth: 100,
                        fontSize: "12px",
                        borderRadius: "6px",
                        backgroundColor: "#16a34a",
                        "&:hover": { backgroundColor: "#15803d", },
                    }}
                >
                    {saveText}
                </Button>
            </Box>
        </Box>
    );
};

export default FormActionButtons;