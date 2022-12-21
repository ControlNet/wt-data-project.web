<script setup lang="ts">
import { onMounted, Ref, ref, watch } from 'vue'
import { RouteRecordName, useRoute } from 'vue-router'
import { useMetadataStore } from "@/stores/metadataStore";
import DateInput from "@/components/sidebar/DateInput.vue";
import MeasurementInput from "@/components/sidebar/MeasurementInput.vue";
import ClazzInput from "@/components/sidebar/ClazzInput.vue";
import ModeInput from "@/components/sidebar/ModeInput.vue";
import BrRangeInput from "@/components/sidebar/BrRangeInput.vue";
import ScaleInput from "@/components/sidebar/ScaleInput.vue";

const displayDateInput = ref(false);
const displayMeasurementInput = ref(false);
const displayClazzInput = ref(false);
const displayModeInput = ref(false);
const displayBrInput = ref(false);
const displayScaleInput = ref(false);

function updateInputDisplay(routeName: RouteRecordName | undefined | null) {
    switch (routeName) {
        case "GlobalLayout": case "br-heatmap":
            displayDateInput.value = true;
            displayMeasurementInput.value = true;
            displayClazzInput.value = true;
            displayModeInput.value = true;
            displayBrInput.value = true;
            displayScaleInput.value = false;
            break;
        case "stacked-area":
            displayDateInput.value = false;
            displayMeasurementInput.value = true;
            displayClazzInput.value = true;
            displayModeInput.value = true;
            displayBrInput.value = false;
            displayScaleInput.value = true;
            break;
    }
}

const route = useRoute()
updateInputDisplay(route.name);
watch(() => route.name, updateInputDisplay)

const allDates: Ref<Array<string>> = ref([])
const lastDate: Ref<string> = ref("")
const metadataPrepared = ref(false)

onMounted(async () => {
    const metadataStore = await useMetadataStore();
    allDates.value = metadataStore.allDates;
    lastDate.value = metadataStore.lastDate;
    metadataPrepared.value = true;
})
</script>


<template>
    <el-aside>
        <div v-if="metadataPrepared">
            <DateInput v-if="displayDateInput" :all-dates="allDates" :last-date="lastDate"/>
            <MeasurementInput v-if="displayMeasurementInput"/>
            <ClazzInput v-if="displayClazzInput"/>
            <ModeInput v-if="displayModeInput"/>
            <BrRangeInput v-if="displayBrInput"/>
            <ScaleInput v-if="displayScaleInput"/>
        </div>
    </el-aside>
</template>

