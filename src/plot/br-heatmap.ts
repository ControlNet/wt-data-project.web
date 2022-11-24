import * as d3 from "d3";
import * as _ from "lodash";
import { Plot } from "./plot";
import { TimeseriesData, TimeseriesRow, TimeseriesRowGetter } from "../data/timeseries-data";
import { categoricalColors, COLORS, CONT_COLORS, Container, Inject, MousePosition, Provider, utils } from "../utils";
import { ColorBar } from "./color-bar";
import { BrLineChart, BrLineChartDataObj } from "./line-chart";
import { BrHeatmapLegend } from "./legend";
import { Table } from "./table";
import { BrHeatmapTooltip, Tooltip } from "./tooltip";
import { Config, Localization, Margin, MeasurementTranslator, NationTranslator } from "../app/config";
import { brs, Content, dataUrl, nations } from "../app/global-env";
import { BRHeatMapPage } from "../app/page/br-heatmap-page";
import { Nation } from "../data/wiki-data";
import { BrHeatColorMap } from "../misc/color-map-def";


@Provider(BrHeatmap)
export class BrHeatmap extends Plot {
    @Inject(Config.BrHeatmapPage.BrHeatmap.svgHeight) readonly svgHeight: number;
    @Inject(Config.BrHeatmapPage.BrHeatmap.svgWidth) readonly svgWidth: number;
    @Inject(Config.BrHeatmapPage.BrHeatmap.margin) readonly margin: Margin;
    @Inject(Config.BrHeatmapPage.BrHeatmap.mainSvgId) readonly mainSvgId: string;
    @Inject(ColorBar) readonly colorBar: ColorBar;
    @Inject(BrLineChart) readonly lineChart: BrLineChart;
    @Inject(BrHeatmapLegend) readonly legend: BrHeatmapLegend;
    @Inject(Table) readonly table: Table;
    @Inject(BrHeatmapTooltip) readonly tooltip: Tooltip;
    @Inject(Content) readonly content: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>
    @Inject(BRHeatMapPage) readonly page: BRHeatMapPage;
    @Inject(BrHeatColorMap) readonly colorMaps: BrHeatColorMap;

    selected: Array<SquareInfo> = [];

    async updateSubPlots() {
        await this.table.update();
        await this.lineChart.update();
        await this.legend.update();
    }

    async resetSubPlots() {
        this.table.reset();
        this.lineChart.reset();
        await this.legend.update();
    }

    static eventWrapper<S extends SVGRectElement | SVGSVGElement, T extends (d: SquareInfo, node: S) => void | Promise<void>>(cb: T)
    : (this: S, d: SquareInfo, i: number, n: S[]) => void {
        return (d, i, n) =>
            // https://stackoverflow.com/questions/27746304/how-to-check-if-an-object-is-a-promise/27760489#27760489
            Promise.resolve((cb.bind(this) as T)(d, n[i])).then(() => {});
    }

    onPointerLeave(_: SquareInfo, node: SVGRectElement): void {
        d3.select(node).style("stroke", "black");
        this.tooltip.hide();
    }

    onPointerOver(d: SquareInfo, node: SVGRectElement): void {
        d3.select(node).style("stroke", "white");
        this.tooltip.appear();
        this.tooltip.rect
            .transition()
            .duration(100)
            .style("fill", this.value2color(d.value));
    }

    async onPointerMove(d: SquareInfo, node: SVGRectElement): Promise<void> {
        await this.tooltip.update([
            `${Container.get(Localization.BrHeatmapPage.Tooltip.nation)}${Container.get<NationTranslator>(Localization.Nation)(d.nation)}`,
            `${Container.get(Localization.BrHeatmapPage.Tooltip.br)}${d.br}`,
            `${Container.get<MeasurementTranslator>(Localization.Measurement)(this.page.measurement)}: ${_.round(d.value, 3)}`
        ], new MousePosition(
            d3.mouse(node)[0],
            d3.mouse(node)[1]
        ));
    }

