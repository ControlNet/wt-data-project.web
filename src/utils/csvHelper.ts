
import type { TimeseriesRBRow, TimeseriesABRow, TimeseriesSBRow, Mode } from "@/config/types"

let obj: TimeseriesRBRow | TimeseriesABRow | TimeseriesSBRow;



export function CoverTextToObject(values:Array<string>,mode:Mode,keys:string | any[] = []){
    let map;
    switch (mode){
        case "rb":
            map = new Map<Array<keyof TimeseriesRBRow>,string>()
            break
        case "ab":
            map = new Map<Array<keyof TimeseriesABRow>,string>()
            break
        case "sb":
            map = new Map<Array<keyof TimeseriesSBRow>,string>()
            break
    }
    for(let i = 0; i < values.length; i++){
        map.set(keys[i],values[i])
    }
    return map
}