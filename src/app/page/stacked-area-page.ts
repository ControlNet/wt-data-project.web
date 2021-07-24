import { Page } from "./page";
import { Container, Inject, Singleton, utils } from "../../utils";
import { Sidebar } from "../global-env";
import * as d3 from "d3";
import { ClassSelect, ModeSelect, ScaleSelect, Select } from "../sidebar/select";
import { StackedLineChart } from "../../plot/line-chart";
import { BRRange, Clazz, Measurement, Mode, Scale } from "../options";


@Singleton(StackedAreaPage)
export class StackedAreaPage extends Page {
    plot: StackedLineChart;
    readonly id = "stacked-area";
    readonly name = "Trends";
    @Inject(Sidebar) sidebar: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

    update(): void {
        // remove old plot
        this.removeOld();
        // add class selection
        Container.get<Select>(ClassSelect).init();
        // add mode selection for measurement
        Container.get<Select>(ModeSelect).init();
        // add scale selection
        Container.get<Select>(ScaleSelect).init();

        // init main plot
        Container.rebind(StackedLineChart).toSelf();
        this.plot = Container.get(StackedLineChart);
        // rebind the plot object as constant value for other subplots
        Container.rebind(StackedLineChart).toConstantValue(this.plot);
        this.plot.init();

        // change any selection will refresh the BrHeatmap.
        utils.setEvent.byClass("plot-selection")
            .onchange(() => this.plot.update());
    }

    get clazz(): Clazz {
        return utils.getSelectedValue("class-selection");
    }

    get mode(): Mode {
        return utils.getSelectedValue("mode-selection");
    }

    get scale(): Scale {
        return utils.getSelectedValue("scale-selection");
    }
}