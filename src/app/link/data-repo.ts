import { Link } from "./link";
import { Singleton } from "../../utils";

@Singleton(DataRepo)
export class DataRepo extends Link {
    readonly id = "data-repo";
    readonly name = "Data";
    readonly url = "https://github.com/ControlNet/wt-data-project.data";
}