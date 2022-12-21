import { createRouter, createWebHistory } from "vue-router"


import HeatMapView from "@/views/HeatMapView.vue"
import StackedAreaViewVue from "@/views/StackedAreaView.vue"
import GlobalLayoutVue from "@/layouts/GlobalLayout.vue"
import TodoListView from "@/views/TodoListView.vue";

export default createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: "/br-heatmap"
        },
        {
            name: "GlobalLayout",
            path: "/",
            component: GlobalLayoutVue,
            children: [
                {
                    name: "br-heatmap",
                    path: "br-heatmap",
                    component: HeatMapView
                },
                {
                    name: "stacked-area",
                    path: "stacked-area",
                    component: StackedAreaViewVue
                }
            ]
        },
        {
            name: "/todo-list",
            path: "/todo-list",
            component: TodoListView,
        }
    ]
})
