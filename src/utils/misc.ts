import * as d3 from "d3";
import type { SquareInfo, TimeseriesRow } from "@/types/dataTypes";

export function getSelectedValue<T extends string = string>(id: string): T {
    return <T>(<HTMLSelectElement>document.getElementById(id)).value;
}

export const setEvent = {
    byIds(...elementIds: Array<string>) {
        const elements = elementIds.map(id => document.getElementById(id));
        return {
            onchange: (event: () => void) => {
                return elements.forEach(element => {
                    if (element) {
                        element.onchange = event;
                    }
                })
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
    const samples = linspace(start, end, n);
    return samples.map((x: number) => 10 ** x);
}

export function formatPower(d: number) {
    const prefix = d < 0 ? "⁻" : "";
    const number = (d + "").split("").map(function (c: string) {
        return "⁰¹²³⁴⁵⁶⁷⁸⁹"[+c];
    }).join("");
    return prefix + number;
}

export function rgbToHex(rgb: string) {
    // rgb(x, y, z)
    const color = rgb.match(/\d+/g);
    let hex = "#";

    if (color === null && rgb.startsWith("#")) {
        return rgb;
    } else if (color === null) {
        console.log("Invalid color format");
        return "#000000";
    }
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
            newArr.push(deepCopy(value));
        })
        return <T>newArr;
    } else if (typeof obj === "object") {
        const newObj: any = {};
        Object.entries(obj).forEach(([key, value]) => {
            newObj[key] = deepCopy(value);
        })
        return <T>newObj;
    } else {
        return obj;
    }
}

// find the closest value in ordered array
// using binary search
export function findClosest(array: Array<number>, target: number): number {
    const n = array.length;

    if (target <= array[0])
        return array[0];
    if (target >= array[n - 1])
        return array[n - 1];

    function getClosest(val1: number, val2: number) {
        if (target - val1 >= val2 - target)
            return val2;
        else
            return val1;
    }

    // Doing binary search
    let low = 0, high = n, mid = 0;
    while (low < high) {
        mid = Math.floor((low + high) / 2)
        if (array[mid] === target)
            return array[mid];
        if (target < array[mid]) {
            if (mid > 0 && target > array[mid - 1])
                return getClosest(array[mid - 1], array[mid]);
            high = mid;
        } else {
            if (mid < n - 1 && target < array[mid + 1])
                return getClosest(array[mid], array[mid + 1]);
            low = mid + 1;
        }
    }
    return array[mid];
}

export function eventWrapper<S extends SVGRectElement | SVGSVGElement, T extends (d: SquareInfo, node: S)
    => void | Promise<void>>(thisBinding: unknown, cb: T): (this: S, d: SquareInfo, i: number, n: S[]) => void {
    return (d, i, n) =>
        // https://stackoverflow.com/questions/27746304/how-to-check-if-an-object-is-a-promise/27760489#27760489
        Promise.resolve((cb.bind(thisBinding) as T)(d, n[i])).then(() => {
        });
}

type RGBColor = { r: number, g: number, b: number };

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex: string): RGBColor | null {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function color2brightness(hex: string): number {
    const rgb = hexToRgb(hex);
    if (rgb === null) {
        return 0;
    } else {
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    }
}

export function genTextColorFromBgColor(bgColor: string): string {
    return color2brightness(bgColor) > 125 ? "black" : "white";
}


// object chain map and forEach
interface ObjGetter {
    (...layers: Array<string>): any
}

interface ChainMapLayer {
    (...getValues: Array<ObjGetter>): Array<Array<string>>
}

export class ObjChainMap {
    readonly getObj: Array<ObjGetter> = [];

    get length(): number {
        return this.getObj.length;
    }

    addLayer(getter: ObjGetter) {
        this.getObj.push(getter);
        return this;
    }

    static chainMapLayer2(getValue0: ObjGetter): Array<Array<string>> {
        return Object.keys(getValue0()).map(layer1 => {
            return [layer1]
        })
    }

    static chainMapLayer3(getValue0: ObjGetter, getValue1: ObjGetter): Array<Array<string>> {
        return ObjChainMap.chainMapLayer2(getValue0).map(([layer1]) => {
            return Object.keys(getValue1(layer1)).map(layer2 => {
                return [layer1, layer2]
            })
        }).flat(1)
    }

    static chainMapLayer4(getValue0: ObjGetter, getValue1: ObjGetter, getValue2: ObjGetter): Array<Array<string>> {
        return ObjChainMap.chainMapLayer3(getValue0, getValue1).map(([layer1, layer2]) => {
            return Object.keys(getValue2(layer1, layer2)).map(layer3 => {
                return [layer1, layer2, layer3]
            });
        }).flat(1)
    }

    static objChainMapFunc: { [length: number]: ChainMapLayer } = {
        2: ObjChainMap.chainMapLayer2,
        3: ObjChainMap.chainMapLayer3,
        4: ObjChainMap.chainMapLayer4
    }

    getKVs() {
        let values;
        if (this.length <= 1) {
            throw Error("Number of layers should >= 2");
        } else {
            const chainMapLayer = ObjChainMap.objChainMapFunc[this.length];
            values = chainMapLayer(...this.getObj)
                .map(layers => [layers, this.getObj[this.length - 1](...layers)])
        }
        return values;
    }

    map<T>(func: (layers: Array<string>, value: T) => T): Array<T> {
        return this.getKVs().map(([layers, value]) => func(layers, value))
    }

    forEach<T>(func: (layers: Array<string>, value: T) => T): void {
        this.getKVs().forEach(([layers, value]) => func(layers, value))
    }
}


export class MousePosition {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
