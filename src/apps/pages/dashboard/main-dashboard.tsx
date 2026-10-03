import { useEffect, useRef, useState, type ReactNode } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { Box, Button, Card, CardContent, Typography, } from "@mui/material";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import StatusSummary from "../../components/common/StatusSummary";
import ChartCard from "../../components/charts/ChartCard";
import AmGraphStack from "../../components/charts/amcharts/AmGraphStack";
import AmSpeedometer from "../../components/charts/amcharts/AmSpeedometer";
import AmBarChart from "../../components/charts/amcharts/AmBarChart";
import AmDonutChart from "../../components/charts/amcharts/AmDonutChart";
import ReactGraphStack from "../../components/charts/reactcharts/ReactGraphStack";
import ReactSpeedometer from "../../components/charts/reactcharts/ReactSpeedometer";
import ReactBarChart from "../../components/charts/reactcharts/ReactBarChart";
import ReactDonutChart from "../../components/charts/reactcharts/ReactDonutChart";
import { fetchDepartmentEmployeeCounts, fetchEmployeeCounts, } from "../store/slices/employee-slice";
import CommonDatePicker from "../../components/common/DatePicker";
import EmployeeListModal from "../../components/common/EmployeeListModal";

const cardSx = {
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
    mb: 2.5,
};

const BLUE_GRADIENT = "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";

interface SectionHeaderProps {
    icon: ReactNode;
    title: string;
    description: string;
}

const SectionHeader = ({ icon, title, description }: SectionHeaderProps) => (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            pb: 2,
            mb: 2,
            borderBottom: "1px solid #e2e8f0",
        }}>
        <Box
            sx={{
                width: 38,
                height: 38,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                background: BLUE_GRADIENT,
                color: "#ffffff",
                boxShadow: "0 3px 8px rgba(37, 99, 235, 0.2)",
            }}>
            {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", lineHeight: 1.3 }}>
                {title}
            </Typography>
            <Typography sx={{ fontSize: "12.5px", color: "#64748b", lineHeight: 1.4 }}>
                {description}
            </Typography>
        </Box>
    </Box>
);

