import { createRouter, createWebHistory } from 'vue-router'


import heatMapView from "@/views/heatMapView.vue"
import stackedAreaViewVue from '@/views/stackedAreaView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      redirect: '/br-heatmap'
    },
    {
      path:"/br-heatmap",
      component:heatMapView
    },
    {
      path:'/stacked-area',
      component:stackedAreaViewVue
    }
  ]
})

export default router
