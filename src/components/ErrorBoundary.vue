<template>
  <div v-if="hasError" class="min-h-screen flex items-center justify-center bg-base-200 p-4">
    <div class="card bg-base-100 shadow-xl max-w-2xl w-full">
      <div class="card-body items-center text-center">
        <!-- 错误图标 -->
        <div class="text-6xl mb-4">⚠️</div>
        
        <!-- 错误标题 -->
        <h2 class="card-title text-2xl mb-2">出错了</h2>
        
        <!-- 错误信息 -->
        <p class="text-base-content/70 mb-4">
          {{ errorMessage || '应用遇到了一个意外错误' }}
        </p>
        
        <!-- 错误详情 (仅开发环境) -->
        <div v-if="isDev && errorStack" class="w-full">
          <div class="collapse collapse-arrow bg-base-200">
            <input type="checkbox" />
            <div class="collapse-title font-medium">
              查看错误详情
            </div>
            <div class="collapse-content">
              <pre class="text-left text-xs overflow-auto p-4 bg-base-300 rounded">{{ errorStack }}</pre>
            </div>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="card-actions mt-6">
          <button @click="reload" class="btn btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            重新加载
          </button>
          <button @click="goHome" class="btn btn-outline">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            返回首页
          </button>
        </div>
        
        <!-- 提示信息 -->
        <p class="text-sm text-base-content/50 mt-4">
          如果问题持续存在，请尝试清除浏览器缓存或联系技术支持
        </p>
      </div>
    </div>
  </div>
  
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const hasError = ref(false)
const errorMessage = ref('')
const errorStack = ref('')
const isDev = ref(window.location.hostname === 'localhost')

// 捕获子组件错误
onErrorCaptured((error: Error, instance, info) => {
  hasError.value = true
  errorMessage.value = error.message
  errorStack.value = error.stack || ''
  
  // 记录错误日志
  console.error('错误边界捕获到错误:', {
    error,
    instance,
    info
  })
  
  // 阻止错误继续向上传播
  return false
})

// 重新加载页面
const reload = () => {
  window.location.reload()
}

// 返回首页
const goHome = () => {
  hasError.value = false
  router.push('/')
}
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
