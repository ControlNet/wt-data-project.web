import * as d3 from "d3";
import {Metadata} from "../data/metadata";

export class Heatmap {
    static svgHeight = 800;
    static svgWidth = 1600;
    static margin = {top: 20, right: 100, bottom: 30, left: 45};
    static width = Heatmap.svgWidth - Heatmap.margin.left - Heatmap.margin.right;
    static height = Heatmap.svgHeight - Heatmap.margin.top - Heatmap.margin.bottom;

    constructor(metadata: Metadata) {
        // build new plots in the content div of page
        const div = d3.select("#content");
        const svg = div.append("svg")
            .attr("height", Heatmap.svgHeight)
            .attr("width", Heatmap.svgWidth)
            .attr("id", "main-svg");
        const heatmap = svg.append("g")
            .attr("id", "main-g")
            .attr("transform", `translate(${Heatmap.margin.left}, ${Heatmap.margin.top})`);

        d3.csv(metadata.path, data => {
            console.log(data);
        })
    }
}