import type { TimeseriesABRow, TimeseriesRBRow, TimeseriesRow, TimeseriesSBRow } from "@/types/dataTypes";
import { Getter } from "@/utils/getter/getter";
import type { Measurement, Mode } from "@/types/options";

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
        switch (this.mode) {
            case "ab":
                const abData = <TimeseriesABRow><unknown>this.data;
                switch (this.measurement) {
                    case "win_rate":
                        return +abData.ab_win_rate;
                    case "battles_sum":
                        return +abData.ab_battles_sum;
                }
                break;
            case "rb":
                const rbData = <TimeseriesRBRow><unknown>this.data;
                switch (this.measurement) {
                    case "win_rate":
                        return +rbData.rb_win_rate;
                    case "battles_sum":
                        return +rbData.rb_battles_sum;
                }
                break;
            case "sb":
                const sbData = <TimeseriesSBRow><unknown>this.data;
                switch (this.measurement) {
                    case "win_rate":
                        return +sbData.sb_win_rate;
                    case "battles_sum":
                        return +sbData.sb_battles_sum;
                }
                break;
        }
    }

    get br(): string {
        switch (this.mode) {
            case "ab":
                return (<TimeseriesABRow><unknown>this.data).ab_br;
            case "rb":
                return (<TimeseriesRBRow><unknown>this.data).rb_br;
            case "sb":
                return (<TimeseriesSBRow><unknown>this.data).sb_br;
        }
    }

    get lowerBr(): number {
        switch (this.mode) {
            case "ab":
                return +(<TimeseriesABRow><unknown>this.data).ab_lower_br;
            case "rb":
                return +(<TimeseriesRBRow><unknown>this.data).rb_lower_br;
            case "sb":
                return +(<TimeseriesSBRow><unknown>this.data).sb_lower_br;
        }
    }
}
