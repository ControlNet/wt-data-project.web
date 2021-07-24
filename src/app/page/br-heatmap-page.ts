import { Page } from "./page";
import { Container, Inject, Singleton, utils } from "../../utils";
import { BrHeatmap } from "../../plot/br-heatmap";
import { Sidebar } from "../global-env";
import { BrRangeSelect, ClassSelect, DateSelect, MeasurementSelect, ModeSelect, Select } from "../sidebar/select";
import * as d3 from "d3";
import { BRRange, Clazz, Measurement, Mode } from "../options";


@Singleton(BRHeatMapPage)
export class BRHeatMapPage extends Page {
    plot: BrHeatmap;
    readonly id = "br-heatmap";
    readonly name = "BR HeatMap";
    @Inject(Sidebar) sidebar: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

    update(): void {
        // remove old plot
        this.removeOld();
        // add date selection
        Container.get<Select>(DateSelect).init();
        // add class selection
        Container.get<Select>(ClassSelect).init();
        // add mode selection for measurement
        Container.get<Select>(ModeSelect).init();
        // add measurement selection
        Container.get<Select>(MeasurementSelect).init();
        // br range selection
        Container.get<Select>(BrRangeSelect).init();
        // init main content plot
        // rebind the container to BrHeatmap constructor to new a object
        Container.rebind(BrHeatmap).toSelf();
        this.plot = Container.get(BrHeatmap);
        // rebind the plot object as constant value for other subplots
        Container.rebind(BrHeatmap).toConstantValue(this.plot);
        this.plot.init();

        // change any selection will refresh the BrHeatmap.
        utils.setEvent.byClass("plot-selection")
            .onchange(() => this.plot.update(false));
        // override some selection forcing re-download time-series data
        utils.setEvent.byIds("mode-selection", "br-range-selection")
            .onchange(() => this.plot.update(true));
    }

    get date(): string {
        return utils.getSelectedValue("date-selection");
    }

    get clazz(): Clazz {
        return utils.getSelectedValue("class-selection");
    }

    get mode(): Mode {
        return utils.getSelectedValue("mode-selection");
    }

    get measurement(): Measurement {
        return utils.getSelectedValue("measurement-selection");
    }

    get brRange(): BRRange {
        return utils.getSelectedValue("br-range-selection");
    }
}
