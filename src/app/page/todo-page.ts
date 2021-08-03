import { Page } from "./page";
import * as d3 from "d3";
import * as marked from "marked";
import { Inject, Singleton } from "../../utils";
import { Localization } from "../config";


@Singleton(TodoPage)
export class TodoPage extends Page {
    readonly id = "todo-list";
    @Inject(Localization.Navbar.TodoList) readonly name = "Todo List";

    update(): void {
        // remove old content of previous page
        this.removeOld();
        d3.text("https://wt.controlnet.space/README.md", function(md) {
            d3.select("#content")
                .html(marked(md))
                .html(d3.select("div#todo-list-section").html())
        })
    }
}