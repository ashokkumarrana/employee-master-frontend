import { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import type { ChartSeries } from "../chartTypes";

interface AmGraphStackProps {
    data: any[];
    xKey: string;
      series: ChartSeries[];
    height?: number;
}

const AmGraphStack = ({
    data,
    xKey,
    series,
    height = 300,
}: AmGraphStackProps) => {
    useLayoutEffect(() => {
        const root = am5.Root.new("am-graph-stack");
        root.setThemes([am5themes_Animated.new(root),]);
        // Chart
        const chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                wheelX: "none",
                wheelY: "none",
                layout: root.verticalLayout,
            })
        );

        // X Axis
        const xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                categoryField: xKey,
                renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30, }),
            })
        );

        xAxis.data.setAll(data);

        // Y Axis
        const yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {}),
                min: 0,
            })
        );

        // Series
        series.forEach((item) => {
            const chartSeries = chart.series.push(
                am5xy.LineSeries.new(root, {
                    name: item.name,
                    xAxis,
                    yAxis,
                    valueYField: item.dataKey,
                    categoryXField: xKey,
                    tooltip: am5.Tooltip.new(root, { labelText: `{name}: {valueY}`, }),
                })
            );

            // Fixed colors
            let seriesColor = am5.color(0x287F76);
            if (item.name.toLowerCase() === "active") {
                seriesColor = am5.color(0x22C55E); // Green
            } else if (item.name.toLowerCase() === "inactive") {
                seriesColor = am5.color(0xEF4444); // Red
            } else if (item.name.toLowerCase() === "total") {
                seriesColor = am5.color(0x3B82F6); // Blue
            }
            // Line color
            chartSeries.strokes.template.setAll({
                stroke: seriesColor,
                strokeWidth: 2,
            });

            // Point color
            chartSeries.bullets.push(() => am5.Bullet.new(root, {
                sprite: am5.Circle.new(root, {
                    radius: 4,
                    fill: seriesColor,
                    stroke: seriesColor,
                }),
            })
            );
            chartSeries.data.setAll(data);
        });

        // Legend
        const legend = chart.children.unshift(
            am5.Legend.new(root, {
                x: am5.percent(100),
                centerX: am5.percent(100),
                layout: root.horizontalLayout,
                marginBottom: 10,
            })
        );
        legend.data.setAll(chart.series.values);
        // Animation
        chart.appear(1000, 100);
        // Cleanup
        return () => { root.dispose(); };
    }, [data, xKey, series]);
    return (
        <div
            id="am-graph-stack"
            style={{
                width: "100%",
                height,
            }}
        />
    );
};

export default AmGraphStack;