import type { TimeseriesABRow, TimeseriesRBRow, TimeseriesRow, TimeseriesSBRow } from "@/types/dataTypes";
import { Getter } from "@/utils/getter/getter";
import type { Measurement, Mode } from "@/types/options";

type TimeseriesRow<T> = T extends 'ab'
    ? TimeseriesABRow
    : T extends 'rb'
        ? TimeseriesRBRow
        : T extends 'sb'
            ? TimeseriesSBRow
            : never;

export class TimeseriesRowGetter<T extends TimeseriesRow = TimeseriesRow> extends Getter {
    protected readonly data: T;
    protected readonly mode: Mode;
    private readonly measurement: Measurement;

    constructor(data: T, mode: Mode, measurement: Measurement) {
        super();
        this.data = data;
        this.mode = mode;
        this.measurement = measurement;
    }

    get value(): number {
        return +this.data[`${this.mode}_${this.measurement}`] as unknown as TimeseriesRow<typeof this.mode>;
    }

    get br(): string {
        return this.data[`${this.mode}_br`] as unknown as TimeseriesRow<typeof this.mode>;
    }

    get lowerBr(): number {
        return +this.data[`${this.mode}_lower_br`] as unknown as TimeseriesRow<typeof this.mode>;
    }
}
