import { Inject, Injectable } from "../utils";
import { Navbar } from "./global-env";
import * as d3 from "d3";

@Injectable
export abstract class NavTab {
    abstract readonly id: string;
    abstract readonly name: string;
    abstract init(): void;
    @Inject(Navbar) navbar: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
}