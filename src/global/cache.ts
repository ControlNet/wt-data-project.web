import type { BrRange, Clazz, Measurement, Mode } from "@/types/options";
import type { TimeseriesData } from "@/types/alias";

import * as d3 from "d3";
import { getTimeseriesDataPath } from "@/utils/urls";
import type { Value2Color } from "@/utils/colorHelper";
import { getValue2color } from "@/utils/colorHelper";

export class CachePool<K, T> {
    private _data: Map<string, T> = new Map();
    private readonly genData: (key: K) => Promise<T>;
    private readonly keyToString: (key: K) => string;

    constructor(genData: (key: K) => Promise<T>, keyToString: (key: K) => string) {
        this.genData = genData;
        this.keyToString = keyToString;
    }

    async get(key: K): Promise<T> {
        const stringKey = this.keyToString(key);
        if (!this._data.has(stringKey)) {
            this._data.set(stringKey, await this.genData(key));
        }
        return this._data.get(stringKey)!;
    }
}

export const timeseriesCache = new CachePool<{mode: Mode, brRange: BrRange}, TimeseriesData>(
    async key => {
        return await d3.csv(getTimeseriesDataPath(key.mode, key.brRange));
    }, key => {
        return key.mode + key.brRange;
    }
);

export const value2colorCache = new CachePool<{measurement: Measurement, clazz: Clazz}, { valueMin: number, valueMax: number, value2color: Value2Color }>(
    async key => {
        return await getValue2color(key.measurement, key.clazz)
    }, key => {
        return key.measurement + key.clazz;
    }
)