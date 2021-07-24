import { SideBarElement } from "./sidebar-element";
import { Container, Inject, Provider } from "../../utils";
import { Sidebar } from "../global-env";
import * as d3 from "d3";
import { Application } from "../application";


@Provider(Select)
export class Select extends SideBarElement {
    @Inject(Sidebar) sidebar: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    private labelText: string;
    private id: string;
    private classes: Array<string>;
    private data: Array<{ id: string, text: string }>;
    private defaultSelectId: string;
    private selection: d3.Selection<HTMLElement, unknown, HTMLElement, any>;

    with(labelText: string, id: string, classes: Array<string>, data: Array<{ id: string, text: string }>,
        defaultSelectId: string
    ) {
        this.labelText = labelText;
        this.id = id;
        this.classes = classes;
        this.data = data;
        this.defaultSelectId = defaultSelectId;
        return this;
    }

    init() {
        // init
        return this.initLabel()
            .initSelect()
            .addData();
    }

    private initLabel() {
        this.selection = this.sidebar
            .append<HTMLLabelElement>("label")
            .text(this.labelText);
        return this;
    }

    private initSelect() {
        this.selection = this.selection
            .append<HTMLSelectElement>("select")
            .attr("id", this.id);
        for (const className of this.classes) {
            this.selection = this.selection.classed(className, true);
        }
        return this;
    }

    private addData() {
        this.selection
            .selectAll()
            .data(this.data)
            .enter()
            .append<HTMLOptionElement>("option")
            .attr("value", d => d.id)
            .attr("selected", d => d.id === this.defaultSelectId ? "selected" : undefined)
            .html(d => d.text);
        return this;
    }
}


@Provider(SelectBuilder)
export class SelectBuilder {
    private labelText: string;
    private _id: string;
    private _class: Array<string> = [];
    private _data: Array<{ id: string, text: string }> = [];
    private defaultId: string;

    label(text: string): SelectBuilder {
        this.labelText = text;
        return this;
    }

    id(id: string): SelectBuilder {
        this._id = id;
        return this;
    }

    get class() {
        const self = this;
        return {
            set(classArr: Array<string>) {
                self._class = classArr;
                return self;
            },
            add(newClass: string) {
                self._class.push(newClass);
                return self;
            }
        }
    }

    get data() {
        const self = this;
        return {
            set(dataArr: Array<{ id: string, text: string }>): SelectBuilder {
                self._data = dataArr;
                return self;
            },
            add(newData: { id: string, text: string }): SelectBuilder {
                self._data.push(newData);
                return self;
            }
        }
    }

    default(defaultId: string): SelectBuilder {
        this.defaultId = defaultId;
        return this
    }

    init(): Select {
        return Container.get(Select)
            .with(this.labelText, this._id, this._class, this._data, this.defaultId)
            .init();
    }
}

// date selection for choosing date
export const DateSelect = Symbol("DateSelect");
Container.bind(DateSelect).toDynamicValue(() => {
    return Container.get(SelectBuilder)
        .id("date-selection")
        .label("Date: ")
        .class.add("plot-selection")
        .data.set(Application.dates.map(date => {
        return {id: date, text: date}
    }));
})

// class selection for choosing ground_vehicles or aviation.
export const ClassSelect = Symbol("ClassSelect");
Container.bind(ClassSelect).toDynamicValue(() => {
    return Container.get(SelectBuilder)
        .id("class-selection")
        .label("Class: ")
        .class.add("plot-selection")
        .data.add({id: "Ground_vehicles", text: "Ground Vehicles"})
        .data.add({id: "Aviation", text: "Aviation"})
        .default("Ground_vehicles");
})

// mode selection for choosing ab, rb and sb
export const ModeSelect = Symbol("ModeSelect");
Container.bind(ModeSelect).toDynamicValue(() => {
    return Container.get(SelectBuilder)
        .id("mode-selection")
        .label("Mode: ")
        .class.add("plot-selection")
        .data.add({id: "ab", text: "AB"})
        .data.add({id: "rb", text: "RB"})
        .data.add({id: "sb", text: "SB"})
        .default("rb");
})

// measurement selection for choose win_rate or battles_sum
export const MeasurementSelect = Symbol("MeasurementSelect");
Container.bind(MeasurementSelect).toDynamicValue(() => {
    return Container.get(SelectBuilder)
        .id("measurement-selection")
        .label("Measurement: ")
        .class.add("plot-selection")
        .data.add({id: "win_rate", text: "Win Rate"})
        .data.add({id: "battles_sum", text: "Battles"})
        .default("win_rate");
})

// br range select for choosing 1 or 0 as br-range
export const BrRangeSelect = Symbol("BrRangeSelect");
Container.bind(BrRangeSelect).toDynamicValue(() => {
    return Container.get(SelectBuilder)
        .id("br-range-selection")
        .label("BR Range: ")
        .class.add("plot-selection")
        .data.add({id: "0", text: "0"})
        .data.add({id: "1", text: "1"})
        .default("1");
})