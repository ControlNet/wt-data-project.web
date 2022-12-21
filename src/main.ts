import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { heatMapState , key} from '@/stores/heatMapState'

import "@/assets/main.css"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use( heatMapState ,key)

app.mount('#app')
