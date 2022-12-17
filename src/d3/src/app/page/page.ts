import * as d3 from "d3";
import { Plot } from "../../plot/plot";
import { NavTab } from "../nav-tab";
import { Injectable } from "../../utils";

@Injectable
export abstract class Page extends NavTab {
    plot: Plot;

    init(): void {
        this.navbar
            .append<HTMLLIElement>("li")
            .append("a")
            .attr("id", this.id)
            .attr("href", `#${this.id}`)
            .classed("page-tab", true)
            .html(this.name)
            .on("click", () => this.update.call(this))
    }

    abstract update(): void;

    removeOld(): void {
        // remove old plot
        d3.select("#sidebar").html("");
        d3.select("#content").html("");
    }
}

export type PageClass<T extends Page> = { new(...args: any[]): T };
