import { Container, ObjChainMap } from "../utils";


export interface ConfigJson {
    readonly BrHeatmapPage: {
        readonly BrHeatmap: MainPlotConfigJson;
        readonly ColorBar: PlotConfigJson;
        readonly BrLineChart: PlotConfigJson;
        readonly Legend: PlotConfigJson;
        readonly Tooltip: TooltipConfigJson;
    }

    readonly StackedAreaPage: {
        readonly StackedLineChart: MainPlotConfigJson;
        readonly Legend: PlotConfigJson;
    }
}

export class Margin {
    readonly top: number;
    readonly right: number;
    readonly bottom: number;
    readonly left: number;
}

interface PlotConfigJson {
    readonly svgHeight: number;
    readonly svgWidth: number;
    readonly margin: Margin;
}

interface MainPlotConfigJson extends PlotConfigJson {
    readonly mainSvgId: string;
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
    readonly plot: string;
    readonly page: string;

    constructor(page: string, name: string) {
        this.page = page;
        this.plot = name;
    }
}

class PlotConfig extends AbstractConfig {
    get svgHeight(): string {
        return `${this.page}.${this.plot}.svgHeight`;
    };

    get svgWidth(): string {
        return `${this.page}.${this.plot}.svgWidth`;
    }

    get margin(): string {
        return `${this.page}.${this.plot}.margin`;
    }
}

class MainPlotConfig extends PlotConfig {
    get mainSvgId() {
        return `${this.page}.${this.plot}.mainSvgId`;
    }
}

class TooltipConfig extends AbstractConfig {
    get parentSvgId(): string {
        return `${this.page}.${this.plot}.parentSvgId`;
    }

    get opacity(): string {
        return `${this.page}.${this.plot}.opacity`;
    }

    get nRow(): string {
        return `${this.page}.${this.plot}.nRow`;
    }

    get rectWidth(): string {
        return `${this.page}.${this.plot}.rectWidth`;
    }

    get rectXBias(): string {
        return `${this.page}.${this.plot}.rectXBias`;
    }

    get rectYBias(): string {
        return `${this.page}.${this.plot}.rectYBias`;
    }

    get textXBias(): string {
        return `${this.page}.${this.plot}.textXBias`;
    }

    get textYBias(): string {
        return `${this.page}.${this.plot}.textYBias`;
    }
}


export class Config {
    static async load(): Promise<void> {
        const json: ConfigJson = await (await fetch("/config/params.json")).json()

        new ObjChainMap()
            .addLayer(() => json)
            .addLayer((page: keyof Config) => json[page])
            .addLayer((page: keyof Config, plot: string) => json[page][plot])
            .addLayer((page: keyof Config, plot: string, attr: string) => json[page][plot][attr])
            .forEach((layers, value) => {
                const [page, plot, attr] = layers as [keyof Config, string, string];
                const key = Config[page][plot][attr];
                Container.bind(key).toConstantValue(value);
            })
    }

    static BrHeatmapPage = class {
        static BrHeatmap = new MainPlotConfig("BrHeatmapPage", "BrHeatmap");
        static ColorBar = new PlotConfig("BrHeatmapPage", "ColorBar");
        static BrLineChart = new PlotConfig("BrHeatmapPage", "BrLineChart");
        static Legend = new PlotConfig("BrHeatmapPage", "Legend");
        static Tooltip = new TooltipConfig("BrHeatmapPage", "Tooltip")
    }

    static StackedAreaPage = class {
        static StackedLineChart = new MainPlotConfig("StackedAreaPage", "StackedLineChart");
        static Legend = new PlotConfig("StackedAreaPage", "Legend");
    }
}

