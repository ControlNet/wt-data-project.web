import { Page, PageClass } from "./page/page";
import { Metadata } from "../data/metadata";
import * as d3 from "d3";
import { Link, LinkClass } from "./link/link";
import { Config, Localization } from "./config";
import { Container } from "../utils";
import "reflect-metadata";
import "../plot/br-heatmap";
import "../plot/color-bar";
import "../plot/line-chart";
import "../plot/legend";
import "../plot/table";
import "../plot/tooltip";
import { GlobalEnv } from "./global-env";
import "./sidebar/sidebar-element";
import "./sidebar/select";
import { Logo, LogoClass } from "./image/logo";


export class Application {
    static Logo: LogoClass;
    static logo: Logo;
    static Pages: Array<PageClass<any>>;
    static pages: Array<Page>;
    static metadata: Array<Metadata>;
    static dates: Array<string>;
    static Links: Array<LinkClass<any>>;
    static links: Array<Link>

    static run(): void {

        d3.json("https://controlnet.space/wt-data-project.data/metadata.json", async (metadata: Array<Metadata>) => {
            // init Container constants
            Container.importProvider();
            await Config.load();
            await Localization.load();
            GlobalEnv.init();

            Application.metadata = metadata;
            // initialize the dates
            Application.dates = Application.metadata
                .filter(each => each.type === "joined")
                .map(each => each.date)
                .reverse();
            // initialize the logo
            Application.logo = Container.get(Application.Logo);
            Application.logo.init();

            // initialize the pages
            Application.pages = Application.Pages.map(Container.get);
            Application.pages.forEach(page => page.init());

            // initialize the links
            Application.links = Application.Links.map(Container.get);
            Application.links.forEach(link => link.init());

            // render the first page
            Application.pages[0].update();

        })
    }

    static build = {
        withBlank() {
            return Application.build;
        },

        withLogo(Logo: LogoClass) {
            Application.Logo = Logo;
            return Application.build;
        },

        withPages(...Pages: Array<PageClass<Page>>) {
            Application.Pages = Pages;
            return Application.build;
        },

        withLinks(...Links: Array<LinkClass<Link>>) {
            Application.Links = Links;
            return Application.build;
        },

        class: Application
    }
}