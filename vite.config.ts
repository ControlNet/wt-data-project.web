import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'


import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import viteWasm from "vite-plugin-wasm"

import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    VueI18nPlugin({
      include:"json"
    }),
    vueJsx(),
    AutoImport({
      resolvers:[ElementPlusResolver()]
    }),
    Components({
      resolvers:[ElementPlusResolver()]
    }),
    viteWasm()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
