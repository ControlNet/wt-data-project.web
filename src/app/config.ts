import { Container, ObjChainMap } from "../utils";
import { Nation } from "../data/wiki-data";
import { Measurement } from "./options";
import * as d3 from "d3";


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
    protected readonly class = "Config";
    protected readonly plot: string;
    protected readonly page: string;

    constructor(page: string, name: string) {
        this.page = page;
        this.plot = name;
    }
}

class PlotConfig extends AbstractConfig {
    get svgHeight(): string {
        return `${this.class}.${this.page}.${this.plot}.svgHeight`;
    };

    get svgWidth(): string {
        return `${this.class}.${this.page}.${this.plot}.svgWidth`;
    }

    get margin(): string {
        return `${this.class}.${this.page}.${this.plot}.margin`;
    }
}

class MainPlotConfig extends PlotConfig {
    get mainSvgId() {
        return `${this.class}.${this.page}.${this.plot}.mainSvgId`;
    }
}

class TooltipConfig extends AbstractConfig {
    get parentSvgId(): string {
        return `${this.class}.${this.page}.${this.plot}.parentSvgId`;
    }

    get opacity(): string {
        return `${this.class}.${this.page}.${this.plot}.opacity`;
    }

    get nRow(): string {
        return `${this.class}.${this.page}.${this.plot}.nRow`;
    }

    get rectWidth(): string {
        return `${this.class}.${this.page}.${this.plot}.rectWidth`;
    }

    get rectXBias(): string {
        return `${this.class}.${this.page}.${this.plot}.rectXBias`;
    }

    get rectYBias(): string {
        return `${this.class}.${this.page}.${this.plot}.rectYBias`;
    }

    get textXBias(): string {
        return `${this.class}.${this.page}.${this.plot}.textXBias`;
    }

