import { Mode } from "../app/options";

export abstract class Getter {
    protected readonly abstract data: Gettable;
    protected readonly abstract mode: Mode;

}


export interface Gettable {
}