import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3007,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4007',
        changeOrigin: true
      }
    }
  }
})
