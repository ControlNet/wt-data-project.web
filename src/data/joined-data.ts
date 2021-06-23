import { TsRow } from "./ts-data";
import { WikiRow } from "./wiki-data";

export type JoinedData = Array<JoinedRow>;

export interface JoinedRow extends TsRow, WikiRow {
    wk_name: string
}
