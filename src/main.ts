import { Application } from "./app/application";
import { BRHeatMapPage } from "./app/page/br-heatmap-page";
import { StackedAreaPage } from "./app/page/stacked-area-page";

Application.build
    .withPages(BRHeatMapPage, StackedAreaPage)
    .run();
