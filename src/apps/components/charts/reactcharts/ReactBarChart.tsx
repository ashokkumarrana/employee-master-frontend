import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import type { ChartSeries } from "../chartTypes";


interface ReactBarChartProps {
    data: any[];
    xKey: string;
    series: ChartSeries[];
    height?: number;
}

const ReactBarChart = ({
    data,
    xKey,
    series,
    height = 300,
}: ReactBarChartProps) => {

    const chartColors: Record<string, string> = {
        total: "#5B8DEF",
        active: "#287F76",
        inactive: "#E53935",
    };

    return (
        <div
            style={{
                width: "100%",
                height,
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                padding: "8px",
                boxSizing: "border-box",
            }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 10,
                    }}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#E5E7EB" />

                    <XAxis
                        dataKey={xKey}
                        tick={{ fontSize: 11, }} />

                    <YAxis
                        tick={{ fontSize: 11, }} />

                    <Tooltip />
                    <Legend />
                    {series.map((item) => (
                        <Bar
                            key={item.dataKey}
                            dataKey={item.dataKey}
                            name={item.name}
                            fill={chartColors[item.dataKey]}
                            radius={[5, 5, 0, 0]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ReactBarChart;