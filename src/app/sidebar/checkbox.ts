import { Container, Inject, Provider } from "../../utils";
import { SideBarElement } from "./sidebar-element";
import { Sidebar } from "../global-env";
import * as d3 from "d3";
import { Select } from "./select";
import { Localization } from "../config";

@Provider(Checkbox)
export class Checkbox extends SideBarElement {
    @Inject(Sidebar) sidebar: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    private labelText: string;
    private id: string;
    private classes: Array<string>;
    private checked: boolean;
    private checkbox: d3.Selection<HTMLElement, unknown, HTMLElement, any>;

    with(labelText: string, id: string, classes: Array<string>, checked: boolean) {
        this.labelText = labelText;
        this.id = id;
        this.classes = classes;
        this.checked = checked;
        return this;
    }

    init() {
        // init
        return this.initLabel()
            .initSelect()
            .addData();
    }

    private initLabel() {
        this.checkbox = this.sidebar
            .append<HTMLLabelElement>("label")
            .text(this.labelText);
        return this;
    }

    private initSelect() {
        this.checkbox = this.checkbox
            .append<HTMLInputElement>("input")
            .attr("id", this.id)
            .attr("name", this.id)
            .attr("type", "checkbox");
        for (const className of this.classes) {
            this.checkbox = this.checkbox.classed(className, true);
        }
        return this;
    }

    private addData() {
        this.checkbox
            .property("checked", this.checked);
        return this;
    }
}

@Provider(CheckboxBuilder)
export class CheckboxBuilder {
    private labelText: string;
    private _id: string;
    private _class: Array<string> = [];

    label(text: string): CheckboxBuilder {
        this.labelText = text;
        return this;
    }

    id(id: string): CheckboxBuilder {
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

    init(): Checkbox {
        const checked = localStorage.getItem(this._id) === "true";
        return Container.get(Checkbox)
            .with(this.labelText, this._id, this._class, checked)
            .init();
    }
}

// date selection for choosing date
export const ColorblindCheckbox = Symbol("ColorblindCheckbox");
Container.bind(ColorblindCheckbox).toDynamicValue(() => {
    return Container.get(CheckboxBuilder)
        .id("colorblind-checkbox")
        .label(Container.get(Localization.Sidebar.Colorblind.label))
        .class.add("plot-checkbox");
})
