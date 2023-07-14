import * as d3 from "d3";
import * as _ from "lodash";
import { Container, Inject, Injectable, MousePosition, Provider } from "../utils";
import { Plot } from "./plot";
import { Config } from "../app/config";
import { BrLineChart, LineChart } from "./line-chart";


@Injectable
export abstract class Tooltip extends Plot {
    readonly parentSvgId: string;
    readonly opacity: number;
    readonly nRow: number;
    readonly rectWidth: number;
    readonly rectXBias: number;
    readonly rectYBias: number;
    readonly textXBias: number;
    readonly textYBias: number;
    readonly leftShiftXThreshold: number;
    readonly downShiftYThreshold: number;
    readonly leftShiftOffset: number;
    readonly downShiftOffset: number;

    parentSvg: d3.Selection<SVGSVGElement, any, HTMLElement, unknown>;
    g: d3.Selection<SVGGElement, any, HTMLElement, unknown>;
    rect: d3.Selection<SVGRectElement, any, HTMLElement, unknown>;
    text: d3.Selection<SVGTextElement, any, HTMLElement, unknown>;

    init(): Tooltip {
        // select parent svg
        this.parentSvg = d3.select("#" + this.parentSvgId);

        // init tooltip g element
        this.g = this.parentSvg.append<SVGGElement>("g")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("pointer-events", "none");

        // init tooltip rect background
        this.rect = this.g.append<SVGRectElement>("rect")
            .attr("class", "tooltip-rect")
            .attr("height", 5 + this.nRow * 15)
            .attr("width", this.rectWidth)
            .attr("fill", "white")
            .style("stroke", "black")
            .style("opacity", this.opacity)
            .attr("rx", "5px")
            .attr("ry", "5px");

        // init tooltip text
        this.text = this.g.append<SVGTextElement>("text")
            .attr("class", "tooltip-text")
            .style("font-size", 12)
            .style("opacity", 0.9);

        // generate tspan for each text row
        _.range(this.nRow)
            .map((n) => this.text.append("tspan").attr("class", `tooltip-text-row${n}`));
        return this;
    }

    // move the tooltip to the top layer of parent svg.
    toTopLayer(): Tooltip {
        this.parentSvg.node().appendChild(this.g.node());
        return this;
    }

    // update rect
    updateRect(mousePos: MousePosition): Tooltip {
        const x = mousePos.x < this.leftShiftXThreshold
            ? mousePos.x + this.rectXBias + this.leftShiftOffset
            : mousePos.x + this.rectXBias;
        const y = mousePos.y < this.downShiftYThreshold
            ? mousePos.y + this.rectYBias + this.downShiftOffset
            : mousePos.y + this.rectYBias;
        this.rect.attr("x", x).attr("y", y);
        return this;
    }

    // update text with new position and new string
    updateText(textArr: Array<string>, mousePos: MousePosition): Tooltip {
        textArr.forEach((line, i) => {
            const x = mousePos.x < this.leftShiftXThreshold
                ? this.textXBias + mousePos.x + this.leftShiftOffset
                : this.textXBias + mousePos.x
            const y = mousePos.y < this.downShiftYThreshold
                ? this.textYBias + mousePos.y + 15 * i + this.downShiftOffset
                : this.textYBias + mousePos.y + 15 * i;
            this.text
                .select(`.tooltip-text-row${i}`)
                .text(line)
                .attr("x", x + "px")
                .attr("y", y + "px")
                .attr("text-anchor", "left");
        });

        _.range(textArr.length, this.nRow).forEach((i) => {
            this.text.select(`.tooltip-text-row${i}`).text("");
        })
        return this;
    }

    async update(textArr: Array<string>, mousePos: MousePosition): Promise<Tooltip> {
        this.updateRect(mousePos);
        this.updateText(textArr, mousePos);
        return this;
    }

    hide(): Tooltip {
        this.g.style("opacity", 0);
        return this;
    }

    appear(): Tooltip {
        this.g.style("opacity", 1);
        return this;
    }
}


