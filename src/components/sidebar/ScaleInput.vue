<template>
    <el-row :justify="'space-between'" :align="'middle'">
        <el-col :span="6"><h1>{{ $t("Sidebar.Scale.label") }}</h1></el-col>
        <el-col :span="18">
            <el-select v-model="selectedScale" @change="onchange">
                <el-option
                    v-for="item in scales"
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
import type { Scale } from "@/types/options";
import { useInputStore } from "@/stores/inputStore";
import { ref } from "vue";

const scales: Array<{ name: Scale; label: string }> = [{
    name: "value",
    label: i18n.global.t("Sidebar.Scale.value")
}, {
    name: "percentage",
    label: i18n.global.t("Sidebar.Scale.percentage")
}]

const selectionStore = useInputStore();
const selectedScale = ref<Scale>(selectionStore.scale);

function onchange() {
    selectionStore.setScale(selectedScale.value);
}
</script>