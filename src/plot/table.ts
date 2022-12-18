import { Plot } from "./plot";
import { BrHeatmap, SquareInfo } from "./br-heatmap";
import * as d3 from "d3";
import { JoinedData, JoinedRow, JoinedRowGetter } from "../data/joined-data";
import * as _ from "lodash";
import { COLORS, Container, Inject, nationColors, Provider, utils } from "../utils";
import { Content, dataUrl } from "../app/global-env";
import { BRHeatMapPage } from "../app/page/br-heatmap-page";
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import "tabulator-tables/dist/css/tabulator.min.css";

@Provider(Table)
export class Table extends Plot {
    table: d3.Selection<HTMLTableElement, unknown, HTMLElement, unknown>
    @Inject(Content) readonly content: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>
    @Inject(BRHeatMapPage) page: BRHeatMapPage;
    cache: Map<string, JoinedData> = new Map();

    init(): Table {
        this.table = this.content
            .append<HTMLDivElement>("div")
            .attr("id", "selected-table-div")
            .append<HTMLTableElement>("table")
            .attr("id", "selected-table");
        return this;
    }

    async searchInCache(): Promise<JoinedData> {
        const key = this.page.date;
        if (this.cache.has(key)) {
            return this.cache.get(key);
        } else {
            return new Promise(resolve => d3.csv(this.dataPath, (data: JoinedData) => {
                this.cache.set(key, data);
                resolve(data);
            }));
        }
    }

    async update(): Promise<Table> {
        // remove previous
        this.reset();

        const clazz = this.page.clazz;
        const brRange = +this.page.brRange;
        const data = await this.searchInCache();
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
        new Tabulator("#selected-table", {
            data: tableData,
            layout: "fitColumns",
            columns: [
                {title: "ts_name", field: "ts_name"},
                {title: "wk_name", field: "wk_name"},
                {
                    title: "nation", field: "nation", maxWidth: 80, formatter: cell => {
                        const value = cell.getValue();
                        const element = cell.getElement();
                        const color = nationColors.get(value);
                        element.style.backgroundColor = color;
                        element.style.color = utils.genTextColorFromBgColor(color);
                        return value;
                    }
                },
                {title: "class", field: "class", maxWidth: 120},
                {title: "br", field: "br", maxWidth: 50},
                {title: "battles", field: "battles", maxWidth: 85},
                {
                    title: "win_rate", field: "win_rate", maxWidth: 95, formatter: cell => {
                        const value = cell.getValue();
                        const element = cell.getElement();
                        const color = utils.rgbToHex(this.page.plot.value2color(value) as string);
                        element.style.backgroundColor = color;
                        element.style.color = utils.genTextColorFromBgColor(color);
                        return value;
                    }
                },
                {title: "air_frags_per_battle", field: "air_frags_per_battle"},
                {title: "air_frags_per_death", field: "air_frags_per_death"},
                {title: "ground_frags_per_battle", field: "ground_frags_per_battle"},
                {title: "ground_frags_per_death", field: "ground_frags_per_death"},
                {
                    title: "premium", field: "is_premium", maxWidth: 99, formatter: (cell) => {
                        const value = cell.getValue();
                        if (value === "True") {
                            cell.getElement().style.backgroundColor = COLORS.YELLOW;
                        }
                        return value;
                    }
                },
                {title: "rp_rate", field: "rp_rate", maxWidth: 84},
                {title: "sl_rate", field: "sl_rate", maxWidth: 80},
            ]
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
        return `${dataUrl}/joined/${this.page.date}.csv`;
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