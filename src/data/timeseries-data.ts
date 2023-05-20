import { Gettable, Getter } from "./getter";
import { Clazz, Measurement, Mode } from "../app/options";
import { Nation } from "./wiki-data";

export type TimeseriesData<T extends TimeseriesRow = TimeseriesRow> = Array<T>;

export interface TimeseriesRow extends Gettable {
    nation: Nation
    cls: Clazz
    date: string
}

export interface TimeseriesABRow extends TimeseriesRow {
    ab_br: string
    ab_lower_br: number
    ab_battles_sum: number
    ab_battles_mean: number
    ab_win_rate: number
    ab_air_frags_per_battle: number
    ab_air_frags_per_death: number
    ab_ground_frags_per_battle: number
    ab_ground_frags_per_death: number
}

export interface TimeseriesRBRow extends TimeseriesRow {
    rb_br: string
    rb_lower_br: number
    rb_battles_sum: number
    rb_battles_mean: number
    rb_win_rate: number
    rb_air_frags_per_battle: number
    rb_air_frags_per_death: number
    rb_ground_frags_per_battle: number
    rb_ground_frags_per_death: number
}

export interface TimeseriesSBRow extends TimeseriesRow {
    sb_br: string
    sb_lower_br: number
    sb_battles_sum: number
    sb_battles_mean: number
    sb_win_rate: number
    sb_air_frags_per_battle: number
    sb_air_frags_per_death: number
    sb_ground_frags_per_battle: number
    sb_ground_frags_per_death: number
}

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
                    case "air_frags_per_battle":
                        return +abData.ab_air_frags_per_battle;
                    case "air_frags_per_death":
                        return +abData.ab_air_frags_per_death;
                    case "ground_frags_per_battle":
                        return +abData.ab_ground_frags_per_battle;
                    case "ground_frags_per_death":
                        return +abData.ab_ground_frags_per_death;
                }
                break;
            case "rb":
                const rbData = <TimeseriesRBRow><unknown>this.data;
                switch (this.measurement) {
                    case "win_rate":
                        return +rbData.rb_win_rate;
                    case "battles_sum":
                        return +rbData.rb_battles_sum;
                    case "air_frags_per_battle":
                        return +rbData.rb_air_frags_per_battle;
                    case "air_frags_per_death":
                        return +rbData.rb_air_frags_per_death;
                    case "ground_frags_per_battle":
                        return +rbData.rb_ground_frags_per_battle;
                    case "ground_frags_per_death":
                        return +rbData.rb_ground_frags_per_death;
                }
                break;
            case "sb":
                const sbData = <TimeseriesSBRow><unknown>this.data;
                switch (this.measurement) {
                    case "win_rate":
                        return +sbData.sb_win_rate;
                    case "battles_sum":
                        return +sbData.sb_battles_sum;
                    case "air_frags_per_battle":
                        return +sbData.sb_air_frags_per_battle;
                    case "air_frags_per_death":
                        return +sbData.sb_air_frags_per_death;
                    case "ground_frags_per_battle":
                        return +sbData.sb_ground_frags_per_battle;
                    case "ground_frags_per_death":
                        return +sbData.sb_ground_frags_per_death;
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
