import { createAsyncThunk, createSlice, type PayloadAction, } from "@reduxjs/toolkit";
import type { DepartmentEmployeeCount, Employee, EmployeeExcelDownloadSummary, EmployeeExcelSummary, EmployeeFilter, EmployeeRequest, } from "../../employee-master/employeeTypes";
import {
    getDepartmentEmployeeCounts,
    getEmployeeCounts,
    getEmployees,
    saveEmployee as saveEmployeeApi,
    updateEmployee as updateEmployeeApi,
    deleteEmployee as deleteEmployeeApi,
} from "../../employee-master/employeeApi";
const pendingEmployeeRequests = new Set<string>();
const pendingCountsRequests = new Set<string>();

interface EmployeeState {
    employees: Employee[];
    totalEmployees: number;
    totalElements: number;
    activeEmployees: number;
    inactiveEmployees: number;
    departmentEmployeeCounts: DepartmentEmployeeCount[];
    loading: boolean;
    excelUploadHistory: EmployeeExcelSummary[];
    excelDownloadHistory: EmployeeExcelDownloadSummary[];
}

type ExcelUploadSummaryPayload = Omit<EmployeeExcelSummary, "id" | "uploadNumber" | "uploadedAt" | "isRead">;
type ExcelDownloadSummaryPayload = Omit<EmployeeExcelDownloadSummary, "id" | "downloadedAt" | "isRead">;

const EXCEL_UPLOAD_HISTORY_KEY = "excelUploadHistory";
const getExcelUploadHistory = (): EmployeeExcelSummary[] => {
    try {
        const savedHistory = localStorage.getItem(EXCEL_UPLOAD_HISTORY_KEY);
        return savedHistory ? JSON.parse(savedHistory) : [];
    } catch {
        return [];
    }
};
const withoutAttachment = (upload: EmployeeExcelSummary): EmployeeExcelSummary => ({
    ...upload,
    attachmentName: undefined,
    attachmentContent: undefined,
});

const saveExcelUploadHistory = (history: EmployeeExcelSummary[]) => {
    const attempts = [
        history,
        history.map((upload, index) => (index === 0 ? upload : withoutAttachment(upload))),
        history.map(withoutAttachment),
    ];
    for (const attempt of attempts) {
        try {
            localStorage.setItem(EXCEL_UPLOAD_HISTORY_KEY, JSON.stringify(attempt));
            return;
        } catch {
        }
    }
};

