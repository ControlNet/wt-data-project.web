import * as d3 from "d3";
import { Plot } from "./plot";
import { TimeseriesData, TimeseriesRow } from "../data/timeseries-data";
import { COLORS, utils } from "../utils";

export class BrHeatmap extends Plot {
    svgHeight = 800;
    svgWidth = 600;
    margin = {top: 20, right: 30, bottom: 30, left: 100};
    mouseoverEvent = function() {
        d3.select(this).style("stroke", "white");
    };

    mouseleaveEvent = function() {
        d3.select(this).style("stroke", "black");
    };


    constructor() {
        super();
        // build new plot in the content div of page
        const div = d3.select("#content");
        const svg = div.append("svg")
            .attr("height", this.svgHeight)
            .attr("width", this.svgWidth)
            .attr("id", "main-svg");
        const heatmap = svg.append("g")
            .attr("id", "main-g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        this.init();
    }

    init(): void {
        d3.csv(this.dataPath, (data: TimeseriesData) => {
            // init
            const dataObjs = this.extractData(data)
            const heatmap = d3.select("#main-g");
            const squareWidth = this.width / utils.nations.length;
            const squareHeight = this.height / utils.brs.length;
            // build axis
            const {x, y} = this.buildAxis(heatmap);

            // colorMap function
            const value2color = this.getValue2color();

            // TODO: tooltip

            // add heat squares
            heatmap.selectAll()
                .data(dataObjs)
                .enter()
                .append("rect")
                .attr("x", d => x(d.nation))
                .attr("y", d => y(d.br))
                .attr("width", squareWidth)
                .attr("height", squareHeight)
                .style("fill", d => value2color(d.value))
                .style("stroke-width", 1)
                .style("stroke", "black")
                .on("mouseover", this.mouseoverEvent)
                .on("mouseleave", this.mouseleaveEvent)

        })
    }

    update() {
        d3.csv(this.dataPath, (data: TimeseriesData) => {
            // init
            const dataObjs = this.extractData(data)
            const heatmap = d3.select("#main-g");
            const squareWidth = this.width / utils.nations.length;
            const squareHeight = this.height / utils.brs.length;

            // select old axis
            const oldAxis = heatmap.selectAll("g#br-heatmap-x, g#br-heatmap-y");

            // build new axis
            const {x, y} = this.buildAxis(heatmap);

            // remove old axis
            oldAxis.remove();

            // colorMap function
            const value2color = this.getValue2color();

            // change fill of squares
            heatmap.selectAll("rect")
                .data(dataObjs)
                .transition()
                .style("fill", d => value2color(d.value));

        })
    }

    private buildAxis(heatmap: any) {
        // x-axis
        const x = d3.scaleBand()
            .range([0, this.width])
            .domain(utils.nations);

        heatmap.append("g")
            .attr("id", "br-heatmap-x")
            .style("font-size", 13)
            .attr("transform", `translate(0, ${this.height + 10})`)
            .call(d3.axisBottom(x).tickSize(0))
            .select("#main-g g path.domain").remove()

        // y-axis
        const y = d3.scaleBand()
            .range([this.height, 0])
            .domain(utils.brs);

        heatmap.append("g")
            .attr("id", "br-heatmap-y")
            .style("font-size", 15)
            .attr("transform", `translate(-5, 0)`)
            .call(d3.axisLeft(y).tickSize(0))
            .select("#main-g g path.domain").remove()
        return {x, y};
    }

    private extractData(data: Array<TimeseriesRow>) {
        return data.filter(row => row.date === this.date)
            .map(row => {
                return {
                    nation: row.nation,
                    br: this.getBr(row),
                    value: this.getValue(row)
                }
            });
    }

    private getValue(row: TimeseriesRow): number {
        // @ts-ignore
        return row[`${this.mode}_${this.measurement}`]
    }

    private getBr(row: TimeseriesRow): string {
        // @ts-ignore
        return row[`${this.mode}_br`]
    }

    private getValue2color() {
        let value2range: d3.ScaleLinear<number, number, never>;
        let range2color: d3.ScaleLinear<number, number, never>;

        switch (this.measurement) {
            case "win_rate":
                value2range = d3.scaleLinear()
                    .domain([0, 100])
                    .range([0, 1]);

                if (this.clazz === "Ground_vehicles") {
                    range2color = d3.scaleLinear()
                        .domain([0, 0.05, 0.4, 0.5, 0.6, 0.95, 1.0])
                        // @ts-ignore
                        .range([COLORS.WHITE, COLORS.BLACK, COLORS.RED, COLORS.YELLOW, COLORS.GREEN, COLORS.BLACK, COLORS.BLACK])
                        // @ts-ignore
                        .interpolate(d3.interpolateHcl)
                } else if (this.clazz === "Aviation") {
                    range2color = d3.scaleLinear()
                        .domain([0, 0.01, 0.5, 0.6, 0.7, 0.99, 1.0])
                        // @ts-ignore
                        .range([COLORS.WHITE, COLORS.BLACK, COLORS.RED, COLORS.YELLOW, COLORS.GREEN, COLORS.BLACK, COLORS.BLACK])
                        // @ts-ignore
                        .interpolate(d3.interpolateHcl)
                }

                break;
            case "battles_sum":
                value2range = d3.scaleLog()
                    .domain([Math.pow(10, 2.5), Math.pow(10, 5.5)])
                    .range([0, 1]);

                range2color = d3.scaleLinear()
                    .domain([0, 0.01, 0.4, 0.5, 0.6, 0.99, 1.0])
                    // @ts-ignore
                    .range([COLORS.WHITE, COLORS.BLACK, COLORS.RED, COLORS.YELLOW, COLORS.GREEN, COLORS.BLACK])
                    // @ts-ignore
                    .interpolate(d3.interpolateHcl)
                break;
        }

        // TODO: add color bar

        return (value: number) => {
            if (value === 0) {
                return COLORS.GRAY;
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

    get clazz(): string {
        console.log("HERE")
        return utils.getSelectedValue("class-selection");
    }

    get mode(): string {
        console.log("HERE")
        return utils.getSelectedValue("mode-selection");
    }

    get measurement(): string {
        console.log("HERE")
        return utils.getSelectedValue("measurement-selection");
    }

    get brRange(): string {
        console.log("HERE")
        return utils.getSelectedValue("br-range-selection");
    }

}