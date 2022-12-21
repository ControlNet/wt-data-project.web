import type { Clazz, Measurement, Mode, BrRange, Scale } from "@/types/options";

export interface HeatMapState {
    metaData: Array<MetaData>,
    selectedDate: string,
    selectedVehiclesType: string,
    selectedGameModeType: Mode,
    csvDataUrl: string,
    csvParser: Parser
}

export interface OnSomeSelectChange {
    is: string,
    newValue: string
}

export interface Metadata {
    type: string;
    date: string;
    path: string;
}

export interface InputState {
    date: string;
    measurement: Measurement;
    clazz: Clazz;
    mode: Mode;
    brRange: BrRange;
    scale: Scale;
}