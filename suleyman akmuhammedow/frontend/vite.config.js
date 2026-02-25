import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 7004,
    proxy: {
      '/api': {
        target: 'http://localhost:7003',
        changeOrigin: true
      }
    }
  }
})
