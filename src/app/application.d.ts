import { Page, PageClass } from "./page";
import { Metadata } from "../data/metadata";
export declare class Application {
    static Pages: Array<PageClass<any>>;
    static pages: Array<Page>;
    static metadata: Array<Metadata>;
    static dates: Array<string>;
    static run(): void;
    static build: {
        withBlank(): typeof Application;
        withPages(...Pages: Array<PageClass<any>>): typeof Application;
    };
}
