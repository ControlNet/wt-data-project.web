export type TimeseriesData<T extends TimeseriesRow = TimeseriesRow> = Array<T>;

export interface TimeseriesRow {
    nation: string
    cls: string
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

