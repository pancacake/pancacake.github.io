import { defineConfig } from 'vite'

export default defineConfig({
  // 如果部署到 https://pancacake.github.io/，设置 base: '/'
  // 如果部署到 https://pancacake.github.io/bio/，设置 base: '/bio/'
  base: '/',
  build: {
    outDir: 'dist',
  },
})

