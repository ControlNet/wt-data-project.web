import type { TimeseriesRow, TsRow, WikiRow } from "@/types/types";
import type { Metadata } from "@/types/states/metadataState";
import type { BrLineChartRow } from "@/types/dataTypes";

export type WikiData = Array<WikiRow>

export type TsData = Array<TsRow>

export type TimeseriesData<T extends TimeseriesRow = TimeseriesRow> = Array<T>;

export type MetadataArray = Array<Metadata>;

export type Nation =
    "USA"
    | "Germany"
    | "USSR"
    | "Britain"
    | "Japan"
    | "France"
    | "Italy"
    | "China"
    | "Sweden"
    | "Israel";

export type BrLineChartData = Array<BrLineChartRow>;
