import {Application} from "./app/application";
import {BRHeatMapPage, StackedAreaPage} from "./app/page";

Application.build
    .withPages(BRHeatMapPage, StackedAreaPage)
    .run();
