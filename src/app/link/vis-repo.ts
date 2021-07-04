import { Link } from "./link";
import { Singleton } from "../../utils";

@Singleton(VisRepo)
export class VisRepo extends Link {
    readonly id = "vis-repo";
    readonly name = "Visualization Repo";
    readonly url = "https://github.com/ControlNet/wt-data-project.visualization";
}
