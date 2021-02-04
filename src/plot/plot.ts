export abstract class Plot {
    svgHeight: number;
    svgWidth: number;
    margin: Margin;

    abstract update(): void;

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