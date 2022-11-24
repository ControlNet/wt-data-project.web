import * as d3 from "d3";
import * as _ from "lodash";
import { Plot } from "./plot";
import { BrHeatmap, SquareInfo } from "./br-heatmap";
import { TimeseriesData, TimeseriesRow, TimeseriesRowGetter } from "../data/timeseries-data";
import { Container, Inject, Injectable, MousePosition, nationColors, Provider, utils, WasmUtils } from "../utils";
import { Clazz, Mode, Scale } from "../app/options";
import { Config, Localization, Margin, MeasurementTranslator, NationTranslator } from "../app/config";
import { dataUrl, nations } from "../app/global-env";
import { BRHeatMapPage } from "../app/page/br-heatmap-page";
import { StackedAreaPage } from "../app/page/stacked-area-page";
import { Nation } from "../data/wiki-data";
import { StackedLineChartLegend } from "./legend";
import { LineChartTooltip, Tooltip } from "./tooltip";
import { Application } from "../app/application";


@Injectable
export abstract class LineChart extends Plot {
    init(): LineChart {
        // build new plot in the content div of page
        this.svg = this.content
            .append<SVGSVGElement>("svg")
            .attr("height", this.svgHeight)
            .attr("width", this.svgWidth)
            .attr("id", "line-chart-svg");
        this.g = this.svg.append<SVGGElement>("g")
            .attr("id", "line-chart-g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
        return this;
    }
}


@Provider(BrLineChart)
export class BrLineChart extends LineChart {
    @Inject(Config.BrHeatmapPage.BrLineChart.svgHeight) readonly svgHeight: number;
    @Inject(Config.BrHeatmapPage.BrLineChart.svgWidth) readonly svgWidth: number;
    @Inject(Config.BrHeatmapPage.BrLineChart.margin) readonly margin: Margin;
    @Inject(BRHeatMapPage) readonly page: BRHeatMapPage;
    @Inject(LineChartTooltip) readonly tooltip: Tooltip;
    selected: Array<BrLineChartDataObj>;
    selectedDate: number;
    xAxis: d3.ScaleTime<number, number>;
    readonly allDates = Application.dates.map(utils.parseDate).map(date => date.getTime()).reverse();

    onPointerLeave(_: SquareInfo, _2: SVGSVGElement): void {
        this.tooltip.hide();
    }

    onPointerOver(_: SquareInfo, _2: SVGSVGElement): void {
        if (this.selected.length > 0) {
            this.tooltip.appear();
        } else {
            this.tooltip.hide();
        }
    }

    async onPointerMove(_d: SquareInfo, node: SVGSVGElement): Promise<void> {
        const mousePos = new MousePosition(
            d3.mouse(node)[0],
            d3.mouse(node)[1]
        );
        const xValue = this.xAxis.invert(mousePos.x - this.margin.left);
        this.selectedDate = utils.findClosest(this.allDates, xValue.getTime());
        await this.tooltip.update(this.selected.map(dataObj =>
            `${Container.get<NationTranslator>(Localization.Nation)(dataObj.nation)} ` +
                `${dataObj.br}: ${_.round(dataObj.values.find(value => value.date.getTime() === this.selectedDate)?.value, 3)}`
        ), mousePos);
    }

    init(): LineChart {
        super.init();
        this.tooltip.init();
        this.svg.on("pointerover", BrHeatmap.eventWrapper<SVGSVGElement, typeof this.onPointerOver>(this.onPointerOver));
        this.svg.on("pointermove", BrHeatmap.eventWrapper<SVGSVGElement, typeof this.onPointerMove>(this.onPointerMove));
        this.svg.on("pointerleave", BrHeatmap.eventWrapper<SVGSVGElement, typeof this.onPointerLeave>(this.onPointerLeave));
        return this;
    }

    async update(): Promise<BrLineChart> {
        const oldXAxis = this.g.selectAll<SVGElement, unknown>(".x-axis");
        const oldYAxis = this.g.selectAll<SVGElement, unknown>(".y-axis");

        const data = this.brHeatmap.cache;
        // const dataObjs: Array<BrLineChartDataObj> = this.groupBy(this.extractData(data));
        const dataObjs = this.groupBy(WasmUtils.extractData(data, this.brHeatmap.selected, this.page.clazz, this.page.mode, this.page.measurement));
        this.selected = dataObjs;

        // x axis
        const x = d3.scaleUtc()
            .domain(d3.extent(data, d => utils.parseDate(d.date)))
            .range([0, this.width]);
        this.xAxis = x;

        // generate sticks
        this.g.append<SVGGElement>("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${this.height})`)
            .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat('%Y/%m')));

