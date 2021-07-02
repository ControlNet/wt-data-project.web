import * as d3 from "d3";
import * as _ from "lodash";
import { Plot } from "./plot";
import { TimeseriesData, TimeseriesRow, TimeseriesRowGetter } from "../data/timeseries-data";
import { categoricalColors, COLORS, CONT_COLORS, MousePosition, utils } from "../utils";
import { ColorBar } from "./color-bar";
import { BRLineChart, BRLineChartDataObj } from "./line-chart";
import { Legend } from "./legend";
import { Table } from "./table";
import { BRRange, Clazz, Measurement, Mode } from "../data/options";
import { Tooltip } from "./tooltip";

export class BrHeatmap extends Plot {
    colorBar: ColorBar;
    lineChart: BRLineChart;
    legend: Legend;
    table: Table;

    selected: Array<SquareInfo> = [];

    private tooltip: Tooltip;

    async updateSubPlots() {
        await this.table.update();
        await this.lineChart.update();
        await this.legend.update();
    }

    async resetSubPlots() {
        await this.table.reset();
        await this.lineChart.reset();
        await this.legend.update();
    }

    get mouseleaveEvent(): () => void{
        const self = this;
        return function(): void {
            d3.select(this).style("stroke", "black");
            self.tooltip.hide();
        };
    }

    get mouseoverEvent(): (d: SquareInfo) => void {
        const self = this;
        return function(d: SquareInfo): void {
            d3.select(this).style("stroke", "white");
            self.tooltip.appear();
            self.tooltip.rect
                .transition()
                .duration(100)
                .style("fill", self.value2color(d.value));
        }
    }

    get mousemoveEvent(): (d: SquareInfo) => void {
        const self = this;
        return async function(d: SquareInfo): Promise<void> {
            const mousePos = new MousePosition(
                d3.mouse(this)[0],
                d3.mouse(this)[1]
            );
            await self.tooltip.update([
                `Nation: ${d.nation}`,
                `BR: ${d.br}`,
                `${self.measurement}: ${_.round(d.value, 3)}`
            ], mousePos);
        }
    }

    get clickEvent(): () => void {
        const self = this;
        return async function(): Promise<void> {
            const square: d3.Selection<SVGRectElement, SquareInfo, HTMLElement, any> = d3.select(this);
            const info: SquareInfo = square.data()[0];

            if (utils.rgbToHex(square.style("fill")).toUpperCase() === COLORS.AZURE) {
                // if the square is selected
                square.style("fill", self.value2color(info.value));
                // remove the item in the `this.selected`
                self.selected = self.selected.filter(each => each.br !== info.br || each.nation !== info.nation);
            } else {
                // if the square is not selected
                square.style("fill", COLORS.AZURE);
                // add the item into the `this.selected`
                self.selected.push(info);
            }
            await self.updateSubPlots()
        }
    }

    cache: TimeseriesData;
    value2color: Value2Color;

