import { Box, Fab, Tooltip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import UploadFile from "@mui/icons-material/UploadFile";

interface EmployeeFabActionsProps {
    onDownloadTemplate: () => void;
    onUploadExcel: () => void;
    onAddEmployee: () => void;
}

const EmployeeFabActions = ({
    onDownloadTemplate,
    onUploadExcel,
    onAddEmployee,
}: EmployeeFabActionsProps) => {

    const fabSx = {
        position: "fixed",
        right: 24,
        zIndex: 20,
        width: 42,
        height: 42,
        minHeight: 42,
    };

    return (
        <Box>
            {/* Upload Excel */}
            <Tooltip
                title="Upload Excel"
                placement="left"
                arrow
            >
                <Fab
                    color="secondary"
                    aria-label="upload excel"
                    onClick={onUploadExcel}
                    sx={{
                        ...fabSx,
                        bottom: 172,
                    }}
                >
                    <UploadFile fontSize="small" />
                </Fab>
            </Tooltip>

            {/* Download Excel Template */}
            <Tooltip
                title="Download Excel Template"
                placement="left"
                arrow
            >
                <Fab
                    color="success"
                    aria-label="download excel template"
                    onClick={onDownloadTemplate}
                    sx={{
                        ...fabSx,
                        bottom: 127,
                    }}>
                    <DownloadIcon fontSize="small" />
                </Fab>
            </Tooltip>

            {/* Add Employee */}
            <Tooltip
                title="Add Employee"
                placement="left"
                arrow
            >
                <Fab
                    color="primary"
                    aria-label="add employee"
                    onClick={onAddEmployee}
                    sx={{
                        ...fabSx,
                        bottom: 82,
                    }}>
                    <AddIcon fontSize="small" />
                </Fab>
            </Tooltip>

        </Box>
    );
};

export default EmployeeFabActions;