import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://backend:3000',
        changeOrigin: true,
        // Utilitzem el nom del servei 'backend' definit a docker-compose
      },
      '/socket.io': {
        target: 'http://backend:3000',
        ws: true,
        changeOrigin: true,
      },
    },
    host: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  }
})
