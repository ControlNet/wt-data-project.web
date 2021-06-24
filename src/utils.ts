import * as d3 from "d3";

export namespace utils {
    export function getSelectedValue<T extends string = string>(id: string): T {
        return <T>(<HTMLSelectElement>document.getElementById(id)).value;
    }

    export const setEvent = {
        byIds(...elementIds: Array<string>) {
            const elements = elementIds.map(id => document.getElementById(id));
            return {
                onchange: (event: () => void) => {
                    return elements.forEach(element => element.onchange = event)
                }
            }
        },

        byClass(className: string) {
            const elements = <Array<HTMLElement>>Array.from(document.getElementsByClassName(className));
            return {
                onchange: (event: () => void) => {
                    return elements.forEach(element => element.onchange = event)
                }
            }
        }
    }

    export const nations = ["USA", "Germany", "USSR", "Britain", "Japan", "France", "Italy", "China", "Sweden"];
    export const brs = {
        "1": ['1.0 ~ 2.0', '1.3 ~ 2.3', '1.7 ~ 2.7', '2.0 ~ 3.0', '2.3 ~ 3.3', '2.7 ~ 3.7',
            '3.0 ~ 4.0', '3.3 ~ 4.3', '3.7 ~ 4.7', '4.0 ~ 5.0', '4.3 ~ 5.3', '4.7 ~ 5.7',
            '5.0 ~ 6.0', '5.3 ~ 6.3', '5.7 ~ 6.7', '6.0 ~ 7.0', '6.3 ~ 7.3', '6.7 ~ 7.7',
            '7.0 ~ 8.0', '7.3 ~ 8.3', '7.7 ~ 8.7', '8.0 ~ 9.0', '8.3 ~ 9.3', '8.7 ~ 9.7',
            '9.0 ~ 10.0', '9.3 ~ 10.3', '9.7 ~ 10.7', '10.0 ~ 11.0', '10.3 ~ 11.3', '10.7 ~ 11.7',
            '11.0 ~ 12.0'
        ],
        "0": ['1.0', '1.3', '1.7', '2.0', '2.3', '2.7', '3.0', '3.3', '3.7', '4.0', '4.3', '4.7', '5.0', '5.3', '5.7',
            '6.0', '6.3', '6.7', '7.0', '7.3', '7.7', '8.0', '8.3', '8.7', '9.0', '9.3', '9.7', '10.0', '10.3', '10.7',
            '11.0'
        ]
    };

    export function isNotNull(x: any) {
        return x !== null && x !== undefined;
    }

    export function linspace(start: number, end: number, n: number) {
        const out = [];
        const delta = (end - start) / (n - 1);

        let i = 0;
        while (i < (n - 1)) {
            out.push(start + (i * delta));
            i++;
        }

        out.push(end);
        return out;
    }

    export function logspace(start: number, end: number, n: number) {
        start = Math.log10(start);
        end = Math.log10(end);
        const samples = this.linspace(start, end, n);
        return samples.map((x: number) => 10 ** x);
    }

    export function formatPower(d: number) {
        const prefix = d < 0 ? "⁻" : "";
        const number = (d + "").split("").map(function(c: string) {
            return "⁰¹²³⁴⁵⁶⁷⁸⁹"[+c];
        }).join("");
        return prefix + number;
    }

    export function rgbToHex(rgb: string) {
        // rgb(x, y, z)
        const color = rgb.match(/\d+/g);
        let hex = "#";

        for (let i = 0; i < 3; i++) {
            hex += ("0" + Number(color[i]).toString(16)).slice(-2);
        }
        return hex;
    }

    export const parseDate = d3.timeParse("%Y-%m-%d")

    // an implementation for deep copy
    export function deepCopy<T extends Object | Array<any>>(obj: T): T {
        if (Array.isArray(obj)) {
            const newArr: Array<any> = [];
            obj.forEach(value => {
                newArr.push(this.deepCopy(value));
            })
            return <T>newArr;
        } else if (typeof obj === "object") {
            const newObj: any = {};
            Object.entries(obj).forEach(([key, value]) => {
                newObj[key] = this.deepCopy(value);
            })
            return <T>newObj;
        } else {
            return obj;
        }
    }
}

export enum COLORS {
    GREEN = "#C3E88D",
    YELLOW = "#FFCB6B",
    RED = "#F07178",
    BLUE = "#82AAFF",
    PURPLE = "#C792EA",
    ORANGE = "#F78C6C",
    AZURE = "#467CDA",
    SKY = "#89DDFF",
    BLACK = "#2B2B2B",
    GRAY = "#616161",
    WHITE = "#EEFFFF",
    BLANK = "#FFFFFF"
}

export const categoricalColors = [
    COLORS.GREEN, COLORS.YELLOW, COLORS.RED, COLORS.BLUE,
    COLORS.PURPLE, COLORS.ORANGE, COLORS.AZURE, COLORS.SKY,
    COLORS.GRAY
];

// Colors for continuous values
export enum CONT_COLORS {
    RED = "#d11141",
    YELLOW = "#ffc425",
    GREEN = "#00b159",
    BLACK = "#2B2B2B",
    WHITE = "#EEFFFF"
}

