import * as _ from "lodash"
import * as d3 from "d3";
import { Container } from "../utils";


export interface ConfigJson {
    readonly BrHeatmapPage: {
        readonly BrHeatmap: BrHeatmapConfigJson
        readonly ColorBar: PlotConfigJson
        readonly BrLineChart: PlotConfigJson
        readonly Legend: PlotConfigJson
        readonly Tooltip: TooltipConfigJson
    }
}

export class Margin {
    readonly top: number;
    readonly right: number;
    readonly bottom: number;
    readonly left: number;
}

interface PlotConfigJson {
    readonly svgHeight: number
    readonly svgWidth: number
    readonly margin: Margin
}

interface BrHeatmapConfigJson extends PlotConfigJson {
    readonly mainSvgId: string
}

interface TooltipConfigJson {
    readonly parentSvgId: string;
    readonly opacity: number;
    readonly nRow: number;
    readonly rectWidth: number;
    readonly rectXBias: number;
    readonly rectYBias: number;
    readonly textXBias: number;
    readonly textYBias: number;
}

abstract class AbstractConfig {
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }
}

class PlotConfig extends AbstractConfig {
    get svgHeight(): string {
        return `${this.name}.svgHeight`;
    };

    get svgWidth(): string {
        return `${this.name}.svgWidth`;
    }

    get margin(): string {
        return `${this.name}.margin`;
    }
}

class TooltipConfig extends AbstractConfig {
    get parentSvgId(): string {
        return `${this.name}.parentSvgId`;
    }

    get opacity(): string {
        return `${this.name}.opacity`;
    }

    get nRow(): string {
        return `${this.name}.nRow`;
    }

    get rectWidth(): string {
        return `${this.name}.rectWidth`;
    }

    get rectXBias(): string {
        return `${this.name}.rectXBias`;
    }

    get rectYBias(): string {
        return `${this.name}.rectYBias`;
    }

    get textXBias(): string {
        return `${this.name}.textXBias`;
    }

    get textYBias(): string {
        return `${this.name}.textYBias`;
    }
}

export class Config {
    static async load(): Promise<void> {
        return new Promise(resolve => {
                d3.json("/config/params.json", (json: ConfigJson) => {
                    _.keys(json).forEach((page: keyof Config) => {
                        const pageJson = json[page];
                        _.keys(pageJson).forEach(plot => {
                            const plotJson = pageJson[plot];
                            _.keys(plotJson).forEach(attr => {
                                const key = Config[page][plot][attr];
                                const value = plotJson[attr];
                                Container.bind(key).toConstantValue(value);
                            })
                        })
                    })
                    resolve();
                });
            }
        )
    }

    static BrHeatmapPage = class {
        static BrHeatmap = new (class extends PlotConfig {
            get mainSvgId() {
                return `${this.name}.mainSvgId`;
            }
        })("BrHeatmap");
        static ColorBar = new PlotConfig("ColorBar");
        static BrLineChart = new PlotConfig("BrLineChart");
        static Legend = new PlotConfig("Legend");
        static Tooltip = new TooltipConfig("Tooltip")
    }
}

