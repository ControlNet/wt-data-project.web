import { Injectable } from "../utils";

@Injectable
export abstract class NavTab {
    abstract readonly id: string;
    abstract readonly name: string;
    abstract init(): void;
}