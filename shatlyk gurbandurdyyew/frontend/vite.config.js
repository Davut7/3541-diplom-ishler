import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 7016,
    proxy: {
      '/api': {
        target: 'http://localhost:7015',
        changeOrigin: true
      }
    }
  }
})
