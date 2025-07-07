<template>
  <div id="app">
    <!-- 使用主布局 -->
    <MainLayout ref="mainLayoutRef" />
  </div>
</template>

<script setup lang="ts">
import { MainLayout } from '@/layouts'

// 主布局组件引用
const mainLayoutRef = ref<InstanceType<typeof MainLayout>>()

// 应用级别的初始化逻辑
const initializeApp = () => {
  // 显示欢迎消息
  ElMessage({
    message: '欢迎使用在线工具箱！',
    type: 'success',
    duration: 3000
  })

  // 可以在这里添加其他应用级别的初始化逻辑
  // 例如：用户认证、主题设置、语言设置等
}

// 全局错误处理
const handleGlobalError = (error: Error, instance: any, info: string) => {
  console.error('全局错误:', error, info)
  ElMessage({
    message: '应用出现错误，请稍后重试',
    type: 'error',
    duration: 5000
  })
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
/* 全局应用样式 - 只保留最基础的应用级样式 */
#app {
  width: 100%;
  height: 100vh;
  font-family: var(--font-family);
  color: var(--text-primary);
  background-color: var(--bg-color);
}

/* 全局字体和基础样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  line-height: 1.6;
  color: var(--text-primary);
  background-color: var(--bg-color);
  overflow: hidden;
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

/* 全局加载状态样式 */
.app-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 14px;
  color: var(--text-secondary);
}

/* 全局错误状态样式 */
.app-error {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
}

.error-content {
  max-width: 400px;
}

.error-icon {
  width: 64px;
  height: 64px;
  color: var(--error-color);
  margin: 0 auto 16px;
}

.error-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.error-message {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 20px 0;
  line-height: 1.5;
}
</style> 
