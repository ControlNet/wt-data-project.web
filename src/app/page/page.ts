import * as d3 from "d3";
import { Plot } from "../../plot/plot";
import { NavTab } from "../nav-tab";

export abstract class Page extends NavTab {
    plot: Plot;

    init(): void {
        d3.select("#navbar")
            .append("li")
            .append("a")
            .attr("id", this.id)
            .attr("href", `#${this.id}`)
            .html(this.name)
            .on("click", this.update)
    }

    abstract update(): void;
}

export type PageClass<T extends Page> = { new(...args: any[]): T };