        // add x label
        this.g.append<SVGTextElement>("text")
            .classed("x-axis", true)
            .text(Container.get(Localization.BrHeatmapPage.BrLineChart.date))
            .attr("transform", `translate(${this.width / 2}, ${this.height + 30})`)
            .style("font-size", 12)
            .style("text-anchor", "middle");

        oldXAxis.remove();

        // y axis
        const yValues: Array<number> = _.flatMap(dataObjs, obj => obj.values).map(row => +row.value);
        const yMax = this.page.measurement === "win_rate"
            ? Math.min(_.max(yValues) * 1.02, 100)
            : _.max(yValues) * 1.02;
        const yMin = this.page.measurement === "win_rate"
            ? Math.max(_.min(yValues) * 0.98, 0)
            : _.min(yValues) * 0.98;
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
            .text(Container.get<MeasurementTranslator>(Localization.Measurement)(this.page.measurement))
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

    // private extractData(data: Array<TimeseriesRow>): BrLineChartData {
    //     const results = data.filter(row => {
    //         const get = new TimeseriesRowGetter(row, this.page.mode, this.page.measurement);
    //         return this.brHeatmap.selected.some(
    //             info => info.nation === row.nation
    //                 && info.br === get.br
    //                 && this.page.clazz === row.cls
    //         )
    //     }).map(row => {
    //         const get = new TimeseriesRowGetter(row, this.page.mode, this.page.measurement);
    //         return {
    //             date: utils.parseDate(row.date),
    //             nation: row.nation,
    //             br: get.br,
    //             value: get.value
    //         }
    //     });
    //     return results;
    // }

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

export type BrLineChartData = Array<BrLineChartRow>;

interface BrLineChartRow {
    date: Date;
    br: string;
    nation: Nation;
    value: number;
}

export interface BrLineChartDataObj {
    br: string;
    nation: Nation;
    values: Array<{ date: Date, value: number }>
}

@Provider(StackedLineChart)
export class StackedLineChart extends LineChart {
    @Inject(Config.StackedAreaPage.StackedLineChart.svgHeight) readonly svgHeight: number;
    @Inject(Config.StackedAreaPage.StackedLineChart.svgWidth) readonly svgWidth: number;
    @Inject(Config.StackedAreaPage.StackedLineChart.margin) readonly margin: Margin;
    @Inject(StackedLineChartLegend) readonly legend: StackedLineChartLegend;
    @Inject(StackedAreaPage) readonly page: StackedAreaPage;
    readonly measurement = "battles_sum";

    dataCache: Array<StackedLineChartCache> = [];
    x: d3.ScaleTime<number, number>;

    init(): StackedLineChart {
        super.init();

        d3.csv(this.dataPath, async (data: TimeseriesData) => {
            const dataObjs: Array<StackedLineChartDataObj> = this.groupBy(this.extractData(data));
            const stacks = d3.stack<StackedLineChartDataObj, Nation>()
                .keys(nations)(dataObjs);

            this.dataCache.push({clazz: this.page.clazz, data: stacks, mode: this.page.mode, scale: this.page.scale});

            // x axis
            this.x = d3.scaleUtc()
                .domain(d3.extent(data, d => utils.parseDate(d.date)))
                .range([0, this.width]);

            // generate sticks
            this.g.append<SVGGElement>("g")
                .classed("x-axis", true)
                .attr("transform", `translate(0, ${this.height})`)
                .call(d3.axisBottom(this.x)
                    .tickFormat(d3.timeFormat('%Y/%m')));

            // add x label
            this.g.append<SVGTextElement>("text")
                .classed("x-axis", true)
                .text(Container.get(Localization.StackedAreaPage.StackedLineChart.date))
                .attr("transform", `translate(${this.width / 2}, ${this.height + 30})`)
                .style("font-size", 12)
                .style("text-anchor", "middle");
            const y = this.setYAxis(stacks);

            // init subplots
            this.legend.init();

            // add area
            const area = this.getArea(this.x, y);

            // init areas
            const areas = this.g.append("g")
                .classed("stacked-area", true)
                .selectAll()
                .data(stacks);

            areas.enter()
                .append("path")
                .attr("fill", ({key}) => nationColors.get(key))
                .attr("d", area)
                .style("stroke", "black");

            this.updateSubPlots().then();
        })

        return this;
    }

    async update(): Promise<Plot> {
        const oldYAxis = this.g.selectAll<SVGElement, unknown>(".y-axis");
        // get data from cache or download
        const stacks = await this.searchInCache();

        // update y axis
        const y = this.setYAxis(stacks);
        oldYAxis.remove();

        // update subplots
        await this.updateSubPlots()

        // add area
        const area = this.getArea(this.x, y);

        // update areas
        const areas = this.g.select<SVGGElement>("g.stacked-area")
            .selectAll("path")
            .data(stacks);

        areas.transition()
            .duration(500)
            .attr("d", area);

        return this;
    }

