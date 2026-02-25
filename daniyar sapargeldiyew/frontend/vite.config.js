import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 7012,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:7011',
        changeOrigin: true
      }
    }
  }
})
