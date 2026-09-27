import { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";

interface AmDonutChartProps {
    data: {
        name: string;
        value: number;
    }[];
    height?: number;
}

const AmDonutChart = ({
    data,
    height = 300,
}: AmDonutChartProps) => {
    useLayoutEffect(() => {
        const root = am5.Root.new("am-donut-chart");

        root.setThemes([]);

        const chart = root.container.children.push(
            am5percent.PieChart.new(root, {
                layout: root.verticalLayout,
                innerRadius: am5.percent(60),
            })
        );

        const series = chart.series.push(
            am5percent.PieSeries.new(root, {
                valueField: "value",
                categoryField: "name",
                alignLabels: false,
            })
        );

        series.labels.template.setAll({
            text: "{category}: {value}",
        });

        series.ticks.template.setAll({
            visible: false,
        });

        series.slices.template.setAll({
            strokeWidth: 2,
            tooltipText: "{category}: {value}",
        });
        series.slices.template.adapters.add("fill", (fill, target) => {
            const category = (target.dataItem?.dataContext as { name?: string })
                ?.name;

            if (category?.toLowerCase() === "active") {
                return am5.color(0x22c55e);
            }
            if (category?.toLowerCase() === "inactive") {
                return am5.color(0xef4444);
            }
            return fill;
        });

        series.slices.template.adapters.add("stroke", (stroke, target) => {
            const category = (target.dataItem?.dataContext as { name?: string })
                ?.name;

            if (category?.toLowerCase() === "active") {
                return am5.color(0x16a34a);
            }
            if (category?.toLowerCase() === "inactive") {
                return am5.color(0xdc2626);
            }
            return stroke;
        });

        series.data.setAll(data);

        chart.children.push(
            am5.Legend.new(root, {
                centerX: am5.p50,
                x: am5.p50,
            })
        );

        series.appear(1000, 100);

        return () => {
            root.dispose();
        };
    }, [data]);

    return (
        <div
            id="am-donut-chart"
            style={{
                width: "100%",
                height,
            }}
        />
    );
};

export default AmDonutChart;