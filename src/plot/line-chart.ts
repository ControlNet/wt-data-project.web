import * as d3 from "d3";
import * as _ from "lodash";
import { Margin, Plot } from "./plot";
import { BrHeatmap } from "./br-heatmap";
import { TimeseriesData, TimeseriesRow } from "../data/timeseries-data";
import { utils } from "../utils";

export abstract class LineChart extends Plot {
}

export class BRLineChart extends LineChart {
    brHeatmap: BrHeatmap;


    constructor(brHeatmap: BrHeatmap, svgHeight: number, svgWidth: number, margin: Margin) {
        super(svgHeight, svgWidth, margin);
        this.brHeatmap = brHeatmap;
    }

    init(): Plot {
        // build new plot in the content div of page
        this.svg = d3.select("#content")
            .append("svg")
            .attr("height", this.svgHeight)
            .attr("width", this.svgWidth)
            .attr("id", "line-chart-svg");
        this.g = this.svg.append("g")
            .attr("id", "line-chart-g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        return this;
    }

    update(): Plot {
        const oldXAxis = this.g.selectAll(".x-axis");
        const oldYAxis = this.g.selectAll(".y-axis");
        // const oldLineChart = this.g.selectAll("g.line-chart-element");

        d3.csv(this.brHeatmap.dataPath, (data: TimeseriesData) => {
            const dataObjs = this.groupBy(this.extractData(data));

            // x axis
            const x = d3.scaleLinear()
                .domain(d3.extent(data, d => utils.parseDate(d.date)))
                .range([0, this.width]);
            // generate sticks
            this.g.append("g")
                .classed("x-axis", true)
                .attr("transform", `translate(0, ${this.height})`)
                .call(d3.axisBottom(x)
                    .tickFormat(d3.timeFormat('%Y/%m')));

            // add x label
            this.g.append("text")
                .classed("x-axis", true)
                .text("Date")
                .attr("transform", `translate(${this.width / 2}, ${this.height + 30})`)
                .style("font-size", 12)
                .style("text-anchor", "middle");

            oldXAxis.remove();

            // y axis
            const yValues: Array<number> = _.flatMap(dataObjs, obj => obj.values).map(row => row.value);
            const yMax = _.max(yValues) * 1.02
            const yMin = _.min(yValues) * 0.98
            const y = d3.scaleLinear()
                .domain([yMin, yMax])
                .range([this.height, 0]);
            // generate sticks
            this.g.append("g")
                .classed("y-axis", true)
                .call(d3.axisLeft(y));

            // add y label
            this.g.append("text")
                .classed("y-axis", true)
                .text(this.brHeatmap.measurement)
                .attr("transform", `translate(${-30}, ${this.height / 2}) rotate(270)`)
                .style("font-size", 12)
                .style("text-anchor", "middle");

            oldYAxis.remove();

            const line = d3.line()
                .x(function(d) {
                    // @ts-ignore
                    return x(d.date)
                })
                .y(function(d) {
                    // @ts-ignore
                    return y(d.value)
                })

            // add lines
            let paths;
            if (this.g.selectAll("#line-chart-path-g").size() > 0) {
                paths = this.g.select("#line-chart-path-g")
                    .selectAll("path")
                    .data(dataObjs, (d: LineChartDataObj) => d.nation + d.br);
            } else {
                paths = this.g.append("g")
                    .attr("id", "line-chart-path-g")
                    .style("fill", "None")
                    .selectAll("path")
                    .data(dataObjs, (d: LineChartDataObj) => d.nation + d.br);
            }

            // @ts-ignore
            paths.exit().transition()
                .duration(500)
                .style("opacity", 0)
                .remove();

            paths.transition()
                .duration(500)
                // @ts-ignore
                .attr("d", (d: LineChartDataObj) => line(d.values))
                .attr("stroke", d => this.brHeatmap.colorPool.get(d));

            paths.enter()
                // @ts-ignore
                .append("path")
                .style("opacity", 0)
                .style("stroke-width", 3)
                .transition()
                .duration(500)
                .style("opacity", 1)
                // @ts-ignore
                .attr("d", (d: LineChartDataObj) => line(d.values))
                .attr("stroke", (d: LineChartDataObj) => this.brHeatmap.colorPool.get(d));

        })

        return this;
    }

    private extractData(data: Array<TimeseriesRow>): LineChartData {
        return data.filter(row => {
            return this.brHeatmap.selected.some(
                info => info.nation === row.nation
                    && info.br === this.brHeatmap.getBr(row)
                    && this.brHeatmap.clazz === row.cls
            )
        }).map(row => {
            return {
                date: utils.parseDate(row.date),
                nation: row.nation,
                br: this.brHeatmap.getBr(row),
                value: this.brHeatmap.getValue(row)
            }
        });
    }

    private groupBy(data: LineChartData): Array<LineChartDataObj> {
        const result: Array<LineChartDataObj> = [];
        for (const row of data) {
            // if there is an existed category
            if (result.filter(category => category.br === row.br && category.nation === row.nation).length > 0) {
                for (const category of result) {
                    if (category.br === row.br && category.nation === row.nation) {
                        category.values.push({
                            date: row.date,
                            value: row.value
                        });
                        break
                    }
                }
            } else {
                // if no category for this item
                result.push({
                    br: row.br,
                    nation: row.nation,
                    values: [{
                        date: row.date,
                        value: row.value
                    }]
                })
            }
        }

        return result;
    }
}

type LineChartData = Array<LineChartRow>;

interface LineChartRow {
    date: Date;
    br: string;
    nation: string;
    value: number;
}

export interface LineChartDataObj {
    br: string;
    nation: string;
    values: Array<{ date: Date, value: number }>
}