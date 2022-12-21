import { COLORS } from "@/global/colors";
import type { Clazz, Measurement } from "@/types/options";
import * as d3 from "d3";
import { brHeatmapColorMaps } from "@/global/colorMaps";

export interface Value2Color {
    (value: number): number | string | COLORS
}

export async function getValue2color(measurement: Measurement, clazz: Clazz): Promise<{ valueMin: number, valueMax: number, value2color: Value2Color }> {
    let value2range: d3.ScaleLinear<number, number>;
    let range2color: d3.ScaleLinear<string, string>;
    let valueMin: number;
    let valueMax: number;

    switch (measurement) {
        case "win_rate":
            valueMin = 0;
            valueMax = 100;

            value2range = d3.scaleLinear<number, number>()
                .domain([valueMin, valueMax])
                .range([0, 1]);

            if (clazz === "Ground_vehicles") {
                range2color = d3.scaleLinear<string, string>()
                    .domain(brHeatmapColorMaps.win_rate.Ground_vehicles.percentiles)
                    .range(brHeatmapColorMaps.win_rate.Ground_vehicles.colors)
                    .interpolate(d3.interpolateHsl)
            } else if (clazz === "Aviation") {
                range2color = d3.scaleLinear<string, string>()
                    .domain(brHeatmapColorMaps.win_rate.Aviation.percentiles)
                    .range(brHeatmapColorMaps.win_rate.Aviation.colors)
                    .interpolate(d3.interpolateHsl)
            }
            break;
        case "battles_sum":
            valueMin = Math.pow(10, 2.5);
            valueMax = Math.pow(10, 5.5);

            value2range = d3.scaleLog()
                .domain([valueMin, valueMax])
                .range([0, 1]);

            range2color = d3.scaleLinear<string, string>()
                .domain(brHeatmapColorMaps.battles_sum.Ground_vehicles.percentiles)
                .range(brHeatmapColorMaps.battles_sum.Ground_vehicles.colors)
                .interpolate(d3.interpolateHsl)
            break;
    }

    return {
        valueMin, valueMax, value2color: (value: number) => {
            if (value == 0.) {
                return COLORS.BLANK;
            } else {
                return range2color(value2range(value));
            }
        }
    }
}