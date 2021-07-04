import { Application } from "../application";
import { Page } from "./page";
import * as d3 from "d3";
import { Container, Singleton, utils } from "../../utils";
import { BrHeatmap } from "../../plot/br-heatmap";


@Singleton(BRHeatMapPage)
export class BRHeatMapPage extends Page {
    plot: BrHeatmap;
    readonly id = "br-heatmap";
    readonly name = "BR HeatMap";

    update(): void {
        // remove old plot
        this.removeOld();
        // init sidebar
        const sidebar = d3.select<HTMLDivElement, unknown>("#sidebar");

        // add date selection
        const dateSelection = sidebar.append<HTMLLabelElement>("label")
            .text("Date: ")
            .append("select")
            .attr("id", "date-selection")
            .classed("br-heatmap-selection", true);

        Application.dates.forEach(date => {
            dateSelection.append<HTMLOptionElement>("option")
                .attr("value", date)
                .html(date);
        })
        // add class selection
        sidebar.append<HTMLLabelElement>("label")
            .text("Class: ")
            .append<HTMLSelectElement>("select")
            .attr("id", "class-selection")
            .classed("br-heatmap-selection", true)
            .selectAll()
            .data([
                {id: "Ground_vehicles", text: "Ground Vehicles"},
                {id: "Aviation", text: "Aviation"}
            ])
            .enter()
            .append<HTMLOptionElement>("option")
            .attr("value", d => d.id)
            .attr("selected", d => d.id === "Ground_vehicles" ? "selected" : undefined)
            .html(d => d.text);

        // add mode selection for measurement
        sidebar.append<HTMLLabelElement>("label")
            .text("Mode: ")
            .append<HTMLSelectElement>("select")
            .attr("id", "mode-selection")
            .classed("br-heatmap-selection", true)
            .selectAll()
            .data([
                {id: "ab", text: "AB"},
                {id: "rb", text: "RB"},
                {id: "sb", text: "SB"}
            ])
            .enter()
            .append<HTMLOptionElement>("option")
            .attr("value", d => d.id)
            .attr("selected", d => d.id === "rb" ? "selected" : undefined)
            .html(d => d.text);

        // add measurement selection
        sidebar.append<HTMLLabelElement>("label")
            .text("Measurement: ")
            .append<HTMLSelectElement>("select")
            .attr("id", "measurement-selection")
            .classed("br-heatmap-selection", true)
            .selectAll()
            .data([
                {id: "win_rate", text: "Win Rate"},
                {id: "battles_sum", text: "Battles"}
            ])
            .enter()
            .append<HTMLOptionElement>("option")
            .attr("value", d => d.id)
            .attr("selected", d => d.id === "win_rate" ? "selected" : undefined)
            .html(d => d.text);

        // br range selection
        sidebar.append<HTMLLabelElement>("label")
            .text("BR Range: ")
            .append<HTMLSelectElement>("select")
            .attr("id", "br-range-selection")
            .classed("br-heatmap-selection", true)
            .selectAll()
            .data([
                {id: "0"},
                {id: "1"}
            ])
            .enter()
            .append<HTMLOptionElement>("option")
            .attr("value", d => d.id)
            .attr("selected", d => d.id === "1" ? "selected" : undefined)
            .html(d => d.id);

        // init main content plot, colorbar and line chart

        this.plot = Container.get(BrHeatmap);
        Container.rebind(BrHeatmap).toConstantValue(this.plot);

        this.plot.init();

        utils.setEvent.byClass("br-heatmap-selection")
            .onchange(() => this.plot.update(false));
        // override some selection forcing re-download time-series data
        utils.setEvent.byIds("mode-selection", "br-range-selection")
            .onchange(() => this.plot.update(true));
    }
}
