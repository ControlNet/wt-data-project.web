import * as d3 from "d3";
import { buildProviderModule, fluentProvide, provide } from "inversify-binding-decorators";
import { interfaces, interfaces as inversifyInterfaces } from "inversify/lib/interfaces/interfaces";
import { inject, Container as InvContainer, injectable } from "inversify";

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

export class MousePosition {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

// IOC containers
export function Singleton(serviceIdentifier: inversifyInterfaces.ServiceIdentifier<any>) {
    return fluentProvide(serviceIdentifier).inSingletonScope().done();
}
export const Provider = provide;
export const Inject = inject;
export const Injectable = injectable();


export class Container {
    static container: InvContainer = new InvContainer();

    static importProvider() {
        Container.container.load(buildProviderModule());
    }

    static get<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T {
        return Container.container.get<T>(serviceIdentifier);
    };

    static rebind<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): interfaces.BindingToSyntax<T> {
        return Container.container.rebind<T>(serviceIdentifier);
    };

    static unbind<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): void {
        return Container.container.unbind(serviceIdentifier);
    };

    static bind<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): interfaces.BindingToSyntax<T> {
        return Container.container.bind<T>(serviceIdentifier);
    }
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

    static objChainMapFunc: {[length: number]: ChainMapLayer} = {
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