    colorPool = {
        values: utils.deepCopy(categoricalColors),
        i: 0,

        bindings: new Array<{ br: string, nation: string, color: string }>(),

        get: function(d: BRLineChartDataObj) {
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

    init(colorBar: ColorBar, lineChart: BRLineChart, legend: Legend, table: Table): BrHeatmap {
        this.colorBar = colorBar;
        this.lineChart = lineChart;
        this.legend = legend;
        this.table = table;

        // build new plot in the content div of page
        this.svg = d3.select<HTMLDivElement, unknown>("#content")
            .append<SVGSVGElement>("svg")
            .attr("height", this.svgHeight)
            .attr("width", this.svgWidth)
            .attr("id", "main-svg");

        // init mouse tooltip
        this.tooltip = new Tooltip(
            this.svg, 0.8, 3, 120, -30, -35, -25, -20
        ).init();

        // init the heatmap plot body
        this.g = this.svg.append<SVGGElement>("g")
            .attr("id", "main-g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        d3.csv(this.dataPath, async (data: TimeseriesData) => {
            // init
            const dataObjs = this.extractData(data)
            const squareWidth = this.width / utils.nations.length;
            const squareHeight = this.height / utils.brs[this.brRange].length;
            // build axis
            const {x, y} = this.buildAxis();

            // init the color bar, line chart and legend
            this.colorBar.init();
            this.lineChart.init();
            this.legend.init();
            this.table.init();

            // colorMap function
            this.value2color = await this.getValue2color();

            // add heat squares
            this.g.selectAll()
                .data(dataObjs)
                .enter()
                .append<SVGRectElement>("rect")
                .attr("x", d => x(d.nation))
                .attr("y", d => y(d.br))
                .attr("width", squareWidth)
                .attr("height", squareHeight)
                .style("fill", d => this.value2color(d.value))
                .style("stroke-width", 1)
                .style("stroke", "black")
                .on("mouseover", this.mouseoverEvent)
                .on("mouseleave", this.mouseleaveEvent)
                .on("mousemove", this.mousemoveEvent)
                .on("click", this.clickEvent);

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
                this.updateSquares(data)
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
        const rects = this.g.selectAll("rect")
            .data(dataObjs);

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
            .domain(utils.nations);

        this.g.append("g")
            .attr("id", "br-heatmap-x")
            .style("font-size", 13)
            .attr("transform", `translate(0, ${this.height + 10})`)
            .call(d3.axisBottom(x).tickSize(0))
            .select("#main-g g path.domain").remove()

        // y-axis
        const y = d3.scaleBand()
            .range([this.height, 0])
            .domain(utils.brs[this.brRange]);

        this.g.append("g")
            .attr("id", "br-heatmap-y")
            .style("font-size", 15)
            .attr("transform", `translate(-5, 0)`)
            .call(d3.axisLeft(y).tickSize(0))
            .select("#main-g g path.domain").remove()
        return {x, y};
    }

    private extractData(data: Array<TimeseriesRow>): Array<SquareInfo> {
        return data.filter(row => row.date === this.date && row.cls === this.clazz)
            .map(row => {
                const get = new TimeseriesRowGetter(row, this.mode, this.measurement);
                return {
                    nation: row.nation,
                    br: get.br,
                    lowerBr: get.lowerBr,
                    value: get.value
                }
            });
    }

    private async getValue2color(): Promise<Value2Color> {
        let value2range: d3.ScaleLinear<number, number>;
        let range2color: d3.ScaleLinear<string, string>;
        let valueMin: number;
        let valueMax: number;

        switch (this.measurement) {
            case "win_rate":
                valueMin = 0;
                valueMax = 100;

                value2range = d3.scaleLinear<number, number>()
                    .domain([valueMin, valueMax])
                    .range([0, 1]);

                if (this.clazz === "Ground_vehicles") {
                    range2color = d3.scaleLinear<string, string>()
                        .domain([0, 0.05, 0.4, 0.5, 0.6, 0.95, 1.0])
                        .range([CONT_COLORS.WHITE, CONT_COLORS.BLACK, CONT_COLORS.RED, CONT_COLORS.YELLOW, CONT_COLORS.GREEN, CONT_COLORS.BLACK, CONT_COLORS.BLACK])
                        .interpolate(d3.interpolateHcl)
                } else if (this.clazz === "Aviation") {
                    range2color = d3.scaleLinear<string, string>()
                        .domain([0, 0.01, 0.5, 0.6, 0.7, 0.99, 1.0])
                        .range([CONT_COLORS.WHITE, CONT_COLORS.BLACK, CONT_COLORS.RED, CONT_COLORS.YELLOW, CONT_COLORS.GREEN, CONT_COLORS.BLACK, CONT_COLORS.BLACK])
                        .interpolate(d3.interpolateHcl)
                }
                break;
            case "battles_sum":
                valueMin = Math.pow(10, 2.5);
                valueMax = Math.pow(10, 5.5);

                value2range = d3.scaleLog()
                    .domain([valueMin, valueMax])
                    .range([0, 1]);

                range2color = d3.scaleLinear<string, string>()
                    .domain([0, 0.01, 0.4, 0.5, 0.6, 0.99, 1.0])
                    .range([CONT_COLORS.WHITE, CONT_COLORS.BLACK, CONT_COLORS.RED, CONT_COLORS.YELLOW, CONT_COLORS.GREEN, CONT_COLORS.BLACK])
                    .interpolate(d3.interpolateHcl)
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
        return `https://raw.githubusercontent.com/ControlNet/wt-data-project.data/master/${this.mode.toLowerCase()}_ranks_${this.brRange}.csv`
    }

    get date(): string {
        return utils.getSelectedValue("date-selection");
    }

    get clazz(): Clazz {
        return utils.getSelectedValue("class-selection");
    }

    get mode(): Mode {
        return utils.getSelectedValue("mode-selection");
    }

    get measurement(): Measurement {
        return utils.getSelectedValue("measurement-selection");
    }

    get brRange(): BRRange {
        return utils.getSelectedValue("br-range-selection");
    }
}

export interface SquareInfo {
    nation: string;
    br: string;
    lowerBr: number;
    value: number;
}

export interface Value2Color {
    (value: number): number | string | COLORS
}
