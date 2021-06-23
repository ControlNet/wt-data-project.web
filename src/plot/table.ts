import { Plot } from "./plot";
import { BrHeatmap, SquareInfo } from "./br-heatmap";
import * as d3 from "d3";
import { JoinedData, JoinedRow } from "../data/joined-data";
import _ = require("lodash");

export class Table extends Plot {
    brHeatmap: BrHeatmap;
    table: d3.Selection<HTMLTableElement, unknown, HTMLElement, any>

    constructor(brHeatmap: BrHeatmap) {
        super(null, null, null);
        this.brHeatmap = brHeatmap;
    }

    init(): Plot {
        this.table = d3.select("#content")
            .append("div")
            .attr("id", "selected-table-div")
            .append("table")
            .attr("id", "selected-table");
        return this;
    }

    async update(): Promise<Plot> {
        // remove previous
        this.table.html(null);

        const clazz = this.brHeatmap.clazz;
        const brRange = +this.brHeatmap.brRange;

        d3.csv(this.dataPath, (data: JoinedData) => {
            // filter the data
            const filtered = this.brHeatmap.selected.map((selected: SquareInfo) => {
                const lowerBr = selected.lowerBr;
                const nation = selected.nation;

                return data.filter(d => {
                    // filter br
                    const br = this.getBr(d);
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
            const keys = _.keys(tableData[0]);
            // init table header
            this.table.append("tr").selectAll().data(keys).enter().append("th").html(d => d);

            // generate table rows from content
            tableData.forEach((tableRow: TableRow) => {
                const tr = this.table.append("tr");
                keys.forEach(key => {
                    // @ts-ignore
                    tr.append("td").html(tableRow[key]);
                })
            })
        })
        return await new Promise(resolve => resolve(this));
    }

    selectColumns(data: JoinedData): Array<TableRow> {
        const mode = this.brHeatmap.mode;
        return data.map((d: JoinedRow) => {
            // @ts-ignore
            return {
                ts_name: d.name,
                wk_name: d.wk_name,
                nation: d.nation,
                "class": d.cls,
                br: this.getBr(d),
                // @ts-ignore
                battles: +d[`${mode}_battles`],
                // @ts-ignore
                win_rate: +d[`${mode}_win_rate`],
                // @ts-ignore
                air_frags_per_battle: +d[`${mode}_air_frags_per_battle`],
                // @ts-ignore
                air_frags_per_death: +d[`${mode}_air_frags_per_death`],
                // @ts-ignore
                ground_frags_per_battle: +d[`${mode}_ground_frags_per_battle`],
                // @ts-ignore
                ground_frags_per_death: +d[`${mode}_ground_frags_per_death`],
                is_premium: d.is_premium,
                // @ts-ignore
                rp_rate: +d[`${mode}_rp_rate`],
                // @ts-ignore
                sl_rate: +d[`${mode}_sl_rate`]
            }
        })
    }

    get dataPath(): string {
        return `https://raw.githubusercontent.com/ControlNet/wt-data-project.data/master/joined/${this.brHeatmap.date}.csv`;
    }

    getBr(row: JoinedRow): number {
        // @ts-ignore
        return +row[`${this.brHeatmap.mode}_br`];
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