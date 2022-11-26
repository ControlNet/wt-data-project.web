import * as d3 from "d3";
import { buildProviderModule, fluentProvide, provide } from "inversify-binding-decorators";
import { interfaces, interfaces as inversifyInterfaces } from "inversify/lib/interfaces/interfaces";
import { Container as InvContainer, inject, injectable } from "inversify";
import { Nation } from "./data/wiki-data";
import * as _ from "lodash";
import { Clazz, Measurement, Mode } from "./app/options";
import { SquareInfo } from "./plot/br-heatmap";
import { TimeseriesData, TimeseriesRowGetter } from "./data/timeseries-data";
import { BrLineChartData } from "./plot/line-chart";

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

    // find closest value in ordered array
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
            Promise.resolve((cb.bind(thisBinding) as T)(d, n[i])).then(() => {});
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

export const nationColors: Map<Nation, COLORS> = new Map(<Array<[Nation, COLORS]>>Object.entries({
    Britain: COLORS.BLUE,
    China: COLORS.ORANGE,
    France: COLORS.AZURE,
    Germany: COLORS.GRAY,
    Italy: COLORS.GREEN,
    Israel: COLORS.BLACK,
    Japan: COLORS.PURPLE,
    Sweden: COLORS.YELLOW,
    USA: COLORS.SKY,
    USSR: COLORS.RED
}))

// Colors for continuous values
export enum CONT_COLORS {
    RED = "#D11141",
    YELLOW = "#FFC425",
    GREEN = "#00b159",
    BLACK = "#2B2B2B",
    WHITE = "#FFFFFF"
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

export class WasmUtils {
    static wasm: {
        extract_data(data_cls: Uint8Array, data_nation: Uint8Array, data_br: Float32Array,
            selected_nation: Uint8Array, selected_br: Float32Array, clazz: number): Uint32Array;
    };

    static async init() {
        WasmUtils.wasm = await import("wasm-utils");
    }

    static clazz2int(clazz: Clazz): number {
        return +(clazz === "Aviation");
    }

    static nation2int(nation: Nation): number {
        switch (nation) {
            case "USA":
                return 0;
            case "Germany":
                return 1;
            case "USSR":
                return 2;
            case "Britain":
                return 3;
            case "Japan":
                return 4;
            case "France":
                return 5;
            case "Italy":
                return 6;
            case "China":
                return 7;
            case "Sweden":
                return 8;
            case "Israel":
                return 9;
        }
    }

    static measurement2int(measurement: Measurement): number {
        switch (measurement) {
            case "win_rate":
                return 0;
            case "battles_sum":
                return 1;
        }
    }

    static extractData(data: TimeseriesData, selected: Array<SquareInfo>, clazz: Clazz, mode: Mode, measurement: Measurement): BrLineChartData {
        // transpose columns from data
        const dataCls = new Uint8Array(data.map(d => WasmUtils.clazz2int(d.cls)));
        const dataNation = new Uint8Array(data.map(d => WasmUtils.nation2int(d.nation)));
        const dataBr = new Float32Array(data.map(d => {
            const get = new TimeseriesRowGetter(d, mode, measurement);
            return get.lowerBr;
        }));
        // transpose columns from selected
        const selectedNation = new Uint8Array(selected.map(d => WasmUtils.nation2int(d.nation)));
        const selectedBr = new Float32Array(selected.map(d => {
            return parseFloat(_.split(d.br, " ~ ")[0])
        }));

        // get filtered indexes
        const filteredIndexes = WasmUtils.wasm.extract_data(dataCls, dataNation, dataBr, selectedNation, selectedBr,
            WasmUtils.clazz2int(clazz));

        return Array.from(filteredIndexes).map(i => data[i]).map(d => {
            const get = new TimeseriesRowGetter(d, mode, measurement);
            return {
                date: utils.parseDate(d.date),
                nation: d.nation,
                br: get.br,
                value: get.value
            }
        });
    }
}
