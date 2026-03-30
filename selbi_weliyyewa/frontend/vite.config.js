import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 7060,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:7061',
        changeOrigin: true
      }
    }
  }
})
