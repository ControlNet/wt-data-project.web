import * as d3 from "d3";
import { Injectable } from "../utils";
import { Margin } from "../app/config";

@Injectable
export abstract class Plot {
    readonly svgHeight: number;
    readonly svgWidth: number;
    readonly margin: Margin;
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
    g: d3.Selection<SVGGElement, unknown, HTMLElement, any>

    abstract init(...args: any[]): Plot;

    abstract update(...args: any[]): Promise<Plot>;

    get width() {
        return this.svgWidth - this.margin.left - this.margin.right;
    }

    get height() {
        return this.svgHeight - this.margin.top - this.margin.bottom;
    }
}
