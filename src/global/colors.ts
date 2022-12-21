import type { Nation } from "@/types/alias";

export enum COLORS {
    GREEN = "#C3E88D",
    YELLOW = "#FFCB6B",
    RED = "#F07178",
    BLUE = "#82AAFF",
    PURPLE = "#C792EA",
    ORANGE = "#F78C6C",
    AZURE = "#467CDA",
    SKY = "#89DDFF",
    BLACK = "#2B2B2B",
    GRAY = "#616161",
    WHITE = "#EEFFFF",
    BLANK = "#FFFFFF"
}

export const categoricalColors = [
    COLORS.GREEN, COLORS.YELLOW, COLORS.RED, COLORS.BLUE,
    COLORS.PURPLE, COLORS.ORANGE, COLORS.AZURE, COLORS.SKY,
    COLORS.GRAY
];

export const nationColors: Map<Nation, COLORS> = new Map(<Array<[Nation, COLORS]>>Object.entries({
    Britain: COLORS.BLUE,
    China: COLORS.ORANGE,
    France: COLORS.AZURE,
    Germany: COLORS.GRAY,
    Italy: COLORS.GREEN,
    Israel: COLORS.BLACK,
    Japan: COLORS.PURPLE,
    Sweden: COLORS.YELLOW,
    USA: COLORS.SKY,
    USSR: COLORS.RED
}))

// Colors for continuous values
export enum CONT_COLORS {
    RED = "#D11141",
    YELLOW = "#FFC425",
    GREEN = "#00b159",
    BLACK = "#2B2B2B",
    WHITE = "#FFFFFF"
}