const EXCEL_DOWNLOAD_HISTORY_KEY = "excelDownloadHistory";
const getExcelDownloadHistory = (): EmployeeExcelDownloadSummary[] => {
    try {
        const saved = localStorage.getItem(EXCEL_DOWNLOAD_HISTORY_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};
const withoutDownloadAttachment = (item: EmployeeExcelDownloadSummary): EmployeeExcelDownloadSummary => ({
    ...item,
    attachmentContent: undefined,
});
const saveExcelDownloadHistory = (history: EmployeeExcelDownloadSummary[]) => {
    const attempts = [
        history,
        history.map((item, index) => (index === 0 ? item : withoutDownloadAttachment(item))),
        history.map(withoutDownloadAttachment),
    ];
    for (const attempt of attempts) {
        try {
            localStorage.setItem(EXCEL_DOWNLOAD_HISTORY_KEY, JSON.stringify(attempt));
            return;
        } catch {
        }
    }
};

const initialState: EmployeeState = {
    employees: [],
    totalEmployees: 0,
    totalElements: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    departmentEmployeeCounts: [],
    loading: false,
    excelUploadHistory: getExcelUploadHistory(),
    excelDownloadHistory: getExcelDownloadHistory(),
};
export const fetchEmployees = createAsyncThunk(
    "employee/fetchEmployees",
    async ({
        page = 0,
        size = 10,
        sortBy = "id",
        direction = "desc",
        filters,
    }: {
        page?: number;
        size?: number;
        sortBy?: string;
        direction?: "asc" | "desc";
        filters?: EmployeeFilter;
    }) => {

        const requestKey = JSON.stringify({
            page,
            size,
            sortBy,
            direction,
            filters: filters ?? {},
        });

        try {
            const response = await getEmployees(
                page,
                size,
                sortBy,
                direction,
                filters
            );

            return response.data;
        } finally {
            pendingEmployeeRequests.delete(requestKey);
        }
    },
    {
        condition: ({
            page = 0,
            size = 10,
            sortBy = "id",
            direction = "desc",
            filters,
        }) => {

            const requestKey = JSON.stringify({
                page,
                size,
                sortBy,
                direction,
                filters: filters ?? {},
            });

            if (pendingEmployeeRequests.has(requestKey)) {
                return false;
            }

            pendingEmployeeRequests.add(requestKey);
            return true;
        },
    }
);

export const fetchEmployeeCounts = createAsyncThunk(
    "employee/fetchEmployeeCounts",
    async (filters?: { fromDate?: string; toDate?: string }) => {
        const requestKey = JSON.stringify(filters ?? {});
        try {
            const response = await getEmployeeCounts(filters);
            return response.data;
        } finally {
            pendingCountsRequests.delete(requestKey);
        }
    },
    {
        condition: (filters) => {
            const requestKey = JSON.stringify(filters ?? {});
            if (pendingCountsRequests.has(requestKey)) {
                return false;
            }
            pendingCountsRequests.add(requestKey);
            return true;
        },
    }
);

export const fetchDepartmentEmployeeCounts = createAsyncThunk(
    "employee/fetchDepartmentEmployeeCounts",
    async (
        filters?: Pick<EmployeeFilter, "fromDate" | "toDate" | "status">
    ) => {
        const response = await getDepartmentEmployeeCounts(filters);
        return response.data;
    }
);

export const saveEmployee = createAsyncThunk("employee/saveEmployee",
    async (data: EmployeeRequest[], { rejectWithValue }) => {
        try {
            const response = await saveEmployeeApi(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data ?? {
                    status: 500,
                    message: "Something went wrong while saving employee.",
                }
            );
        }
    }
);

export const updateEmployee = createAsyncThunk("employee/updateEmployee",
    async ({ id, data, }: { id: number; data: EmployeeRequest; },
        { rejectWithValue }) => {
        try {
            const response = await updateEmployeeApi(id, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data ?? {
                    status: 500, message: "Something went wrong while updating employee.",
                }
            );
        }
    }
);
export const deleteEmployee = createAsyncThunk("employee/deleteEmployee", async (id: number, { rejectWithValue }) => {
    try {
        const response = await deleteEmployeeApi(id);
        return { id, response, };
    } catch (error: any) {
        return rejectWithValue(
            error?.response?.data ?? {
                status: 500,
                message: "Failed to delete employee.",
            }
        );
    }
}
);

const employeeSlice = createSlice({
    name: "employee", initialState,
    reducers: {
        setEmployees: (state, action: PayloadAction<Employee[]>) => {
            state.employees = action.payload;
        },
        setEmployeeCounts: (state, action: PayloadAction<{
            totalEmployees: number;
            activeEmployees: number;
            inactiveEmployees: number;
        }>
        ) => {
            state.totalEmployees = action.payload.totalEmployees;
            state.activeEmployees = action.payload.activeEmployees;
            state.inactiveEmployees = action.payload.inactiveEmployees;
        },

        setEmployeeLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        clearEmployees: (state) => {
            state.employees = [];
        },
        addExcelUploadSummary: (state, action: PayloadAction<ExcelUploadSummaryPayload>) => {
            const uploadNumber = state.excelUploadHistory.length > 0
                ? Math.max(...state.excelUploadHistory.map((upload) => upload.uploadNumber)) + 1
                : 1;

            state.excelUploadHistory.unshift({
                ...action.payload,
                id: crypto.randomUUID(),
                uploadNumber,
                uploadedAt: new Date().toISOString(),
                isRead: false,
            });
            state.excelUploadHistory = state.excelUploadHistory.slice(0, 10);
            saveExcelUploadHistory(state.excelUploadHistory);
        },
        markExcelUploadNotificationsRead: (state) => {
            state.excelUploadHistory.forEach((upload) => { upload.isRead = true; });
            saveExcelUploadHistory(state.excelUploadHistory);
        },
        addExcelDownloadSummary: (state, action: PayloadAction<ExcelDownloadSummaryPayload>) => {
            state.excelDownloadHistory.unshift({
                ...action.payload,
                id: crypto.randomUUID(),
                downloadedAt: new Date().toISOString(),
                isRead: false,
            });
            state.excelDownloadHistory = state.excelDownloadHistory.slice(0, 10);
            saveExcelDownloadHistory(state.excelDownloadHistory);
        },
        markExcelDownloadNotificationsRead: (state) => {
            state.excelDownloadHistory.forEach((item) => { item.isRead = true; });
            saveExcelDownloadHistory(state.excelDownloadHistory);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = action.payload.content;
                state.totalElements = action.payload.totalElements;
            })

            .addCase(fetchEmployees.rejected, (state) => {
                state.loading = false;
                state.employees = [];
                state.totalElements = 0;
            })

            .addCase(fetchEmployeeCounts.fulfilled, (state, action) => {
                state.totalEmployees = action.payload.totalEmployees;
                state.activeEmployees = action.payload.activeEmployees;
                state.inactiveEmployees = action.payload.inactiveEmployees;
            })

            .addCase(fetchDepartmentEmployeeCounts.fulfilled, (state, action) => {
                state.departmentEmployeeCounts = action.payload;
            })

            .addCase(saveEmployee.pending, (state) => {
                state.loading = true;
            })

            .addCase(saveEmployee.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.data) {
                    state.employees.unshift(...action.payload.data);
                }
            })

            .addCase(saveEmployee.rejected, (state) => {
                state.loading = false;
            })

            .addCase(updateEmployee.pending, (state) => {
                state.loading = true;
            })

            .addCase(updateEmployee.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.data) {
                    action.payload.data.forEach((updatedEmployee) => {
                        const index = state.employees.findIndex(
                            (employee) => employee.id === updatedEmployee.id
                        );

                        if (index !== -1) {
                            state.employees[index] = updatedEmployee;
                        }
                    });
                }
            })

            .addCase(updateEmployee.rejected, (state) => {
                state.loading = false;
            })

            .addCase(deleteEmployee.pending, (state) => {
                state.loading = true;
            })

            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.loading = false;

                state.employees = state.employees.filter(
                    (employee) => employee.id !== action.payload.id
                );
            })

            .addCase(deleteEmployee.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const {
    setEmployees,
    setEmployeeCounts,
    setEmployeeLoading,
    clearEmployees,
    addExcelUploadSummary,
    markExcelUploadNotificationsRead,
    addExcelDownloadSummary,
    markExcelDownloadNotificationsRead,
} = employeeSlice.actions;

export default employeeSlice.reducer;