import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";

interface DonutData {
    name: string;
    value: number;
}

interface ReactDonutChartProps {
    data: DonutData[];
    height?: number;
}

const ReactDonutChart = ({
    data,
    height = 300,
}: ReactDonutChartProps) => {

    const chartColors: Record<string, string> = {
        Active: "#287F76",
        Inactive: "#E53935",
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
            }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="80%"
                        paddingAngle={3}
                        label={({ name, value }) =>
                            `${name}: ${value}`
                        }
                    >
                        {data.map((item, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={chartColors[item.name] || "#287F76"}
                            />
                        ))}
                    </Pie>

                    <Tooltip />

                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ReactDonutChart;