import { Page } from "./page";
import { Singleton } from "../../utils";


@Singleton(StackedAreaPage)
export class StackedAreaPage extends Page {
    readonly id = "stacked-area";
    readonly name = "Trends";

    update(): void {
        // remove old plot
        this.removeOld();
    }
}