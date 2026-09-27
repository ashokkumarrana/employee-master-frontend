import dayjs from "dayjs";
import * as Yup from "yup";

export const employeeValidationSchema = Yup.object({
    employeeCode: Yup.string()
        .trim()
        .required("Please enter an employee code")
        .max(20, "Employee code must not exceed 20 characters")
        .matches(
            /^[A-Za-z0-9]+$/,
            "Employee code can contain only letters and numbers"
        ),

    employeeName: Yup.string()
        .trim()
        .required("Please enter an employee name")
        .max(150, "Employee name must not exceed 150 characters")
        .matches(
            /^[A-Za-z]+(?: [A-Za-z]+)*$/,
            "Employee name can contain only alphabets and spaces"
        ),

    communicationName: Yup.string()
        .trim()
        .max(150, "Communication name must not exceed 150 characters"),

    departmentId: Yup.string()
        .required("Please select a department"),

    designationId: Yup.string()
        .required("Please select a designation"),

    reportingManager: Yup.string()
        .trim()
        .nullable()
        .notRequired(),

    employeeType: Yup.string()
        .required("Please select an employee type")
        .oneOf(
            ["Permanent", "Contract", "Consultant"],
            "Please select an employee type"
        ),

    gender: Yup.string()
        .required("Please select a gender")
        .oneOf(
            ["Male", "Female", "Other"],
            "Please select a gender"
        ),

    maritalStatus: Yup.string()
        .oneOf(
            ["", "Married", "Unmarried"],
            "Please select a valid marital status"
        ),

    skills: Yup.array()
        .of(Yup.string().trim())
        .default([]),

    languages: Yup.string()
        .trim()
        .max(100, "Languages must not exceed 100 characters"),

    mobile: Yup.string()
        .required("Please enter a mobile number")
        .matches(
            /^[6-9][0-9]{9}$/,
            "Please enter a valid 10-digit mobile number starting with 6-9"
        ),

    alternateMobile: Yup.string().test(
        "valid-alternate-mobile",
        "Please enter a valid 10-digit alternate mobile number starting with 6-9",
        (value) => {
            if (!value || value.trim() === "") {
                return true;
            }

            return /^[6-9][0-9]{9}$/.test(value);
        }
    ),

    email: Yup.string()
        .trim()
        .required("Please enter an email address")
        .email("Please enter a valid email address")
        .max(150, "Email address must not exceed 150 characters"),

    alternateEmail: Yup.string()
        .trim()
        .email("Please enter a valid alternate email address")
        .max(
            150,
            "Alternate email address must not exceed 150 characters"
        ),

    dob: Yup.string().test(
        "minimum-age",
        "Employee must be at least 18 years old",
        (value) => {
            if (!value || value.trim() === "") {
                return true;
            }

            const dob = dayjs(value);
            const minimumDob = dayjs().subtract(18, "year");

            return !dob.isAfter(minimumDob, "day");
        }
    ),

    joiningDate: Yup.string()
        .required("Please select a joining date")
        .test(
            "not-future",
            "Joining date cannot be in the future",
            (value) => {
                if (!value || value.trim() === "") {
                    return true;
                }

                const joiningDate = dayjs(value);

                return !joiningDate.isAfter(dayjs(), "day");
            }
        ),

    address: Yup.string()
        .trim()
        .max(500, "Address must not exceed 500 characters"),

    city: Yup.string()
        .trim()
        .max(100, "City must not exceed 100 characters")
        .test(
            "valid-city",
            "City can contain only alphabets and spaces",
            (value) => {
                if (!value || value.trim() === "") {
                    return true;
                }

                return /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(value);
            }
        ),

    stateId: Yup.string()
        .trim(),

    countryId: Yup.string()
        .required("Please select a country"),

    zipCode: Yup.string()
        .trim()
        .max(10, "ZIP code must not exceed 10 digits")
        .test(
            "valid-zipcode",
            "ZIP code can contain only numbers",
            (value) => {
                if (!value || value.trim() === "") {
                    return true;
                }

                return /^[0-9]+$/.test(value);
            }
        ),

    bloodGroup: Yup.string()
        .oneOf(
            ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            "Please select a valid blood group"
        ),

    status: Yup.boolean(),

    profileImage: Yup.mixed<File>()
        .nullable()
        .test(
            "fileType",
            "Only JPG, JPEG, and PNG files are allowed",
            (file) => {
                if (!file) {
                    return true;
                }

                return [
                    "image/jpeg",
                    "image/png",
                ].includes(file.type);
            }
        )
        .test(
            "fileSize",
            "Profile image must not exceed 5 MB",
            (file) => {
                if (!file) {
                    return true;
                }

                return file.size <= 5 * 1024 * 1024;
            }
        ),

    documents: Yup.mixed<File>()
        .nullable()
        .test(
            "fileType",
            "Only PDF, DOC, DOCX, XLS, and XLSX files are allowed",
            (file) => {
                if (!file) {
                    return true;
                }

                return [
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "application/vnd.ms-excel",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ].includes(file.type);
            }
        )
        .test(
            "fileSize",
            "Document must not exceed 20 MB",
            (file) => {
                if (!file) {
                    return true;
                }

                return file.size <= 20 * 1024 * 1024;
            }
        ),

    remarks: Yup.string()
        .trim()
        .max(1000, "Remarks must not exceed 1000 characters"),
});
