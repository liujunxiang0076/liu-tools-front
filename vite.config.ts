import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    // 自动导入 Vue API
    AutoImport({
      imports: [
        'vue',
        'vue-router'
      ],
      dts: true, // 生成类型定义文件
      eslintrc: {
        enabled: true, // 生成eslint配置
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
    }),
    // 自动导入组件
    Components({
      dts: true, // 生成类型定义文件
      dirs: ['src/components'], // 自动导入的组件目录
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  css: {
    postcss: './postcss.config.js',
  },
}) 
 