import * as d3 from "d3";
import { NavTab } from "../nav-tab";

export abstract class Link extends NavTab {
    abstract readonly url: string;

    init(): void {
        d3.select<HTMLDivElement, unknown>("#navbar")
            .append("li")
            .append("a")
            .attr("id", this.id)
            .attr("href", this.url)
            .classed("link-tab", true)
            .html(this.name)
    }

}


export type LinkClass<T extends Link> = { new(...args: any[]): T };