    private getArea(x: d3.ScaleTime<number, number>, y: d3.ScaleLinear<number, number>) {
        return d3.area<{ 0: number, 1: number, data: StackedLineChartDataObj }>()
            .x(d => x(d.data.date))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]));
    }

    private setYAxis(stacks: Array<d3.Series<StackedLineChartDataObj, Nation>>) {
        // y axis
        const yMax = this.page.scale === "value" ? d3.max(stacks[nations.length - 1], d => d[1]) : 1;
        const yMin = 0;

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
            .text(Container.get(Localization.StackedAreaPage.StackedLineChart.battles))
            .attr("transform", `translate(${-60}, ${this.height / 2}) rotate(270)`)
            .style("font-size", 12)
            .style("text-anchor", "middle");
        return y;
    }

    private async searchInCache(): Promise<Array<d3.Series<StackedLineChartDataObj, Nation>>> {
        // search dataObj in cache
        for (const cache of this.dataCache) {
            if (this.page.clazz === cache.clazz
                && this.page.mode === cache.mode
                && this.page.scale === cache.scale
            ) {
                return cache.data;
            }
        }
        // else generate a new cache
        return new Promise(resolve => {
            d3.csv(this.dataPath, (data: TimeseriesData) => {
                const dataObjs = this.groupBy(this.extractData(data));
                const stacks = d3.stack<StackedLineChartDataObj, Nation>()
                    .keys(nations)(dataObjs);
                this.dataCache.push({
                    clazz: this.page.clazz,
                    mode: this.page.mode,
                    scale: this.page.scale,
                    data: stacks
                });
                resolve(stacks);
            })
        });
    }

    private extractData(data: Array<TimeseriesRow>): StackedLineChartData {
        return data
            .filter(row => row.cls === this.page.clazz)
            .map(row => {
                const get = new TimeseriesRowGetter(row, this.page.mode, this.measurement);
                return {
                    date: utils.parseDate(row.date),
                    nation: row.nation,
                    value: get.value
                }
            });
    }

    private groupBy(data: StackedLineChartData): Array<StackedLineChartDataObj> {
        const dataMap: Map<string, StackedLineChartDataObj> = new Map();
        data.forEach((row: StackedLineChartRow) => {
            const dateStr = row.date.toString();
            if (dataMap.has(dateStr)) {
                dataMap.get(dateStr)[row.nation] = row.value;
            } else {
                const newObj: StackedLineChartDataObj = {
                    Britain: 0,
                    China: 0,
                    France: 0,
                    Germany: 0,
                    Italy: 0,
                    Israel: 0,
                    Japan: 0,
                    Sweden: 0,
                    USA: 0,
                    USSR: 0,
                    date: row.date
                };
                newObj[row.nation] = row.value;
                dataMap.set(dateStr, newObj);
            }
        });
        // scale as percentage if the option is chosen
        const dataObjs = Array.from(dataMap.values());
        switch (this.page.scale) {
            case "value":
                return dataObjs;
            case "percentage":
                return dataObjs.map(({Britain, China, France, Germany, Italy, Israel, Japan, Sweden, USA, USSR, date}) => {
                    const s = _.sum([Britain, China, France, Germany, Italy, Israel, Japan, Sweden, USA, USSR]);
                    return {
                        Britain: Britain / s,
                        China: China / s,
                        France: France / s,
                        Germany: Germany / s,
                        Italy: Italy / s,
                        Israel: Israel / s,
                        Japan: Japan / s,
                        Sweden: Sweden / s,
                        USA: USA / s,
                        USSR: USSR / s,
                        date: date
                    }
                });
        }
    }

    async updateSubPlots() {
        await this.legend.update();
    }

    get dataPath(): string {
        return `${dataUrl}/${this.page.mode.toLowerCase()}_ranks_all.csv`
    }
}


interface StackedLineChartCache {
    clazz: Clazz;
    mode: Mode;
    scale: Scale;
    data: Array<d3.Series<StackedLineChartDataObj, Nation>>;
}

type StackedLineChartData = Array<StackedLineChartRow>;

interface StackedLineChartRow {
    date: Date;
    nation: Nation;
    value: number;
}

interface StackedLineChartDataObj {
    date: Date;
    USA: number;
    Germany: number;
    USSR: number;
    Britain: number;
    Japan: number;
    France: number;
    Italy: number;
    China: number;
    Sweden: number;
    Israel: number
}
