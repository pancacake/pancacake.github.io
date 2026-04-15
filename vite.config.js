import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'open-source': resolve(__dirname, 'open-source.html'),
        publications: resolve(__dirname, 'publications.html'),
        honors: resolve(__dirname, 'honors.html'),
        experiences: resolve(__dirname, 'experiences.html'),
      },
    },
  },
})
