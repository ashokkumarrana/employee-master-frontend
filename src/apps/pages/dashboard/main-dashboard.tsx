import { useEffect, useRef, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { Box, Button, Card, CardContent, Typography, } from "@mui/material";
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
        <Box sx={{ p: 2 }}>
            {/* Dashboard header */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="h5"
                    sx={{ fontWeight: 700, color: "#17375E", }}>
                    Employee Master Dashboard
                </Typography>
                <Typography variant="body2"
                    sx={{ color: "text.secondary", mt: 0.5, }}>
                    Employee analytics and performance overview
                </Typography>
            </Box>
            {/* Filter and summary section */}
            <Card
                sx={{ borderRadius: 2, boxShadow: 1, mb: 2, }}>
                <CardContent>
                    {/* Dashboard filters */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                            flexWrap: "wrap",
                            mb: 2,
                        }}>

                        <Box sx={{ minWidth: 160, maxWidth: 180 }}>
                            <CommonDatePicker
                                label="From Date"
                                value={fromDate}
                                onChange={setFromDate}
                                maxDate={toDate ?? dayjs()}
                            />
                        </Box>
                        {/* To date filter */}
                        <Box sx={{ minWidth: 160, maxWidth: 180 }}>
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
                            }}                        >
                            <Button variant="contained" onClick={handleSearch} > Search</Button>
                            <Button variant="outlined" onClick={handleReset}>Reset</Button>
                        </Box>
                    </Box>
                    {/* Employee status summary */}
                    <StatusSummary
                        totalEmployees={totalEmployees}
                        activeEmployees={activeEmployees}
                        inactiveEmployees={inactiveEmployees}
                        selectedStatus={status === "all" ? "" : status}
                        clickable={false} />

                </CardContent>
            </Card>

            {/* AmCharts dashboard section */}
            <Card
                sx={{ borderRadius: 2, boxShadow: 1, mb: 2, }}>
                <CardContent>
                    <Box
                        sx={{
                            mb: 2,
                            textAlign: "center",
                        }} >
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#526A68",
                                mt: 0.3,
                            }}>
                            Employee analytics using AmCharts
                        </Typography>
                    </Box>
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
            <Card
                sx={{ borderRadius: 2, boxShadow: 1, mb: 2, }}>
                <CardContent>
                    <Box
                        sx={{ mb: 2, textAlign: "center", }}>
                        <Typography
                            variant="body2"
                            sx={{ color: "#526A68", mt: 0.3, }}>
                            Employee analytics using React charts
                        </Typography>
                    </Box>

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