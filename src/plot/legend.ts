import * as d3 from "d3";
import { Margin, Plot } from "./plot";
import { BrHeatmap, SquareInfo } from "./br-heatmap";

export class Legend extends Plot {
    brHeatmap: BrHeatmap;

    constructor(brHeatmap: BrHeatmap, svgHeight: number, svgWidth: number, margin: Margin) {
        super(svgHeight, svgWidth, margin);
        this.brHeatmap = brHeatmap;
    }

    init(): Plot {
        // build new plot in the content div of page
        this.svg = d3.select("#content")
            .append("svg")
            .attr("height", this.svgHeight)
            .attr("width", this.svgWidth)
            .attr("id", "legend-svg");
        this.g = this.svg.append("g")
            .attr("id", "legend-g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        return this;
    }

    async update(): Promise<Plot> {
        const legends = this.g.selectAll("g")
            .data(this.brHeatmap.selected, (info: SquareInfo) => info.nation + info.br);

        const height = this.height;
        const brHeatmap = this.brHeatmap;
        const g = this.g;

        legends.exit()
            .each(function(d: SquareInfo, i: number) {
                d3.selectAll(g.selectAll("g.legend-row").nodes().slice(i + 1))
                    .each(function() {
                        const obj = d3.select(this);
                        const rect = obj.select("rect");
                        const text = obj.select("text");
                        rect.transition().duration(500).attr("y", +rect.attr("y") + 30);
                        text.transition().duration(500).attr("y", +text.attr("y") + 30);
                    })
            })
            .transition()
            .duration(500)
            .style("opacity", 0)
            .remove()


        legends.enter()
            .append("g")
            .classed("legend-row", true)
            .each(function(d: SquareInfo, i: number) {
                // add rect
                d3.select(this)
                    .append("rect")
                    .classed("legend-rect", true)
                    .attr("x", 5)
                    .attr("y", height - 30 - 30 * i)
                    .attr("width", 20)
                    .attr("height", 20)
                    .style("fill", brHeatmap.colorPool.bindings.filter(binding => {
                        return binding.br === d.br && binding.nation === d.nation
                    })[0].color);
                // add text
                d3.select(this)
                    .append("text")
                    .attr("x", 35)
                    .attr("y", height - 15 - 30 * i)
                    .text(`${d.nation} ${d.br}`)
                    .attr("text-anchor", "start")
                    .style("font-size", 12.5);
            })

        return await new Promise(resolve => resolve(this));
    }
}