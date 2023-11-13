import { CONT_COLORS, CONT_COLORS_BLIND, Container } from "../utils";
import * as d3 from "d3";

export class ColorMap {
    constructor(
        public name: string,
        public colors: Array<string>,
        public percentiles: Array<number>
    ) {
    }
}


export class BrHeatColorMap {
    winRate: { Aviation: ColorMap; Ground_vehicles: ColorMap };
    battlesSum: { Aviation: ColorMap; Ground_vehicles: ColorMap };
    airFragsPerBattle: { Aviation: ColorMap; Ground_vehicles: ColorMap };
    airFragsPerDeath: { Aviation: ColorMap; Ground_vehicles: ColorMap };
    groundFragsPerBattle: { Aviation: ColorMap; Ground_vehicles: ColorMap };
    groundFragsPerDeath: { Aviation: ColorMap; Ground_vehicles: ColorMap };
}

const getBrHeatmapColorMaps: (isColorblind: boolean) => BrHeatColorMap = (isColorblind) => {
    const colors = isColorblind ? CONT_COLORS_BLIND : CONT_COLORS;
    return {
        "winRate": {
            "Ground_vehicles": new ColorMap(
                "ground-vehicles-win-rate",
                [colors.BLACK, colors.BLACK, colors.RED, colors.YELLOW, colors.GREEN, colors.BLACK, colors.BLACK],
                [0, 0.05, 0.43, 0.53, 0.63, 0.95, 1.0]
            ),
            "Aviation": new ColorMap(
                "aviation-win-rate",
                [colors.BLACK, colors.BLACK, colors.RED, colors.YELLOW, colors.GREEN, colors.BLACK, colors.BLACK],
                [0, 0.01, 0.5, 0.6, 0.7, 0.99, 1.0]
            )
        },
        "battlesSum": {
            "Ground_vehicles": new ColorMap(
                "ground-vehicles-battles-sum",
                [colors.BLACK, colors.BLACK, colors.RED, colors.YELLOW, colors.GREEN, colors.BLACK, colors.BLACK],
                [0, 0.01, 0.4, 0.5, 0.6, 0.99, 1.0],
            ),
            "Aviation": new ColorMap(
                "aviation-battles-sum",
                [colors.BLACK, colors.BLACK, colors.RED, colors.YELLOW, colors.GREEN, colors.BLACK, colors.BLACK],
                [0, 0.01, 0.4, 0.5, 0.6, 0.99, 1.0],
            )
        },
        "airFragsPerBattle": {
            "Ground_vehicles": new ColorMap(
                "ground-vehicles-air-frags-per-battle",
                [colors.BLACK, colors.BLACK, colors.RED, colors.YELLOW, colors.GREEN, colors.BLACK, colors.BLACK],
                [0, 0.001, 0.01, 0.025, 0.05, 0.999, 1.0],
            ),
            "Aviation": new ColorMap(
                "aviation-air-frags-per-battle",
                [colors.BLACK, colors.BLACK, colors.RED, colors.YELLOW, colors.GREEN, colors.BLACK, colors.BLACK],
                [0, 0.001, 0.07, 0.13, 0.25, 0.999, 1.0],
            )
        },
        "airFragsPerDeath": {
            "Ground_vehicles": new ColorMap(
                "ground-vehicles-air-frags-per-death",
                [colors.BLACK, colors.BLACK, colors.RED, colors.YELLOW, colors.GREEN, colors.BLACK, colors.BLACK],
                [0, 0.001, 0.01, 0.025, 0.05, 0.999, 1.0],
            ),
            "Aviation": new ColorMap(
                "aviation-air-frags-per-death",
                [colors.BLACK, colors.BLACK, colors.RED, colors.YELLOW, colors.GREEN, colors.BLACK, colors.BLACK],
                [0, 0.001, 0.07, 0.13, 0.25, 0.999, 1.0],
            )
        },
        "groundFragsPerBattle": {
            "Ground_vehicles": new ColorMap(
                "ground-vehicles-ground-frags-per-battle",
                [colors.BLACK, colors.BLACK, colors.RED, colors.YELLOW, colors.GREEN, colors.BLACK, colors.BLACK],
                [0, 0.001, 0.1, 0.2, 0.3, 0.999, 1.0],
            ),
            "Aviation": new ColorMap(
                "aviation-ground-frags-per-battle",
                [colors.BLACK, colors.BLACK, colors.RED, colors.YELLOW, colors.GREEN, colors.BLACK, colors.BLACK],
                [0, 0.001, 0.01, 0.05, 0.3, 0.999, 1.0],
            )
        },
        "groundFragsPerDeath": {
            "Ground_vehicles": new ColorMap(
                "ground-vehicles-ground-frags-per-death",
                [colors.BLACK, colors.BLACK, colors.RED, colors.YELLOW, colors.GREEN, colors.BLACK, colors.BLACK],
                [0, 0.001, 0.1, 0.2, 0.3, 0.999, 1.0],
            ),
            "Aviation": new ColorMap(
                "aviation-ground-frags-per-death",
                [colors.BLACK, colors.BLACK, colors.RED, colors.YELLOW, colors.GREEN, colors.BLACK, colors.BLACK],
                [0, 0.001, 0.01, 0.05, 0.3, 0.999, 1.0],
            )
        }
    }
}

// Container.bind(BrHeatColorMap).toConstantValue(brHeatmapColorMaps);
Container.bind(BrHeatColorMap).toDynamicValue(() => {
    const isColorblindMode = d3.select("#colorblind-checkbox").property("checked") as boolean;
    return getBrHeatmapColorMaps(isColorblindMode)
});
