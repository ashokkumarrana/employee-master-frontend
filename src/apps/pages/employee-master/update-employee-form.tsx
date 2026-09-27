import { useEffect, useState, type ChangeEvent, type FocusEvent } from "react";
import * as Yup from "yup";
import dayjs, { type Dayjs } from "dayjs";
import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField,
    Typography,
    type AutocompleteChangeDetails,
    type AutocompleteChangeReason,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { SelectChangeEvent } from "@mui/material/Select";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DatePicker from "../../components/common/DatePicker";
import { employeeValidationSchema } from "./employee-validation";
import FormActionButtons from "../../components/common/FormActionButtons";
import { useAppDispatch } from "../hooks/useAppDispatch";
import type { Dropdown, Employee, EmployeeFormData, EmployeeRequest } from "./employeeTypes";
import { updateEmployee } from "../store/slices/employee-slice";
import { uploadEmployeeAttachments } from "./employeeApi";

interface UpdateEmployeeProps {
    departments: Dropdown[];
    designations: Dropdown[];
    states: Dropdown[];
    countries: Dropdown[];
    cities: Dropdown[];
    onBack?: () => void;
    employee?: Employee | null;
    onUpdateSuccess?: () => void;
    onUpdateMessage?: (message: string, severity: "success" | "error") => void;
    onError?: (message: string) => void;
}

type FormErrors = Partial<Record<keyof EmployeeFormData, string>>;

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
    joiningDate: "",
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

const REPORTING_MANAGERS = [
    { id: 1, name: "Rahul Sharma" },
    { id: 2, name: "Amit Kumar" },
    { id: 3, name: "Priya Singh" },
    { id: 4, name: "Neha Verma" },
];

const LANGUAGE_OPTIONS = ["Hindi", "English", "Arabic"];
const skillOptions = ["Java", "React", "SQL", "Spring Boot", "Python"];
const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const inputSx = {
    width: "100%",
    "& .MuiOutlinedInput-root": { minHeight: 40, borderRadius: "6px", fontSize: "13px" },
    "& .MuiInputLabel-root": { fontSize: "12px" },
    "& .MuiInputLabel-asterisk": { color: "red" },
    "& .MuiInputBase-input": { fontSize: "13px" },
};

