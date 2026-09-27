export interface ChartSeries {
    dataKey: string;
    name: string;
}

export interface BarChartProps<T> {
    data: T[];
    xKey: keyof T;
    series: ChartSeries[];
    title?: string;
    height?: number;
}

export interface StackedBarChartProps<T> {
    data: T[];
    xKey: keyof T;
    series: ChartSeries[];
    title?: string;
    height?: number;
}

export interface SpeedometerProps {
    value: number;
    maxValue: number;
    title?: string;
    height?: number;
}
