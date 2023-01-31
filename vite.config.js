import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/absproxy/3000',
  // publicDir: '/absproxy/3000/public',
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
    ]
  },
  server: {
    port: 3000
  }
})
