<template>
    <el-row :justify="'space-between'" :align="'middle'">
        <el-col :span="6"><h1>{{ $t("Sidebar.Measurement.label") }}</h1></el-col>
        <el-col :span="18">
            <el-select v-model="selectedMeasurement" @change="onchange">
                <el-option
                    v-for="item in measurements"
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
import type { Measurement } from "@/types/options";
import { useInputStore } from "@/stores/inputStore";
import { ref } from "vue";

const measurements: Array<{ name: Measurement; label: string }> = [{
    name: "win_rate",
    label: i18n.global.t("Sidebar.Measurement.winRate")
}, {
    name: "battles_sum",
    label: i18n.global.t("Sidebar.Measurement.battlesSum")
}]

const selectionStore = useInputStore();
const selectedMeasurement = ref<Measurement>(selectionStore.measurement);

function onchange() {
    selectionStore.setMeasurement(selectedMeasurement.value);
}
</script>