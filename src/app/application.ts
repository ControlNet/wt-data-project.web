import {Page, PageClass} from "./page/page";
import {Metadata} from "../data/metadata";
import d3 = require("d3");
import { Link, LinkClass } from "./link/link";

export class Application {
    static Pages: Array<PageClass<any>>;
    static pages: Array<Page>;
    static metadata: Array<Metadata>;
    static dates: Array<string>;
    static Links: Array<LinkClass<any>>;
    static links: Array<Link>

    static run(): void {
        d3.json("https://raw.githubusercontent.com/ControlNet/wt-data-project.data/master/metadata.json", metadata => {
            Application.metadata = metadata;
            // initialize the dates
            Application.dates = Application.metadata
                .filter(each => each.type === "joined")
                .map(each => each.date)
                .reverse();
            // initialize the pages
            Application.pages = Application.Pages.map(Page => new Page(Application.metadata));
            Application.pages.forEach(page => page.init());

            // initialize the links
            Application.links = Application.Links.map(TheLink => new TheLink());
            Application.links.forEach(link => link.init());

            // render the first page
            Application.pages[0].update();
        })
    }

    static build = {
        withBlank() {
            return Application.build;
        },

        withPages(...Pages: Array<PageClass<any>>) {
            Application.Pages = Pages;
            return Application.build;
        },

        withLinks(...Links: Array<LinkClass<any>>) {
            Application.Links = Links;
            return Application.build;
        },

        class: Application
    }
}