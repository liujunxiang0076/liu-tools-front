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
  build: {
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 构建后的文件大小警告限制（单位：KB）
    chunkSizeWarningLimit: 1000,
    // Rollup 配置
    rollupOptions: {
      output: {
        // 代码分割策略
        manualChunks: {
          // 将 Vue 相关库单独打包
          'vue-vendor': ['vue', 'vue-router'],
          // 将 UI 组件库单独打包
          'ui-vendor': ['lucide-vue-next'],
          // 将工具库单独打包
          'utils-vendor': ['clipboard', 'qrcode', 'qrcode.vue'],
        },
        // 优化输出文件名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        // 生产环境移除 console
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 启用源码映射（可选，调试用）
    sourcemap: false,
  },
  // 性能优化
  optimizeDeps: {
    include: ['vue', 'vue-router', 'lucide-vue-next'],
  },
}) 
 