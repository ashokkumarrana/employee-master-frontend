import type { FocusEvent } from "react";
import { useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import {
    Autocomplete, Box, Button, Card, CardContent, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import FormActionButtons from "../../components/common/FormActionButtons";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import DatePicker from "../../components/common/DatePicker";
import { employeeValidationSchema } from "./employee-validation";
import ResponseDialog from "../../components/common/ResponseDialog";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { reportingManagerList, type Dropdown, type EmployeeFormData, type EmployeeRequest } from "./employeeTypes";
import { saveEmployee } from "../store/slices/employee-slice";
import { useArrayForm } from "../../components/common/useArrayForm";
import { uploadEmployeeAttachments } from "./employeeApi";

interface EmployeeAddFormProps {
    departments: Dropdown[];
    designations: Dropdown[];
    states: Dropdown[];
    countries: Dropdown[];
    cities: Dropdown[];
    onBack?: () => void;
    onSaveSuccess?: () => Promise<void> | void;
}
const initialFormData: EmployeeFormData = {
    employeeCode: "",
    employeeName: "",
    communicationName: "",
    departmentId: "",
    designationId: "",
    reportingManager: null,
    employeeType: "",
    gender: "",
    maritalStatus: "",
    skills: [],
    languages: "",
    mobile: "",
    alternateMobile: "",
    email: "",
    alternateEmail: "",
    dob: "",
    joiningDate: dayjs().format("YYYY-MM-DD"),
    address: "",
    city: "",
    stateId: "",
    countryId: "",
    zipCode: "",
    bloodGroup: "",
    status: true,
    profileImage: null,
    documents: null,
    remarks: "",
};

const inputSx = {
    width: "100%",

    "& .MuiOutlinedInput-root": {
        minHeight: 40,
        borderRadius: "6px",
        fontSize: "13px",
    },

    "& .MuiInputLabel-root": {
        fontSize: "12px",
    },

    "& .MuiInputLabel-asterisk": {
        color: "red",
    },

    "& .MuiFormLabel-asterisk": {
        color: "red",
    },

    "& .MuiInputBase-input": {
        fontSize: "13px",
    },
};

const sectionTitleSx = {
    display: "flex",
    alignItems: "center",
    gap: 1,
    fontSize: "14px",
    fontWeight: 700,
    color: "#1e293b",
    mb: 1.5,
    "&::before": {
        content: '""',
        width: 4,
        height: 18,
        borderRadius: "4px",
        backgroundColor: "#2563eb",
    },
};

const cardSx = {
    mb: 2,
    border: "1px solid #dbe3ef",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
};

const cardContentSx = {
    p: {
        xs: "12px !important",
        sm: "16px !important",
        md: "20px !important",
    },
};

const requiredFieldOrder: (keyof EmployeeFormData)[] = [
    "employeeCode",
    "employeeName",
    "departmentId",
    "designationId",
    "employeeType",
    "gender",
    "mobile",
    "email",
    "joiningDate",
    "countryId",
];

const numericSelectFields: (keyof EmployeeFormData)[] = ["departmentId", "designationId", "stateId", "countryId"];
const fileFields: (keyof EmployeeFormData)[] = ["profileImage", "documents"];
const skillOptions = ["Java", "React", "SQL", "Spring Boot", "Python"];

function toEmployeeRequest(employee: EmployeeFormData): EmployeeRequest {
    return {
        id: employee.id ?? null,
        employeeCode: employee.employeeCode,
        employeeName: employee.employeeName,
        communicationName: employee.communicationName,
        departmentId: Number(employee.departmentId),
        designationId: Number(employee.designationId),
        reportingManager: employee.reportingManager ? Number(employee.reportingManager) : null,
        employeeType: employee.employeeType,
        gender: employee.gender,
        maritalStatus: employee.maritalStatus,
        skills: [...employee.skills],
        languages: employee.languages,
        mobile: employee.mobile,
        alternateMobile: employee.alternateMobile,
        email: employee.email,
        alternateEmail: employee.alternateEmail,
        dob: employee.dob || null,
        joiningDate: employee.joiningDate || null,
        address: employee.address,
        city: employee.city || null,
        stateId: employee.stateId === "" ? null : Number(employee.stateId),
        countryId: Number(employee.countryId),
        zipCode: employee.zipCode,
        bloodGroup: employee.bloodGroup,
        status: employee.status,
        remarks: employee.remarks,
    };
}

type PendingAttachment = { id: number; profileImage: File | null; documents: File | null };

function getAttachmentsToUpload(
    employees: EmployeeFormData[],
    savedEmployees: Array<{ id?: number }>
): PendingAttachment[] {
    return employees
        .map((employee, i) => ({
            id: savedEmployees[i]?.id,
            profileImage: employee.profileImage,
            documents: employee.documents,
        }))
        .filter(
            (attachment): attachment is PendingAttachment =>
                attachment.id != null && (attachment.profileImage != null || attachment.documents != null)
        );
}

function extractErrorMessage(error: unknown): string {
    if (typeof error === "object" && error !== null && "error" in error) {
        return String((error as { error?: unknown }).error);
    }
    if (typeof error === "object" && error !== null && "message" in error) {
        return String((error as { message?: unknown }).message);
    }
    if (error instanceof Error) {
        return error.message;
    }
    return "Something went wrong while saving employees.";
}

const AddEmployee = ({
    departments,
    designations,
    states,
    countries,
    cities,
    onBack,
    onSaveSuccess,
}: EmployeeAddFormProps) => {
    const dispatch = useAppDispatch();
    const {
        items: employees,
        errors,
        sectionRefs,
        setFieldValue,
        handleChange,
        handleSelectChange,
        handleNumericChange,
        handleBlur,
        handleSelectBlur,
        handleFileChange,
        handleRemoveFile,
        handleAddMore,
        handleRemoveItem,
        handleReset,
        validateAll,
        canAddMore,
        remainingDisabledFor,
    } = useArrayForm<EmployeeFormData>({
        initialItem: { ...initialFormData, joiningDate: dayjs().format("YYYY-MM-DD"), skills: [] },
        validationSchema: employeeValidationSchema,
        requiredFieldOrder,
        remainingDisabledField: "countryId",
    });

    const [responseDialog, setResponseDialog] = useState({
        open: false,
        success: false,
        message: "",
    });

    const handleDobChange = (index: number, value: Dayjs | null) =>
        setFieldValue(index, "dob", value ? value.format("YYYY-MM-DD") : "");

    const handleJoiningDateChange = (index: number, value: Dayjs | null) =>
        setFieldValue(index, "joiningDate", value ? value.format("YYYY-MM-DD") : "");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { valid } = await validateAll();
        if (!valid) {
            return;
        }

        try {
            const response = await dispatch(saveEmployee(employees.map(toEmployeeRequest))).unwrap();
            const attachmentsToUpload = getAttachmentsToUpload(employees, response.data ?? []);

            if (attachmentsToUpload.length > 0) {
                try {
                    await uploadEmployeeAttachments(attachmentsToUpload);
                } catch {
                    await onSaveSuccess?.();
                    setResponseDialog({
                        open: true,
                        success: true,
                        message: "Employees saved, but some attachments failed to upload.",
                    });
                    return;
                }
            }

            await onSaveSuccess?.();
            setResponseDialog({
                open: true,
                success: response.status >= 200 && response.status < 300,
                message: response.message || (response.error && response.error !== "none" ? response.error : "Employees saved successfully."),
            });
        } catch (error) {
            setResponseDialog({ open: true, success: false, message: extractErrorMessage(error) });
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} noValidate style={{ width: "100%", paddingBottom: "16px" }}>
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        mb: 2.5,
                        p: { xs: 1.5, sm: 2 },
                        flexWrap: "wrap",
                        borderRadius: "10px",
                        border: "1px solid #dbe3ef",
                        background: "linear-gradient(90deg, #eff6ff 0%, #ffffff 100%)",
                    }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "10px",
                                backgroundColor: "#2563eb",
                                color: "#ffffff",
                                boxShadow: "0 4px 10px rgba(37,99,235,0.25)",
                            }}>
                            <PersonAddAltOutlinedIcon sx={{ fontSize: 24 }} />
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: { xs: "18px", sm: "20px", md: "22px" },
                                    fontWeight: 700,
                                    color: "#1e293b",
                                    lineHeight: 1.25,
                                }}>
                                Add Employees
                            </Typography>
                            <Typography sx={{ fontSize: "12px", color: "#64748b", mt: 0.3 }}>
                                Create one or multiple employee records
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "999px",
                            backgroundColor: "#dbeafe",
                            color: "#1d4ed8",
                            fontSize: "12px",
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                        }}
                    >
                        {employees.length === 1 ? "Employee" : `${employees.length} Employees`}
                    </Box>
                </Box>

                {employees.map((formData, index) => {
                    const employeeErrors = errors[index] || {};
                    const remainingDisabled = remainingDisabledFor(index);
                    return (
                        <Box
                            key={index}
                            ref={(el: HTMLDivElement | null) => {
                                sectionRefs.current[index] = el;
                            }}
                        >
                            {index > 0 && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        mt: 3,
                                        mb: 1.5,
                                        px: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 4,
                                                height: 22,
                                                borderRadius: 1,
                                                backgroundColor: "#1e4d82",
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                fontSize: "15px",
                                                fontWeight: 700,
                                                color: "#1e293b",
                                            }}
                                        >
                                            Employee {index + 1}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontSize: "11px",
                                                color: "#64748b",
                                                ml: 0.5,
                                            }}
                                        >
                                            Employee Details
                                        </Typography>
                                    </Box>

                                    <Button
                                        type="button"
                                        size="small"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleRemoveItem(index)}
                                        sx={{
                                            textTransform: "none",
                                            fontSize: "12px",
                                            minWidth: "auto",
                                            borderRadius: "6px",
                                            px: 1.2,
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            )}

                            {/* Basic Information */}
                            <Card elevation={0} sx={cardSx}>
                                <CardContent sx={cardContentSx}>
                                    <Typography sx={sectionTitleSx}>Basic Information</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={1.5}>
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <TextField
                                                fullWidth
                                                required
                                                label="Employee Code"
                                                name="employeeCode"
                                                value={formData.employeeCode}
                                                onChange={(e) => handleChange(index, e)}
                                                onBlur={(e) => handleBlur(index, e)}
                                                error={!!employeeErrors.employeeCode}
                                                helperText={employeeErrors.employeeCode}
                                                sx={inputSx}
                                                slotProps={{ htmlInput: { maxLength: 20 } }}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <TextField
                                                fullWidth
                                                required
                                                label="Employee Name"
                                                name="employeeName"
                                                value={formData.employeeName}
                                                onChange={(e) => handleChange(index, e)}
                                                onBlur={(e) => handleBlur(index, e)}
                                                error={!!employeeErrors.employeeName}
                                                helperText={employeeErrors.employeeName}
                                                sx={inputSx}
                                                slotProps={{ htmlInput: { maxLength: 150 } }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <TextField
                                                fullWidth
                                                label="Communication Name"
                                                name="communicationName"
                                                value={formData.communicationName}
                                                onChange={(e) => handleChange(index, e)}
                                                onBlur={(e) => handleBlur(index, e)}
                                                error={!!employeeErrors.communicationName}
                                                helperText={employeeErrors.communicationName}
                                                sx={inputSx}
                                                slotProps={{ htmlInput: { maxLength: 150 } }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <FormControl fullWidth required error={!!employeeErrors.departmentId} sx={inputSx}>
                                                <InputLabel>Department</InputLabel>
                                                <Select
                                                    name="departmentId"
                                                    value={formData.departmentId}
                                                    label="Department"
                                                    onChange={(e) => handleSelectChange(index, e, numericSelectFields)}
                                                    onBlur={(e) => handleSelectBlur(index, e)}>
                                                    <MenuItem value="">Select Department</MenuItem>
                                                    {departments.map((department) => (
                                                        <MenuItem key={department.id} value={department.id}>
                                                            {department.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <FormHelperText>{employeeErrors.departmentId}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <FormControl fullWidth required error={!!employeeErrors.designationId} sx={inputSx}>
                                                <InputLabel>Designation</InputLabel>
                                                <Select
                                                    name="designationId"
                                                    value={formData.designationId}
                                                    label="Designation"
                                                    onChange={(e) => handleSelectChange(index, e, numericSelectFields)}
                                                    onBlur={(e) => handleSelectBlur(index, e)}>
                                                    <MenuItem value="">Select Designation</MenuItem>
                                                    {designations.map((designation) => (
                                                        <MenuItem key={designation.id} value={designation.id}>
                                                            {designation.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <FormHelperText>{employeeErrors.designationId}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <FormControl fullWidth error={!!employeeErrors.reportingManager} sx={inputSx}>
                                                <InputLabel>Reporting Manager</InputLabel>
                                                <Select
                                                    name="reportingManager"
                                                    value={formData.reportingManager ?? ""}
                                                    label="Reporting Manager"
                                                    onChange={(e) => {
                                                        const value = e.target.value as number | "";
                                                        setFieldValue(index, "reportingManager", value === "" ? null : Number(value));
                                                    }}>
                                                    <MenuItem value="">Select Manager</MenuItem>
                                                    {reportingManagerList.map((manager) => (
                                                        <MenuItem key={manager.id} value={manager.id}>
                                                            {manager.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <FormHelperText>{employeeErrors.reportingManager}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <FormControl fullWidth required error={!!employeeErrors.employeeType} sx={inputSx}>
                                                <InputLabel>Employee Type</InputLabel>
                                                <Select
                                                    name="employeeType"
                                                    value={formData.employeeType}
                                                    label="Employee Type"
                                                    onChange={(e) => handleSelectChange(index, e)}
                                                    onBlur={(e) => handleSelectBlur(index, e)}>
                                                    <MenuItem value="">Select Type</MenuItem>
                                                    <MenuItem value="Permanent">Permanent</MenuItem>
                                                    <MenuItem value="Contract">Contract</MenuItem>
                                                    <MenuItem value="Consultant">Consultant</MenuItem>
                                                </Select>
                                                <FormHelperText>{employeeErrors.employeeType}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <FormControl fullWidth required error={!!employeeErrors.gender} sx={inputSx}>
                                                <InputLabel>Gender</InputLabel>
                                                <Select
                                                    name="gender"
                                                    value={formData.gender}
                                                    label="Gender"
                                                    onChange={(e) => handleSelectChange(index, e)}
                                                    onBlur={(e) => handleSelectBlur(index, e)}>
                                                    <MenuItem value="">Select Gender </MenuItem>
                                                    <MenuItem value="Male">Male</MenuItem>
                                                    <MenuItem value="Female">Female</MenuItem>
                                                    <MenuItem value="Other">Other</MenuItem>
                                                </Select>
                                                <FormHelperText>{employeeErrors.gender}</FormHelperText>
                                            </FormControl>
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <FormControl fullWidth error={!!employeeErrors.maritalStatus} sx={inputSx}>
                                                <InputLabel>Marital Status</InputLabel>
                                                <Select
                                                    name="maritalStatus"
                                                    value={formData.maritalStatus}
                                                    label="Marital Status"
                                                    onChange={(e) => handleSelectChange(index, e)}
                                                    onBlur={(e) => handleSelectBlur(index, e)}>
                                                    <MenuItem value="">Select Status</MenuItem>
                                                    <MenuItem value="Married">Married</MenuItem>
                                                    <MenuItem value="Unmarried">Unmarried</MenuItem>
                                                </Select>
                                                <FormHelperText>{employeeErrors.maritalStatus}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Contact Information */}
                            <Card elevation={0} sx={cardSx}>
                                <CardContent sx={cardContentSx}>
                                    <Typography sx={sectionTitleSx}>Contact Information</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={1.5}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                required
                                                label="Mobile"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={(e) => handleNumericChange(index, e)}
                                                onBlur={(e) => handleBlur(index, e)}
                                                error={!!employeeErrors.mobile}
                                                helperText={employeeErrors.mobile}
                                                sx={inputSx}
                                                slotProps={{ htmlInput: { maxLength: 10, inputMode: "numeric" } }}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Alternate Mobile"
                                                name="alternateMobile"
                                                value={formData.alternateMobile}
                                                onChange={(e) => handleNumericChange(index, e)}
                                                onBlur={(e) => handleBlur(index, e)}
                                                error={!!employeeErrors.alternateMobile}
                                                helperText={employeeErrors.alternateMobile}
                                                sx={inputSx}
                                                slotProps={{ htmlInput: { maxLength: 10, inputMode: "numeric" } }}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                required
                                                type="email"
                                                label="Email Id"
                                                name="email"
                                                value={formData.email}
                                                onChange={(e) => handleChange(index, e)}
                                                onBlur={(e) => handleBlur(index, e)}
                                                error={!!employeeErrors.email}
                                                helperText={employeeErrors.email}
                                                sx={inputSx}
                                                slotProps={{ htmlInput: { maxLength: 150 } }}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                type="email"
                                                label="Alternate Email"
                                                name="alternateEmail"
                                                value={formData.alternateEmail}
                                                onChange={(e) => handleChange(index, e)}
                                                onBlur={(e) => handleBlur(index, e)}
                                                error={!!employeeErrors.alternateEmail}
                                                helperText={employeeErrors.alternateEmail}
                                                sx={inputSx}
                                                slotProps={{ htmlInput: { maxLength: 150 } }}
                                            />
                                        </Grid>

                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                minRows={3}
                                                label="Address"
                                                name="address"
                                                value={formData.address}
                                                onChange={(e) => handleChange(index, e)}
                                                onBlur={(e) => handleBlur(index, e)}
                                                error={!!employeeErrors.address}
                                                helperText={employeeErrors.address}
                                                sx={inputSx}
                                                slotProps={{ htmlInput: { maxLength: 500 } }}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <Autocomplete
                                                fullWidth
                                                options={cities}
                                                getOptionLabel={(option) => option.name}
                                                value={cities.find((city) => city.name === formData.city) || null}
                                                onChange={(_, newValue) => {
                                                    setFieldValue(index, "city", newValue?.name || "");
                                                }}
                                                onBlur={(e) =>
                                                    handleSelectBlur(index, e as unknown as FocusEvent<HTMLInputElement>)
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        autoFocus={false}
                                                        label="City"
                                                        error={!!employeeErrors.city}
                                                        helperText={employeeErrors.city}
                                                        sx={inputSx}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <FormControl fullWidth error={!!employeeErrors.stateId} sx={inputSx}>
                                                <InputLabel>State</InputLabel>
                                                <Select
                                                    name="stateId"
                                                    value={formData.stateId}
                                                    label="State"
                                                    onChange={(e) => handleSelectChange(index, e, numericSelectFields)}
                                                    onBlur={(e) => handleSelectBlur(index, e)}
                                                >
                                                    <MenuItem value="">Select State</MenuItem>
                                                    {states.map((state) => (
                                                        <MenuItem key={state.id} value={state.id}>
                                                            {state.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>

                                                <FormHelperText>{employeeErrors.stateId}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <FormControl fullWidth required error={!!employeeErrors.countryId} sx={inputSx}>
                                                <InputLabel>Country</InputLabel>
                                                <Select
                                                    name="countryId"
                                                    value={formData.countryId}
                                                    label="Country"
                                                    onChange={(e) => handleSelectChange(index, e, numericSelectFields)}
                                                    onBlur={(e) => handleSelectBlur(index, e)}
                                                >
                                                    <MenuItem value="">Select Country</MenuItem>
                                                    {countries.map((country) => (
                                                        <MenuItem key={country.id} value={country.id}>
                                                            {country.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>

                                                <FormHelperText>{employeeErrors.countryId}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <TextField
                                                fullWidth
                                                disabled={remainingDisabled}
                                                label="Zip Code"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={(e) => handleNumericChange(index, e)}
                                                onBlur={(e) => handleBlur(index, e)}
                                                error={!!employeeErrors.zipCode}
                                                helperText={employeeErrors.zipCode}
                                                sx={inputSx}
                                                slotProps={{ htmlInput: { maxLength: 10, inputMode: "numeric" } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Personal Information */}
                            <Card elevation={0} sx={cardSx}>
                                <CardContent sx={cardContentSx}>
                                    <Typography sx={sectionTitleSx}>Personal Information</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={1.5}>
                                        {/* DOB */}
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <DatePicker
                                                label="Date of Birth"
                                                value={formData.dob ? dayjs(formData.dob) : null}
                                                onChange={(value) => handleDobChange(index, value)}
                                                maxDate={dayjs().subtract(18, "year")}
                                                referenceDate={dayjs().subtract(18, "year")}
                                                error={!!employeeErrors.dob}
                                                helperText={employeeErrors.dob}
                                            />
                                        </Grid>
                                        {/* Joining Date */}
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <DatePicker
                                                required
                                                label="Joining Date"
                                                value={formData.joiningDate ? dayjs(formData.joiningDate) : null}
                                                onChange={(value) => handleJoiningDateChange(index, value)}
                                                maxDate={dayjs()}
                                                referenceDate={dayjs()}
                                                error={!!employeeErrors.joiningDate}
                                                helperText={employeeErrors.joiningDate}
                                            />
                                        </Grid>

                                        {/* Blood Group */}
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <FormControl fullWidth error={!!employeeErrors.bloodGroup} sx={inputSx}>
                                                <InputLabel>Blood Group</InputLabel>
                                                <Select
                                                    name="bloodGroup"
                                                    value={formData.bloodGroup}
                                                    label="Blood Group"
                                                    onChange={(e) => handleSelectChange(index, e)}>
                                                    <MenuItem value="">Select Blood Group</MenuItem>
                                                    <MenuItem value="A+">A+</MenuItem>
                                                    <MenuItem value="A-">A-</MenuItem>
                                                    <MenuItem value="B+">B+</MenuItem>
                                                    <MenuItem value="B-">B-</MenuItem>
                                                    <MenuItem value="AB+"> AB+</MenuItem>
                                                    <MenuItem value="AB-">AB-</MenuItem>
                                                    <MenuItem value="O+">O+</MenuItem>
                                                    <MenuItem value="O-"> O-</MenuItem>
                                                </Select>
                                                <FormHelperText>{employeeErrors.bloodGroup}</FormHelperText>
                                            </FormControl>
                                        </Grid>

                                        {/* Languages */}
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <FormControl error={!!employeeErrors.languages}>
                                                <FormLabel>Languages</FormLabel>
                                                <FormGroup row>
                                                    {["Hindi", "English", "Arabic"].map((language) => {
                                                        const selectedLanguages = formData.languages
                                                            ? formData.languages.split(", ")
                                                            : [];
                                                        return (
                                                            <FormControlLabel
                                                                key={language}
                                                                control={
                                                                    <Checkbox
                                                                        checked={selectedLanguages.includes(language)}
                                                                        onChange={(e) => {
                                                                            const updatedLanguages = e.target.checked
                                                                                ? [...selectedLanguages, language]
                                                                                : selectedLanguages.filter((item) => item !== language);
                                                                            setFieldValue(index, "languages", updatedLanguages.join(", "));
                                                                        }}
                                                                    />
                                                                }
                                                                label={language}
                                                            />
                                                        );
                                                    })}
                                                </FormGroup>
                                                {employeeErrors.languages && (
                                                    <FormHelperText>{employeeErrors.languages}</FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>

                                        {/* Skills */}
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Autocomplete
                                                multiple
                                                options={["Select All", ...skillOptions]}
                                                value={formData.skills}
                                                filterSelectedOptions
                                                disableCloseOnSelect
                                                getOptionLabel={(option) => option}
                                                isOptionEqualToValue={(option, value) => option === value}
                                                onChange={(_, newValue) => {
                                                    const isSelectAllClicked = newValue.includes("Select All");
                                                    const updatedSkills = isSelectAllClicked
                                                        ? skillOptions
                                                        : newValue.filter((skill) => skill !== "Select All");
                                                    setFieldValue(index, "skills", updatedSkills);
                                                }}
                                                renderOption={(props, option) => {
                                                    const { key, ...optionProps } = props;
                                                    const isSelectAll = option === "Select All";
                                                    const allSelected = formData.skills.length === skillOptions.length;
                                                    return (
                                                        <li key={key} {...optionProps}>
                                                            <Checkbox
                                                                size="small"
                                                                checked={isSelectAll ? allSelected : formData.skills.includes(option)
                                                                }
                                                                sx={{ mr: 1 }} />
                                                            {option}
                                                        </li>
                                                    );
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Skills"
                                                        error={!!employeeErrors.skills}
                                                        helperText={employeeErrors.skills}
                                                        placeholder={
                                                            formData.skills.length === skillOptions.length
                                                                ? "All skills selected"
                                                                : "Select skills"
                                                        }
                                                        sx={inputSx}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Documents */}
                            <Card elevation={0} sx={cardSx}>
                                <CardContent sx={cardContentSx}>
                                    <Typography sx={sectionTitleSx}>Documents</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={1.5}>
                                        {/* Profile Image */}
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Button
                                                    component="label"
                                                    fullWidth
                                                    variant="outlined"
                                                    startIcon={<CloudUploadIcon />}
                                                    sx={{
                                                        minHeight: 42,
                                                        justifyContent: "flex-start",
                                                        fontSize: "12px",
                                                        borderRadius: "6px",
                                                        textTransform: "none",
                                                    }}
                                                >
                                                    {formData.profileImage ? formData.profileImage.name : "Upload Profile Image"}
                                                    <input
                                                        hidden
                                                        type="file"
                                                        name="profileImage"
                                                        accept=".jpg,.jpeg,.png"
                                                        onChange={(e) => handleFileChange(index, e, fileFields)}
                                                    />
                                                </Button>
                                                {formData.profileImage && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleRemoveFile(index, "profileImage")}
                                                        sx={{
                                                            color: "#ef4444",
                                                            border: "1px solid #fecaca",
                                                            borderRadius: "6px",
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        <CloseIcon sx={{ fontSize: 18 }} />
                                                    </IconButton>
                                                )}
                                            </Box>
                                            <FormHelperText error={!!employeeErrors.profileImage} sx={{ ml: "14px", mt: 0.5 }}>
                                                {employeeErrors.profileImage || "Allowed: JPG, JPEG, PNG (max 5 MB)"}
                                            </FormHelperText>
                                        </Grid>

                                        {/* Documents */}
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Button
                                                    component="label"
                                                    fullWidth
                                                    variant="outlined"
                                                    startIcon={<CloudUploadIcon />}
                                                    sx={{
                                                        minHeight: 42,
                                                        justifyContent: "flex-start",
                                                        fontSize: "12px",
                                                        borderRadius: "6px",
                                                        textTransform: "none",
                                                    }}
                                                >
                                                    {formData.documents ? formData.documents.name : "Upload Documents"}
                                                    <input
                                                        hidden
                                                        type="file"
                                                        name="documents"
                                                        accept=".pdf,.docx,.xlsx,.png,.jpg"
                                                        onChange={(e) => handleFileChange(index, e, fileFields)}
                                                    />
                                                </Button>
                                                {formData.documents && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleRemoveFile(index, "documents")}
                                                        sx={{
                                                            color: "#ef4444",
                                                            border: "1px solid #fecaca",
                                                            borderRadius: "6px",
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        <CloseIcon sx={{ fontSize: 18 }} />
                                                    </IconButton>
                                                )}
                                            </Box>
                                            <FormHelperText error={!!employeeErrors.documents} sx={{ ml: "14px", mt: 0.5 }}>
                                                {employeeErrors.documents || "Allowed: PDF, DOCX, XLSX, PNG, JPG (max 20 MB)"}
                                            </FormHelperText>
                                        </Grid>

                                        {/* Remarks */}
                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                minRows={3}
                                                label="Remarks"
                                                name="remarks"
                                                value={formData.remarks}
                                                onChange={(e) => handleChange(index, e)}
                                                onBlur={(e) => handleBlur(index, e)}
                                                error={!!employeeErrors.remarks}
                                                helperText={employeeErrors.remarks}
                                                sx={inputSx}
                                                slotProps={{ htmlInput: { maxLength: 1000 } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Box>
                    );
                })}

                {/* Bottom Buttons */}
                <FormActionButtons
                    onBack={onBack}
                    onReset={handleReset}
                    onAddMore={handleAddMore}
                    addMoreDisabled={!canAddMore}
                    addMoreText="Add More"
                    saveText="Add"
                    addMoreIcon={<AddIcon />}
                    backIcon={<ArrowBackIcon />}
                    resetIcon={<RestartAltIcon />}
                    saveIcon={<SaveIcon />}
                />
            </form>
            <ResponseDialog
                open={responseDialog.open}
                success={responseDialog.success}
                message={responseDialog.message}
                onClose={() => {
                    setResponseDialog((prev) => ({ ...prev, open: false }));
                }}
                onSuccess={() => {
                    onBack?.();
                }}
            />
        </>
    );
};
export default AddEmployee;