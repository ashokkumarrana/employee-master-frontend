import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, Tooltip } from "@mui/material";

interface ActionButtonsProps {
    onEdit?: () => void;
    onDelete?: () => void;
}

const ActionButtons = ({ onEdit, onDelete }: ActionButtonsProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 0.5,
            }}>
            {onEdit && (
                <Tooltip title="Edit" arrow placement="top">
                    <IconButton
                        type="button"
                        size="small"
                        aria-label="edit"
                        onClick={(event) => { event.stopPropagation(); onEdit(); }}
                        sx={{
                            width: 32,
                            height: 32,
                            color: "#d97706",
                            "&:hover": { backgroundColor: "#fffbeb", },
                        }}
                    >
                        <EditIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Tooltip>
            )}

            {onDelete && (
                <Tooltip title="Delete" arrow placement="top">
                    <IconButton
                        type="button"
                        size="small"
                        aria-label="delete"
                        onClick={(event) => { event.stopPropagation(); onDelete(); }}
                        sx={{
                            width: 32,
                            height: 32,
                            color: "#dc2626",
                            "&:hover": { backgroundColor: "#fef2f2", },
                        }}>
                        <DeleteIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Tooltip>
            )}
        </Box>
    );
};

export default ActionButtons;