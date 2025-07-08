<template>
  <div id="app" data-theme="tropical" class="min-h-screen bg-base-200">
    <MainLayout />
  </div>
</template>

<script setup lang="ts">
import { MainLayout } from '@/layouts'

// 主布局组件引用
const mainLayoutRef = ref<InstanceType<typeof MainLayout>>()

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

// 应用级别的初始化逻辑
const initializeApp = () => {
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
  @apply fixed inset-0 bg-white flex items-center justify-center z-50;
}

.loading-content {
  @apply text-center;
}

.loading-spinner {
  @apply w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4;
}

.loading-text {
  @apply text-sm text-gray-600;
}

/* 全局错误状态样式 */
.app-error {
  @apply fixed inset-0 bg-white flex items-center justify-center text-center p-5;
}

.error-content {
  @apply max-w-md;
}

.error-icon {
  @apply w-16 h-16 text-red-500 mx-auto mb-4;
}

.error-title {
  @apply text-xl font-semibold text-gray-900 mb-2;
}

.error-message {
  @apply text-sm text-gray-600 mb-5 leading-relaxed;
}
</style> 
