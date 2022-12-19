import { createStore,Store } from 'vuex'
import type { InjectionKey } from 'vue'

export interface MetaData {
  type:string,
  date:string,
  path:string
}


export interface State {
  metaData:Array<MetaData> 
}

export const key: InjectionKey<Store<State>> = Symbol()

export const d3DataStore = createStore<State>({
  state () {
    return {
      metaData:[]
    }
  },
  getters:{
    getJoinedMetaData(state){
      return state.metaData.filter(item => item.type === 'joined')
    }
  },
  mutations: {
    updateMetaData(state,newMetaData){
      state.metaData = newMetaData
    }
  },
  actions: {
    async getMetaData(context){
      if (context.state.metaData.length === 0){
        let metaData = await fetch(`https:///metadata.json`)
        metaData = await metaData.json()
        context.commit('updateMetaData',metaData)
      }
      return context.state.metaData
    }
  }
})