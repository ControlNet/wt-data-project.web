<script setup lang="ts">

</script>


<template>
    <el-container class="container">
        <el-aside>
            <el-row :justify="'space-between'" :align="'middle'">
                <el-col :span="4"><h1>日期:</h1></el-col>
                <el-col :span="18"><el-select></el-select></el-col>
            </el-row>
            <el-row :justify="'space-between'" :align="'middle'">
                <el-col :span="6"><h1>指标:</h1></el-col>
                <el-col :span="18"><el-select></el-select></el-col>
            </el-row>
            <el-row :justify="'space-between'" :align="'middle'">
                <el-col :span="6"><h1>载具类型:</h1></el-col>
                <el-col :span="18"><el-select></el-select></el-col>
            </el-row>
            <el-row :justify="'space-between'" :align="'middle'">
                <el-col :span="6"><h1>游戏模式:</h1></el-col>
                <el-col :span="18"><el-select></el-select></el-col>
            </el-row>
            <el-row :justify="'space-between'" :align="'middle'">
                <el-col :span="6"><h1>分房区间:</h1></el-col>
                <el-col :span="18"><el-select></el-select></el-col>
            </el-row>
        </el-aside>
        <el-divider style="height: auto;" direction="vertical" />
        <el-main style="height:1000px">1</el-main>
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