import * as d3 from "d3";
import * as _ from "lodash";
import { MousePosition } from "../utils";
import { Plot } from "./plot";

export class Tooltip extends Plot {
    readonly parentSvg: d3.Selection<SVGSVGElement, any, HTMLElement, unknown>;
    readonly opacity: number;
    readonly nRow: number;
    readonly rectWidth: number;
    readonly rectXBias: number;
    readonly rectYBias: number;
    readonly textXBias: number;
    readonly textYBias: number;
    g: d3.Selection<SVGGElement, any, HTMLElement, unknown>;
    rect: d3.Selection<SVGRectElement, any, HTMLElement, unknown>;
    text: d3.Selection<SVGTextElement, any, HTMLElement, unknown>;

    constructor(
        parentSvg: d3.Selection<SVGSVGElement, any, HTMLElement, unknown>, opacity: number,
        nRow: number, width: number,
        rectXBias: number, rectYBias: number,
        textXBias: number, textYBias: number
    ) {
        super(null, null, null);
        this.parentSvg = parentSvg;
        this.opacity = opacity;
        this.nRow = nRow;
        this.rectWidth = width;
        this.rectXBias = rectXBias;
        this.rectYBias = rectYBias;
        this.textXBias = textXBias;
        this.textYBias = textYBias;
    }

    init(): Tooltip {
        // init tooltip g element
        this.g = this.parentSvg.append<SVGGElement>("g")
            .attr("class", "tooltip")
            .style("opacity", 0);

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
            .map((n) => this.text.append("tspan").attr("class", `tooltip-text-row${n + 1}`))
        return this;
    }

    // move the tooltip to the top layer of parent svg.
    toTopLayer(): Tooltip {
        this.parentSvg.node().appendChild(this.g.node());
        return this;
    }

    // update rect
    updateRect(mousePos: MousePosition): Tooltip {
        const x = mousePos.x < 130 ? mousePos.x + this.rectXBias + 150 : mousePos.x + this.rectXBias;
        const y = mousePos.y < 40 ? mousePos.y + this.rectYBias + 70 : mousePos.y + this.rectYBias;
        this.rect
            .attr("x", x)
            .attr("y", y);
        return this;
    }

    // update text with new position and new string
    updateText(textArr: Array<string>, mousePos: MousePosition): Tooltip {
        textArr.forEach((line, i) => {
            const x = mousePos.x < 130 ? this.textXBias + mousePos.x + 150 : this.textXBias + mousePos.x
            const y = mousePos.y < 40 ? this.textYBias + mousePos.y + 15 * i + 70 : this.textYBias + mousePos.y + 15 * i;
            this.text
                .select(`.tooltip-text-row${i + 1}`)
                .text(line)
                .attr("x", x + "px")
                .attr("y", y + "px")
                .attr("text-anchor", "left");
        });
        return this;
    }

    update(textArr: Array<string>, mousePos: MousePosition): Promise<Tooltip> {
        this.updateRect(mousePos);
        this.updateText(textArr, mousePos);
        return Promise.resolve(this);
    }

    hide(): Tooltip {
        this.g.style("opacity", 0)
        return this;
    }

    appear(): Tooltip {
        this.g.style("opacity", 1)
        return this;
    }

}