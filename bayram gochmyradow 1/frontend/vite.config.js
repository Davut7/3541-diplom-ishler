import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 7020,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:7021',
        changeOrigin: true
      }
    }
  }
})
