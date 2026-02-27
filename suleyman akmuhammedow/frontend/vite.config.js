import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3009,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4009',
        changeOrigin: true
      }
    }
  }
})