    async onClick(_: SquareInfo, node: SVGRectElement): Promise<void> {
        const square: d3.Selection<SVGRectElement, SquareInfo, HTMLElement, any> = d3.select(node);
        const info: SquareInfo = square.data()[0];

        if (utils.rgbToHex(square.style("fill")).toUpperCase() === COLORS.AZURE) {
            // if the square is selected
            square.style("fill", this.value2color(info.value));
            // remove the item in the `this.selected`
            this.selected = this.selected.filter(each => each.br !== info.br || each.nation !== info.nation);
        } else {
            // if the square is not selected
            square.style("fill", COLORS.AZURE);
            // add the item into the `this.selected`
            this.selected.push(info);
        }
        await this.updateSubPlots();
    }

    cache: TimeseriesData;
    value2color: Value2Color;

    colorPool = {
        values: utils.deepCopy(categoricalColors),
        i: 0,

        bindings: new Array<{ br: string, nation: string, color: string }>(),

        get: function(d: BrLineChartDataObj) {
            // if the category is generated before, use previous color
            for (const binding of this.bindings) {
                if (binding.br === d.br && binding.nation === d.nation) {
                    return binding.color;
                }
            }
            // else assign a new color to the nation
            const out = this.values[this.i];
            this.i++;
            if (this.i === this.values.length) {
                this.i = 0;
            }

            // add to binding
            this.bindings.push({
                nation: d.nation,
                br: d.br,
                color: out
            })
            return out;
        },
    }

