import { Link } from "./link";
import { Singleton } from "../../utils";

@Singleton(GithubLink)
export class GithubLink extends Link {
    readonly id = "github";
    readonly name = "by ControlNet";
    readonly url = "https://github.com/ControlNet";
}