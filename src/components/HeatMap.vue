<script setup lang="ts">

import params from "@/global/params";
import { computed, onMounted } from "vue";
import { brs, dataUrl, nations } from "@/global/consts";
import { useInputStore } from "@/stores/inputStore";
import type { TimeseriesData } from "@/types/alias";
import * as d3 from "d3";
import type { SquareInfo, TimeseriesRow } from "@/types/dataTypes";
import { TimeseriesRowGetter } from "@/utils/getter/timeseriesData";
import { i18n } from "@/i18n";
import { COLORS } from "@/global/colors";
import type { Clazz, Measurement } from "@/types/options";
import { brHeatmapColorMaps } from "@/global/colorMaps";

const svgHeight = params.BrHeatmapPage.BrHeatmap.svgHeight
const svgWidth = params.BrHeatmapPage.BrHeatmap.svgWidth
const margin = params.BrHeatmapPage.BrHeatmap.margin
const width = svgWidth - margin.left - margin.right
const height = svgHeight - margin.top - margin.bottom
const translate = `translate(${margin.left}, ${margin.top})`

const inputStore = useInputStore();

const dataPath = computed(() => {
    return `${dataUrl}/${inputStore.mode.toLowerCase()}_ranks_${inputStore.brRange}.csv`
})

let value2color: Value2Color | undefined;

let data: TimeseriesData = [];
let g: d3.Selection<SVGGElement, unknown, HTMLElement, any> | undefined;

const squareWidth = computed(() => width / nations.length)
const squareHeight = computed(() => height / brs[inputStore.brRange].length)

async function init() {
    data = await d3.csv(dataPath.value)
    const dataObjs = extractData(data)

    g = d3.select<SVGGElement, unknown>("#main-g")
    // build axis
    const {x, y} = buildAxis(g)

    // colorMap function
    value2color = await getValue2color(inputStore.measurement, inputStore.clazz)

    // add heat squares
    g.selectAll()
        .data(dataObjs, d => d!.nation + d!.lowerBr)
        .enter()
        .append<SVGRectElement>("rect")
        .attr("x", d => x(d.nation)!)
        .attr("y", d => y(d.br)!)
        .attr("width", squareWidth.value)
        .attr("height", squareHeight.value)
        .style("fill", d => value2color!(d.value))
        .style("stroke-width", 1)
        .style("stroke", "black")
}

async function update(reDownload: boolean) {
    const oldAxis = d3.selectAll("g#br-heatmap-x, g#br-heatmap-y");
    if (reDownload) {
        // if need re-download data
        data = await d3.csv(dataPath.value)
    }
    // else read data from cache
    await updateSquares(data);
    // reset axis
    buildAxis(g!);
    oldAxis.remove();
}


async function updateSquares(data: TimeseriesData) {
    // init
    const dataObjs = extractData(data)

    // colorMap function
    value2color = await getValue2color(inputStore.measurement, inputStore.clazz)

    // change fill of squares
    const rects = g!
        .selectAll<SVGRectElement, SquareInfo>("rect")
        .data(dataObjs, d => d.nation + d.lowerBr);

    rects.enter()
        .transition()
        .style("fill", d => value2color!(d.value));

    rects.exit()
        .transition()
        .style("fill", COLORS.BLANK);

    rects.transition()
        .style("fill", d => value2color!(d.value));
}

onMounted(async () => {
    await init()
    // only update the plot after mounted
    inputStore.$onAction(({name, after}) => {
        after(() => {
            if (name === "setBrRange" || name === "setMode") {
                update(true)
            } else {
                update(false)
            }
        })
    })
})

function extractData(data: Array<TimeseriesRow>): Array<SquareInfo> {
    const dataObjs = data.filter(row => row.date === inputStore.date && row.cls === inputStore.clazz)
        .map(row => {
            const get = new TimeseriesRowGetter(row, inputStore.mode, inputStore.measurement);
            return {
                nation: row.nation,
                br: get.br,
                lowerBr: get.lowerBr,
                value: get.value
            }
        });

    const blankObjs: Array<SquareInfo> = [];
    nations.forEach(nation => {
        brs[inputStore.brRange].forEach(br => {
            if (!dataObjs.find(obj => obj.nation === nation && obj.br === br)) {
                blankObjs.push({
                    nation,
                    br,
                    value: 0,
                    lowerBr: +br.split("~")[0].replace(" ", ""),
                })
            }
        })
    })

    return dataObjs.concat(blankObjs);
}

function buildAxis(g: d3.Selection<SVGGElement, unknown, HTMLElement, any>) {
    // x-axis
    const x = d3.scaleBand()
        .range([0, width])
        .domain(nations);

    g.append("g")
        .attr("id", "br-heatmap-x")
        .style("font-size", 13)
        .attr("transform", `translate(0, ${height + 10})`)
        .call(d3.axisBottom(x).tickSize(0)
            .tickFormat((d: string) => i18n.global.t(`Nation.${d}`)))
        .select("#main-g g path.domain").remove()

    // y-axis
    const y = d3.scaleBand()
        .range([height, 0])
        .domain(brs[inputStore.brRange]);

    g.append("g")
        .attr("id", "br-heatmap-y")
        .style("font-size", 15)
        .attr("transform", `translate(-5, 0)`)
        .call(d3.axisLeft(y).tickSize(0))
        .select("#main-g g path.domain").remove()
    return {x, y};
}

export interface Value2Color {
    (value: number): number | string | COLORS
}

async function getValue2color(measurement: Measurement, clazz: Clazz): Promise<Value2Color> {
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

    const value2color = (value: number) => range2color(value2range(value));

    // update color bar
    // await this.colorBar.update(valueMin, valueMax, value2color);

    return (value: number) => {
        if (value == 0.) {
            return COLORS.BLANK;
        } else {
            return range2color(value2range(value));
        }
    }
}
</script>


<template>
    <svg :height="svgHeight" :width="svgWidth">
        <g id="main-g" :transform="translate"/>
    </svg>
</template>

<style>
</style>