@Provider(BrHeatmapTooltip)
export class BrHeatmapTooltip extends Tooltip {
    @Inject(Config.BrHeatmapPage.Tooltip.parentSvgId) readonly parentSvgId: string;
    @Inject(Config.BrHeatmapPage.Tooltip.opacity) readonly opacity: number;
    @Inject(Config.BrHeatmapPage.Tooltip.nRow) readonly nRow: number;
    @Inject(Config.BrHeatmapPage.Tooltip.rectWidth) readonly rectWidth: number;
    @Inject(Config.BrHeatmapPage.Tooltip.rectXBias) readonly rectXBias: number;
    @Inject(Config.BrHeatmapPage.Tooltip.rectYBias) readonly rectYBias: number;
    @Inject(Config.BrHeatmapPage.Tooltip.textXBias) readonly textXBias: number;
    @Inject(Config.BrHeatmapPage.Tooltip.textYBias) readonly textYBias: number;
    @Inject(Config.BrHeatmapPage.Tooltip.leftShiftXThreshold) readonly leftShiftXThreshold: number;
    @Inject(Config.BrHeatmapPage.Tooltip.downShiftYThreshold) readonly downShiftYThreshold: number;
    @Inject(Config.BrHeatmapPage.Tooltip.leftShiftOffset) readonly leftShiftOffset: number;
    @Inject(Config.BrHeatmapPage.Tooltip.downShiftOffset) readonly downShiftOffset: number;
}

@Provider(LineChartTooltip)
export class LineChartTooltip extends Tooltip {
    @Inject(Config.BrHeatmapPage.LineChartTooltip.parentSvgId) readonly parentSvgId: string;
    @Inject(Config.BrHeatmapPage.LineChartTooltip.opacity) readonly opacity: number;
    @Inject(Config.BrHeatmapPage.LineChartTooltip.nRow) readonly nRow: number;
    @Inject(Config.BrHeatmapPage.LineChartTooltip.rectWidth) readonly rectWidth: number;
    @Inject(Config.BrHeatmapPage.LineChartTooltip.rectXBias) readonly rectXBias: number;
    @Inject(Config.BrHeatmapPage.LineChartTooltip.rectYBias) readonly rectYBias: number;
    @Inject(Config.BrHeatmapPage.LineChartTooltip.textXBias) readonly textXBias: number;
    @Inject(Config.BrHeatmapPage.LineChartTooltip.textYBias) readonly textYBias: number;
    @Inject(Config.BrHeatmapPage.LineChartTooltip.leftShiftXThreshold) readonly leftShiftXThreshold: number;
    @Inject(Config.BrHeatmapPage.LineChartTooltip.downShiftYThreshold) readonly downShiftYThreshold: number;
    @Inject(Config.BrHeatmapPage.LineChartTooltip.leftShiftOffset) readonly leftShiftOffset: number;
    @Inject(Config.BrHeatmapPage.LineChartTooltip.downShiftOffset) readonly downShiftOffset: number;

    line: d3.Selection<SVGLineElement, any, HTMLElement, unknown>;

    init(): Tooltip {
        super.init();
        this.line = this.g.append("line")
            .classed("tooltip", true)
            .classed("tooltip-line", true)
            .attr("y1", 0)
            .attr("y2", this.parent.height)
            .attr("x1", 150)
            .attr("x2", 150)
            .style("stroke", "black")
            .style("opacity", 0);
        return this;
    }

    async update(textArr: Array<string>, mousePos: MousePosition): Promise<Tooltip> {
        await super.update(textArr, mousePos);
        const newRow = textArr.length;
        this.rect.attr("height", 5 + newRow * 15);
        this.g.attr("transform", `translate(0, ${-15 * newRow + 20})`);
        this.line.attr("transform", `translate(0, ${15 * newRow - 10})`)
        this.line.attr("x1", mousePos.x + this.rectXBias + 163)
            .attr("x2", mousePos.x + this.rectXBias + 163);
        return this;
    }

    get parent(): LineChart {
        return Container.get(BrLineChart);
    }

    hide(): Tooltip {
        super.hide();
        this.line.style("opacity", 0);
        return this;
    }

    appear(): Tooltip {
        super.appear();
        this.line.style("opacity", 1);
        return this;
    }
}
