import { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import type { ChartSeries } from "../chartTypes";

interface AmBarChartProps {
    data: any[];
    xKey: string;
    series: ChartSeries[];
    height?: number;
}

const AmBarChart = ({
    data,
    xKey,
    series,
    height = 300,
}: AmBarChartProps) => {
    useLayoutEffect(() => {
        const root = am5.Root.new("am-bar-chart");
        root.setThemes([
            am5themes_Animated.new(root),
        ]);
        const chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                wheelX: "none",
                wheelY: "none",
                layout: root.verticalLayout,
            })
        );
        const xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                categoryField: xKey,
                renderer: am5xy.AxisRendererX.new(root, {
                    minGridDistance: 30,
                }),
            })
        );
        xAxis.data.setAll(data);
        const yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                min: 0,
                renderer: am5xy.AxisRendererY.new(root, {}),
            })
        );
        const colors: Record<string, am5.Color> = {
            Total: am5.color(0x5b8def),
            Active: am5.color(0x2e7d32),
            Inactive: am5.color(0xd32f2f),
        };
        series.forEach((item) => {
            const chartSeries = chart.series.push(
                am5xy.ColumnSeries.new(root, {
                    name: item.name,
                    xAxis,
                    yAxis,
                    valueYField: item.dataKey,
                    categoryXField: xKey,
                    tooltip: am5.Tooltip.new(root, {
                        labelText: `{name}: {valueY}`,
                    }),
                })
            );

            chartSeries.columns.template.setAll({
                cornerRadiusTL: 5,
                cornerRadiusTR: 5,
                fill: colors[item.name],
                stroke: colors[item.name],
            });

            chartSeries.data.setAll(data);
        });

        const legend = chart.children.unshift(
            am5.Legend.new(root, {
                x: am5.percent(100),
                centerX: am5.percent(100),
                layout: root.horizontalLayout,
                marginBottom: 10,
            })
        );

        legend.data.setAll(chart.series.values);
        chart.appear(1000, 100);
        return () => { root.dispose(); };
    }, [data, xKey, series]);
    return (
        <div
            id="am-bar-chart"
            style={{
                width: "100%",
                height,
            }}
        />
    );
};

export default AmBarChart;