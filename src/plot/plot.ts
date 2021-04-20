export abstract class Plot {
    svgHeight: number;
    svgWidth: number;
    margin: Margin;
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
    g: d3.Selection<SVGGElement, unknown, HTMLElement, any>

    constructor(svgHeight: number, svgWidth: number, margin: Margin) {
        this.svgHeight = svgHeight;
        this.svgWidth = svgWidth;
        this.margin = margin;
    }

    abstract init(...args: any[]): Plot;

    abstract update(...args: any[]): Plot;

    get width() {
        return this.svgWidth - this.margin.left - this.margin.right;
    }

    get height() {
        return this.svgHeight - this.margin.top - this.margin.bottom;
    }
}

export class Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}