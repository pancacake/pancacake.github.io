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
        blogs: resolve(__dirname, 'blogs.html'),
        'blog-catchme': resolve(__dirname, 'blog/catchme.html'),
        experiences: resolve(__dirname, 'experiences.html'),
      },
    },
  },
})
