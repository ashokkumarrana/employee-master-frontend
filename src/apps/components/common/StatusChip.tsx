import { Chip } from "@mui/material";

interface StatusChipProps {
    status: boolean;
}

const StatusChip = ({ status }: StatusChipProps) => {
    const isActive = status === false;

    return (
        <Chip
            label={isActive ? "Active" : "Inactive"}
            size="small"
            sx={{
                minWidth: "75px",
                height: "26px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: 600,
                backgroundColor: isActive ? "#dcfce7" : "#fee2e2",
                color: isActive ? "#15803d" : "#b91c1c",
                border: `1px solid ${isActive ? "#bbf7d0" : "#fecaca"
                    }`,
                "& .MuiChip-label": {
                    px: 1.25,
                },
            }}
        />
    );
};

export default StatusChip;