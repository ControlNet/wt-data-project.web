import type { TimeseriesRow } from "@/types/dataTypes";
import { Getter } from "@/utils/getter/getter";
import type { Measurement, Mode } from "@/types/options";

export class TimeseriesRowGetter<T extends Mode> extends Getter {
    protected readonly data: TimeseriesRow<T>;
    protected readonly mode: T;
    private readonly measurement: Measurement;

    constructor(data: TimeseriesRow<T>, mode: T, measurement: Measurement) {
        super();
        this.data = data;
        this.mode = mode;
        this.measurement = measurement;
    }

    get value(): number {
        return Number(this.data[`${this.mode}_${this.measurement}` as keyof TimeseriesRow<T>]);
    }

    get br(): string {
        return String(this.data[`${this.mode}_br` as keyof TimeseriesRow<T>]);
    }

    get lowerBr(): number {
        return Number(this.data[`${this.mode}_lower_br` as keyof TimeseriesRow<T>]);
    }
}
