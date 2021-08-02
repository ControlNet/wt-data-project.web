import { NavTab } from "../nav-tab"
import { Injectable } from "../../utils";

@Injectable
export abstract class Link extends NavTab {
    abstract readonly url: string;

    init(): void {
        this.navbar
            .append<HTMLLIElement>("li")
            .append("a")
            .attr("id", this.id)
            .attr("href", this.url)
            .classed("link-tab", true)
            .html(this.name)
    }

}


export type LinkClass<T extends Link> = { new(...args: any[]): T };
