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
    static load(json: ConfigJson) {
        const bindMap: Array<{key: string, value: any}> = [
            {key: Config.BrHeatmapPage.BrHeatmap.svgHeight, value: json.BrHeatmapPage.BrHeatmap.svgHeight},
            {key: Config.BrHeatmapPage.BrHeatmap.svgWidth, value: json.BrHeatmapPage.BrHeatmap.svgWidth},
            {key: Config.BrHeatmapPage.BrHeatmap.margin, value: json.BrHeatmapPage.BrHeatmap.margin},
            {key: Config.BrHeatmapPage.BrHeatmap.mainSvgId, value: json.BrHeatmapPage.BrHeatmap.mainSvgId},

            {key: Config.BrHeatmapPage.ColorBar.svgHeight, value: json.BrHeatmapPage.ColorBar.svgHeight},
            {key: Config.BrHeatmapPage.ColorBar.svgWidth, value: json.BrHeatmapPage.ColorBar.svgWidth},
            {key: Config.BrHeatmapPage.ColorBar.margin, value: json.BrHeatmapPage.ColorBar.margin},

            {key: Config.BrHeatmapPage.BrLineChart.svgHeight, value: json.BrHeatmapPage.BrLineChart.svgHeight},
            {key: Config.BrHeatmapPage.BrLineChart.svgWidth, value: json.BrHeatmapPage.BrLineChart.svgWidth},
            {key: Config.BrHeatmapPage.BrLineChart.margin, value: json.BrHeatmapPage.BrLineChart.margin},

            {key: Config.BrHeatmapPage.Legend.svgHeight, value: json.BrHeatmapPage.Legend.svgHeight},
            {key: Config.BrHeatmapPage.Legend.svgWidth, value: json.BrHeatmapPage.Legend.svgWidth},
            {key: Config.BrHeatmapPage.Legend.margin, value: json.BrHeatmapPage.Legend.margin},

            {key: Config.BrHeatmapPage.Tooltip.parentSvgId, value: json.BrHeatmapPage.Tooltip.parentSvgId},
            {key: Config.BrHeatmapPage.Tooltip.opacity, value: json.BrHeatmapPage.Tooltip.opacity},
            {key: Config.BrHeatmapPage.Tooltip.nRow, value: json.BrHeatmapPage.Tooltip.nRow},
            {key: Config.BrHeatmapPage.Tooltip.rectWidth, value: json.BrHeatmapPage.Tooltip.rectWidth},
            {key: Config.BrHeatmapPage.Tooltip.rectXBias, value: json.BrHeatmapPage.Tooltip.rectXBias},
            {key: Config.BrHeatmapPage.Tooltip.rectYBias, value: json.BrHeatmapPage.Tooltip.rectYBias},
            {key: Config.BrHeatmapPage.Tooltip.textXBias, value: json.BrHeatmapPage.Tooltip.textXBias},
            {key: Config.BrHeatmapPage.Tooltip.textYBias, value: json.BrHeatmapPage.Tooltip.textYBias},
        ];

        bindMap.forEach(({key, value}) => {
            Container.bind(key).toConstantValue(value);
        });
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

