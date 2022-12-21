import { defineStore } from "pinia";
import type { Value2Color } from "@/utils/colorHelper";

export const useHeatMapStore = defineStore({
    id: "heatMapStore",
    actions: {
        updateColorBar(valueMin: number, valueMax: number, value2color: Value2Color) {}
    }
})
