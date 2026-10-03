import type { Dayjs } from "dayjs";

export interface Employee {
    id: number;
    employeeCode: string;
    employeeName: string;
    communicationName: string;
    departmentId: number;
    designationId: number;
    reportingManager: number | null;
    employeeType: string;
    gender: string;
    maritalStatus: string;
    skills: string[];
    languages: string;
    mobile: string;
    alternateMobile: string;
    email: string;
    alternateEmail: string;
    dob: string;
    joiningDate: string;
    address: string;
    city: string | null;
    stateId: number | null;
    countryId: number;
    zipCode: string;
    bloodGroup: string;
    status: boolean;
    profileImage: string | null;
    documents: string | null;
    remarks: string;
    createdBy: number;
    createdByName?: string | null;
    createdAt: string;
    updatedBy: number;
    updatedByName?: string | null;
    updatedAt: string;
}

export interface EmployeeRequest {
    id?: number | null;
    employeeCode: string;
    employeeName: string;
    communicationName: string;
    departmentId: number;
    designationId: number;
    reportingManager: number | null;
    employeeType: string;
    gender: string;
    maritalStatus: string;
    skills: string[];
    languages: string;
    mobile: string;
    alternateMobile: string;
    email: string;
    alternateEmail: string;
    dob: string | null;
    joiningDate: string | null;
    address: string;
    city: string | null;
    stateId: number | null;
    countryId: number;
    zipCode: string;
    bloodGroup: string;
    status: boolean;
    remarks: string;
}

export interface EmployeePage {
    content: Employee[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
    error: string | null;
}

export type EmployeeHistoryAction = "CREATED" | "UPDATED" | "DELETED";

export interface EmployeeHistoryFieldChange {
    field: string;
    oldValue: string | null;
    newValue: string | null;
}

export interface EmployeeHistory {
    historyId: number;
    employeeId: number;
    action: "CREATE" | "UPDATE" | "DELETE";
    employeeCode: string;
    employeeName: string;
    departmentId: number;
    designationId: number;
    employeeType: string;
    gender: string;
    mobile: string;
    email: string;
    joiningDate: string;
    countryId: number;
    status: boolean;
    communicationName: string | null;
    reportingManager: number | null;
    maritalStatus: string | null;
    skills: string[] | null;
    languages: string | null;
    alternateMobile: string | null;
    alternateEmail: string | null;
    dob: string | null;
    address: string | null;
    city: string | null;
    stateId: number | null;
    zipCode: string | null;
    bloodGroup: string | null;
    profileImage: string | null;
    documents: string | null;
    remarks: string | null;

    createdBy: number | null;
    createdByName?: string | null;
    createdAt: string | null;

    updatedBy: number | null;
    updatedAt: string | null;

    changedBy: number | null;
    changedByName?: string | null;
    changedAt: string;
}

export interface EmployeeHistoryPage {
    content: EmployeeHistory[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

export interface Dropdown {
    id: number;
    name: string;
}

export interface EmployeeFilter {
    departmentId?: number;
    designationId?: number;
    city?: string;
    status?: boolean;
    fromDate?: string;
    toDate?: string;
}

export interface DepartmentEmployeeCount {
    id: number;
    name: string;
    total: number;
    active: number;
    inactive: number;
}

export interface ExcelDownloadResult {
    emailSent: boolean;
    message: string;
    blob?: Blob;
    filename?: string;
    attachmentContent?: string;
}

export interface EmployeeFormData {
    id?: number | null;
    employeeCode: string;
    employeeName: string;
    communicationName: string;
    departmentId: number | "";
    designationId: number | "";
    reportingManager: number | null;
    employeeType: string;
    gender: string;
    maritalStatus: string;
    skills: string[];
    languages: string;
    mobile: string;
    alternateMobile: string;
    email: string;
    alternateEmail: string;
    dob: string;
    joiningDate: string;
    address: string;
    city: string;
    stateId: number | "";
    countryId: number | "";
    zipCode: string;
    bloodGroup: string;
    status: boolean;
    profileImage: File | null;
    documents: File | null;
    remarks: string;
}

export interface EmployeeFilterValues {
    search: string;
    dateFrom: Dayjs | null;
    dateTo: Dayjs | null;
    department: number | "";
    designation: number | "";
    status: string;
    city: string;
}

export interface EmployeeExcelSummary {
    id: string;
    uploadNumber: number;
    uploadedAt: string;
    totalRows: number;
    successCount: number;
    failureCount: number;
    duplicateCount: number;
    isRead: boolean;
    attachmentName?: string;
    attachmentContent?: string;
}
export interface EmployeeExcelDownloadSummary {
    id: string;
    downloadedAt: string;
    fromDate: string;
    toDate: string;
    days: number;
    message: string;
    fileName?: string;
    attachmentContent?: string;
    isRead: boolean;
}
export const reportingManagerList = [
    { id: 1, name: "Rahul Sharma" },
    { id: 2, name: "Amit Kumar" },
    { id: 3, name: "Priya Singh" },
    { id: 4, name: "Neha Verma" },
];

export const getReportingManagerName = (id?: number | string | null) =>
    reportingManagerList.find((manager) => manager.id === Number(id))?.name || "N/A";