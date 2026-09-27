import { useLayoutEffect, useRef } from "react";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface AmSpeedometerProps {
    value: number;
    min?: number;
    max?: number;
    title?: string;
    height?: number;
    unit?: string;
}

const AmSpeedometer = ({
    value,
    min = 0,
    max = 100,
    title = "Active Employees",
    height = 280,
    unit = "%",
}: AmSpeedometerProps) => {
    const chartRef = useRef<HTMLDivElement | null>(null);

    const displayValue = Math.min(Math.max(value, min), max);

    useLayoutEffect(() => {
        if (!chartRef.current) return;

        const root = am5.Root.new(chartRef.current);

        root.setThemes([
            am5themes_Animated.new(root),
        ]);

        // Radar Chart
        const chart = root.container.children.push(
            am5radar.RadarChart.new(root, {
                panX: false,
                panY: false,

                startAngle: 180,
                endAngle: 360,

                // Smaller gauge
                innerRadius: am5.percent(60),
                radius: am5.percent(72),

                wheelX: "none",
                wheelY: "none",
            })
        );

        // Gauge Renderer
        const renderer = am5radar.AxisRendererCircular.new(root, {
            innerRadius: -8,
            strokeOpacity: 1,
            strokeWidth: 13,
            minGridDistance: 20,

            strokeGradient: am5.LinearGradient.new(root, {
                rotation: 0,
                stops: [
                    {
                        color: am5.color(0x19D228),
                    },
                    {
                        color: am5.color(0xF4FB16),
                    },
                    {
                        color: am5.color(0xF6D32B),
                    },
                    {
                        color: am5.color(0xFB7116),
                    },
                ],
            }),
        });

        renderer.grid.template.setAll({
            visible: false,
        });

        renderer.labels.template.setAll({
            visible: true,
            fontSize: 10,
            fontWeight: "500",
            fill: am5.color(0x64748B),
            radius: 12,
        });

        renderer.ticks.template.setAll({
            visible: false,
        });

        // Value Axis
        const axis = chart.xAxes.push(
            am5xy.ValueAxis.new(root, {
                min,
                max,
                strictMinMax: true,
                maxDeviation: 0,
                renderer,
            })
        );

        // Needle
        const hand = am5radar.ClockHand.new(root, {
            pinRadius: 9,
            radius: am5.percent(80),
            innerRadius: 0,
            topWidth: 3,
            bottomWidth: 6,
        });

        const handDataItem = axis.makeDataItem({
            value: min,
        });

        handDataItem.set(
            "bullet",
            am5xy.AxisBullet.new(root, {
                sprite: hand,
            })
        );

        axis.createAxisRange(handDataItem);
        // Needle Animation
        handDataItem.animate({
            key: "value",
            to: displayValue,
            duration: 1200,
            easing: am5.ease.out(am5.ease.cubic),
        });
        chart.appear(1000, 100);

        return () => {
            root.dispose();
        };
    }, [value, min, max, unit, displayValue]);

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height,

                backgroundColor: "#F4F7FA",
                borderRadius: "14px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 2px 6px rgba(15, 23, 42, 0.06)",

                overflow: "hidden",
            }}
        >
            <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    bottom: "2%",
                    transform: "translateX(-50%)",
                    textAlign: "center",
                    pointerEvents: "none",
                }}
            >
                <div style={{ fontSize: 18, fontWeight: 700, color: "#287F76" }}>
                    {displayValue.toFixed(1)}{unit}
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#64748B", marginTop: 2 }}>
                    {title}
                </div>
            </div>
        </div>
    );
};

export default AmSpeedometer;