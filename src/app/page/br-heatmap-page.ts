import { Application } from "../application";
import { BrHeatmap } from "../../plot/br-heatmap";
import { Page } from "./page";
import * as d3 from "d3";
import { utils } from "../../utils";

export class BRHeatMapPage extends Page {
    plot: BrHeatmap;
    id = "br-heatmap";
    name = "BR HeatMap";

    update(): void {
        // remove old plot
        d3.select("#sidebar").selectAll("*").remove();
        d3.select("#content").selectAll("*").remove();
        // init sidebar
        const sidebar = d3.select("#sidebar");

        // add date selection
        const dateSelection = sidebar.append("label")
            .text("Date: ")
            .append("select")
            .attr("id", "date-selection")
            .classed("br-heatmap-selection", true);

        Application.dates.forEach(date => {
            dateSelection.append("option")
                .attr("value", date)
                .html(date);
        })
        // add class selection
        sidebar.append("label")
            .text("Class: ")
            .append("select")
            .attr("id", "class-selection")
            .classed("br-heatmap-selection", true)
            .selectAll()
            .data([
                {id: "Ground_vehicles", text: "Ground Vehicles"},
                {id: "Aviation", text: "Aviation"}
            ])
            .enter()
            .append("option")
            .attr("value", d => d.id)
            .attr("selected", d => d.id === "Ground_vehicles" ? "selected" : undefined)
            .html(d => d.text);

        // add mode selection for measurement
        sidebar.append("label")
            .text("Mode: ")
            .append("select")
            .attr("id", "mode-selection")
            .classed("br-heatmap-selection", true)
            .selectAll()
            .data([
                {id: "ab", text: "AB"},
                {id: "rb", text: "RB"},
                {id: "sb", text: "SB"}
            ])
            .enter()
            .append("option")
            .attr("value", d => d.id)
            .attr("selected", d => d.id === "rb" ? "selected" : undefined)
            .html(d => d.text);

        // add measurement selection
        sidebar.append("label")
            .text("Measurement: ")
            .append("select")
            .attr("id", "measurement-selection")
            .classed("br-heatmap-selection", true)
            .selectAll()
            .data([
                {id: "win_rate", text: "Win Rate"},
                {id: "battles_sum", text: "Battles"}
            ])
            .enter()
            .append("option")
            .attr("value", d => d.id)
            .attr("selected", d => d.id === "win_rate" ? "selected" : undefined)
            .html(d => d.text);

        // br range selection
        sidebar.append("label")
            .text("BR Range: ")
            .append("select")
            .attr("id", "br-range-selection")
            .classed("br-heatmap-selection", true)
            .selectAll()
            .data([
                {id: "0"},
                {id: "1"}
            ])
            .enter()
            .append("option")
            .attr("value", d => d.id)
            .attr("selected", d => d.id === "1" ? "selected" : undefined)
            .html(d => d.id);

        // init main content plot
        const margin = {top: 20, right: 30, bottom: 30, left: 100};
        this.plot = new BrHeatmap(800, 600, margin);
        utils.setEvent.byClass("br-heatmap-selection")
            .onchange(() => this.plot.update(false));
        // override some selection forcing re-download time-series data
        utils.setEvent.byIds("mode-selection", "br-range-selection")
            .onchange(() => this.plot.update(true));
    }
}

export type BRRange = "0" | "1";

export type Measurement = "win_rate" | "battles_sum";