<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const nowRouterIs = ref(route.name)

const selectDate = ref()
const metaData = ref()
const selectBr = ref()
watch(
  ()=> route.name,
  name =>{
    nowRouterIs.value = name
  }
)

</script>



<template>
  <el-aside>
     <el-row v-show="nowRouterIs !== 'stacked-area'" :justify="'space-between'" :align="'middle'">
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
     <el-row v-show="nowRouterIs !== 'stacked-area'" :justify="'space-between'" :align="'middle'">
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
     <el-row v-show="nowRouterIs !== 'stacked-area'" :justify="'space-between'" :align="'middle'">
         <el-col :span="6"><h1>分房区间:</h1></el-col>
         <el-col :span="18">
             <el-select v-model="selectBr">
                 <el-option
                 />
             </el-select>
         </el-col>
     </el-row>
     <el-row v-show="nowRouterIs === 'stacked-area'" :justify="'space-between'" :align="'middle'">
         <el-col :span="6"><h1>比例:</h1></el-col>
         <el-col :span="18">
             <el-select >
                 <el-option
                 />
             </el-select>
         </el-col>
     </el-row>
 </el-aside>
</template>


<style scoped>

</style>

