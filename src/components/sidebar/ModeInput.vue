<template>
    <el-row :justify="'space-between'" :align="'middle'">
        <el-col :span="6"><h1>{{ $t('Sidebar.Mode.label') }}</h1></el-col>
        <el-col :span="18">
            <el-select v-model="selectedMode" @change="onchange">
                <el-option
                    v-for="item in modes"
                    :key="item.name"
                    :label="item.label"
                    :value="item.name"
                />
            </el-select>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">

import type { Mode } from "@/types/options";
import { i18n } from "@/i18n";
import { useInputStore } from "@/stores/inputStore";
import { ref } from "vue";

const modes: Array<{ name: Mode, label: string }> = [
    {name: "ab", label: i18n.global.t("Sidebar.Mode.ab")},
    {name: "rb", label: i18n.global.t("Sidebar.Mode.rb")},
    {name: "sb", label: i18n.global.t("Sidebar.Mode.sb")},
]

const selectionStore = useInputStore();
const selectedMode = ref<Mode>(selectionStore.mode);

function onchange() {
    selectionStore.setMode(selectedMode.value);
}
</script>