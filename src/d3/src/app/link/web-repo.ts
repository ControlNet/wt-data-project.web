import { Link } from "./link";
import { Inject, Singleton } from "../../utils";
import { Localization } from "../config";

@Singleton(WebRepo)
export class WebRepo extends Link {
    @Inject(Localization.Navbar.WebRepo) readonly name = "GitHub";
    readonly id = "web-repo";
    readonly url = "https://github.com/ControlNet/wt-data-project.web";
}