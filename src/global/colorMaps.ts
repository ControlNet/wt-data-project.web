import { CONT_COLORS } from "@/global/colors";

export class ColorMap {
    constructor(
        public name: string,
        public colors: Array<string>,
        public percentiles: Array<number>
    ) { }
}


export interface BrHeatColorMap {
    win_rate: { Aviation: ColorMap; Ground_vehicles: ColorMap };
    battles_sum: { Aviation: ColorMap; Ground_vehicles: ColorMap };
}

export const brHeatmapColorMaps: BrHeatColorMap = {
    "win_rate": {
        "Ground_vehicles": new ColorMap(
            "ground-vehicles-win-rate",
            [CONT_COLORS.BLACK, CONT_COLORS.BLACK, CONT_COLORS.RED, CONT_COLORS.YELLOW, CONT_COLORS.GREEN, CONT_COLORS.BLACK, CONT_COLORS.BLACK],
            [0, 0.05, 0.43, 0.53, 0.63, 0.95, 1.0]
        ),
        "Aviation": new ColorMap(
            "aviation-win-rate",
            [CONT_COLORS.BLACK, CONT_COLORS.BLACK, CONT_COLORS.RED, CONT_COLORS.YELLOW, CONT_COLORS.GREEN, CONT_COLORS.BLACK, CONT_COLORS.BLACK],
            [0, 0.01, 0.5, 0.6, 0.7, 0.99, 1.0]
        )
    },
    "battles_sum": {
        "Ground_vehicles": new ColorMap(
            "ground-vehicles-battles-sum",
            [CONT_COLORS.BLACK, CONT_COLORS.BLACK, CONT_COLORS.RED, CONT_COLORS.YELLOW, CONT_COLORS.GREEN, CONT_COLORS.BLACK, CONT_COLORS.BLACK],
            [0, 0.01, 0.4, 0.5, 0.6, 0.99, 1.0],
        ),
        "Aviation": new ColorMap(
            "aviation-battles-sum",
            [CONT_COLORS.BLACK, CONT_COLORS.BLACK, CONT_COLORS.RED, CONT_COLORS.YELLOW, CONT_COLORS.GREEN, CONT_COLORS.BLACK, CONT_COLORS.BLACK],
            [0, 0.01, 0.4, 0.5, 0.6, 0.99, 1.0],
        )
    }
}
