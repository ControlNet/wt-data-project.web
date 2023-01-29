import { Container } from "../utils";
import * as d3 from "d3";
import { Nation } from "../data/wiki-data";

export class GlobalEnv {
    static init() {
        Container.bind(Navbar).toConstantValue(navbar);
        Container.bind(Sidebar).toConstantValue(sidebar);
        Container.bind(Content).toConstantValue(content);
    }
}

export const Navbar = Symbol("Navbar");
const navbar = d3.select<HTMLDivElement, unknown>("#navbar")
export const Sidebar = Symbol("Sidebar");
const sidebar = d3.select<HTMLDivElement, unknown>("#sidebar");
export const Content = Symbol("Content");
const content = d3.select<HTMLDivElement, unknown>("#content");

export const nations: Array<Nation> = ["USA", "Germany", "USSR", "Britain", "Japan", "France", "Italy", "China", "Sweden", "Israel"];

export const brs = {
    "1": ['1.0 ~ 2.0', '1.3 ~ 2.3', '1.7 ~ 2.7', '2.0 ~ 3.0', '2.3 ~ 3.3', '2.7 ~ 3.7',
        '3.0 ~ 4.0', '3.3 ~ 4.3', '3.7 ~ 4.7', '4.0 ~ 5.0', '4.3 ~ 5.3', '4.7 ~ 5.7',
        '5.0 ~ 6.0', '5.3 ~ 6.3', '5.7 ~ 6.7', '6.0 ~ 7.0', '6.3 ~ 7.3', '6.7 ~ 7.7',
        '7.0 ~ 8.0', '7.3 ~ 8.3', '7.7 ~ 8.7', '8.0 ~ 9.0', '8.3 ~ 9.3', '8.7 ~ 9.7',
        '9.0 ~ 10.0', '9.3 ~ 10.3', '9.7 ~ 10.7', '10.0 ~ 11.0', '10.3 ~ 11.3', '10.7 ~ 11.7',
        '11.0 ~ 12.0', '11.3 ~ 12.3', '11.7 ~ 12.7', '12.0 ~ 13.0'
    ],
    "0": ['1.0', '1.3', '1.7', '2.0', '2.3', '2.7', '3.0', '3.3', '3.7', '4.0', '4.3', '4.7', '5.0', '5.3', '5.7',
        '6.0', '6.3', '6.7', '7.0', '7.3', '7.7', '8.0', '8.3', '8.7', '9.0', '9.3', '9.7', '10.0', '10.3', '10.7',
        '11.0', '11.3', '11.7', '12.0'
    ]
};

export const dataUrl = "https://controlnet.space/wt-data-project.data";
