import { Inject, Singleton } from "../../utils";
import { Link } from "./link";
import { Localization } from "../config";

@Singleton(GithubIssue)
export class GithubIssue extends Link {
    @Inject(Localization.Navbar.Issues) readonly name: string;
    readonly id = "issues";
    readonly url = "https://github.com/ControlNet/wt-data-project.web/issues";
}