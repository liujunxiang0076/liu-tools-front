<template>
  <div class="min-h-screen bg-base-200 py-4 md:py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- 页面标题 -->
      <div class="mb-6 md:mb-8">
        <div class="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <button 
            @click="goBack"
            class="btn btn-ghost btn-circle touch-manipulation"
          >
            <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span class="text-2xl md:text-3xl">🌐</span>
          <h1 class="text-xl md:text-2xl font-bold text-base-content">User Agent 解析器</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          解析 User Agent 字符串，识别浏览器、操作系统、设备类型等信息
        </p>
      </div>

      <!-- 当前浏览器信息 -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-lg mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-base-content">当前浏览器</h2>
          <button 
            @click="useCurrentUA"
            class="btn btn-sm btn-primary"
          >
            使用当前 UA
          </button>
        </div>
        <div class="p-3 bg-base-200 rounded-lg">
          <code class="text-xs break-all">{{ currentUA }}</code>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-lg mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-base-content">User Agent 字符串</h2>
          <div class="flex gap-2">
            <button 
              @click="clearUA"
              class="btn btn-sm btn-ghost"
              :disabled="!userAgent"
            >
              清空
            </button>
            <button 
              @click="loadExample"
              class="btn btn-sm btn-outline"
            >
              示例
            </button>
          </div>
        </div>
        
        <textarea
          v-model="userAgent"
          @input="parseUA"
          placeholder="请输入 User Agent 字符串..."
          class="textarea textarea-bordered w-full h-24 font-mono text-sm resize-none"
        ></textarea>
      </div>

      <!-- 解析结果 -->
      <div v-if="parsed" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 浏览器信息 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h3 class="font-semibold text-base-content mb-4 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
            </svg>
            浏览器
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-base-200 rounded-lg">
              <span class="text-sm text-base-content/70">名称</span>
              <span class="font-medium text-base-content">{{ parsed.browser.name || '未知' }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-base-200 rounded-lg">
              <span class="text-sm text-base-content/70">版本</span>
              <span class="font-medium text-base-content">{{ parsed.browser.version || '未知' }}</span>
            </div>
          </div>
        </div>

        <!-- 操作系统 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h3 class="font-semibold text-base-content mb-4 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            操作系统
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-base-200 rounded-lg">
              <span class="text-sm text-base-content/70">名称</span>
              <span class="font-medium text-base-content">{{ parsed.os.name || '未知' }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-base-200 rounded-lg">
              <span class="text-sm text-base-content/70">版本</span>
              <span class="font-medium text-base-content">{{ parsed.os.version || '未知' }}</span>
            </div>
          </div>
        </div>

        <!-- 设备信息 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h3 class="font-semibold text-base-content mb-4 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            设备
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-base-200 rounded-lg">
              <span class="text-sm text-base-content/70">类型</span>
              <span class="font-medium text-base-content">{{ parsed.device.type || '桌面' }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-base-200 rounded-lg">
              <span class="text-sm text-base-content/70">品牌</span>
              <span class="font-medium text-base-content">{{ parsed.device.vendor || '未知' }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-base-200 rounded-lg">
              <span class="text-sm text-base-content/70">型号</span>
              <span class="font-medium text-base-content">{{ parsed.device.model || '未知' }}</span>
            </div>
          </div>
        </div>

        <!-- 引擎信息 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h3 class="font-semibold text-base-content mb-4 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            渲染引擎
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-base-200 rounded-lg">
              <span class="text-sm text-base-content/70">名称</span>
              <span class="font-medium text-base-content">{{ parsed.engine.name || '未知' }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-base-200 rounded-lg">
              <span class="text-sm text-base-content/70">版本</span>
              <span class="font-medium text-base-content">{{ parsed.engine.version || '未知' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="bg-base-100 rounded-2xl p-12 shadow-lg text-center">
        <div class="text-6xl mb-4">🌐</div>
        <p class="text-base-content/60">输入 User Agent 字符串开始解析</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToolNavigation } from '@/composables/useToolNavigation'

const { goBack } = useToolNavigation()

const currentUA = ref('')
const userAgent = ref('')

interface ParsedUA {
  browser: { name: string; version: string }
  os: { name: string; version: string }
  device: { type: string; vendor: string; model: string }
  engine: { name: string; version: string }
}

const parsed = ref<ParsedUA | null>(null)


// 简化的 UA 解析（实际项目建议使用 ua-parser-js 等库）
const parseUA = () => {
  if (!userAgent.value.trim()) {
    parsed.value = null
    return
  }

  const ua = userAgent.value
  const result: ParsedUA = {
    browser: { name: '', version: '' },
    os: { name: '', version: '' },
    device: { type: '', vendor: '', model: '' },
    engine: { name: '', version: '' }
  }

  // 浏览器检测
  if (ua.includes('Chrome') && !ua.includes('Edg')) {
    result.browser.name = 'Chrome'
    const match = ua.match(/Chrome\/([\d.]+)/)
    result.browser.version = match ? match[1] : ''
  } else if (ua.includes('Firefox')) {
    result.browser.name = 'Firefox'
    const match = ua.match(/Firefox\/([\d.]+)/)
    result.browser.version = match ? match[1] : ''
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    result.browser.name = 'Safari'
    const match = ua.match(/Version\/([\d.]+)/)
    result.browser.version = match ? match[1] : ''
  } else if (ua.includes('Edg')) {
    result.browser.name = 'Edge'
    const match = ua.match(/Edg\/([\d.]+)/)
    result.browser.version = match ? match[1] : ''
  }

  // 操作系统检测
  if (ua.includes('Windows NT 10.0')) {
    result.os.name = 'Windows'
    result.os.version = '10/11'
  } else if (ua.includes('Windows NT 6.3')) {
    result.os.name = 'Windows'
    result.os.version = '8.1'
  } else if (ua.includes('Windows NT 6.1')) {
    result.os.name = 'Windows'
    result.os.version = '7'
  } else if (ua.includes('Mac OS X')) {
    result.os.name = 'macOS'
    const match = ua.match(/Mac OS X ([\d_]+)/)
    result.os.version = match ? match[1].replace(/_/g, '.') : ''
  } else if (ua.includes('Android')) {
    result.os.name = 'Android'
    const match = ua.match(/Android ([\d.]+)/)
    result.os.version = match ? match[1] : ''
  } else if (ua.includes('iPhone') || ua.includes('iPad')) {
    result.os.name = 'iOS'
    const match = ua.match(/OS ([\d_]+)/)
    result.os.version = match ? match[1].replace(/_/g, '.') : ''
  } else if (ua.includes('Linux')) {
    result.os.name = 'Linux'
  }

  // 设备类型检测
  if (ua.includes('Mobile') || ua.includes('Android')) {
    result.device.type = '移动设备'
  } else if (ua.includes('Tablet') || ua.includes('iPad')) {
    result.device.type = '平板'
  } else {
    result.device.type = '桌面'
  }

  // 设备品牌
  if (ua.includes('iPhone') || ua.includes('iPad')) {
    result.device.vendor = 'Apple'
    result.device.model = ua.includes('iPhone') ? 'iPhone' : 'iPad'
  } else if (ua.includes('Samsung')) {
    result.device.vendor = 'Samsung'
  } else if (ua.includes('Huawei')) {
    result.device.vendor = 'Huawei'
  }

  // 渲染引擎
  if (ua.includes('AppleWebKit')) {
    result.engine.name = 'WebKit'
    const match = ua.match(/AppleWebKit\/([\d.]+)/)
    result.engine.version = match ? match[1] : ''
  } else if (ua.includes('Gecko')) {
    result.engine.name = 'Gecko'
    const match = ua.match(/Gecko\/([\d]+)/)
    result.engine.version = match ? match[1] : ''
  } else if (ua.includes('Trident')) {
    result.engine.name = 'Trident'
  }

  parsed.value = result
}

const useCurrentUA = () => {
  userAgent.value = currentUA.value
  parseUA()
}

const clearUA = () => {
  userAgent.value = ''
  parsed.value = null
}

const loadExample = () => {
  userAgent.value = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  parseUA()
}

onMounted(() => {
  currentUA.value = navigator.userAgent
})
</script>

<style lang="scss" scoped>
/* 移动端优化 */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
