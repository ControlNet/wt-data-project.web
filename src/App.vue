<script setup lang="ts">
import NavbarView from "@/views/NavbarView.vue"
</script>

<template>
    <el-container direction="vertical">
        <NavbarView></NavbarView>
        <RouterView></RouterView>
    </el-container>
</template>

<style scoped>
</style>
