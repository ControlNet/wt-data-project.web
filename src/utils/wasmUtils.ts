import type { Measurement, Mode, Clazz } from "@/types/options";
import type { BrLineChartData, Nation, TimeseriesData } from "@/types/alias";

import * as _ from "lodash";
import type { SquareInfo } from "@/types/dataTypes";
import { parseDate } from "@/utils/misc";
import { TimeseriesRowGetter } from "@/utils/getter/timeseriesData";

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
                date: parseDate(d.date)!,
                nation: d.nation,
                br: get.br,
                value: get.value
            }
        });
    }
}