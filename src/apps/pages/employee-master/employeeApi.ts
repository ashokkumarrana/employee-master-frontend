import api from "../../../api/axios";
import type { ExcelUploadResponse } from "../../components/common/ExcelUpload";
import type { ApiResponse, DepartmentEmployeeCount, Dropdown, Employee, EmployeeFilter, EmployeeHistoryPage, EmployeePage, EmployeeRequest, ExcelDownloadResult, } from "./employeeTypes";
export type { ExcelUploadResponse };

export const getEmployees = async (
    page = 0,
    size = 10,
    sortBy = "id",
    direction = "desc",
    filters?: EmployeeFilter
): Promise<ApiResponse<EmployeePage>> => {
    const response = await api.get<ApiResponse<EmployeePage>>("/employee/list", { params: { page, size, sortBy, direction, ...filters, }, });
    return response.data;
};

export const saveEmployee = async (data: EmployeeRequest[]): Promise<ApiResponse<Employee[]>> => {
    const response = await api.post<ApiResponse<Employee[]>>("/employee/save", data);
    return response.data;
};

export const uploadEmployeeAttachments = async (
    attachments: { id: number; profileImage?: File | null; documents?: File | null }[]
): Promise<ApiResponse<void>> => {
    const formData = new FormData();

    attachments.forEach((attachment) => {
        if (attachment.profileImage) {
            formData.append(`profileImage_${attachment.id}`, attachment.profileImage);
        }
        if (attachment.documents) {
            formData.append(`documents_${attachment.id}`, attachment.documents);
        }
    });

    const response = await api.post<ApiResponse<void>>("/employee/attachments", formData);
    return response.data;
};

export const downloadEmployeeAttachment = async (path: string
): Promise<{ blob: Blob; filename: string }> => {
    const response = await api.get("/employee/attachments/download", {
        params: { path },
        responseType: "blob",
    });

    const contentDisposition = response.headers["content-disposition"];
    let filename = path.split("/").pop() || "attachment";

    if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
            filename = match[1];
        }
    }
    return { blob: response.data, filename };
};

export const updateEmployee = async (id: number, data: EmployeeRequest): Promise<ApiResponse<Employee[]>> => {
    return saveEmployee([{ ...data, id }]);
};

export const deleteEmployee = async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/employee/delete/${id}`);
    return response.data;
};

export const getEmployeeHistory = async (
    employeeId: number,
    page = 0,
    size = 10,
    sortBy = "changedAt",
    direction = "desc"
): Promise<ApiResponse<EmployeeHistoryPage>> => {
    const response = await api.get<ApiResponse<EmployeeHistoryPage>>(
        `/employee/history/${employeeId}`,
        { params: { page, size, sortBy, direction } }
    );
    return response.data;
};

export const getEmployeeCounts = async (filters?: { fromDate?: string; toDate?: string }
): Promise<ApiResponse<{
    totalEmployees: number;
    activeEmployees: number;
    inactiveEmployees: number;
}>> => {
    const response = await api.get<ApiResponse<{
        totalEmployees: number;
        activeEmployees: number;
        inactiveEmployees: number;
    }>>("/employee/count-status", { params: { ...filters } });
    return response.data;
};

export const searchEmployees = async (search: string): Promise<ApiResponse<Employee[]>> => {
    const response = await api.get<ApiResponse<Employee[]>>("/employee/search", { params: { search }, }
    );
    return response.data;
};

export const getDepartments = async (): Promise<ApiResponse<Dropdown[]>> => {
    const response = await api.get<ApiResponse<Dropdown[]>>("/dropdown/department/list");
    return response.data;
};

export const getDesignations = async (): Promise<ApiResponse<Dropdown[]>> => {
    const response = await api.get<ApiResponse<Dropdown[]>>("/dropdown/designation/list");
    return response.data;
};

export const getStates = async (): Promise<ApiResponse<Dropdown[]>> => {
    const response = await api.get<ApiResponse<Dropdown[]>>("/dropdown/state/list");
    return response.data;
};

export const getCountries = async (): Promise<ApiResponse<Dropdown[]>> => {
    const response = await api.get<ApiResponse<Dropdown[]>>("/dropdown/country/list");
    return response.data;
};

export const getCities = async (): Promise<ApiResponse<Dropdown[]>> => {
    const response = await api.get<ApiResponse<Dropdown[]>>("/dropdown/city/list");
    return response.data;
};

export const uploadEmployeeExcel = async (file: File): Promise<ExcelUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<ExcelUploadResponse>("/employee/excel/excel-upload", formData);
    return response.data;
};

export const saveEmployeeExcel = async (data: ExcelUploadResponse): Promise<ExcelUploadResponse> => {
    const response = await api.post<ExcelUploadResponse>("/employee/excel/excel-upload/save", {
        totalRows: data.totalRows,
        successCount: data.successCount,
        failureCount: data.failureCount,
        duplicateCount: data.duplicateCount,
        correctData: data.correctData,
        incorrectData: data.incorrectData,
        duplicateData: data.duplicateData,
    }
    );

    return response.data;
};

export const downloadEmployeeTemplate = async (): Promise<Blob> => {
    try {
        const response = await api.get("/employee/excel/template", {
            responseType: "blob",
        });

        return response.data;
    } catch (error: any) {
        if (error.response?.data instanceof Blob) {
            const errorText = await error.response.data.text();
            try {
                error.response.data = JSON.parse(errorText);
            } catch {
                throw new Error("Unable to read server error response.");
            }
        }
        throw error;
    }
};

export const downloadEmployees = async (
    fromDate: string,
    toDate: string,
    filters?: {
        departmentId?: number | string;
        designationId?: number | string;
        city?: string;
        status?: boolean;
    }
): Promise<ExcelDownloadResult> => {
    try {
        const response = await api.get("/employee/excel/download", {
            params: {
                fromDate,
                toDate,
                departmentId: filters?.departmentId || undefined,
                designationId: filters?.designationId || undefined,
                city: filters?.city || undefined,
                status: filters?.status,
            },
            responseType: "blob",
        });

        const contentType = String(response.headers["content-type"] ?? "");

        if (contentType.includes("application/json")) {
            const json = JSON.parse(await (response.data as Blob).text());
            const emailData = json.data || {};
            return {
                emailSent: true,
                message: json.message || "Report has been emailed to you.",
                filename: emailData.fileName,
                attachmentContent: emailData.fileContent,
            };
        }

        const contentDisposition = String(response.headers["content-disposition"] ?? "");
        const match = contentDisposition.match(/filename="?([^"]+)"?/);

        return {
            emailSent: false,
            message: "File is ready to download.",
            blob: response.data,
            filename: match?.[1] || "employees.xlsx",
        };
    } catch (error: any) {
        if (error.response?.data instanceof Blob) {
            try {
                error.response.data = JSON.parse(await error.response.data.text());
            } catch {
                throw new Error("Unable to read server error response.");
            }
        }
        throw error;
    }
};

export const getDepartmentEmployeeCounts = async (
    filters?: Pick<EmployeeFilter, "fromDate" | "toDate" | "status">
): Promise<ApiResponse<DepartmentEmployeeCount[]>> => {
    const response = await api.get<ApiResponse<DepartmentEmployeeCount[]>>("/employee/department/count-department", {
        params: { ...filters, },
    });
    return response.data;
};