const sectionTitleSx = {
    fontSize: "14px",
    fontWeight: 700,
    color: "#1e293b",
    mb: 1.5,
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

const getInitialEmployeeData = (employee?: Employee | null): Partial<EmployeeFormData> | undefined => {
    if (!employee) {
        return undefined;
    }
    return {
        id: employee.id,
        employeeCode: employee.employeeCode ?? "",
        employeeName: employee.employeeName ?? "",
        communicationName: employee.communicationName ?? "",
        departmentId: employee.departmentId ?? "",
        designationId: employee.designationId ?? "",
        reportingManager: employee.reportingManager ?? null,
        employeeType: employee.employeeType ?? "",
        gender: employee.gender ?? "",
        maritalStatus: employee.maritalStatus ?? "",
        skills: employee.skills ?? [],
        languages: employee.languages ?? "",
        mobile: employee.mobile ?? "",
        alternateMobile: employee.alternateMobile ?? "",
        email: employee.email ?? "",
        alternateEmail: employee.alternateEmail ?? "",
        dob: employee.dob ?? "",
        joiningDate: employee.joiningDate ?? "",
        address: employee.address ?? "",
        city: employee.city ?? "",
        stateId: employee.stateId ?? "",
        countryId: employee.countryId ?? "",
        zipCode: employee.zipCode ?? "",
        bloodGroup: employee.bloodGroup ?? "",
        status: employee.status,
        remarks: employee.remarks ?? "",
    };
};

const buildFormData = (employee?: Employee | null): EmployeeFormData => {
    const mapped = getInitialEmployeeData(employee);
    return {
        ...initialFormData,
        ...mapped,
        skills: mapped?.skills ? [...mapped.skills] : [],
    };
};

function toEmployeeRequest(formData: EmployeeFormData): EmployeeRequest {
    return {
        id: formData.id ?? null,
        employeeCode: formData.employeeCode,
        employeeName: formData.employeeName,
        communicationName: formData.communicationName,
        departmentId: Number(formData.departmentId),
        designationId: Number(formData.designationId),
        reportingManager: formData.reportingManager ? Number(formData.reportingManager) : null,
        employeeType: formData.employeeType,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        skills: [...formData.skills],
        languages: formData.languages,
        mobile: formData.mobile,
        alternateMobile: formData.alternateMobile,
        email: formData.email,
        alternateEmail: formData.alternateEmail,
        dob: formData.dob || null,
        joiningDate: formData.joiningDate || null,
        address: formData.address,
        city: formData.city || null,
        stateId: formData.stateId === "" ? null : Number(formData.stateId),
        countryId: Number(formData.countryId),
        zipCode: formData.zipCode,
        bloodGroup: formData.bloodGroup,
        status: formData.status,
        remarks: formData.remarks,
    };
}

function getValidationErrors(error: Yup.ValidationError): FormErrors {
    const validationErrors: FormErrors = {};
    error.inner.forEach((item) => {
        if (!item.path) {
            return;
        }
        const fieldName = item.path as keyof EmployeeFormData;
        if (!validationErrors[fieldName]) {
            validationErrors[fieldName] = item.message;
        }
    });
    return validationErrors;
}

function focusFirstInvalidField(validationErrors: FormErrors, fieldOrder: (keyof EmployeeFormData)[]) {
    const firstInvalidField = fieldOrder.find((field) => validationErrors[field]);
    if (!firstInvalidField) {
        return;
    }
    setTimeout(() => {
        const element = document.querySelector(`[name="${firstInvalidField}"]`);
        if (element instanceof HTMLElement) {
            element.focus();
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, 0);
}

function extractErrorMessage(error: unknown): string {
    const backendError = typeof error === "object" && error !== null
        ? (error as { status?: number; message?: string; error?: string })
        : null;
    return backendError?.error || backendError?.message || "Something went wrong while updating employee.";
}

const UpdateEmployee = ({
    departments,
    designations,
    states,
    countries,
    cities,
    onBack,
    employee,
    onUpdateSuccess,
    onUpdateMessage,
}: UpdateEmployeeProps) => {
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState<EmployeeFormData>(() => buildFormData(employee));
    const [errors, setErrors] = useState<FormErrors>({});
    const [formVisible, setFormVisible] = useState(true);
    const [existingProfileImage, setExistingProfileImage] = useState<string | null>(employee?.profileImage ?? null);
    const [existingDocuments, setExistingDocuments] = useState<string | null>(employee?.documents ?? null);
    const [showStatusSwitch, setShowStatusSwitch] = useState(getInitialEmployeeData(employee)?.status === true);
    useEffect(() => {
        const mapped = getInitialEmployeeData(employee);
        setFormData(buildFormData(employee));
        setShowStatusSwitch(mapped?.status === true);
        setErrors({});
        setFormVisible(true);
        setExistingProfileImage(employee?.profileImage ?? null);
        setExistingDocuments(employee?.documents ?? null);
    }, [employee]);

    const hasFieldValue = (field: keyof EmployeeFormData): boolean => {
        const value = formData[field];
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        if (value instanceof File) {
            return true;
        }
        if (typeof value === "boolean") {
            return true;
        }
        return String(value ?? "").trim().length > 0;
    };

    const isFieldValid = (field: keyof EmployeeFormData): boolean => {
        if (!hasFieldValue(field)) {
            return false;
        }
        try {
            employeeValidationSchema.validateSyncAt(field, formData);
            return true;
        } catch {
            return false;
        }
    };

    const isFieldDisabled = (field: keyof EmployeeFormData): boolean => {
        const currentIndex = requiredFieldOrder.indexOf(field);
        if (currentIndex <= 0) {
            return false;
        }
        const previousField = requiredFieldOrder[currentIndex - 1];
        return !isFieldValid(previousField);
    };

    const validateField = async (field: keyof EmployeeFormData) => {
        try {
            await employeeValidationSchema.validateAt(field, formData);
            setErrors((prev) => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                setErrors((prev) => ({ ...prev, [field]: error.message }));
            }
        }
    };

    const validateLiveField = async (
        fieldName: keyof EmployeeFormData,
        updatedFormData: EmployeeFormData
    ) => {
        try {
            await employeeValidationSchema.validateAt(fieldName, updatedFormData);
            setErrors((prev) => {
                const updated = { ...prev };
                delete updated[fieldName];
                return updated;
            });
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                setErrors((prev) => ({ ...prev, [fieldName]: error.message }));
            }
        }
    };

    const handleBlur = async (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const fieldName = event.target.name as keyof EmployeeFormData;
        if (fieldName in formData) {
            await validateField(fieldName);
        }
    };

    const handleSelectBlur = async (event: FocusEvent<HTMLInputElement>) => {
        const fieldName = event.target.name as keyof EmployeeFormData;
        if (fieldName in formData) {
            await validateField(fieldName);
        }
    };

    const handleChange = async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        const fieldName = name as keyof EmployeeFormData;
        const updatedFormData = { ...formData, [fieldName]: value };
        setFormData(updatedFormData);
        await validateLiveField(fieldName, updatedFormData);
    };

    const handleSelectChange = async (event: SelectChangeEvent<number | string>) => {
        const { name, value } = event.target;
        const fieldName = name as keyof EmployeeFormData;

        let fieldValue: string | number | null = value;
        if (
            fieldName === "departmentId" ||
            fieldName === "designationId" ||
            fieldName === "stateId" ||
            fieldName === "countryId"
        ) {
            fieldValue = value === "" ? "" : Number(value);
        }

        const updatedFormData: EmployeeFormData = { ...formData, [fieldName]: fieldValue as never };
        setFormData(updatedFormData);
        await validateLiveField(fieldName, updatedFormData);
    };

    const handleMobileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const numericValue = value.replace(/\D/g, "").slice(0, 10);
        const fieldName = name as keyof EmployeeFormData;
        const updatedFormData = { ...formData, [fieldName]: numericValue };
        setFormData(updatedFormData);
        await validateLiveField(fieldName, updatedFormData);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, files } = event.target;
        if (!files?.length) {
            return;
        }
        if (name !== "profileImage" && name !== "documents") {
            return;
        }

        const selectedFile = files[0];
        const fieldName = name as keyof EmployeeFormData;
        setFormData((prev) => ({ ...prev, [fieldName]: selectedFile }));
        setErrors((prev) => {
            const updated = { ...prev };
            delete updated[fieldName];
            return updated;
        });
    };

    const handleRemoveFile = (field: "profileImage" | "documents") => {
        setFormData((prev) => ({ ...prev, [field]: null }));
        setErrors((prev) => {
            const updated = { ...prev };
            delete updated[field];
            return updated;
        });
        if (field === "profileImage") {
            setExistingProfileImage(null);
        } else {
            setExistingDocuments(null);
        }
    };

    const handleDobChange = async (value: Dayjs | null) => {
        const updatedFormData = { ...formData, dob: value ? value.format("YYYY-MM-DD") : "" };
        setFormData(updatedFormData);
        await validateLiveField("dob", updatedFormData);
    };

    const handleJoiningDateChange = async (value: Dayjs | null) => {
        const updatedFormData = {
            ...formData,
            joiningDate: value ? value.format("YYYY-MM-DD") : "",
        };
        setFormData(updatedFormData);
        await validateLiveField("joiningDate", updatedFormData);
    };

    const handleReportingManagerChange = (
        _: unknown,
        selectedEmployee: { id: number; name: string } | null
    ) => {
        const updatedFormData = {
            ...formData,
            reportingManager: selectedEmployee ? selectedEmployee.id : null,
        };
        setFormData(updatedFormData);
        validateLiveField("reportingManager", updatedFormData);
    };

    const handleCityChange = async (_: unknown, newValue: Dropdown | null) => {
        const updatedFormData: EmployeeFormData = { ...formData, city: newValue?.name || "" };
        setFormData(updatedFormData);
        await validateLiveField("city", updatedFormData);
    };

    const handleLanguageToggle = (language: string) => (e: ChangeEvent<HTMLInputElement>) => {
        const selectedLanguages = formData.languages ? formData.languages.split(", ") : [];
        const updatedLanguages = e.target.checked
            ? [...selectedLanguages, language]
            : selectedLanguages.filter((item) => item !== language);

        setFormData((prev) => ({ ...prev, languages: updatedLanguages.join(", ") }));
    };

    const handleSkillsChange = (
        _: React.SyntheticEvent,
        newValue: string[],
        _reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails<string>
    ) => {
        if (details?.option === "Select All") {
            setFormData((prev) => ({
                ...prev,
                skills:
                    prev.skills.length === skillOptions.length
                        ? []
                        : [...skillOptions],
            }));
            return;
        }

        setFormData((prev) => ({
            ...prev,
            skills: newValue.filter((skill) => skill !== "Select All"),
        }));
    };

    const handleStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setFormData((prev) => ({ ...prev, status: !checked }));
    };

    const finishUpdate = (message: string, severity: "success" | "error", notifySuccess: boolean) => {
        setFormVisible(false);
        onUpdateMessage?.(message, severity);
        if (notifySuccess) {
            onUpdateSuccess?.();
        }
        onBack?.();
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await employeeValidationSchema.validate(formData, { abortEarly: false });
            setErrors({});

            const response = await dispatch(
                updateEmployee({ id: formData.id!, data: toEmployeeRequest(formData) })
            ).unwrap();

            if (formData.profileImage || formData.documents) {
                try {
                    await uploadEmployeeAttachments([
                        { id: formData.id!, profileImage: formData.profileImage, documents: formData.documents },
                    ]);
                } catch {
                    finishUpdate("Employee updated, but attachment upload failed.", "error", true);
                    return;
                }
            }

            finishUpdate(response.message || "Employee updated successfully.", "success", true);
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors = getValidationErrors(error);
                setErrors(validationErrors);
                focusFirstInvalidField(validationErrors, requiredFieldOrder);
                return;
            }
            finishUpdate(extractErrorMessage(error), "error", false);
        }
    };

    const handleReset = () => {
        setFormData(buildFormData(employee));
        setErrors({});
    };

    return (
        <>
            {formVisible && (
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ width: "100%", minWidth: 0, pb: 2 }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                            mb: 2,
                            flexWrap: "wrap",
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: { xs: "19px", sm: "21px", md: "23px" },
                                    fontWeight: 700,
                                    color: "#1e293b",
                                }}
                            >
                                Update Employee
                            </Typography>
                            <Typography sx={{ fontSize: "12px", color: "#64748b", mt: 0.3 }}>
                                Update employee information
                            </Typography>
                        </Box>

                        <Button
                            type="button"
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={onBack}
                            sx={{ minHeight: 36, fontSize: "12px", borderRadius: "6px" }}
                        >
                            Back
                        </Button>
                    </Box>

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
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.employeeCode}
                                        helperText={errors.employeeCode}
                                        sx={inputSx}
                                        slotProps={{ htmlInput: { maxLength: 20 } }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <TextField
                                        fullWidth
                                        required
                                        disabled={isFieldDisabled("employeeName")}
                                        label="Employee Name"
                                        name="employeeName"
                                        value={formData.employeeName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.employeeName}
                                        helperText={errors.employeeName}
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
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.communicationName}
                                        helperText={errors.communicationName}
                                        sx={inputSx}
                                        slotProps={{ htmlInput: { maxLength: 150 } }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl
                                        fullWidth
                                        required
                                        error={!!errors.departmentId}
                                        sx={inputSx}
                                    >
                                        <InputLabel>Department</InputLabel>
                                        <Select
                                            name="departmentId"
                                            value={formData.departmentId}
                                            label="Department"
                                            onChange={handleSelectChange}
                                        >
                                            <MenuItem value="">Select Department</MenuItem>
                                            {departments.map((department) => (
                                                <MenuItem key={department.id} value={department.id}>
                                                    {department.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{errors.departmentId}</FormHelperText>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl
                                        fullWidth
                                        required
                                        error={!!errors.designationId}
                                        sx={inputSx}
                                    >
                                        <InputLabel>Designation</InputLabel>
                                        <Select
                                            name="designationId"
                                            value={formData.designationId}
                                            label="Designation"
                                            onChange={handleSelectChange}
                                            onBlur={handleSelectBlur}
                                        >
                                            <MenuItem value="">Select Designation</MenuItem>
                                            {designations.map((designation) => (
                                                <MenuItem key={designation.id} value={designation.id}>
                                                    {designation.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{errors.designationId}</FormHelperText>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <Autocomplete
                                        fullWidth
                                        options={REPORTING_MANAGERS}
                                        getOptionLabel={(option) => option.name}
                                        value={
                                            REPORTING_MANAGERS.find(
                                                (employeeOption) => employeeOption.id === formData.reportingManager
                                            ) || null
                                        }
                                        onChange={handleReportingManagerChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Reporting Manager"
                                                error={!!errors.reportingManager}
                                                helperText={errors.reportingManager}
                                                sx={inputSx}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl
                                        fullWidth
                                        required
                                        error={!!errors.employeeType}
                                        sx={inputSx}
                                    >
                                        <InputLabel>Employee Type</InputLabel>
                                        <Select
                                            name="employeeType"
                                            value={formData.employeeType}
                                            label="Employee Type"
                                            onChange={handleSelectChange}
                                            onBlur={handleSelectBlur}
                                        >
                                            <MenuItem value="">Select Type</MenuItem>
                                            <MenuItem value="Permanent">Permanent</MenuItem>
                                            <MenuItem value="Contract">Contract</MenuItem>
                                            <MenuItem value="Consultant">Consultant</MenuItem>
                                        </Select>
                                        <FormHelperText>{errors.employeeType}</FormHelperText>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl
                                        fullWidth
                                        required
                                        error={!!errors.gender}
                                        sx={inputSx}
                                    >
                                        <InputLabel>Gender</InputLabel>
                                        <Select
                                            name="gender"
                                            value={formData.gender}
                                            label="Gender"
                                            onChange={handleSelectChange}
                                            onBlur={handleSelectBlur}
                                        >
                                            <MenuItem value="">Select Gender</MenuItem>
                                            <MenuItem value="Male">Male</MenuItem>
                                            <MenuItem value="Female">Female</MenuItem>
                                            <MenuItem value="Other">Other</MenuItem>
                                        </Select>
                                        <FormHelperText>{errors.gender}</FormHelperText>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl
                                        fullWidth
                                        error={!!errors.maritalStatus}
                                        sx={inputSx}
                                    >
                                        <InputLabel>Marital Status</InputLabel>
                                        <Select
                                            name="maritalStatus"
                                            value={formData.maritalStatus}
                                            label="Marital Status"
                                            onChange={handleSelectChange}
                                            onBlur={handleSelectBlur}
                                        >
                                            <MenuItem value="">Select Status</MenuItem>
                                            <MenuItem value="Married">Married</MenuItem>
                                            <MenuItem value="Unmarried">Unmarried</MenuItem>
                                        </Select>
                                        <FormHelperText>{errors.maritalStatus}</FormHelperText>
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
                                        onChange={handleMobileChange}
                                        onBlur={handleBlur}
                                        error={!!errors.mobile}
                                        helperText={errors.mobile}
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
                                        onChange={handleMobileChange}
                                        onBlur={handleBlur}
                                        error={!!errors.alternateMobile}
                                        helperText={errors.alternateMobile}
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
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.email}
                                        helperText={errors.email}
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
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.alternateEmail}
                                        helperText={errors.alternateEmail}
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
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.address}
                                        helperText={errors.address}
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
                                        onChange={handleCityChange}
                                        onBlur={handleSelectBlur}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="City"
                                                error={!!errors.city}
                                                helperText={errors.city}
                                                sx={inputSx}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <FormControl fullWidth error={!!errors.stateId} sx={inputSx}>
                                        <InputLabel>State</InputLabel>
                                        <Select
                                            name="stateId"
                                            value={formData.stateId}
                                            label="State"
                                            onChange={handleSelectChange}
                                            onBlur={handleSelectBlur}>
                                            <MenuItem value="">Select State</MenuItem>
                                            {states.map((state) => (
                                                <MenuItem key={state.id} value={state.id}>
                                                    {state.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{errors.stateId}</FormHelperText>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <FormControl fullWidth required error={!!errors.countryId} sx={inputSx}>
                                        <InputLabel>Country</InputLabel>
                                        <Select
                                            name="countryId"
                                            value={formData.countryId}
                                            label="Country"
                                            onChange={handleSelectChange}
                                            onBlur={handleSelectBlur}
                                        >
                                            <MenuItem value="">Select Country</MenuItem>
                                            {countries.map((country) => (
                                                <MenuItem key={country.id} value={country.id}>
                                                    {country.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{errors.countryId}</FormHelperText>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <TextField
                                        fullWidth
                                        label="Zip Code"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleMobileChange}
                                        onBlur={handleBlur}
                                        error={!!errors.zipCode}
                                        helperText={errors.zipCode}
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
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <DatePicker
                                        label="Date of Birth"
                                        value={formData.dob ? dayjs(formData.dob) : null}
                                        onChange={handleDobChange}
                                        maxDate={dayjs().subtract(18, "year")}
                                        referenceDate={dayjs().subtract(18, "year")}
                                        error={!!errors.dob}
                                        helperText={errors.dob}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <DatePicker
                                        required
                                        label="Joining Date"
                                        value={formData.joiningDate ? dayjs(formData.joiningDate) : null}
                                        onChange={handleJoiningDateChange}
                                        maxDate={dayjs()}
                                        referenceDate={dayjs()}
                                        error={!!errors.joiningDate}
                                        helperText={errors.joiningDate}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl fullWidth error={!!errors.bloodGroup} sx={inputSx}>
                                        <InputLabel>Blood Group</InputLabel>
                                        <Select
                                            name="bloodGroup"
                                            value={formData.bloodGroup}
                                            label="Blood Group"
                                            onChange={handleSelectChange}
                                        >
                                            <MenuItem value=""></MenuItem>
                                            {BLOOD_GROUP_OPTIONS.map((group) => (
                                                <MenuItem key={group} value={group}>
                                                    {group}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{errors.bloodGroup}</FormHelperText>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControl error={!!errors.languages}>
                                        <FormLabel>Languages</FormLabel>
                                        <FormGroup row>
                                            {LANGUAGE_OPTIONS.map((language) => {
                                                const selectedLanguages = formData.languages
                                                    ? formData.languages.split(", ")
                                                    : [];
                                                return (
                                                    <FormControlLabel
                                                        key={language}
                                                        control={
                                                            <Checkbox
                                                                checked={selectedLanguages.includes(language)}
                                                                onChange={handleLanguageToggle(language)}
                                                            />
                                                        }
                                                        label={language}
                                                    />
                                                );
                                            })}
                                        </FormGroup>
                                        {errors.languages && <FormHelperText>{errors.languages}</FormHelperText>}
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Autocomplete
                                        multiple
                                        options={["Select All", ...skillOptions]}
                                        value={formData.skills}
                                        onChange={handleSkillsChange}
                                        disableCloseOnSelect
                                        renderOption={(props, option) => {
                                            const allSelected =
                                                formData.skills.length === skillOptions.length;

                                            return (
                                                <li {...props}>
                                                    <Checkbox
                                                        size="small"
                                                        checked={
                                                            option === "Select All"
                                                                ? allSelected
                                                                : formData.skills.includes(option)
                                                        }
                                                        sx={{ mr: 1 }}
                                                    />
                                                    {option}
                                                </li>
                                            );
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Skills"
                                                error={!!errors.skills}
                                                helperText={errors.skills}
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
                                            {formData.profileImage
                                                ? formData.profileImage.name
                                                : existingProfileImage
                                                    ? existingProfileImage.split("/").pop()
                                                    : "Upload Profile Image"}
                                            <input
                                                hidden
                                                type="file"
                                                name="profileImage"
                                                accept=".jpg,.jpeg,.png"
                                                onChange={handleFileChange}
                                            />
                                        </Button>
                                        {(formData.profileImage || existingProfileImage) && (
                                            <IconButton
                                                size="small"
                                                onClick={() => handleRemoveFile("profileImage")}
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
                                    {errors.profileImage && <FormHelperText error>{errors.profileImage}</FormHelperText>}
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
                                            {formData.documents
                                                ? formData.documents.name
                                                : existingDocuments
                                                    ? existingDocuments.split("/").pop()
                                                    : "Upload Documents"}
                                            <input
                                                hidden
                                                type="file"
                                                name="documents"
                                                accept=".pdf,.docx,.xlsx,.png,.jpg"
                                                onChange={handleFileChange}
                                            />
                                        </Button>
                                        {(formData.documents || existingDocuments) && (
                                            <IconButton
                                                size="small"
                                                onClick={() => handleRemoveFile("documents")}
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
                                    {errors.documents && <FormHelperText error>{errors.documents}</FormHelperText>}
                                </Grid>

                                <Grid size={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={3}
                                        label="Remarks"
                                        name="remarks"
                                        value={formData.remarks}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.remarks}
                                        helperText={errors.remarks}
                                        sx={inputSx}
                                        slotProps={{ htmlInput: { maxLength: 1000 } }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Status */}
                    {showStatusSwitch && (
                        <Card elevation={0} sx={{ mb: 2, border: "1px solid #dbe3ef", borderRadius: "8px" }}>
                            <CardContent sx={{ py: "10px !important" }}>
                                <FormControlLabel
                                    control={<Switch checked={formData.status === false} onChange={handleStatusChange} />}
                                    label={
                                        <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>
                                            Activate Employee
                                        </Typography>
                                    }
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Bottom Buttons */}
                    <FormActionButtons
                        onBack={onBack}
                        onReset={handleReset}
                        saveText="Update"
                        backText="Back"
                        resetText="Reset"
                        backIcon={<ArrowBackIcon />}
                        resetIcon={<RestartAltIcon />}
                        saveIcon={<SaveIcon />}
                    />
                </Box>
            )}
        </>
    );
};

export default UpdateEmployee;