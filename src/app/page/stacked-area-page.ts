import { Page } from "./page";

export class StackedAreaPage extends Page {
    id = "stacked-area";
    name = "Trends";

    update(): void {
        // remove old plot
        this.removeOld();
    }
}