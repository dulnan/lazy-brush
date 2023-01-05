import { resolve } from 'path'
import { fileURLToPath } from 'url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()]
})
