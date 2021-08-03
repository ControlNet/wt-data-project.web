import { Link } from "./link";
import { Inject, Singleton } from "../../utils";
import { Localization } from "../config";

@Singleton(GithubLink)
export class GithubLink extends Link {
    @Inject(Localization.Navbar.Github) readonly name: string;
    readonly id = "github";
    readonly url = "https://github.com/ControlNet";
}