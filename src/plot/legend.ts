import * as d3 from "d3";
import { Plot } from "./plot";
import { BrHeatmap, SquareInfo } from "./br-heatmap";
import { Config, Margin } from "../app/config";
import { Container, Inject, Provider } from "../utils";


@Provider(Legend)
export class Legend extends Plot {
    @Inject(Config.BrHeatmapPage.Legend.svgHeight) readonly svgHeight: number;
    @Inject(Config.BrHeatmapPage.Legend.svgWidth) readonly svgWidth: number;
    @Inject(Config.BrHeatmapPage.Legend.margin) readonly margin: Margin;

    init(): Legend {
        // build new plot in the content div of page
        this.svg = d3.select<HTMLDivElement, unknown>("#content")
            .append<SVGSVGElement>("svg")
            .attr("height", this.svgHeight)
            .attr("width", this.svgWidth)
            .attr("id", "legend-svg");
        this.g = this.svg.append<SVGGElement>("g")
            .attr("id", "legend-g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        return this;
    }

    async update(): Promise<Legend> {
        const legends = this.g.selectAll<SVGGElement, SquareInfo>("g")
            .data(this.brHeatmap.selected, (info: SquareInfo) => info.nation + info.br);

        const height = this.height;
        const brHeatmap = this.brHeatmap;
        const g = this.g;

        // removed legend
        legends.exit()
            .each(function(d: SquareInfo, i: number) {
                d3.selectAll(g.selectAll<SVGGElement, unknown>("g.legend-row").nodes().slice(i + 1))
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

        // new legend
        legends.enter()
            .append<SVGGElement>("g")
            .classed("legend-row", true)
            .each(function(d: SquareInfo, i: number) {
                // add rect
                d3.select(this)
                    .append<SVGRectElement>("rect")
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
                    .append<SVGTextElement>("text")
                    .attr("x", 35)
                    .attr("y", height - 15 - 30 * i)
                    .text(`${d.nation} ${d.br}`)
                    .attr("text-anchor", "start")
                    .style("font-size", 12.5);
            })

        return await new Promise(resolve => resolve(this));
    }

    get brHeatmap(): BrHeatmap {
        return Container.get(BrHeatmap);
    }

    async reset(): Promise<Plot> {
        this.g.html(null)
        return await new Promise(resolve => resolve(this));
    }
}