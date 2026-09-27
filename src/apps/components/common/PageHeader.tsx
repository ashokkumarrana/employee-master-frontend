import { type ReactNode } from "react";

import { Box, Button, Typography } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actionLabel?: string;
    onAction?: () => void;
    actionIcon?: ReactNode;
}

const PageHeader = ({
    title,
    subtitle,
    actionLabel,
    onAction,
    actionIcon,
}: PageHeaderProps) => {
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                mb: 2.5,
                flexWrap: "wrap",
            }}
        >
            {/* LEFT SIDE */}
            <Box
                sx={{
                    minWidth: 0,
                    flex: 1,
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        color: "#1e293b",
                        fontWeight: 700,
                        fontSize: {
                            xs: "1.15rem",
                            sm: "1.25rem",
                        },
                        lineHeight: 1.3,
                    }}
                >
                    {title}
                </Typography>

                {subtitle && (
                    <Typography
                        variant="body2"
                        sx={{
                            mt: 0.5,
                            color: "#64748b",
                            fontSize: "0.8125rem",
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>

            {/* RIGHT SIDE */}
            {actionLabel && onAction && (
                <Button
                    variant="contained"
                    onClick={onAction}
                    startIcon={
                        actionIcon ?? <AddIcon />
                    }
                    sx={{
                        flexShrink: 0,
                        minHeight: 38,
                        px: 2,
                        borderRadius: "8px",
                        backgroundColor: "#2563eb",

                        "&:hover": {
                            backgroundColor: "#1d4ed8",
                        },
                    }}
                >
                    {actionLabel}
                </Button>
            )}
        </Box>
    );
};

export default PageHeader;