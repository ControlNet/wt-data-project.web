import { NavTab } from "../nav-tab";
import { Singleton } from "../../utils";

@Singleton(Logo)
export class Logo extends NavTab {
    readonly id: string = "nav-logo";
    readonly name: string = null;
    readonly image: string = "/img/logo64.png";

    init(): void {
        this.navbar
            .append<HTMLLIElement>("li")
            .append("img")
            .attr("id", this.id)
            .attr("src", this.image)
            .classed("image-tab", true);
    }
}

export type LogoClass = { new(...args: any[]): Logo };
