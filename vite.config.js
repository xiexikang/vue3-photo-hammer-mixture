import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  base: './',
  server: {
    host: '0.0.0.0',
    port: 8888,
    open: true,
  },
  
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "";` //引用公共样式，使用vite搭建项目只安装sass即可，不需要安装node-sass,sass-loader
      },
    }
  }
})
