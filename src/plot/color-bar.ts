import * as d3 from "d3";
import { Plot } from "./plot";
import { BrHeatmap, Value2Color } from "./br-heatmap";
import { Container, Inject, Provider, utils } from "../utils";
import { Config, Margin } from "../app/config";
import { Content } from "../app/global-env";
import { BRHeatMapPage } from "../app/page/br-heatmap-page";


@Provider(ColorBar)
export class ColorBar extends Plot {
    @Inject(Config.BrHeatmapPage.ColorBar.svgHeight) readonly svgHeight: number;
    @Inject(Config.BrHeatmapPage.ColorBar.svgWidth) readonly svgWidth: number;
    @Inject(Config.BrHeatmapPage.ColorBar.margin) readonly margin: Margin;
    @Inject(Content) readonly content: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>
    @Inject(BRHeatMapPage) readonly page: BRHeatMapPage;
    valueMin: number;
    valueMax: number;
    value2color: Value2Color;

    init(): ColorBar {
        this.svg = this.content
            .append<SVGSVGElement>("svg")
            .attr("height", this.svgHeight)
            .attr("width", this.svgWidth)
            .attr("id", "color-bar-svg");

        this.g = this.svg.append<SVGGElement>("g")
            .attr("id", "color-bar-g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
        return this;
    }

    async update(valueMin: number, valueMax: number, value2color: Value2Color): Promise<ColorBar> {
        this.valueMin = valueMin;
        this.valueMax = valueMax;
        this.value2color = value2color;

        const scale = this.page.measurement === "battles_sum" ? "log" : "linear";
        const samples = scale === "log"
            ? utils.logspace(this.valueMin, this.valueMax, 100)
            : utils.linspace(this.valueMin, this.valueMax, 100);
        const colors = samples.map(this.value2color);

        // remove current legend
        this.g.selectAll("*").remove();

        // append gradient bar
        const gradientId = `${this.svg.attr("id")}-gradient`;
        const gradient = this.g.append<SVGDefsElement>("defs")
            .append<SVGLinearGradientElement>("linearGradient")
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
            gradient.append<SVGStopElement>('stop')
                .attr('offset', pct)
                .attr('stop-color', scale)
                .attr('stop-opacity', 1);
        });

        const legendHeight = this.height;
        const legendWidth = this.width;

        this.g.append<SVGRectElement>('rect')
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
                } else if (this.page.measurement === "battles_sum") {
                    return d + "%";
                } else {
                    return d.toString();
                }
            });

        this.g.append("g")
            .style("font-size", scale === "log" ? 12 : null)
            .attr("class", "legend-axis")
            .attr("transform", "translate(" + legendWidth + ", 0)")
            .call(legendAxis);

        return this;
    }

    get brHeatmap(): BrHeatmap {
        return Container.get(BrHeatmap);
    }
}