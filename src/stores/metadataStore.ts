import { defineStore } from "pinia";
import { dataUrl } from "@/global/consts";
import type { MetadataArray } from "@/types/alias";
import * as d3 from "d3";
import * as _ from "lodash";

const _useMetadataStore = defineStore({
    id: "metadataStore",
    state: () => ({
        metadata: [] as MetadataArray
    }),
    getters: {
        joinedMetaData: state => state.metadata.filter(item => item.type === "joined"),
        allDates: state => _.uniq(state.metadata.map(item => item.date)).sort(),
        lastDate(): string {
            return _.reverse(this.allDates as Array<string>)[0]
        }
    },
    actions: {
        // retrieve metadata from server
        async fromServer() {
            const metadata: MetadataArray | undefined = await d3.json(`${dataUrl}/metadata.json`)
            if (metadata !== undefined) {
                this.metadata = metadata
            console.log("metadataStore: fromServer: metadata")
            }
        }
    },
})

export const useMetadataStore = async () => {
    const store = _useMetadataStore()
    if (store.metadata.length === 0) {
        await store.fromServer()
    }
    return store
}
