import * as d3 from "d3";
import * as _ from "lodash";
import { Plot } from "./plot";
import { BrHeatmap } from "./br-heatmap";
import { TimeseriesData, TimeseriesRow, TimeseriesRowGetter } from "../data/timeseries-data";
import { Container, Inject, Injectable, Provider, utils } from "../utils";
import { BRRange, Clazz, Measurement, Mode } from "../data/options";
import { Config, Margin } from "../app/config";


@Injectable
export abstract class LineChart extends Plot {
}


@Provider(BrLineChart)
export class BrLineChart extends LineChart {
    @Inject(Config.BrHeatmapPage.BrLineChart.svgHeight) readonly svgHeight: number;
    @Inject(Config.BrHeatmapPage.BrLineChart.svgWidth) readonly svgWidth: number;
    @Inject(Config.BrHeatmapPage.BrLineChart.margin) readonly margin: Margin;
    dataCache: Array<TimeseriesDataCache> = [];

    init(): BrLineChart {
        // build new plot in the content div of page
        this.svg = d3.select<HTMLDivElement, unknown>("#content")
            .append<SVGSVGElement>("svg")
            .attr("height", this.svgHeight)
            .attr("width", this.svgWidth)
            .attr("id", "line-chart-svg");
        this.g = this.svg.append<SVGGElement>("g")
            .attr("id", "line-chart-g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        return this;
    }

    private async searchInCache(): Promise<TimeseriesData> {
        // search dataObj in cache
        for (const cache of this.dataCache) {
            if (this.brHeatmap.clazz === cache.clazz
                && this.brHeatmap.brRange === cache.brRange
                && this.brHeatmap.mode === cache.mode
                && this.brHeatmap.measurement === cache.measurement
            ) {
                return cache.data;
            }
        }
        // else generate a new cache
        return new Promise(resolve => {
            d3.csv(this.brHeatmap.dataPath, (data: TimeseriesData) => {
                this.dataCache.push({
                    brRange: this.brHeatmap.brRange,
                    clazz: this.brHeatmap.clazz,
                    measurement: this.brHeatmap.measurement,
                    mode: this.brHeatmap.mode,
                    data: data
                });
                resolve(data);
            })
        });
    }

    async update(): Promise<BrLineChart> {
        const oldXAxis = this.g.selectAll<SVGElement, unknown>(".x-axis");
        const oldYAxis = this.g.selectAll<SVGElement, unknown>(".y-axis");

        const data = await this.searchInCache();
        const dataObjs: Array<BrLineChartDataObj> = this.groupBy(this.extractData(data));

        // x axis
        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => utils.parseDate(d.date)))
            .range([0, this.width]);
        // generate sticks
        this.g.append<SVGGElement>("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${this.height})`)
            .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat('%Y/%m')));

        // add x label
        this.g.append<SVGTextElement>("text")
            .classed("x-axis", true)
            .text("Date")
            .attr("transform", `translate(${this.width / 2}, ${this.height + 30})`)
            .style("font-size", 12)
            .style("text-anchor", "middle");

        oldXAxis.remove();

        // y axis
        const yValues: Array<number> = _.flatMap(dataObjs, obj => obj.values).map(row => +row.value);
        const yMax = Math.min(_.max(yValues) * 1.02, 100);
        const yMin = Math.max(_.min(yValues) * 0.98, 0);
        const y = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([this.height, 0]);
        // generate sticks
        this.g.append<SVGGElement>("g")
            .classed("y-axis", true)
            .call(d3.axisLeft(y));

        // add y label
        this.g.append<SVGTextElement>("text")
            .classed("y-axis", true)
            .text(this.brHeatmap.measurement)
            .attr("transform", `translate(${-30}, ${this.height / 2}) rotate(270)`)
            .style("font-size", 12)
            .style("text-anchor", "middle");

        oldYAxis.remove();

        const line = d3.line<{ date: Date, value: number }>()
            .x(function(d) {
                return x(d.date)
            })
            .y(function(d) {
                return y(d.value)
            })

        // add lines
        let paths: d3.Selection<SVGPathElement, BrLineChartDataObj, SVGGElement, unknown>;
        if (this.g.selectAll("#line-chart-path-g").size() > 0) {
            paths = this.g.select<SVGGElement>("#line-chart-path-g")
                .selectAll<SVGPathElement, BrLineChartDataObj>("path")
                .data(dataObjs, (d: BrLineChartDataObj) => d.nation + d.br);
        } else {
            paths = this.g.append<SVGGElement>("g")
                .attr("id", "line-chart-path-g")
                .style("fill", "None")
                .selectAll<SVGPathElement, BrLineChartDataObj>("path")
                .data(dataObjs, (d: BrLineChartDataObj) => d.nation + d.br);
        }

        // remove lines for removed selection
        paths.exit().transition()
            .duration(500)
            .style("opacity", 0)
            .remove();

        // shift the lines with re-adjusted y-axis range
        paths.transition()
            .duration(500)
            .attr("d", (d: BrLineChartDataObj) => line(d.values))
            .attr("stroke", d => this.brHeatmap.colorPool.get(d));

        // add lines for new selected data
        paths.enter()
            .append<SVGPathElement>("path")
            .style("opacity", 0)
            .style("stroke-width", 3)
            .transition()
            .duration(500)
            .style("opacity", 1)
            .attr("d", (d: BrLineChartDataObj) => line(d.values))
            .attr("stroke", (d: BrLineChartDataObj) => this.brHeatmap.colorPool.get(d));

        return this;
    }

    get brHeatmap(): BrHeatmap {
        return Container.get(BrHeatmap);
    }

    reset(): BrLineChart {
        this.g.html(null);
        return this;
    }

    private extractData(data: Array<TimeseriesRow>): BrLineChartData {
        return data.filter(row => {
            const get = new TimeseriesRowGetter(row, this.brHeatmap.mode, this.brHeatmap.measurement);
            return this.brHeatmap.selected.some(
                info => info.nation === row.nation
                    && info.br === get.br
                    && this.brHeatmap.clazz === row.cls
            )
        }).map(row => {
            const get = new TimeseriesRowGetter(row, this.brHeatmap.mode, this.brHeatmap.measurement);
            return {
                date: utils.parseDate(row.date),
                nation: row.nation,
                br: get.br,
                value: get.value
            }
        });
    }

    private groupBy(data: BrLineChartData): Array<BrLineChartDataObj> {
        const result: Array<BrLineChartDataObj> = [];
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

        // remove 0 values
        return result.map(category => {
            category.values = category.values.filter(row => row.value > 0);
            return category;
        });
    }
}

type BrLineChartData = Array<BrLineChartRow>;

interface BrLineChartRow {
    date: Date;
    br: string;
    nation: string;
    value: number;
}

export interface BrLineChartDataObj {
    br: string;
    nation: string;
    values: Array<{ date: Date, value: number }>
}

interface TimeseriesDataCache {
    clazz: Clazz;
    mode: Mode;
    measurement: Measurement;
    brRange: BRRange;
    data: TimeseriesData;
}

export class StackLineChart extends LineChart {
    init(...args: any[]): Plot {
        return undefined;
    }

    async update(...args: any[]): Promise<Plot> {
        return this;
    }

}