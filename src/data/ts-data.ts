export type TsData = Array<TsRow>

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