<template>
    <el-row :justify="'space-between'" :align="'middle'">
        <el-col :span="4"><h1>{{ $t("Sidebar.Date.label") }}</h1></el-col>
        <el-col :span="18">
            <el-select v-model="selectDate" @change="onchange">
                <el-option
                    v-for="item in allDates"
                    :key="item"
                    :label="item"
                    :value="item"
                />
            </el-select>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { useInputStore } from "@/stores/inputStore";

const {allDates, lastDate} = defineProps(["allDates", "lastDate"]);
const selectDate: Ref<string> = ref(lastDate);
const selectionStore = useInputStore();
selectionStore.setDate(selectDate.value);

function onchange() {
    selectionStore.setDate(selectDate.value);
}
</script>

<style scoped>

</style>