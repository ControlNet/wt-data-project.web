import * as d3 from "d3";
import {Metadata} from "../data/metadata";
import {Heatmap} from "../plots/heatmap";
import {Application} from "./application"

export abstract class Page {
    id: string;
    name: string;
    protected metadata: Metadata;

    constructor(metadata: Metadata) {
        this.metadata = metadata;
    };

    init(): void {
        d3.select("#navbar")
            .append("li")
            .append("a")
            .attr("id", this.id)
            .attr("href", `#${this.id}`)
            .html(this.name)
    }

    abstract update(): void;
}

export type PageClass<T extends Page> = { new(...args: any[]): T };

export class BRHeatMapPage extends Page {
    id = "br-heatmap";
    name = "BR HeatMap";

    update(): void {
        // remove old plots
        d3.select("#sidebar").selectAll().remove();
        d3.select("#content").selectAll().remove();
        // init sidebar
        const sidebar = d3.select("#sidebar");

        // add date selection
        const dateSelection = sidebar.append("label")
            .text("Date: ")
            .append("select")
            .attr("id", "date-selection");

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
            .selectAll()
            .data([
                {id: "Ground_vehicles", text: "Ground Vehicles"},
                {id: "Aviation", text: "Aviation"}
            ])
            .enter()
            .append("option")
            .attr("value", d => d.id)
            .html(d => d.text);

        // add measurement selection
        sidebar.append("label")
            .text("Measurement: ")
            .append("select")
            .attr("id", "measurement-selection")
            .selectAll()
            .data([
                {id: "rb_win_rate", text: "RB Win Rate"},
                {id: "rb_battles_sum", text: "RB Battles"}
            ])
            .enter()
            .append("option")
            .attr("value", d => d.id)
            .html(d => d.text);

        // init main content plots
        new Heatmap({
            type: null,
            date: null,
            path: "https://raw.githubusercontent.com/ControlNet/wt-data-project.data/master/rb_ranks_1.csv"
        });
    }
}

export class StackedAreaPage extends Page {
    id = "stacked-area";
    name = "Trends";

    update(): void {
        // remove old plots
        d3.select("#sidebar").selectAll().remove();
        d3.select("#content").selectAll().remove();
    }
}
