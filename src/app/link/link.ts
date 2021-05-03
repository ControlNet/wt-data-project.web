import * as d3 from "d3";
import { NavTab } from "../nav-tab";

export abstract class Link extends NavTab {
    abstract url: string;

    init(): void {
        console.log(this.id);
        console.log(this.url);

        d3.select("#navbar")
            .append("li")
            .append("a")
            .attr("id", this.id)
            .attr("href", this.url)
            .html(this.name)
    }

}


export type LinkClass<T extends Link> = { new(...args: any[]): T };
