import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import {d3DataStore , key} from '@/stores/store'

import "@/assets/main.css"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(d3DataStore,key)

app.mount('#app')
