import { Page } from "./page";
import * as d3 from "d3"

export class StackedAreaPage extends Page {
    id = "stacked-area";
    name = "Trends";

    update(): void {
        // remove old plot
        d3.select("#sidebar").selectAll("*").remove();
        d3.select("#content").selectAll("*").remove();
    }
}