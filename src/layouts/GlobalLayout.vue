<script setup lang="ts">
import Sidebar from "@/components/Sidebar.vue";
</script>


<template>
    <el-container class="container">
        <Sidebar/>
        <el-divider style="height: auto;" direction="vertical"/>
        <el-main>
            <RouterView/>
        </el-main>
    </el-container>
</template>

<style scoped>
.container {
    --bs-gutter-x: 1.5rem;
    margin-top: 20px;
    padding-left: calc(var(--bs-gutter-x) * .5);
    padding-right: calc(var(--bs-gutter-x) * .5);
}
</style>