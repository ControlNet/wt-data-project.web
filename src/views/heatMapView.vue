<script setup lang="ts">

import { ref } from 'vue'
import { d3DataStore } from "@/stores/store" 

import type { MetaData } from "@/stores/store"
import type { Ref } from 'vue'


import HeatMap from "@/components/HeatMap.vue"



const metaData :Ref<MetaData[] | null> = ref(null)
const selectDate :Ref<string> = ref('')
const selectBr :Ref<Number> = ref(0)

d3DataStore.dispatch('getMetaData').then((data)=>{
    metaData.value = d3DataStore.getters.getJoinedMetaData
})


</script>


<template>
  <HeatMap></HeatMap>
</template>


<style scoped>
</style>