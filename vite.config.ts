import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from "path";

export default defineConfig({
  plugins: [vue()],
  base: '/vsti/',
  resolve: {
    alias: [
      { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
      { find: '@interfaces', replacement: path.resolve(__dirname, 'src/interfaces') },
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ]
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  }
})