const Dashboard = () => {
    const dispatch = useAppDispatch();
    const { totalEmployees, activeEmployees, inactiveEmployees, departmentEmployeeCounts, } = useAppSelector((state) => state.employee);

    const getDefaultDates = () => ({
        fromDate: dayjs().subtract(7, "day"),
        toDate: dayjs(),
    });

    const defaultDates = getDefaultDates();
    const [fromDate, setFromDate] = useState<Dayjs | null>(defaultDates.fromDate);
    const [toDate, setToDate] = useState<Dayjs | null>(defaultDates.toDate);
    const [status, setStatus] = useState("all");
    const dashboardFetchedRef = useRef(false);

    useEffect(() => {
        if (dashboardFetchedRef.current) { return; }
        dashboardFetchedRef.current = true;
        dispatch(fetchEmployeeCounts());
        dispatch(fetchDepartmentEmployeeCounts());
    }, [dispatch]);

    const fetchWithStatus = (filter: string) => {
        dispatch(
            fetchDepartmentEmployeeCounts({
                fromDate: fromDate ? fromDate.format("YYYY-MM-DD") : undefined,
                toDate: toDate ? toDate.format("YYYY-MM-DD") : undefined,
                status: filter === "all" ? undefined : filter === "active" ? false : true,
            })
        );
    };

    const [selectedDept, setSelectedDept] = useState<{ id: number; name: string } | null>(null);
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);

    const handleDeptRowClick = (row: Record<string, any>) => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setSelectedDept({ id: row.id, name: row.name });
        setShowEmployeeModal(true);
    };

    const handleSearch = () => {
        fetchWithStatus(status);
    };

    const handleReset = () => {
        const defaultDates = getDefaultDates();

        setFromDate(defaultDates.fromDate);
        setToDate(defaultDates.toDate);
        setStatus("all");

        dispatch(fetchEmployeeCounts());
        dispatch(
            fetchDepartmentEmployeeCounts({
                fromDate: defaultDates.fromDate.format("YYYY-MM-DD"),
                toDate: defaultDates.toDate.format("YYYY-MM-DD"),
                status: undefined,
            })
        );
    };

    const activePercentage = totalEmployees > 0 ? (activeEmployees / totalEmployees) * 100 : 0;
    const employeeStatusData = [
        {
            name: "Active",
            value: activeEmployees,
        },
        {
            name: "Inactive",
            value: inactiveEmployees,
        },
    ];
    const departmentChartSeries = [
        {
            dataKey: "total",
            name: "Total",
        },
        {
            dataKey: "active",
            name: "Active",
        },
        {
            dataKey: "inactive",
            name: "Inactive",
        },
    ];

    const departmentColumns = [
        {
            key: "name" as const,
            label: "Department",
        },
        {
            key: "total" as const,
            label: "Total",
        },
        {
            key: "active" as const,
            label: "Active",
        },
        {
            key: "inactive" as const,
            label: "Inactive",
        },
    ];

    return (
        <Box sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                    px: 2,
                    py: 1.2,
                    borderRadius: "12px",
                    backgroundColor: "#eff6ff",
                    border: "1px solid #bfdbfe",
                }}
            >
                <Box
                    sx={{
                        width: 38,
                        height: 38,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "10px",
                        backgroundColor: "#2563eb",
                        color: "#ffffff",
                    }}>
                    <SpaceDashboardOutlinedIcon sx={{ fontSize: 22 }} />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: "#2563eb",
                            lineHeight: 1.3,
                            fontSize: { xs: "17px", sm: "20px" },
                        }}>
                        Employee Master Dashboard
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: "#64748b", fontSize: "12.5px", lineHeight: 1.3 }}>
                        Employee analytics and performance overview
                    </Typography>
                </Box>
            </Box>

            {/* Filter and summary section */}
            <Card sx={cardSx}>
                <CardContent sx={{ p: { xs: 2, sm: 2.5 }, "&:last-child": { pb: { xs: 2, sm: 2.5 } } }}>
                    {/* Filters heading */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <TuneIcon sx={{ fontSize: 20, color: "#2563eb" }} />
                        <Typography sx={{ fontSize: "15px", fontWeight: 700, color: "#1e293b" }}>
                            Filters
                        </Typography>
                    </Box>

                    {/* Dashboard filters */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                            flexWrap: "wrap",
                            mb: 2.5,
                        }}>

                        <Box sx={{ minWidth: 160, maxWidth: 200 }}>
                            <CommonDatePicker
                                label="From Date"
                                value={fromDate}
                                onChange={setFromDate}
                                maxDate={toDate ?? dayjs()}
                            />
                        </Box>
                        {/* To date filter */}
                        <Box sx={{ minWidth: 160, maxWidth: 200 }}>
                            <CommonDatePicker
                                label="To Date"
                                value={toDate}
                                onChange={setToDate}
                                minDate={fromDate ?? dayjs().subtract(7, "day")}
                                maxDate={dayjs()}
                            />
                        </Box>

                        {/* Search and reset actions */}
                        <Box
                            sx={{
                                display: "flex", gap: 1, alignSelf: "flex-end",
                            }}>
                            <Button
                                variant="contained"
                                startIcon={<SearchIcon />}
                                onClick={handleSearch}
                                sx={{
                                    textTransform: "none",
                                    borderRadius: "8px",
                                    fontWeight: 600,
                                    px: 2.5,
                                    boxShadow: "none",
                                    "&:hover": { boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)" },
                                }}
                            >
                                Search
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<RestartAltIcon />}
                                onClick={handleReset}
                                sx={{
                                    textTransform: "none",
                                    borderRadius: "8px",
                                    fontWeight: 600,
                                    px: 2.5,
                                }}
                            >
                                Reset
                            </Button>
                        </Box>
                    </Box>

                    {/* Employee status summary */}
                    <Box sx={{ pt: 2.5, borderTop: "1px solid #e2e8f0" }}>
                        <StatusSummary
                            totalEmployees={totalEmployees}
                            activeEmployees={activeEmployees}
                            inactiveEmployees={inactiveEmployees}
                            selectedStatus={status === "all" ? "" : status}
                            clickable={false} />
                    </Box>

                </CardContent>
            </Card>

            {/* AmCharts dashboard section */}
            <Card sx={cardSx}>
                <CardContent sx={{ p: { xs: 2, sm: 2.5 }, "&:last-child": { pb: { xs: 2, sm: 2.5 } } }}>
                    <SectionHeader
                        icon={<BarChartIcon sx={{ fontSize: 22 }} />}
                        title="AmCharts Analytics"
                        description="Employee analytics using AmCharts"
                    />
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr", },
                            gap: 2,
                        }} >
                        <ChartCard
                            title="Department Wise Employee"
                            description="Employee distribution by department"
                            data={departmentEmployeeCounts}
                            columns={departmentColumns}
                            onRowClick={handleDeptRowClick}
                            graph={
                                <AmBarChart
                                    data={departmentEmployeeCounts}
                                    xKey="name"
                                    series={departmentChartSeries}
                                    height={300}
                                />
                            }
                        />
                        <ChartCard
                            title="Employee Status"
                            description="Active employee percentage"
                            data={[
                                {
                                    metric: "Active Employees",
                                    value: `${activePercentage.toFixed(1)}%`,
                                },
                            ]}
                            columns={[
                                {
                                    key: "metric",
                                    label: "Metric",
                                },
                                {
                                    key: "value",
                                    label: "Value",
                                },
                            ]}
                            graph={
                                <AmSpeedometer
                                    value={activePercentage}
                                    min={0}
                                    max={100}
                                    title="Active Employees"
                                    unit="%"
                                    height={280}
                                />
                            }
                        />
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <ChartCard
                            title="Employee Graph"
                            description="Department employee comparison"
                            data={departmentEmployeeCounts}
                            columns={departmentColumns}
                            onRowClick={handleDeptRowClick}
                            graph={
                                <AmGraphStack
                                    data={departmentEmployeeCounts}
                                    xKey="name"
                                    series={departmentChartSeries}
                                    height={300}
                                />
                            }
                        />
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <ChartCard
                            title="Employee Status Distribution"
                            description="Active vs Inactive Employees"
                            data={employeeStatusData}
                            columns={[
                                {
                                    key: "name",
                                    label: "Status",
                                },
                                {
                                    key: "value",
                                    label: "Employees",
                                },
                            ]}
                            graph={
                                <Box
                                    sx={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <AmDonutChart
                                        data={employeeStatusData}
                                        height={300}
                                    />
                                </Box>
                            }
                        />
                    </Box>

                </CardContent>
            </Card>

            {/* React Charts dashboard section */}
            <Card sx={cardSx}>
                <CardContent sx={{ p: { xs: 2, sm: 2.5 }, "&:last-child": { pb: { xs: 2, sm: 2.5 } } }}>
                    <SectionHeader
                        icon={<ShowChartIcon sx={{ fontSize: 22 }} />}
                        title="React Charts Analytics"
                        description="Employee analytics using React charts"
                    />

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                lg: "1fr 1fr",
                            },
                            gap: 2,
                        }}>
                        <ChartCard
                            title="Department Wise Employee"
                            description="Employee distribution by department"
                            data={departmentEmployeeCounts}
                            columns={departmentColumns}
                            onRowClick={handleDeptRowClick}
                            graph={
                                <ReactBarChart
                                    data={departmentEmployeeCounts}
                                    xKey="name"
                                    series={departmentChartSeries}
                                    height={300} />
                            } />
                        <ChartCard
                            title="Employee Status"
                            description="Active employee percentage"
                            data={[
                                {
                                    metric: "Active Employees",
                                    value: `${activePercentage.toFixed(1)}%`,
                                },
                            ]}
                            columns={[
                                {
                                    key: "metric",
                                    label: "Metric",
                                },
                                {
                                    key: "value",
                                    label: "Value",
                                },
                            ]}
                            graph={
                                <Box
                                    sx={{
                                        width: "100%",
                                        height: 300,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <ReactSpeedometer
                                        value={activePercentage}
                                        min={0}
                                        max={100}
                                        height={280}
                                    />
                                </Box>
                            }
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <ChartCard
                            title="Employee Graph"
                            description="Department employee comparison"
                            data={departmentEmployeeCounts}
                            columns={departmentColumns}
                            onRowClick={handleDeptRowClick}
                            graph={
                                <ReactGraphStack
                                    data={departmentEmployeeCounts}
                                    xKey="name"
                                    series={departmentChartSeries}
                                    height={300}
                                />
                            }
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <ChartCard
                            title="Employee Status Distribution"
                            description="Active vs Inactive Employees"
                            data={employeeStatusData}
                            columns={[
                                {
                                    key: "name",
                                    label: "Status",
                                },
                                {
                                    key: "value",
                                    label: "Employees",
                                },
                            ]}
                            graph={
                                <Box
                                    sx={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}>
                                    <ReactDonutChart
                                        data={employeeStatusData}
                                        height={300}
                                    />
                                </Box>
                            }
                        />
                    </Box>
                </CardContent>
            </Card>

            {/* Employee list modal */}
            {showEmployeeModal && selectedDept && (
                <EmployeeListModal
                    departmentId={selectedDept.id}
                    departmentName={selectedDept.name}
                    open={showEmployeeModal}
                    onClose={() => setShowEmployeeModal(false)}
                />
            )}
        </Box>
    );
};

export default Dashboard;