<template>
  <div id="app" class="min-h-screen bg-base-200">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onErrorCaptured } from 'vue'

// 主题状态
const theme = ref('light')

// 初始化主题
const initializeTheme = () => {
  // 从localStorage获取保存的主题
  const savedTheme = localStorage.getItem('theme')
  
  // 检测系统偏好
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  // 确定要使用的主题 - 默认使用优化的tropical主题以获得更好的背景搭配
  let initialTheme = 'tropical'
  if (savedTheme) {
    initialTheme = savedTheme
  } else if (prefersDark) {
    initialTheme = 'tropical-dark'
  }
  
  theme.value = initialTheme
  document.documentElement.setAttribute('data-theme', initialTheme)
  
  // 监听系统主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'tropical-dark' : 'tropical'
      theme.value = newTheme
      document.documentElement.setAttribute('data-theme', newTheme)
    }
  })
}

// 应用级别的初始化逻辑
const initializeApp = () => {
  // 初始化主题
  initializeTheme()
}

// 全局错误处理
const handleGlobalError = (error: Error, instance: any, info: string) => {
  console.error('全局错误:', error, info)
}

// 组件挂载时的初始化
onMounted(() => {
  initializeApp()
})

// 错误边界处理
onErrorCaptured((error, instance, info) => {
  handleGlobalError(error, instance, info)
  return false // 阻止错误继续传播
})
</script>

<style>
/* 全局样式重置 */
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* 防止选择文本时的蓝色高亮 */
::selection {
  background-color: rgba(59, 130, 246, 0.2);
  color: inherit;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

/* 深色模式滚动条 */
[data-theme="dark"] ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 输入框聚焦样式 */
input:focus,
textarea:focus,
select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

/* 按钮点击反馈 */
.btn:active {
  transform: scale(0.98);
}

/* 卡片悬停效果 */
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* 平滑过渡 */
* {
  transition: all 0.2s ease;
}

/* 禁用某些元素的过渡 */
.no-transition,
.no-transition * {
  transition: none !important;
}
</style> 
