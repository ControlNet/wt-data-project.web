<script setup lang="ts">

import params from "@/global/params";
import { computed, onMounted } from "vue";
import { brs, nations } from "@/global/consts";
import { useInputStore } from "@/stores/inputStore";
import type { TimeseriesData } from "@/types/alias";
import * as d3 from "d3";
import type { SquareInfo, TimeseriesRow } from "@/types/dataTypes";
import { TimeseriesRowGetter } from "@/utils/getter/timeseriesData";
import { i18n } from "@/i18n";
import { COLORS } from "@/global/colors";
import type { Value2Color } from "@/utils/colorHelper";
import { timeseriesCache, value2colorCache } from "@/global/cache";
import { useHeatMapStore } from "@/stores/heatMapStore";

const svgHeight = params.BrHeatmapPage.BrHeatmap.svgHeight
const svgWidth = params.BrHeatmapPage.BrHeatmap.svgWidth
const margin = params.BrHeatmapPage.BrHeatmap.margin
const width = svgWidth - margin.left - margin.right
const height = svgHeight - margin.top - margin.bottom
const translate = `translate(${margin.left}, ${margin.top})`

const inputStore = useInputStore();

let value2color: Value2Color | undefined;

let data: TimeseriesData = [];
let g: d3.Selection<SVGGElement, unknown, HTMLElement, any> | undefined;

const squareWidth = computed(() => width / nations.length)
const squareHeight = computed(() => height / brs[inputStore.brRange].length)

const heatMapStore = useHeatMapStore();

async function init() {
    data = await timeseriesCache.get(inputStore);
    const dataObjs = extractData(data)

    g = d3.select<SVGGElement, unknown>("#main-g")
    // build axis
    const {x, y} = buildAxis(g)

    // colorMap function
    const {value2color: _value2color, valueMax, valueMin} = await value2colorCache.get(inputStore);
    value2color = _value2color;
    heatMapStore.updateColorBar(valueMin, valueMax, value2color);

    // add heat squares
    g.selectAll()
        .data(dataObjs, d => d!.nation + d!.lowerBr)
        .enter()
        .append<SVGRectElement>("rect")
        .attr("x", d => x(d.nation)!)
        .attr("y", d => y(d.br)!)
        .attr("width", squareWidth.value)
        .attr("height", squareHeight.value)
        .style("stroke-width", 1)
        .style("stroke", "black")
        .style("fill", d => value2color!(d.value))
}

async function update(reDownload: boolean) {
    const oldAxis = d3.selectAll("g#br-heatmap-x, g#br-heatmap-y");
    if (reDownload) {
        // if need re-download data
        data = await timeseriesCache.get(inputStore);
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
    const {value2color: _value2color, valueMax, valueMin} = await value2colorCache.get(inputStore);
    value2color = _value2color;
    heatMapStore.updateColorBar(valueMin, valueMax, value2color);

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
        after(async () => {
            if (name === "setBrRange" || name === "setMode") {
                await update(true)
            } else {
                await update(false)
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
</script>


<template>
    <svg :height="svgHeight" :width="svgWidth">
        <g id="main-g" :transform="translate"/>
    </svg>
</template>

<style>
</style>