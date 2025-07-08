<template>
  <div id="app" class="min-h-screen bg-base-200">
    <MainLayout />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onErrorCaptured } from 'vue'
import { MainLayout } from '@/layouts'

// 主布局组件引用
const mainLayoutRef = ref<InstanceType<typeof MainLayout>>()

// 主题状态
const theme = ref('light')

// 消息状态
const message = reactive({
  show: false,
  text: '',
  type: 'success' as 'success' | 'error' | 'info'
})

// 显示消息
const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'success', duration = 3000) => {
  message.text = text
  message.type = type
  message.show = true
  
  setTimeout(() => {
    message.show = false
  }, duration)
}

// 获取消息样式类
const getAlertClass = () => {
  switch (message.type) {
    case 'success':
      return 'bg-green-500'
    case 'error':
      return 'bg-red-500'
    case 'info':
    default:
      return 'bg-blue-500'
  }
}

// 初始化主题
const initializeTheme = () => {
  // 从localStorage获取保存的主题
  const savedTheme = localStorage.getItem('theme')
  
  // 检测系统偏好
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  // 确定要使用的主题
  let initialTheme = 'light'
  if (savedTheme) {
    initialTheme = savedTheme
  } else if (prefersDark) {
    initialTheme = 'dark'
  }
  
  theme.value = initialTheme
  document.documentElement.setAttribute('data-theme', initialTheme)
  
  // 监听系统主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'dark' : 'light'
      theme.value = newTheme
      document.documentElement.setAttribute('data-theme', newTheme)
    }
  })
}

// 应用级别的初始化逻辑
const initializeApp = () => {
  // 初始化主题
  initializeTheme()
  
  // 显示欢迎消息
  showMessage('欢迎使用在线工具箱！', 'success', 3000)

  // 可以在这里添加其他应用级别的初始化逻辑
  // 例如：用户认证、主题设置、语言设置等
}

// 全局错误处理
const handleGlobalError = (error: Error, instance: any, info: string) => {
  console.error('全局错误:', error, info)
  showMessage('应用出现错误，请稍后重试', 'error', 5000)
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

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 消息提示动画 */
.alert {
  animation: slideInRight 0.3s ease-out;
}

.alert.alert-leave {
  animation: slideOutRight 0.3s ease-in;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* 全局加载状态样式 */
.app-loading {
  position: fixed;
  inset: 0;
  background-color: hsl(var(--b1));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 4px solid hsl(var(--b3));
  border-top-color: hsl(var(--p));
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 0.875rem;
  color: hsl(var(--bc) / 0.6);
}

/* 全局错误状态样式 */
.app-error {
  position: fixed;
  inset: 0;
  background-color: hsl(var(--b1));
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1.25rem;
}

.error-content {
  max-width: 28rem;
}

.error-icon {
  width: 4rem;
  height: 4rem;
  color: hsl(var(--er));
  margin: 0 auto 1rem auto;
}

.error-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: hsl(var(--bc));
  margin-bottom: 0.5rem;
}

.error-message {
  font-size: 0.875rem;
  color: hsl(var(--bc) / 0.6);
  margin-bottom: 1.25rem;
  line-height: 1.625;
}
</style> 
