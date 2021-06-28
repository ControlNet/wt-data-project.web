import { Application } from "./app/application";
import { BRHeatMapPage } from "./app/page/br-heatmap-page";
import { StackedAreaPage } from "./app/page/stacked-area-page";
import { TodoPage } from "./app/page/todo-page";
import { WebRepo } from "./app/link/web-repo";
import { DataRepo } from "./app/link/data-repo";
import { GithubLink } from "./app/link/github-link";

Application.build
    .withPages(BRHeatMapPage, StackedAreaPage, TodoPage)
    .withLinks(WebRepo, DataRepo, GithubLink)
    .class
    .run()