    init(): BrHeatmap {
        // build new plot in the content div of page
        this.svg = this.content
            .append<SVGSVGElement>("svg")
            .attr("height", this.svgHeight)
            .attr("width", this.svgWidth)
            .attr("id", this.mainSvgId);

        // init the heatmap plot body
        this.g = this.svg.append<SVGGElement>("g")
            .attr("id", "main-g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        d3.csv(this.dataPath, async (data: TimeseriesData) => {
            // init
            const dataObjs = this.extractData(data)
            const squareWidth = this.width / nations.length;
            const squareHeight = this.height / brs[this.page.brRange].length;
            // build axis
            const {x, y} = this.buildAxis();

            // init the color bar, line chart, legend, table and tooltip
            this.colorBar.init();
            this.lineChart.init();
            this.legend.init();
            this.table.init();
            this.tooltip.init();

            // colorMap function
            this.value2color = await this.getValue2color();

            // add heat squares
            this.g.selectAll()
                .data(dataObjs, d => d.nation + d.lowerBr)
                .enter()
                .append<SVGRectElement>("rect")
                .attr("x", d => x(d.nation))
                .attr("y", d => y(d.br))
                .attr("width", squareWidth)
                .attr("height", squareHeight)
                .style("fill", d => this.value2color(d.value))
                .style("stroke-width", 1)
                .style("stroke", "black")
                .on("pointerover", BrHeatmap.eventWrapper<SVGRectElement, typeof this.onPointerOver>(this.onPointerOver))
                .on("pointerleave", BrHeatmap.eventWrapper<SVGRectElement, typeof this.onPointerLeave>(this.onPointerLeave))
                .on("pointermove", BrHeatmap.eventWrapper<SVGRectElement, typeof this.onPointerMove>(this.onPointerMove))
                .on("click", BrHeatmap.eventWrapper<SVGRectElement, typeof this.onClick>(this.onClick));

            this.cache = data;

            // sort the tooltip in the top layer
            this.tooltip.toTopLayer();
        })
        return this;
    }

    async update(reDownload: boolean): Promise<BrHeatmap> {
        const oldAxis = d3.selectAll("g#br-heatmap-x, g#br-heatmap-y");

        if (reDownload) {
            // if need re-download data
            d3.csv(this.dataPath, (data: TimeseriesData) => {
                this.updateSquares(data);
                this.cache = data;
            })
        } else {
            // else read data from cache
            await this.updateSquares(this.cache);
        }

        // reset axis
        this.buildAxis();
        oldAxis.remove();
        // reset selected data and sub plots
        this.selected = [];
        await this.resetSubPlots();

        // sort the tooltip in the top layer
        this.tooltip.toTopLayer();

        return this;
    }

    private async updateSquares(data: TimeseriesData) {
        // init
        const dataObjs = this.extractData(data)

        // colorMap function
        this.value2color = await this.getValue2color();

        // change fill of squares
        const rects = this.g
            .selectAll<SVGRectElement, SquareInfo>("rect")
            .data(dataObjs, d => d.nation + d.lowerBr);

        rects.enter()
            .transition()
            .style("fill", d => this.value2color(d.value));

        rects.exit()
            .transition()
            .style("fill", COLORS.BLANK);

        rects.transition()
            .style("fill", d => this.value2color(d.value));
    }

    private buildAxis() {
        // x-axis
        const x = d3.scaleBand()
            .range([0, this.width])
            .domain(nations);

        this.g.append("g")
            .attr("id", "br-heatmap-x")
            .style("font-size", 13)
            .attr("transform", `translate(0, ${this.height + 10})`)
            .call(d3.axisBottom(x).tickSize(0)
                .tickFormat(Container.get<NationTranslator>(Localization.Nation)))
            .select("#main-g g path.domain").remove()

        // y-axis
        const y = d3.scaleBand()
            .range([this.height, 0])
            .domain(brs[this.page.brRange]);

        this.g.append("g")
            .attr("id", "br-heatmap-y")
            .style("font-size", 15)
            .attr("transform", `translate(-5, 0)`)
            .call(d3.axisLeft(y).tickSize(0))
            .select("#main-g g path.domain").remove()
        return {x, y};
    }

    private extractData(data: Array<TimeseriesRow>): Array<SquareInfo> {
        const dataObjs = data.filter(row => row.date === this.page.date && row.cls === this.page.clazz)
            .map(row => {
                const get = new TimeseriesRowGetter(row, this.page.mode, this.page.measurement);
                return {
                    nation: row.nation,
                    br: get.br,
                    lowerBr: get.lowerBr,
                    value: get.value
                }
            });

        const blankObjs: Array<SquareInfo> = [];
        nations.forEach(nation => {
            brs[this.page.brRange].forEach(br => {
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

    private async getValue2color(): Promise<Value2Color> {
        let value2range: d3.ScaleLinear<number, number>;
        let range2color: d3.ScaleLinear<string, string>;
        let valueMin: number;
        let valueMax: number;

        switch (this.page.measurement) {
            case "win_rate":
                valueMin = 0;
                valueMax = 100;

                value2range = d3.scaleLinear<number, number>()
                    .domain([valueMin, valueMax])
                    .range([0, 1]);

                if (this.page.clazz === "Ground_vehicles") {
                    range2color = d3.scaleLinear<string, string>()
                        .domain(this.colorMaps.win_rate.Ground_vehicles.percentiles)
                        .range(this.colorMaps.win_rate.Ground_vehicles.colors)
                        .interpolate(d3.interpolateHsl)
                } else if (this.page.clazz === "Aviation") {
                    range2color = d3.scaleLinear<string, string>()
                        .domain(this.colorMaps.win_rate.Aviation.percentiles)
                        .range(this.colorMaps.win_rate.Aviation.colors)
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
                    .domain(this.colorMaps.battles_sum.Ground_vehicles.percentiles)
                    .range(this.colorMaps.battles_sum.Ground_vehicles.colors)
                    .interpolate(d3.interpolateHsl)
                break;
        }

        const value2color = (value: number) => range2color(value2range(value));

        // update color bar
        await this.colorBar.update(valueMin, valueMax, value2color);

        return (value: number) => {
            if (value == 0.) {
                return COLORS.BLANK;
            } else {
                return range2color(value2range(value));
            }
        }
    }

    get dataPath(): string {
        return `${dataUrl}/${this.page.mode.toLowerCase()}_ranks_${this.page.brRange}.csv`
    }
}

export interface SquareInfo {
    nation: Nation;
    br: string;
    lowerBr: number;
    value: number;
}

export interface Value2Color {
    (value: number): number | string | COLORS
}
