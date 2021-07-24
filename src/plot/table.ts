import { Plot } from "./plot";
import { BrHeatmap, SquareInfo } from "./br-heatmap";
import * as d3 from "d3";
import { JoinedData, JoinedRow, JoinedRowGetter } from "../data/joined-data";
import * as _ from "lodash";
import { Container, Inject, Provider } from "../utils";
import { Content } from "../app/global-env";
import { BRHeatMapPage } from "../app/page/br-heatmap-page";


@Provider(Table)
export class Table extends Plot {
    table: d3.Selection<HTMLTableElement, unknown, HTMLElement, unknown>
    @Inject(Content) readonly content: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>
    @Inject(BRHeatMapPage) page: BRHeatMapPage;

    init(): Table {
        this.table = this.content
            .append<HTMLDivElement>("div")
            .attr("id", "selected-table-div")
            .append<HTMLTableElement>("table")
            .attr("id", "selected-table");
        return this;
    }

    async update(): Promise<Table> {
        // remove previous
        this.reset();

        const clazz = this.page.clazz;
        const brRange = +this.page.brRange;

        d3.csv(this.dataPath, (data: JoinedData) => {
            // filter the data
            const filtered = this.brHeatmap.selected.map((selected: SquareInfo) => {
                const lowerBr = selected.lowerBr;
                const nation = selected.nation;

                return data.filter(d => {
                    // filter br
                    const get = new JoinedRowGetter(d, this.page.mode);
                    const br = get.br;
                    const filterBr = () => br <= lowerBr + brRange && br >= lowerBr;
                    // filter nation
                    const filterNation = () => d.nation === nation;
                    // filter class
                    const filterClass = () => d.cls === clazz;
                    return filterBr() && filterNation() && filterClass();
                })
            }).flat();

            // select columns with selected mode
            const tableData = this.selectColumns(_.uniqBy(filtered, d => d.name));
            const keys = <Array<keyof TableRow>>_.keys(tableData[0]);
            // init table header
            this.table.append("tr").selectAll().data(keys).enter().append("th").html(d => d);

            // generate table rows from content
            tableData.forEach((tableRow: TableRow) => {
                const tr = this.table.append("tr");
                keys.forEach(key => {
                    tr.append("td").html(<string>tableRow[key]);
                })
            })
        })
        return this;
    }

    reset(): Table {
        // remove previous
        this.table.html(null);
        return this;
    }

    selectColumns(data: JoinedData): Array<TableRow> {
        const mode = this.page.mode;
        return data.map((d: JoinedRow) => {
            const get = new JoinedRowGetter(d, mode)
            return {
                ts_name: d.name,
                wk_name: d.wk_name,
                nation: d.nation,
                "class": d.cls,
                br: get.br,
                battles: get.battles,
                win_rate: get.winRate,
                air_frags_per_battle: get.airFragsPerBattle,
                air_frags_per_death: get.airFragsPerDeath,
                ground_frags_per_battle: get.groundFragsPerBattle,
                ground_frags_per_death: get.groundFragsPerDeath,
                is_premium: d.is_premium,
                rp_rate: get.rpRate,
                sl_rate: get.slRate
            }
        })
    }

    get brHeatmap(): BrHeatmap {
        return Container.get(BrHeatmap);
    }

    get dataPath(): string {
        return `https://controlnet.space/wt-data-project.data/joined/${this.page.date}.csv`;
    }
}

export interface TableRow {
    ts_name: string
    wk_name: string
    nation: string
    "class": string
    br: number
    battles: number
    win_rate: number
    air_frags_per_battle: number
    air_frags_per_death: number
    ground_frags_per_battle: number
    ground_frags_per_death: number
    is_premium: boolean
    rp_rate: number
    sl_rate: number
}