import { Link } from "./link";
import { Singleton } from "../../utils";

@Singleton(WebRepo)
export class WebRepo extends Link {
    readonly id = "web-repo";
    readonly name = "GitHub";
    readonly url = "https://github.com/ControlNet/wt-data-project.web";
}