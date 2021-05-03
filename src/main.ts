import { Application } from "./app/application";
import { BRHeatMapPage } from "./app/page/br-heatmap-page";
import { StackedAreaPage } from "./app/page/stacked-area-page";
import { VisRepo } from "./app/link/vis-repo";
import { WebRepo } from "./app/link/web-repo";
import { DataRepo } from "./app/link/data-repo";
import { GithubLink } from "./app/link/github-link";

Application.build
    .withPages(BRHeatMapPage, StackedAreaPage)
    .withLinks(WebRepo, DataRepo, VisRepo, GithubLink)
    .class
    .run()
