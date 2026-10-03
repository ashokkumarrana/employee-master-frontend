import { useState, useEffect, useRef } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { Box, Button, Chip, Collapse, FormControl, MenuItem, Select, Stack, TextField, Tooltip, Typography, } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import StatusSummary from "../../components/common/StatusSummary";
import type { Dropdown, Employee, EmployeeFilterValues } from "./employeeTypes";
import { searchEmployees } from "./employeeApi";

interface EmployeeFilterProps {
    departments: Dropdown[];
    designations: Dropdown[];
    cities: Dropdown[];
    onSearch: (filters: EmployeeFilterValues) => void;
    onFiltersChange: (filters: EmployeeFilterValues) => void;
    onGlobalSearch: (
        filters: EmployeeFilterValues,
        results: Employee[]
    ) => void;
    onReset?: () => void;
    onGlobalSearchClear: () => void;
    totalEmployees: number;
    activeEmployees: number;
    inactiveEmployees: number;
    filteredTotal: number;
    countMode: "date" | "beginning";
    onCountModeChange: (mode: "date" | "beginning") => void;
    onDownloadClick: () => void;
    resetSignal?: number;
}

const getInitialFilters = (): EmployeeFilterValues => ({
    search: "",
    dateFrom: dayjs().subtract(7, "day"),
    dateTo: dayjs(),
    department: "",
    designation: "",
    status: "active",
    city: "",
});

export interface SelectedFilterItem {
    key: keyof EmployeeFilterValues;
    label: string;
    removable?: boolean;
}

export const getSelectedFilterItems = (
    filters: EmployeeFilterValues,
    departments: Dropdown[],
    designations: Dropdown[],
    selectedSummaryStatus: string,
): SelectedFilterItem[] => {
    const items: SelectedFilterItem[] = [];

    if (filters.dateFrom || filters.dateTo) {
        const fromLabel = filters.dateFrom ? dayjs(filters.dateFrom).format("DD-MM-YYYY") : "";
        const toLabel = filters.dateTo ? dayjs(filters.dateTo).format("DD-MM-YYYY") : "";
        items.push({
            key: "dateFrom",
            label: `${fromLabel} To ${toLabel}`,
            removable: false,
        });
    }

    if (selectedSummaryStatus) {
        items.push({
            key: "status",
            label: `Status: ${selectedSummaryStatus === "active"
                ? "Active"
                : selectedSummaryStatus === "inactive"
                    ? "Inactive"
                    : "All"
                }`,
            removable: false,
        });
    }


    if (filters.search.trim()) {
        items.push({
            key: "search",
            label: `Search: ${filters.search}`,
        });
    }

    if (filters.department) {
        items.push({
            key: "department",
            label: `Department: ${departments.find(
                (department) => department.id === filters.department
            )?.name ?? ""
                }`,
        });
    }

    if (filters.designation) {
        items.push({
            key: "designation",
            label: `Designation: ${designations.find(
                (designation) => designation.id === filters.designation
            )?.name ?? ""
                }`,
        });
    }

    if (filters.city) {
        items.push({
            key: "city",
            label: `City: ${filters.city}`,
        });
    }

    return items;
};
const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        backgroundColor: "#fff",
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#dbe3ef",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#94a3b8",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#2563eb",
        borderWidth: "1.5px",
    },
};

const selectSx = {
    borderRadius: "8px",
    backgroundColor: "#fff",
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#dbe3ef",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#94a3b8",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#2563eb",
        borderWidth: "1.5px",
    },
};

const chipSx = {
    height: 28,
    borderRadius: "999px",
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: 600,
    fontSize: "12px",
    border: "1px solid #bfdbfe",
    maxWidth: "100%",
    "& .MuiChip-label": {
        overflow: "hidden",
        textOverflow: "ellipsis",
        px: 1,
    },
    "& .MuiChip-deleteIcon": {
        color: "#60a5fa",
        "&:hover": { color: "#1d4ed8" },
    },
};