    get textYBias(): string {
        return `${this.class}.${this.page}.${this.plot}.textYBias`;
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

interface LocalizationJson {
    readonly Navbar: {
        readonly BrHeatmap: string,
        readonly StackedArea: string,
        readonly TodoList: string,
        readonly WebRepo: string,
        readonly DataRepo: string,
        readonly Issues: string,
        readonly Github: string
    }

    readonly Sidebar: {
        readonly Mode: {
            readonly label: string,
            readonly ab: string,
            readonly rb: string,
            readonly sb: string
        }
        readonly Measurement: {
            readonly label: string,
            readonly winRate: string,
            readonly battlesSum: string
        }
        readonly BrRange: {
            readonly label: string
        }
        readonly Scale: {
            readonly label: string,
            readonly value: string,
            readonly percentage: string
        }
    }

    readonly BrHeatmapPage: {
        readonly Tooltip: {
            readonly nation: string,
            readonly br: string
        }

        readonly BrLineChart: {
            readonly date: string
        }
    }

    readonly StackedAreaPage: {
        readonly StackedLineChart: {
            readonly date: string,
            readonly battles: string
        }
    }

    readonly Nation: {
        readonly USA: string,
        readonly Germany: string,
        readonly USSR: string,
        readonly Britain: string,
        readonly Japan: string,
        readonly France: string,
        readonly Italy: string,
        readonly China: string,
        readonly Sweden: string
    }
}

abstract class AbstractLocalization {
    protected readonly class = "Localization";
    protected abstract readonly layout: string;
}

class NavbarLocalization extends AbstractLocalization {
    protected layout: string = "Navbar";

    get BrHeatmap(): string {
        return `${this.class}.${this.layout}.BrHeatmap`;
    }
    get StackedArea(): string {
        return `${this.class}.${this.layout}.StackedArea`;
    }
    get TodoList(): string {
        return `${this.class}.${this.layout}.TodoList`;
    }
    get WebRepo(): string {
        return `${this.class}.${this.layout}.WebRepo`;
    }
    get DataRepo(): string {
        return `${this.class}.${this.layout}.DataRepo`;
    }
    get Issues(): string {
        return `${this.class}.${this.layout}.Issues`;
    }
    get Github(): string {
        return `${this.class}.${this.layout}.Github`;
    }
}

class SelectionLocalization extends AbstractLocalization {
    protected readonly layout: string;
    protected readonly selection: string;

    constructor(layout: string, selection: string) {
        super();
        this.layout = layout;
        this.selection = selection;
    }

    get label(): string {
        return `${this.class}.${this.layout}.${this.selection}.label`;
    }
}

export type NationTranslator = (n: Nation) => string;
export type MeasurementTranslator = (m: Measurement) => string;

export class Localization {
    static async load() {
        let lang;

        try {
            lang = navigator.language === "zh-CN" || navigator.language === "zh" ? "zh-CN" : "en-US";
            d3.select("html").attr("lang", lang);
            d3.select("#stat").style("display", null);
        } catch (e) {
            console.error(e);
            lang = "en-US";
        }
        const {Navbar, Sidebar, BrHeatmapPage, StackedAreaPage, Nation}: LocalizationJson =
            await (await fetch(`/config/i18n/${lang}.json`)).json();

        // set navbar i18n
        Object.entries(Navbar).forEach(([layer, value]) => {
            const attr = layer as keyof NavbarLocalization;
            const key = Localization.Navbar[attr];
            Container.bind(key).toConstantValue(value);
        })

        // set sidebar i18n
        new ObjChainMap()
            .addLayer(() => Sidebar)
            .addLayer((selection: keyof typeof Sidebar) => Sidebar[selection])
            .addLayer((selection: keyof typeof Sidebar, attr: keyof SelectionLocalization) => Sidebar[selection][attr])
            .forEach((layers, value) => {
                const [selection, attr] = layers as [keyof typeof Sidebar, keyof SelectionLocalization];
                const key = Localization.Sidebar[selection][attr];
                Container.bind(key).toConstantValue(value);
            })

        // set BrHeatmapPage i18n
        new ObjChainMap()
            .addLayer(() => BrHeatmapPage)
            .addLayer((plot: keyof typeof BrHeatmapPage) => BrHeatmapPage[plot])
            .addLayer((plot: keyof typeof BrHeatmapPage, attr: keyof Localization) => BrHeatmapPage[plot][attr])
            .forEach((layers, value) => {
                const [plot, attr] = layers as [keyof typeof BrHeatmapPage, keyof Localization];
                const key = Localization.BrHeatmapPage[plot][attr];
                Container.bind(key).toConstantValue(value);
            })

        // set StackedAreaPage i18n
        new ObjChainMap()
            .addLayer(() => StackedAreaPage)
            .addLayer((plot: keyof typeof StackedAreaPage) => StackedAreaPage[plot])
            .addLayer((plot: keyof typeof StackedAreaPage, attr: keyof Localization) => StackedAreaPage[plot][attr])
            .forEach((layers, value) => {
                const [plot, attr] = layers as [keyof typeof StackedAreaPage, keyof Localization];
                const key = Localization.StackedAreaPage[plot][attr];
                Container.bind(key).toConstantValue(value);
            })

        // set nation map
        Container.bind<NationTranslator>(Localization.Nation).toFunction((n: Nation) => Nation[n]);

        // set measurement map
        Container.bind<MeasurementTranslator>(Localization.Measurement).toFunction((m: Measurement) => {
            switch (m) {
                case "win_rate":
                    return Container.get(Localization.Sidebar.Measurement.winRate);
                case "battles_sum":
                    return Container.get(Localization.Sidebar.Measurement.battlesSum);
            }
        })
    }

    static Navbar = new NavbarLocalization();
    static Sidebar = class {
        static Date = new SelectionLocalization("Sidebar", "Date");

        static Class = new class extends SelectionLocalization {
            get groundVehicles(): string {
                return `${this.class}.${this.layout}.${this.selection}.groundVehicles`;
            }
            get aviation(): string {
                return `${this.class}.${this.layout}.${this.selection}.aviation`
            }
        }("Sidebar", "Class");

        static Mode = new class extends SelectionLocalization {
            get ab(): string {
                return `${this.class}.${this.layout}.${this.selection}.ab`;
            }
            get rb(): string {
                return `${this.class}.${this.layout}.${this.selection}.rb`;
            }
            get sb(): string {
                return `${this.class}.${this.layout}.${this.selection}.sb`;
            }
        }("Sidebar", "Mode");

        static Measurement = new class extends SelectionLocalization {
            get winRate(): string {
                return `${this.class}.${this.layout}.${this.selection}.winRate`;
            }
            get battlesSum(): string {
                return `${this.class}.${this.layout}.${this.selection}.battlesSum`;
            }
        }("Sidebar", "Measurement");

        static BrRange = new SelectionLocalization("Sidebar", "BrRange");

        static Scale = new class extends SelectionLocalization {
            get value(): string {
                return `${this.class}.${this.layout}.${this.selection}.value`;
            }
            get percentage(): string {
                return `${this.class}.${this.layout}.${this.selection}.percentage`;
            }
        }("Sidebar", "Scale")
    };

    static BrHeatmapPage = {
        Tooltip: new class {
            get nation() {
                return "Localization.BrHeatmapPage.Tooltip.nation";
            }

            get br() {
                return "Localization.BrHeatmapPage.Tooltip.br(";
            }
        }(),

        BrLineChart: new class {
            get date() {
                return "Localization.BrHeatmapPage.BrLineChart.date";
            }
        }()
    }

    static StackedAreaPage = {
        StackedLineChart: new class {
            get date(): string {
                return "Localization.StackedAreaPage.StackedLineChart.date";
            }

            get battles(): string {
                return "Localization.StackedAreaPage.StackedLineChart.battles";
            }
        }()
    }

    static Nation = "Localization.Nation";
    static Measurement = "Localization.Measurement"
}
