import { Link } from "./link";
import { Inject, Singleton } from "../../utils";
import { Localization } from "../config";

@Singleton(DataRepo)
export class DataRepo extends Link {
    @Inject(Localization.Navbar.DataRepo) readonly name: string;
    readonly id = "data-repo";
    readonly url = "https://github.com/ControlNet/wt-data-project.data";
}