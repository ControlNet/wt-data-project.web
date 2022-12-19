<script setup lang="ts">
import { ref } from 'vue'
import { d3DataStore } from "@/stores/store" 

import type { MetaData } from "@/stores/store"
import type { Ref } from 'vue'


import heatMap from "@/components/heatMap.vue"



const metaData: Ref<MetaData[] | null> = ref(null)
const selectDate :Ref<string> = ref('')
const selectBr :Ref<Number> = ref(0)

d3DataStore.dispatch('getMetaData').then((data)=>{
    metaData.value = d3DataStore.getters.getJoinedMetaData
})


</script>


<template>
    <el-container class="container">
        <el-aside>
            <el-row :justify="'space-between'" :align="'middle'">
                <el-col :span="4"><h1>日期:</h1></el-col>
                <el-col :span="18">
                    <el-select v-model="selectDate">
                        <el-option 
                        v-for="item in metaData"
                        :key="item.date"
                        :label="item.date"
                        :value="item.date"
                        />
                    </el-select>
                </el-col>
            </el-row>
            <el-row :justify="'space-between'" :align="'middle'">
                <el-col :span="6"><h1>指标:</h1></el-col>
                <el-col :span="18"><el-select></el-select></el-col>
            </el-row>
            <el-row :justify="'space-between'" :align="'middle'">
                <el-col :span="6"><h1>载具类型:</h1></el-col>
                <el-col :span="18">
                    <el-select>
                        <el-option :value="'地面载具'"/>
                        <el-option :value="'空中载具'"/>
                    </el-select>
                </el-col>
            </el-row>
            <el-row :justify="'space-between'" :align="'middle'">
                <el-col :span="6"><h1>游戏模式:</h1></el-col>
                <el-col :span="18"><el-select></el-select></el-col>
            </el-row>
            <el-row :justify="'space-between'" :align="'middle'">
                <el-col :span="6"><h1>分房区间:</h1></el-col>
                <el-col :span="18">
                    <el-select v-model="selectBr">
                        <el-option
                        />
                    </el-select>
                </el-col>
            </el-row>
        </el-aside>
        <el-divider style="height: auto;" direction="vertical" />
        <el-main id="d3enterPoint" >
            <heatMap></heatMap>
        </el-main>
    </el-container>
</template>


<style scoped>
.container{
    --bs-gutter-x:1.5rem;
    margin-top: 20px;
    padding-left: calc(var(--bs-gutter-x) * .5);
    padding-right: calc(var(--bs-gutter-x) * .5);
}
</style>