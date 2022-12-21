<script setup lang="ts">

import params from "@/global/params";
import { onMounted } from "vue";
import type { Value2Color } from "@/utils/colorHelper";
import { useHeatMapStore } from "@/stores/heatMapStore";
import { useInputStore } from "@/stores/inputStore";
import { formatPower, linspace, logspace } from "@/utils/misc";
import * as d3 from "d3";

const svgHeight = params.BrHeatmapPage.ColorBar.svgHeight
const svgWidth = params.BrHeatmapPage.ColorBar.svgWidth
const margin = params.BrHeatmapPage.ColorBar.margin
const transform = `translate(${margin.left}, ${margin.top})`
const height = svgHeight - margin.top - margin.bottom
const width = svgWidth - margin.left - margin.right

let valueMin: number = 0
let valueMax: number = 0
let value2color: Value2Color | undefined

const heatMapStore = useHeatMapStore();
const inputStore = useInputStore();

onMounted(() => {
    heatMapStore.$onAction(({name, args, after}) => {
        if (name === "updateColorBar") {
            [valueMin, valueMax, value2color] = args;
            after(update);
        }
    })
})

async function update(): Promise<void> {
    const svg = d3.select<SVGSVGElement, unknown>("#color-bar-svg")
    const g = d3.select<SVGGElement, unknown>("#color-bar-g")

    const scale = inputStore.measurement === "battles_sum" ? "log" : "linear";
    const samples = scale === "log"
        ? logspace(valueMin, valueMax, 100)
        : linspace(valueMin, valueMax, 100);
    const colors = samples.map(value2color!);

    // remove current legend
    g.selectAll("*").remove();

    // append gradient bar
    const gradientId = `${svg.attr("id")}-gradient`;
    const gradient = g.append<SVGDefsElement>("defs")
        .append<SVGLinearGradientElement>("linearGradient")
        .attr('id', gradientId)
        .attr('x1', '0%') // bottom
        .attr('y1', '100%')
        .attr('x2', '0%') // to top
        .attr('y2', '0%')
        .attr('spreadMethod', 'pad');

    // values for legend
    const pct = linspace(0, 100, 100).map(function (d) {
        return Math.round(d) + '%';
    });

    d3.zip(pct, colors).forEach(function ([pct, scale]) {
        gradient.append<SVGStopElement>('stop')
            .attr('offset', pct)
            .attr('stop-color', scale)
            .attr('stop-opacity', 1);
    });

    const legendHeight = height;
    const legendWidth = width;

    g.append<SVGRectElement>('rect')
        .attr('x1', 0)
        .attr('y1', 10)
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .style('fill', `url(#${gradientId})`);

    // create a scale and axis for the legend
    let legendScale;
    if (scale === "log") {
        legendScale = d3.scaleLog()
            .domain([valueMin, valueMax])
            .range([legendHeight, 0])
    } else {
        legendScale = d3.scaleLinear()
            .domain([valueMin, valueMax])
            .range([legendHeight, 0])
    }

    let legendAxis = d3.axisRight(legendScale);

    if (scale === "log") {
        legendAxis = legendAxis.ticks(3);
    }

    legendAxis = legendAxis
        .tickFormat(d => {
            if (scale === "log") {
                return 10 + formatPower(Math.round(Math.log10(+d)))
            } else {
                return d + "%";
            }
        });

    g.append("g")
        .style("font-size", scale === "log" ? 12 : -1)
        .attr("class", "legend-axis")
        .attr("transform", "translate(" + legendWidth + ", 0)")
        .call(legendAxis);
}

</script>

<template>
    <div id="color-bar">
        <svg id="color-bar-svg" :height="svgHeight" :width="svgWidth">
            <g id="color-bar-g" :transform="transform" />
        </svg>
    </div>
</template>