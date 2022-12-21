import { dataUrl } from "@/global/consts";
import type { BrRange, Mode } from "@/types/options";

export const getTimeseriesDataPath = (mode: Mode, brRange: BrRange) => {
    return `${dataUrl}/${mode.toLowerCase()}_ranks_${brRange}.csv`
}