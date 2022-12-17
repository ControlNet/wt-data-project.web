import { createStore,Store } from 'vuex'
import type { InjectionKey } from 'vue'
import { dataUrl } from '@/d3/src/app/global-env'

export interface metaData {
  type:string,
  data:string,
  path:string
}


export interface State {
  metaData:Array<metaData> | null
}

export const key: InjectionKey<Store<State>> = Symbol()

export const d3DataStore = createStore<State>({
  state () {
    return {
      metaData:null
    }
  },
  mutations: {
    updateMetaData(state,newMetaData){
      state.metaData = newMetaData
    }
  },
  actions: {
    async getMetaData(context){
      if (context.state.metaData == null){
        let metaData = await fetch(`${dataUrl}/metaData.json`)
        metaData = await metaData.json()
      }
      return context.state.metaData
    }
  }
})