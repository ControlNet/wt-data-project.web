import { defineStore } from "pinia";
import type { InputState } from "@/types/states";
import type { BrRange, Clazz, Measurement, Mode, Scale } from "@/types/options";

export const useInputStore = defineStore({
    id: "inputStore",
    state: () => ({
        date: "",
        measurement: "win_rate",
        clazz: "Ground_vehicles",
        mode: "rb",
        brRange: "1",
        scale: "value",
    } as InputState),

    actions: {
        setDate(date: string) {
            this.date = date
        },

        setMeasurement(measurement: Measurement) {
            this.measurement = measurement
        },

        setClazz(clazz: Clazz) {
            this.clazz = clazz
        },

        setMode(mode: Mode) {
            this.mode = mode
        },

        setBrRange(brRange: BrRange) {
            this.brRange = brRange
        },

        setScale(scale: Scale) {
            this.scale = scale
        }
    }
})
