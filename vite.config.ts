import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const customElements = new Set<string>([
  'card',
  'field',
  'value',
  'table-container',
])

// https://vite.dev/config/
export default defineConfig({
  // base: '/PEWarbornAdmin/',
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => customElements.has(tag),
        }
      }
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
