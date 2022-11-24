import { Inject, Singleton } from "../../utils";
import { Link } from "./link";
import { Localization } from "../config";
import * as d3 from "d3";

@Singleton(Forum)
export class Forum extends Link {
    @Inject(Localization.Navbar.Forum) readonly name: string;
    readonly id = "forum";
    readonly url = "https://github.com/ControlNet/wt-data-project.web/discussions";

    init() {
        super.init();
        d3.select(`#${this.id}`)
            .html(`${this.name}<span class="new-tag">NEW</span>`)
    }
}
