import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 7040,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:7041',
        changeOrigin: true
      }
    }
  }
})