export default function EmployeeFilter({
    departments,
    designations,
    cities,
    onSearch,
    onGlobalSearch,
    onFiltersChange,
    onGlobalSearchClear,
    onReset,
    totalEmployees,
    activeEmployees,
    inactiveEmployees,
    filteredTotal,
    countMode,
    onCountModeChange,
    onDownloadClick,
    resetSignal,
}: EmployeeFilterProps) {
    const [filters, setFilters] = useState<EmployeeFilterValues>(getInitialFilters());
    const [selectedSummaryStatus, setSelectedSummaryStatus] = useState(getInitialFilters().status);

    useEffect(() => { onFiltersChange(filters); }, [filters, onFiltersChange]);

    const [moreFilters, setMoreFilters] = useState(false);
    const [lastGlobalSearch, setLastGlobalSearch] = useState("");
    const [searchError, setSearchError] = useState("");

    const updateFilter = <K extends keyof EmployeeFilterValues>(key: K, value: EmployeeFilterValues[K]) => {
        setFilters((previous) => ({ ...previous, [key]: value, }));
    };

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        handleReset();
    }, [resetSignal]);

    const handleSearch = () => {
        onSearch(filters);
        setMoreFilters(false);
    };

    const handleGlobalSearch = async () => {
        const searchValue = filters.search.trim();
        if (searchValue.length < 2) {
            setSearchError("Please enter at least 2 characters to search.");
            return;
        }
        setSearchError("");
        if (searchValue === lastGlobalSearch) {
            return;
        }
        setLastGlobalSearch(searchValue);
        try {
            const response = await searchEmployees(searchValue);
            onGlobalSearch({ ...filters, search: searchValue, status: "", }, response.data
            );
        } catch (error) {
            onGlobalSearch(
                { ...filters, search: searchValue, status: "", }, []);
        }
    };

    const handleRemoveFilter = (key: keyof EmployeeFilterValues) => {
        const updatedFilters: EmployeeFilterValues = {
            ...filters,
            [key]: key === "dateFrom" || key === "dateTo" ? null : "",
        };
        setFilters(updatedFilters);
        if (key === "search") {
            setLastGlobalSearch("");
            onGlobalSearchClear();
            return;
        }
        onSearch(updatedFilters);
    };

    const handleReset = () => {
        const initialFilters = getInitialFilters();

        const isAlreadyReset =
            filters.search === initialFilters.search &&
            filters.dateFrom?.isSame(initialFilters.dateFrom, "day") &&
            filters.dateTo?.isSame(initialFilters.dateTo, "day") &&
            filters.department === initialFilters.department &&
            filters.designation === initialFilters.designation &&
            filters.status === initialFilters.status &&
            filters.city === initialFilters.city &&
            lastGlobalSearch === "" &&
            countMode === "date";

        setMoreFilters(false);
        setSelectedSummaryStatus(initialFilters.status);
        if (countMode !== "date") {
            onCountModeChange("date");
        }
        if (isAlreadyReset) return;
        setFilters(initialFilters);
        setLastGlobalSearch("");
        onReset?.();
    };
    const handleDateChange = (
        key: "dateFrom" | "dateTo",
        value: Dayjs | null
    ) => {
        const updatedFilters = {
            ...filters,
            [key]: value,
        };

        setFilters(updatedFilters);
        //onSearch(updatedFilters);
    };

    const handleSummaryFilter = (status: string) => {
        setSelectedSummaryStatus(status);
        const updatedFilters = {
            ...filters,
            status,
        };

        setFilters(updatedFilters);
        onSearch(updatedFilters);
    };

    return (
        <Box
            sx={{
                width: "100%",
                minWidth: 0,
                boxSizing: "border-box",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor: "background.paper",
                p: { xs: 1.5, sm: 2 },
                overflow: "hidden",
            }}
        >
            {/* Filter + Status Summary */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(0, 1fr)", },
                    gap: 2,
                    width: "100%",
                    alignItems: "start",
                }}
            >
                {/* ================= FILTER AREA ================= */}
                <Box sx={{ width: "100%", minWidth: 0 }}>
                    {/* Search */}
                    <TextField
                        fullWidth
                        size="small"
                        placeholder={searchError || "Search Employee by name code email......"}
                        value={searchError ? "" : filters.search}
                        onChange={(event) => {
                            updateFilter("search", event.target.value);
                            setSearchError("");
                            if (!event.target.value.trim()) { setLastGlobalSearch(""); }
                        }}
                        onKeyDown={(event) => { if (event.key === "Enter") { handleGlobalSearch(); } }}
                        sx={{
                            ...fieldSx,
                            "& input::placeholder": {
                                color: searchError ? "error.main" : "#94a3b8",
                                opacity: 1,
                            },
                        }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            type="button"
                                            onClick={handleGlobalSearch}
                                            edge="end"
                                            size="small"
                                            aria-label="search employee"
                                            sx={{
                                                width: 28,
                                                height: 28,
                                                mr: 0.2,
                                                borderRadius: "7px",
                                                color: "#2563eb",
                                                backgroundColor: "#eff6ff",
                                                border: "1px solid #bfdbfe",
                                                transition: "all 0.15s ease",
                                                "&:hover": {
                                                    color: "#ffffff",
                                                    backgroundColor: "#2563eb",
                                                    borderColor: "#2563eb",
                                                },
                                            }}>
                                            <SearchIcon sx={{ fontSize: 17 }} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    {/* Date Range */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", },
                            gap: 2,
                            mt: 2,
                            width: "100%",
                        }}
                    >
                        <DatePicker
                            label="From Date"
                            value={filters.dateFrom}
                            maxDate={filters.dateTo ? filters.dateTo : dayjs()}
                            format="DD-MM-YYYY"
                            onChange={(value) => handleDateChange("dateFrom", value)}
                            slotProps={{
                                textField: { size: "small", fullWidth: true, sx: fieldSx, },
                            }}
                        />
                        <DatePicker
                            label="To Date"
                            value={filters.dateTo}
                            minDate={filters.dateFrom ? filters.dateFrom : dayjs().subtract(7, "day")}
                            maxDate={dayjs()}
                            format="DD-MM-YYYY"
                            onChange={(value) => handleDateChange("dateTo", value)}
                            slotProps={{
                                textField: { size: "small", fullWidth: true, sx: fieldSx, },
                            }}
                        />
                    </Box>

                    {/* More Filters */}
                    <Collapse in={moreFilters}>
                        <Box
                            sx={{
                                mt: 2,
                                pt: 2,
                                borderTop: "1px solid",
                                borderColor: "divider",
                                width: "100%",
                            }}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    mb: 1.5,
                                    fontWeight: 600,
                                }}>
                                Search Filters
                            </Typography>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", },
                                    gap: 2,
                                    width: "100%",
                                }}
                            >
                                <FormControl size="small" fullWidth>
                                    <Select
                                        displayEmpty
                                        value={filters.department}
                                        onChange={(event) => updateFilter("department", event.target.value)}
                                        sx={selectSx}
                                    >
                                        <MenuItem value="">
                                            <Typography color="text.secondary">Select Department</Typography>
                                        </MenuItem>
                                        {departments.map((department) => (
                                            <MenuItem
                                                key={department.id}
                                                value={department.id}>
                                                {department.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl size="small" fullWidth>
                                    <Select
                                        displayEmpty
                                        value={filters.designation}
                                        onChange={(event) => updateFilter("designation", event.target.value)}
                                        sx={selectSx}
                                    >
                                        <MenuItem value="">
                                            <Typography color="text.secondary">Select Designation</Typography>
                                        </MenuItem>

                                        {designations.map((designation) => (
                                            <MenuItem
                                                key={designation.id}
                                                value={designation.id}>
                                                {designation.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl size="small" fullWidth>
                                    <Select
                                        displayEmpty
                                        value={filters.status}
                                        onChange={(event) => {
                                            const value = event.target.value;
                                            updateFilter("status", value);
                                            setSelectedSummaryStatus(value);
                                        }}
                                        sx={selectSx}
                                    >
                                        <MenuItem value="">
                                            <Typography color="text.secondary">Select Status</Typography>
                                        </MenuItem>
                                        <MenuItem value="all">All</MenuItem>
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="inactive">Inactive</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl size="small" fullWidth>
                                    <Select
                                        displayEmpty
                                        value={filters.city}
                                        onChange={(event) => updateFilter("city", event.target.value)}
                                        sx={selectSx}
                                    >
                                        <MenuItem value="">
                                            <Typography color="text.secondary">City</Typography>
                                        </MenuItem>

                                        {cities.map((city) => (
                                            <MenuItem
                                                key={city.id}
                                                value={city.name}>
                                                {city.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    </Collapse>

                    {/* Action Buttons */}
                    <Stack
                        direction={{ xs: "column", sm: "row", }}
                        spacing={1}
                        sx={{ mt: 2, width: "100%", }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={
                                moreFilters ? (
                                    <CloseIcon />
                                ) : (
                                    <TuneIcon />
                                )
                            }
                            onClick={() => setMoreFilters((previous) => !previous)}
                            sx={{ textTransform: "none", }}>
                            {moreFilters ? "Hide Filters" : "More Filters"}
                        </Button>

                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<SearchIcon />}
                            onClick={handleSearch}
                            sx={{ textTransform: "none", }}>
                            Apply
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="inherit"
                            startIcon={<RestartAltIcon />}
                            onClick={handleReset}
                            sx={{ textTransform: "none", }}>
                            Reset
                        </Button>
                    </Stack>
                </Box>

                {/* ================= STATUS SUMMARY ================= */}
                <Box
                    sx={{
                        width: "100%",
                        minWidth: 0,
                    }}>

                    <StatusSummary
                        totalEmployees={totalEmployees}
                        activeEmployees={activeEmployees}
                        inactiveEmployees={inactiveEmployees}
                        handleSummaryFilter={handleSummaryFilter}
                        selectedStatus={selectedSummaryStatus}
                        showModeToggle
                        countMode={countMode}
                        onCountModeChange={(mode) => {
                            setSelectedSummaryStatus("");
                            onCountModeChange(mode);
                        }}
                    />
                </Box>
            </Box>

            {/* ================= FILTERED BY ================= */}
            <Box
                sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                }}>
                {/* Selected Filters */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                        flex: 1,
                        minWidth: 0,
                    }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 600,
                            flexShrink: 0,
                        }}>
                        Filtered by:
                    </Typography>

                    {getSelectedFilterItems(filters, departments, designations, selectedSummaryStatus).map((filter) => (
                        <Chip
                            key={filter.key}
                            label={filter.label}
                            size="small"
                            onDelete={
                                filter.removable !== false ? () => handleRemoveFilter(filter.key) : undefined}
                            deleteIcon={<CloseIcon sx={{ fontSize: 16 }} />}
                            sx={chipSx}
                        />
                    ))}
                </Box>

                {/* Record Count */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                        ml: 2,
                        flexShrink: 0,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 600,
                            color: "#334155",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Results : {filteredTotal}
                    </Typography>

                    {/* CHANGED: Tooltip add hua (hover pe "Download Employees" dikhega) */}
                    <Tooltip title="Download Employees" arrow placement="top">
                        <IconButton
                            type="button"
                            size="small"
                            onClick={onDownloadClick}
                            aria-label="download employees"
                            sx={{
                                width: 32,
                                height: 32,
                                color: "#2563eb",
                                backgroundColor: "#eff6ff",
                                border: "1px solid #bfdbfe",
                                borderRadius: "7px",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    color: "#ffffff",
                                    backgroundColor: "#2563eb",
                                    borderColor: "#2563eb",
                                },
                            }}
                        >
                            <DownloadIcon sx={{ fontSize: 19 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    );
}