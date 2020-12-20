import { Metadata } from "../data/metadata";
export declare abstract class Page {
    id: string;
    name: string;
    protected metadata: Metadata;
    constructor(metadata: Metadata);
    init(): void;
    abstract update(): void;
}
export declare type PageClass<T extends Page> = {
    new (...args: any[]): T;
};
export declare class BRHeatMapPage extends Page {
    id: string;
    name: string;
    update(): void;
}
export declare class StackedAreaPage extends Page {
    id: string;
    name: string;
    update(): void;
}
