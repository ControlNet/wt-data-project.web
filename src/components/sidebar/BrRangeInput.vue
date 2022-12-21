<template>
    <el-row :justify="'space-between'" :align="'middle'">
        <el-col :span="6"><h1>{{$t("Sidebar.BrRange.label")}}</h1></el-col>
        <el-col :span="18">
            <el-select v-model="selectedBrRange" @change="onchange">
                <el-option
                    v-for="item in brRanges"
                    :key="item"
                    :label="item"
                    :value="item"
                />
            </el-select>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { useInputStore } from "@/stores/inputStore";
import { ref } from "vue";
import type { BrRange } from "@/types/options";

const brRanges: Array<BrRange> = ["1", "0"]
const selectionStore = useInputStore();
const selectedBrRange = ref<BrRange>(selectionStore.brRange);

function onchange() {
    selectionStore.setBrRange(selectedBrRange.value);
}
</script>