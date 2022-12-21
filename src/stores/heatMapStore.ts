// import { createStore } from 'vuex'
// import { parse } from 'csv-parse/browser/esm';
// import { CoverTextToObject } from '@/utils/csvHelper';
// import type { HeatMapState, OnSomeSelectChange } from "@/types/states/heatMapState"
// import { dataUrl } from "@/global/consts";
//
// export const heatMapStore = createStore<HeatMapState>({
//     state() {
//         return {
//             metaData: [],
//             setDate: '',
//             selectedVehiclesType: '',
//             selectedGameModeType: 'rb',
//             csvParser: parse({
//                 delimiter: ','
//             }),
//             csvDataUrl: 'https://controlnet.space/wt-data-project.data/rb_ranks_1.csv'
//         }
//     },
//     getters: {
//         getJoinedMetaData(state) {
//             return state.metaData.filter(item => item.type === 'joined')
//         }
//     },
//     mutations: {
//         updateMetaData(state, newMetaData) {
//             state.metaData = newMetaData
//         }
//     },
//     actions: {
//         async getMetaData(context) {
//             if (context.state.metaData.length === 0) {
//                 let metaData = await fetch(`${dataUrl}/metadata.json`)
//                 metaData = await metaData.json()
//                 context.commit('updateMetaData', metaData)
//             }
//             return context.state.metaData
//         },
//         async getCsvDataBySelected(context) {
//             let start = Date.now()
//             context.state.metaData = []
//
//             async function* makeTextFileLineIterator(fileURL: string): AsyncGenerator<string> {
//                 const utf8Decoder = new TextDecoder("utf-8");
//                 let response = await fetch(fileURL);
//                 if (response.body === null) {
//                     return ''
//                 }
//                 let reader = response.body.getReader();
//                 let {value: chunk, done: readerDone} = await reader.read();
//                 new Promise(reader.read)
//                 let re = /\r\n|\n|\r/gm;
//                 let startIndex = 0;
//                 let decoderd = chunk ? utf8Decoder.decode(chunk, {stream: true}) : "";
//                 for (; ;) {
//                     let result = re.exec(decoderd);
//                     if (!result) {
//                         if (readerDone) {
//                             break;
//                         }
//                         let remainder = decoderd.substr(startIndex);
//                         ({value: chunk, done: readerDone} = await reader.read());
//                         decoderd = remainder + (chunk ? utf8Decoder.decode(chunk, {stream: true}) : "");
//                         startIndex = re.lastIndex = 0;
//                         continue;
//                     }
//                     yield decoderd.substring(startIndex, result.index);
//                     startIndex = re.lastIndex;
//                 }
//             }
//
//             let index = 0 //readed line Number
//             let keys: string | any[] = []
//             for await (let line of makeTextFileLineIterator(context.state.csvDataUrl)) {
//                 let decoderdText = line.split(',')
//                 if (index == 0) {
//                     keys = decoderdText
//                 }
//                 let read = CoverTextToObject(decoderdText, context.state.selectedGameModeType, keys)
//                 context.state.metaData.push(read)
//                 index++
//             }
//             context.state.metaData.shift()
//             let end = Date.now()
//             console.log(`load ok,use: ${end - start} ms `)
//         },
//         async onDateSelectChange(context, newDate: string) {
//
//         },
//         async onVehiclesTypeSelectChange(context, vehiclesType: string) {
//
//         },
//         async onGameModeSelectChange(context, gameMode: string) {
//
//         },
//         async onMeasurementSelectChange(context, measurement: string) {
//
//         },
//         async onBrRangeSelectChange(context, brRange: string) {
//
//         },
//         async onScaleSelectChange(context, Scale: string) {
//
//         },
//         async onSomeSelectChange(context, detail: OnSomeSelectChange) {
//
//         }
//     }
// })