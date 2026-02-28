import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 7080,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:7081',
        changeOrigin: true
      }
    }
  }
})
