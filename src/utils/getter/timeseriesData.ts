import type { TimeseriesABRow, TimeseriesRBRow, TimeseriesRow, TimeseriesSBRow } from "@/types/dataTypes";
import { Getter } from "@/utils/getter/getter";
import type { Measurement, Mode } from "@/types/options";

// currently useless since the value of `TimeseriesRowGetter.mode` haven't been specialized
// https://github.com/ControlNet/wt-data-project.web/pull/10#discussion_r1054797252
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
        return Number((this.data as unknown as TimeseriesRow<typeof this.mode>)[`${this.mode}_${this.measurement}`]);
    }

    get br(): string {
        return String((this.data as unknown as TimeseriesRow<typeof this.mode>)[`${this.mode}_br`]);
    }

    get lowerBr(): number {
        return Number((this.data as unknown as TimeseriesRow<typeof this.mode>)[`${this.mode}_lower_br`]);
    }
}
