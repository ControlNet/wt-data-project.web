<template>
    <el-row :justify="'space-between'" :align="'middle'">
        <el-col :span="6"><h1>{{ $t("Sidebar.Class.label") }}</h1></el-col>
        <el-col :span="18">
            <el-select v-model="selectedClazz" @change="onchange">
                <el-option
                    v-for="item in classes"
                    :key="item.name"
                    :label="item.label"
                    :value="item.name"
                />
            </el-select>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { i18n } from "@/i18n";
import type { Clazz } from "@/types/options";
import { useInputStore } from "@/stores/inputStore";
import { ref } from "vue";

const classes: Array<{ name: Clazz, label: string }> = [{
    name: "Ground_vehicles",
    label: i18n.global.t("Sidebar.Class.groundVehicles")
}, {
    name: "Aviation",
    label: i18n.global.t("Sidebar.Class.aviation")
}]

const selectionStore = useInputStore();
const selectedClazz = ref<Clazz>(selectionStore.clazz);

function onchange() {
    selectionStore.setClazz(selectedClazz.value);
}
</script>