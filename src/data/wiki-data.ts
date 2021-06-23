export type WikiData = Array<WikiRow>

export interface WikiRow {
    name: string
    nation: string
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