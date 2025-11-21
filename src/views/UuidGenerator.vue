<template>
  <div class="min-h-screen bg-base-200 py-4 md:py-8">
    <div class="container mx-auto px-4 max-w-5xl">
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
          <span class="text-2xl md:text-3xl">🆔</span>
          <h1 class="text-xl md:text-2xl font-bold text-base-content">UUID生成器</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          生成全局唯一标识符（UUID/GUID），支持多种版本和格式
        </p>
      </div>

      <!-- 生成配置 -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-lg mb-6">
        <h2 class="text-lg font-semibold text-base-content mb-4">生成配置</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- UUID版本 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">UUID版本</span>
            </label>
            <select v-model="version" class="select select-bordered">
              <option value="v4">Version 4 (随机)</option>
              <option value="v1">Version 1 (时间戳)</option>
            </select>
            <label class="label">
              <span class="label-text-alt text-base-content/60">
                {{ version === 'v4' ? '基于随机数生成' : '基于时间戳生成' }}
              </span>
            </label>
          </div>

          <!-- 生成数量 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">生成数量</span>
            </label>
            <input
              v-model.number="count"
              type="number"
              min="1"
              max="100"
              class="input input-bordered"
            />
            <label class="label">
              <span class="label-text-alt text-base-content/60">最多100个</span>
            </label>
          </div>

          <!-- 格式选项 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">大小写</span>
            </label>
            <div class="flex gap-3">
              <label class="label cursor-pointer gap-2">
                <input
                  v-model="uppercase"
                  type="radio"
                  :value="false"
                  class="radio radio-primary"
                />
                <span class="label-text">小写</span>
              </label>
              <label class="label cursor-pointer gap-2">
                <input
                  v-model="uppercase"
                  type="radio"
                  :value="true"
                  class="radio radio-primary"
                />
                <span class="label-text">大写</span>
              </label>
            </div>
          </div>

          <!-- 连字符选项 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">格式</span>
            </label>
            <div class="flex gap-3">
              <label class="label cursor-pointer gap-2">
                <input
                  v-model="withHyphens"
                  type="checkbox"
                  class="checkbox checkbox-primary"
                />
                <span class="label-text">包含连字符</span>
              </label>
            </div>
          </div>
        </div>

        <!-- 生成按钮 -->
        <div class="mt-6 flex gap-3">
          <button 
            @click="generateUuids"
            class="btn btn-primary flex-1"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            生成 UUID
          </button>
          <button 
            @click="clearResults"
            class="btn btn-ghost"
            :disabled="results.length === 0"
          >
            清空
          </button>
        </div>
      </div>

      <!-- 生成结果 -->
      <div v-if="results.length > 0" class="bg-base-100 rounded-2xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-base-content">
            生成结果 ({{ results.length }} 个)
          </h2>
          <button 
            @click="copyAll"
            class="btn btn-sm btn-primary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            复制全部
          </button>
        </div>

        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div
            v-for="(uuid, index) in results"
            :key="index"
            class="flex items-center gap-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
          >
            <span class="text-sm text-base-content/60 w-8">{{ index + 1 }}</span>
            <code class="flex-1 font-mono text-sm text-base-content select-all">{{ uuid }}</code>
            <button 
              @click="copySingle(uuid)"
              class="btn btn-xs btn-ghost"
              title="复制"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="bg-base-100 rounded-2xl p-12 shadow-lg text-center">
        <div class="text-6xl mb-4">🆔</div>
        <p class="text-base-content/60">点击"生成 UUID"按钮开始生成</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const version = ref<'v1' | 'v4'>('v4')
const count = ref(1)
const uppercase = ref(false)
const withHyphens = ref(true)
const results = ref<string[]>([])

const goBack = () => {
  router.push('/')
}

// 生成 UUID v4
const generateUuidV4 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// 生成 UUID v1 (简化版，基于时间戳)
const generateUuidV1 = (): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(16).substring(2, 14)
  const uuid = `${timestamp.toString(16)}-${random.substring(0, 4)}-1${random.substring(4, 7)}-${random.substring(7, 11)}-${random.substring(11)}`
  return uuid.padEnd(36, '0')
}

// 格式化 UUID
const formatUuid = (uuid: string): string => {
  let formatted = uuid
  
  if (!withHyphens.value) {
    formatted = formatted.replace(/-/g, '')
  }
  
  if (uppercase.value) {
    formatted = formatted.toUpperCase()
  }
  
  return formatted
}

// 生成 UUIDs
const generateUuids = () => {
  const newResults: string[] = []
  const generateCount = Math.min(Math.max(1, count.value), 100)
  
  for (let i = 0; i < generateCount; i++) {
    const uuid = version.value === 'v4' ? generateUuidV4() : generateUuidV1()
    newResults.push(formatUuid(uuid))
  }
  
  results.value = newResults
}

// 清空结果
const clearResults = () => {
  results.value = []
}

// 复制单个
const copySingle = async (uuid: string) => {
  try {
    await navigator.clipboard.writeText(uuid)
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 复制全部
const copyAll = async () => {
  try {
    await navigator.clipboard.writeText(results.value.join('\n'))
  } catch (error) {
    console.error('复制失败:', error)
  }
}
</script>

<style scoped>
/* 移动端优化 */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* 滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: hsl(var(--b2));
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: hsl(var(--bc) / 0.2);
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--bc) / 0.3);
}
</style>
