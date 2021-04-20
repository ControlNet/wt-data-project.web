import * as d3 from "d3";
import { Margin, Plot } from "./plot";
import { BrHeatmap } from "./br-heatmap";
import { utils } from "../utils";

export class ColorBar extends Plot {
    brHeatmap: BrHeatmap;
    valueMin: number;
    valueMax: number;
    value2color: any;

    constructor(brHeatmap: BrHeatmap, svgHeight: number, svgWidth: number, margin: Margin) {
        super(svgHeight, svgWidth, margin);
        this.brHeatmap = brHeatmap;
    }

    init(): ColorBar {
        this.svg = d3.select("#content")
            .append("svg")
            .attr("height", this.svgHeight)
            .attr("width", this.svgWidth)
            .attr("id", "color-bar-svg");

        this.g = this.svg.append("g")
            .attr("id", "color-bar-g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
        return this;
    }

    update(valueMin: number, valueMax: number, value2color: any): ColorBar {
        this.valueMin = valueMin;
        this.valueMax = valueMax;
        this.value2color = value2color;

        const scale = this.brHeatmap.measurement === "battles_sum" ? "log" : "linear";
        const samples = scale === "log" ? utils.logspace(this.valueMin, this.valueMax, 100)
            : utils.linspace(this.valueMin, this.valueMax, 100);
        const colors = samples.map(this.value2color);

        // remove current legend
        this.g.selectAll("*").remove();

        // append gradient bar
        const gradientId = `${this.svg.attr("id")}-gradient`;
        const gradient = this.g.append("defs")
            .append('linearGradient')
            .attr('id', gradientId)
            .attr('x1', '0%') // bottom
            .attr('y1', '100%')
            .attr('x2', '0%') // to top
            .attr('y2', '0%')
            .attr('spreadMethod', 'pad');

        // values for legend
        const pct = utils.linspace(0, 100, 100).map(function(d) {
            return Math.round(d) + '%';
        });

        d3.zip(pct, colors).forEach(function([pct, scale]) {
            gradient.append('stop')
                .attr('offset', pct)
                .attr('stop-color', scale)
                .attr('stop-opacity', 1);
        });

        const legendHeight = this.height;
        const legendWidth = this.width;

        this.g.append('rect')
            .attr('x1', 0)
            .attr('y1', 10)
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .style('fill', `url(#${gradientId})`);

        // create a scale and axis for the legend
        let legendScale;
        if (scale === "log") {
            legendScale = d3.scaleLog()
                .domain([this.valueMin, this.valueMax])
                .range([legendHeight, 0])
        } else {
            legendScale = d3.scaleLinear()
                .domain([this.valueMin, this.valueMax])
                .range([legendHeight, 0])
        }

        let legendAxis = d3.axisRight(legendScale);

        if (scale === "log") {
            legendAxis = legendAxis.ticks(3);
        }

        legendAxis = legendAxis
            .tickFormat((d: number) => {
                if (scale === "log") {
                    return 10 + utils.formatPower(Math.round(Math.log10(d)))
                } else {
                    return d + "%";
                }
            });

        this.g.append("g")
            .style("font-size", scale === "log" ? 12 : null)
            .attr("class", "legend-axis")
            .attr("transform", "translate(" + legendWidth + ", 0)")
            .call(legendAxis);

        return this;
    }
}