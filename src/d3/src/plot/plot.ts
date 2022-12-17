import * as d3 from "d3";
import { Inject, Injectable } from "../utils";
import { Margin } from "../app/config";
import { Content } from "../app/global-env";

@Injectable
export abstract class Plot {
    readonly svgHeight: number;
    readonly svgWidth: number;
    readonly margin: Margin;
    @Inject(Content) readonly content: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>
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
