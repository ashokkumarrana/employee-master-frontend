import {
    RadialBarChart,
    RadialBar,
    PolarAngleAxis,
    ResponsiveContainer,
} from "recharts";

import { Box, Typography } from "@mui/material";

interface ReactSpeedometerProps {
    value: number;
    min?: number;
    max?: number;
    height?: number;
}

const ReactSpeedometer = ({
    value,
    min = 0,
    max = 100,
    height = 260,
}: ReactSpeedometerProps) => {
    const percentage =
        max > min
            ? Math.min(
                100,
                Math.max(
                    0,
                    ((value - min) / (max - min)) * 100
                )
            )
            : 0;

    const displayValue = Number(value.toFixed(1));

    const needleAngle = -135 + percentage * 2.7;

    const data = [
        {
            name: "Employee Status",
            value: percentage,
        },
    ];

    return (
        <Box
            sx={{
                width: "100%",
                height,
                background: "linear-gradient(145deg, #F8FAFC 0%, #EEF4F3 100%)",
                borderRadius: "14px",
                position: "relative",
                overflow: "hidden",
                border: "1px solid #E5E7EB",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            }}
        >
            {/* Gauge */}
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                    data={data}
                    cx="50%"
                    cy="58%"
                    innerRadius="60%"
                    outerRadius="92%"
                    startAngle={225}
                    endAngle={-45}
                    barSize={40}
                >
                    <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                    />

                    {/* Background curve */}
                    <RadialBar
                        dataKey={() => 100}
                        fill="#DDE7E5"
                        cornerRadius={16}
                        isAnimationActive={false}
                    />

                    {/* Active curve */}
                    <RadialBar
                        dataKey="value"
                        fill="#287F76"
                        cornerRadius={16}
                        isAnimationActive
                        animationDuration={1000}
                    />
                </RadialBarChart>
            </ResponsiveContainer>

            {/* Needle */}
            <Box
                component="svg"
                viewBox="0 0 200 150"
                sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                }}
            >
                <g transform={`rotate(${needleAngle} 100 87)`}>
                    <line
                        x1="100"
                        y1="87"
                        x2="100"
                        y2="32"
                        stroke="#263238"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />

                    {/* Needle center */}
                    <circle
                        cx="100"
                        cy="87"
                        r="9"
                        fill="#287F76"
                    />

                    <circle
                        cx="100"
                        cy="87"
                        r="4"
                        fill="#FFFFFF"
                    />
                </g>
            </Box>

            {/* Percentage */}
            <Box
                sx={{
                    position: "absolute",
                    left: "50%",
                    top: "76%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    pointerEvents: "none",
                    minWidth: "120px",
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: "#287F76",
                        lineHeight: 1,
                        letterSpacing: "-0.5px",
                    }}
                >
                    {displayValue}%
                </Typography>

                <Typography
                    sx={{
                        fontSize: "12px",
                        color: "#64748B",
                        mt: 0.5,
                        fontWeight: 500,
                    }}
                >
                    Active Employees
                </Typography>
            </Box>

            {/* Min */}
            <Typography
                sx={{
                    position: "absolute",
                    left: "17%",
                    bottom: "10%",
                    fontSize: "12px",
                    color: "#64748B",
                    fontWeight: 500,
                }}
            >
                {min}
            </Typography>

            {/* Max */}
            <Typography
                sx={{
                    position: "absolute",
                    right: "17%",
                    bottom: "10%",
                    fontSize: "12px",
                    color: "#64748B",
                    fontWeight: 500,
                }}
            >
                {max}
            </Typography>
        </Box>
    );
};

export default ReactSpeedometer;