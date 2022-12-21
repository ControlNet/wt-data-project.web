import type { Nation } from "@/types/alias";
import type { Clazz, Mode } from "@/types/options";

export interface Getter {
    data: Gettable;
    mode: Mode;
}

export interface Gettable {
}


export interface WikiRow {
    name: string
    nation: Nation
    cls: string
    ab_br: number
    rb_br: number
    sb_br: number
    ab_repair: number
    rb_repair: number
    sb_repair: number
    is_premium: boolean
    ab_rp_rate: number
    ab_sl_rate: number
    rb_rp_rate: number
    rb_sl_rate: number
    sb_rp_rate: number
    sb_sl_rate: number
}

export interface TsRow {
    name: string
    ab_battles: number
    ab_win_rate: number
    ab_air_frags_per_battle: number
    ab_air_frags_per_death: number
    ab_ground_frags_per_battle: number
    ab_ground_frags_per_death: number
    rb_battles: number
    rb_win_rate: number
    rb_air_frags_per_battle: number
    rb_air_frags_per_death: number
    rb_ground_frags_per_battle: number
    rb_ground_frags_per_death: number
    sb_battles: number
    sb_win_rate: number
    sb_air_frags_per_battle: number
    sb_air_frags_per_death: number
    sb_ground_frags_per_battle: number
    sb_ground_frags_per_death: number
    alt_name: string
}

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

export interface JoinedRow extends TsRow, WikiRow {
    wk_name: string
}

export interface TimeseriesCol {
    nation: string
    detail: Array<TimeseriesRow>
}

export interface SquareInfo {
    nation: Nation;
    br: string;
    lowerBr: number;
    value: number;
}

interface BrLineChartRow {
    date: Date;
    br: string;
    nation: Nation;
    value: number;
}

export interface BrLineChartDataObj {
    br: string;
    nation: Nation;
    values: Array<{ date: Date, value: number }>
}