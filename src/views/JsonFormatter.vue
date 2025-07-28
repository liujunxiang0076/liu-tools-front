<template>
  <div class="min-h-screen bg-base-200 py-4 md:py-8">
    <div class="container mx-auto px-4 max-w-7xl">
      <!-- 页面标题 -->
      <div class="mb-6 md:mb-8">
        <div class="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <button @click="goBack" class="btn btn-ghost btn-circle touch-manipulation">
            <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span class="text-2xl md:text-3xl">📄</span>
          <h1 class="text-xl md:text-2xl font-bold text-base-content">JSON格式化工具</h1>
        </div>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between px-4 md:px-0">
          <p class="text-sm md:text-base text-base-content/70 mb-3 md:mb-0">
            JSON数据格式化、压缩和验证工具，支持语法高亮和错误提示
          </p>

          <!-- 模式切换器 -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-base-content/60">模式:</span>
            <div class="join">
              <button @click="switchMode('format')" class="btn btn-sm join-item"
                :class="{ 'btn-primary': currentMode === 'format', 'btn-outline': currentMode !== 'format' }">
                格式化
              </button>
              <button @click="switchMode('diff')" class="btn btn-sm join-item"
                :class="{ 'btn-primary': currentMode === 'diff', 'btn-outline': currentMode !== 'diff' }">
                对比
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div v-if="currentMode === 'format'" class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <!-- 格式化模式的原有内容 -->
      </div>

      <!-- 对比模式的内容区域 -->
      <div v-else-if="currentMode === 'diff'" class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <!-- 移动端工具栏 -->
        <div class="lg:hidden flex items-center justify-between bg-base-100 rounded-xl p-4 shadow-lg">
          <div class="flex items-center gap-2">
            <span class="text-sm text-base-content/60">当前编辑:</span>
            <div class="join">
              <button @click="setMobileTab('A')" class="btn btn-sm join-item"
                :class="{ 'btn-primary': mobileTab === 'A', 'btn-outline': mobileTab !== 'A' }">
                JSON A
              </button>
              <button @click="setMobileTab('B')" class="btn btn-sm join-item"
                :class="{ 'btn-primary': mobileTab === 'B', 'btn-outline': mobileTab !== 'B' }">
                JSON B
              </button>
            </div>
          </div>
          <button @click="compareJson" class="btn btn-sm btn-primary"
            :disabled="!jsonA || !jsonB || hasErrorA || hasErrorB">
            开始对比
          </button>
        </div>
        <!-- 第一个JSON输入区域 -->
        <div class="bg-base-100 rounded-2xl p-4 md:p-6 shadow-lg"
          :class="{ 'lg:block': true, 'hidden': mobileTab === 'B', 'block': mobileTab === 'A' }"
          @touchstart="initTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchStart = { x: 0, y: 0 }">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">JSON A</h2>
            <span v-if="autoFormatA" class="text-sm text-base-content/60">已自动格式化</span>
            <div class="flex gap-2">
              <button @click="clearJsonA" class="btn btn-sm btn-ghost" :disabled="!jsonA">
                清空
              </button>
              <button @click="loadExampleA" class="btn btn-sm btn-outline">
                示例
              </button>
            </div>
          </div>

          <div class="relative">
            <textarea v-model="jsonA" @input="handleJsonAChange" placeholder="请输入第一个JSON数据..."
              class="textarea textarea-bordered w-full h-[38rem] font-mono text-sm resize-none"
              :class="{ 'textarea-error': hasErrorA }"></textarea>

            <div class="absolute bottom-2 right-2 text-xs text-base-content/50">
              {{ jsonA.length }} 字符
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-if="hasErrorA" class="mt-3 p-3 bg-error/10 border border-error/20 rounded-lg">
            <div class="flex items-start gap-2">
              <svg class="w-4 h-4 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <div>
                <div class="text-sm font-medium text-error">JSON A 格式错误</div>
                <div class="text-xs text-error/80 mt-1">{{ errorMessageA }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第二个JSON输入区域 -->
        <div class="bg-base-100 rounded-2xl p-4 md:p-6 shadow-lg"
          :class="{ 'lg:block': true, 'hidden': mobileTab === 'A', 'block': mobileTab === 'B' }"
          @touchstart="initTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchStart = { x: 0, y: 0 }">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">JSON B</h2>
            <div v-if="autoFormatB" class="text-sm text-base-content/60">
              <span class="text-success">已自动格式化</span>
              <button @click="autoFormatB = false" class="btn btn-sm btn-ghost">还原</button>
            </div>
            <div class="flex gap-2">
              <button @click="clearJsonB" class="btn btn-sm btn-ghost" :disabled="!jsonB">
                清空
              </button>
              <button @click="loadExampleB" class="btn btn-sm btn-outline">
                示例
              </button>
            </div>
          </div>

          <div class="relative">
            <textarea v-model="jsonB" @input="handleJsonBChange" placeholder="请输入第二个JSON数据..."
              class="textarea textarea-bordered w-full h-[38rem] font-mono text-sm resize-none"
              :class="{ 'textarea-error': hasErrorB }"></textarea>

            <div class="absolute bottom-2 right-2 text-xs text-base-content/50">
              {{ jsonB.length }} 字符
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-if="hasErrorB" class="mt-3 p-3 bg-error/10 border border-error/20 rounded-lg">
            <div class="flex items-start gap-2">
              <svg class="w-4 h-4 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <div>
                <div class="text-sm font-medium text-error">JSON B 格式错误</div>
                <div class="text-xs text-error/80 mt-1">{{ errorMessageB }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 对比结果显示区域 -->
      <div v-if="currentMode === 'diff'" class="mt-4 md:mt-6 bg-base-100 rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-base-content">差异对比结果</h2>
          <div class="flex gap-2">
            <button @click="compareJson" class="btn btn-primary" :disabled="!jsonA || !jsonB || hasErrorA || hasErrorB">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              开始对比
            </button>
            <button @click="exportDiff" class="btn btn-outline" :disabled="!diffResult">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              导出差异
            </button>
          </div>
        </div>

        <div class="bg-base-200 p-4 rounded-lg h-[20rem] overflow-auto">
          <div v-if="!diffResult" class="text-base-content/40 italic">
            对比结果将在此显示...
          </div>
          <div v-else-if="diffResult.identical" class="text-success">
            ✅ 两个JSON完全相同
          </div>
          <div v-else class="space-y-2">
            <div class="text-sm font-medium text-base-content mb-3">
              发现 {{ diffResult.differences.length }} 处差异:
            </div>
            <div v-for="(diff, index) in diffResult.differences" :key="index"
              class="border-l-4 pl-4 py-2 text-sm font-mono" :class="{
                'border-red-500 bg-red-50 dark:bg-red-900/20': diff.type === 'removed',
                'border-green-500 bg-green-50 dark:bg-green-900/20': diff.type === 'added',
                'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20': diff.type === 'changed'
              }">
              <div class="font-semibold text-xs text-base-content/70 mb-1">
                {{ diff.path }} - {{ diff.type === 'removed' ? '删除' : diff.type === 'added' ? '新增' : '修改' }}
              </div>
              <div v-if="diff.type === 'removed'" class="text-red-600 dark:text-red-400">
                - {{ diff.oldValue }}
              </div>
              <div v-else-if="diff.type === 'added'" class="text-green-600 dark:text-green-400">
                + {{ diff.newValue }}
              </div>
              <div v-else-if="diff.type === 'changed'">
                <div class="text-red-600 dark:text-red-400">- {{ diff.oldValue }}</div>
                <div class="text-green-600 dark:text-green-400">+ {{ diff.newValue }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 格式化模式的原有内容区域 -->
      <div v-if="currentMode === 'format'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 输入区域 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">JSON输入</h2>
            <div class="flex gap-2">
              <button @click="clearInput" class="btn btn-sm btn-ghost" :disabled="!inputJson">
                清空
              </button>
              <button @click="loadExample" class="btn btn-sm btn-outline">
                示例
              </button>
            </div>
          </div>

          <div class="relative">
            <textarea v-model="inputJson" @input="handleInputChange" placeholder="请输入JSON数据..."
              class="textarea textarea-bordered w-full h-[38rem] font-mono text-sm resize-none"
              :class="{ 'textarea-error': hasError }"></textarea>

            <!-- 字符计数 -->
            <div class="absolute bottom-2 right-2 text-xs text-base-content/50">
              {{ inputJson.length }} 字符
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-if="hasError" class="mt-3 p-3 bg-error/10 border border-error/20 rounded-lg">
            <div class="flex items-start gap-2">
              <svg class="w-4 h-4 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <div>
                <div class="text-sm font-medium text-error">JSON格式错误</div>
                <div class="text-xs text-error/80 mt-1">{{ errorMessage }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 输出区域 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">格式化结果</h2>
            <div class="flex gap-2">
              <button @click="copyResult" class="btn btn-sm btn-primary" :disabled="!formattedJson || hasError">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                复制
              </button>
              <button @click="downloadJson" class="btn btn-sm btn-outline" :disabled="!formattedJson || hasError">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                下载
              </button>
            </div>
          </div>

          <div class="relative">
            <div class="bg-base-200 p-4 rounded-lg h-[38rem] overflow-auto custom-json-viewer">
              <template v-if="!hasError && formattedJson">
                <pre class="json-pre"><code v-html="highlightedJson"></code></pre>
              </template>
              <div v-else-if="hasError" class="text-error/60 italic">JSON格式错误，请检查输入</div>
              <div v-else class="text-base-content/40 italic">格式化结果将在此显示...</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 工具栏 -->
      <div class="mt-6 bg-base-100 rounded-2xl p-6 shadow-lg">
        <div class="flex flex-wrap gap-4 items-center justify-between">
          <div class="flex flex-wrap gap-2">
            <button @click="formatJson" class="btn btn-primary" :disabled="!inputJson || hasError">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              格式化
            </button>

            <button @click="compressJson" class="btn btn-outline" :disabled="!inputJson || hasError">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              压缩
            </button>

            <button @click="validateJson" class="btn btn-outline" :disabled="!inputJson">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              验证
            </button>
          </div>

          <div class="flex items-center gap-4 text-sm text-base-content/60">
            <span>缩进:</span>
            <select v-model="indentSize" class="select select-sm select-bordered">
              <option value="2">2空格</option>
              <option value="4">4空格</option>
              <option value="tab">制表符</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div v-if="jsonStats" class="mt-6 bg-base-100 rounded-2xl p-6 shadow-lg">
        <h3 class="text-lg font-semibold text-base-content mb-4">JSON统计信息</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-primary">{{ jsonStats.size }}</div>
            <div class="text-sm text-base-content/60">文件大小</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-secondary">{{ jsonStats.keys }}</div>
            <div class="text-sm text-base-content/60">键数量</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-accent">{{ jsonStats.depth }}</div>
            <div class="text-sm text-base-content/60">嵌套深度</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-info">{{ jsonStats.type }}</div>
            <div class="text-sm text-base-content/60">数据类型</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const inputJson = ref(localStorage.getItem('json-formatter-input') || '')
const formattedJson = ref('')
const hasError = ref(false)
const errorMessage = ref('')
const indentSize = ref('2')

// 对比模式相关状态
const currentMode = ref<'format' | 'diff'>('format')
const jsonA = ref('')
const jsonB = ref('')
const hasErrorA = ref(false)
const hasErrorB = ref(false)
const errorMessageA = ref('')
const errorMessageB = ref('')
const autoFormatA = ref(false)
const autoFormatB = ref(false)

// 移动端相关状态
const mobileTab = ref<'A' | 'B'>('A')
const setMobileTab = (tab: 'A' | 'B') => {
  mobileTab.value = tab
}

// 移动端手势处理
const handleTouchStart = ref({ x: 0, y: 0 })
const handleTouchMove = (event: TouchEvent) => {
  if (!handleTouchStart.value.x || !handleTouchStart.value.y) return

  const deltaX = event.touches[0].clientX - handleTouchStart.value.x
  const deltaY = event.touches[0].clientY - handleTouchStart.value.y

  // 只处理水平滑动，忽略垂直滑动
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
    if (deltaX > 0 && mobileTab.value === 'B') {
      setMobileTab('A')
    } else if (deltaX < 0 && mobileTab.value === 'A') {
      setMobileTab('B')
    }
    handleTouchStart.value = { x: 0, y: 0 }
  }
}

const initTouchStart = (event: TouchEvent) => {
  handleTouchStart.value = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
  }
}

// 差异对比结果
interface DiffItem {
  path: string
  type: 'added' | 'removed' | 'changed'
  oldValue?: any
  newValue?: any
}

interface DiffResult {
  identical: boolean
  differences: DiffItem[]
}

const diffResult = ref<DiffResult | null>(null)

// JSON统计信息
interface JsonStats {
  size: string
  keys: number
  depth: number
  type: string
}

const jsonStats = ref<JsonStats | null>(null)

// 示例JSON数据
const exampleJson = `{
  "name": "张三",
  "age": 25,
  "email": "zhangsan@example.com",
  "address": {
    "city": "北京",
    "district": "朝阳区",
    "street": "建国路123号"
  },
  "hobbies": ["读书", "旅游", "摄影"],
  "isActive": true,
  "profile": {
    "bio": "软件开发工程师",
    "skills": ["JavaScript", "Vue.js", "Node.js"],
    "experience": {
      "years": 3,
      "companies": ["公司A", "公司B"]
    }
  }
}`


// 返回上一页
const goBack = () => {
  router.back()
}

// 处理输入变化
const handleInputChange = () => {
  if (!inputJson.value.trim()) {
    hasError.value = false
    errorMessage.value = ''
    formattedJson.value = ''
    jsonStats.value = null
    return
  }

  // 自动验证
  validateJson()
}

// 验证JSON
const validateJson = () => {
  if (!inputJson.value.trim()) {
    hasError.value = false
    errorMessage.value = ''
    return
  }

  try {
    const parsed = JSON.parse(inputJson.value)
    hasError.value = false
    errorMessage.value = ''

    // 生成统计信息
    generateStats(parsed)

    return parsed
  } catch (error) {
    hasError.value = true
    errorMessage.value = error instanceof Error ? error.message : '未知错误'
    jsonStats.value = null
    return null
  }
}

// 格式化JSON
const formatJson = () => {
  const parsed = validateJson()
  if (parsed !== null) {
    const indent = indentSize.value === 'tab' ? '\t' : parseInt(indentSize.value)
    formattedJson.value = JSON.stringify(parsed, null, indent)
  }
}

// 压缩JSON
const compressJson = () => {
  const parsed = validateJson()
  if (parsed !== null) {
    formattedJson.value = JSON.stringify(parsed)
  }
}

// 生成统计信息
const generateStats = (data: any) => {
  const jsonString = JSON.stringify(data)
  const sizeInBytes = new Blob([jsonString]).size

  // 格式化文件大小
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // 计算键数量
  const countKeys = (obj: any): number => {
    if (typeof obj !== 'object' || obj === null) return 0

    let count = 0
    if (Array.isArray(obj)) {
      obj.forEach(item => {
        count += countKeys(item)
      })
    } else {
      count += Object.keys(obj).length
      Object.values(obj).forEach(value => {
        count += countKeys(value)
      })
    }
    return count
  }

  // 计算嵌套深度
  const calculateDepth = (obj: any): number => {
    if (typeof obj !== 'object' || obj === null) return 0

    let maxDepth = 0
    if (Array.isArray(obj)) {
      obj.forEach(item => {
        maxDepth = Math.max(maxDepth, calculateDepth(item))
      })
    } else {
      Object.values(obj).forEach(value => {
        maxDepth = Math.max(maxDepth, calculateDepth(value))
      })
    }
    return maxDepth + 1
  }

  // 确定数据类型
  const getDataType = (data: any): string => {
    if (Array.isArray(data)) return 'Array'
    if (typeof data === 'object' && data !== null) return 'Object'
    return typeof data
  }

  jsonStats.value = {
    size: formatSize(sizeInBytes),
    keys: countKeys(data),
    depth: calculateDepth(data),
    type: getDataType(data)
  }
}

// 复制结果
const copyResult = async () => {
  if (!formattedJson.value) return

  try {
    await navigator.clipboard.writeText(formattedJson.value)
    // 这里可以添加成功提示
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 下载JSON文件
const downloadJson = () => {
  if (!formattedJson.value) return

  const blob = new Blob([formattedJson.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'formatted.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 加载示例
const loadExample = () => {
  inputJson.value = exampleJson
  handleInputChange()
}

// 清空输入
const clearInput = () => {
  inputJson.value = ''
  formattedJson.value = ''
  hasError.value = false
  errorMessage.value = ''
  jsonStats.value = null
  localStorage.removeItem('json-formatter-input')
}

// 监听输入变化
watch(inputJson, () => {
  if (inputJson.value.trim()) {
    formatJson()
  }
  // 持久化到localStorage
  localStorage.setItem('json-formatter-input', inputJson.value)
})

// 模式切换方法
const switchMode = (mode: 'format' | 'diff') => {
  currentMode.value = mode
  if (mode === 'diff') {
    diffResult.value = null
  }
}

// JSON A 相关方法
const handleJsonAChange = () => {
  try {
    if (jsonA.value.trim()) {
      JSON.parse(jsonA.value)
      hasErrorA.value = false
      errorMessageA.value = ''
    }
  } catch (error) {
    hasErrorA.value = true
    errorMessageA.value = error instanceof Error ? error.message : '解析错误'
  }
}

const clearJsonA = () => {
  jsonA.value = ''
  hasErrorA.value = false
  errorMessageA.value = ''
  diffResult.value = null
}

const loadExampleA = () => {
  jsonA.value = exampleJson
  handleJsonAChange()
}

// JSON B 相关方法
const handleJsonBChange = () => {
  try {
    if (jsonB.value.trim()) {
      JSON.parse(jsonB.value)
      hasErrorB.value = false
      errorMessageB.value = ''
    }
  } catch (error) {
    hasErrorB.value = true
    errorMessageB.value = error instanceof Error ? error.message : '解析错误'
  }
}

const clearJsonB = () => {
  jsonB.value = ''
  hasErrorB.value = false
  errorMessageB.value = ''
  diffResult.value = null
}

const loadExampleB = () => {
  const exampleB = `{
  "name": "李四",
  "age": 28,
  "email": "lisi@example.com",
  "address": {
    "city": "上海",
    "district": "浦东新区",
    "street": "世纪大道456号"
  },
  "hobbies": ["读书", "游戏", "音乐"],
  "isActive": false,
  "profile": {
    "bio": "产品经理",
    "skills": ["Product Design", "User Research", "Agile"],
    "experience": {
      "years": 5,
      "companies": ["公司C", "公司D", "公司E"]
    }
  }
}`
  jsonB.value = exampleB
  handleJsonBChange()
}

// 深度对比两个对象
const deepCompare = (obj1: any, obj2: any, path = ''): DiffItem[] => {
  const differences: DiffItem[] = []

  // 处理基本类型
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    if (obj1 !== obj2) {
      differences.push({
        path: path || 'root',
        type: 'changed',
        oldValue: obj1,
        newValue: obj2
      })
    }
    return differences
  }

  // 获取所有键
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  const allKeys = new Set([...keys1, ...keys2])

  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key
    const hasKey1 = key in obj1
    const hasKey2 = key in obj2

    if (!hasKey1 && hasKey2) {
      // 新增的键
      differences.push({
        path: currentPath,
        type: 'added',
        newValue: obj2[key]
      })
    } else if (hasKey1 && !hasKey2) {
      // 删除的键
      differences.push({
        path: currentPath,
        type: 'removed',
        oldValue: obj1[key]
      })
    } else if (hasKey1 && hasKey2) {
      // 递归比较
      differences.push(...deepCompare(obj1[key], obj2[key], currentPath))
    }
  }

  return differences
}

// JSON对比方法
const compareJson = () => {
  try {
    const parsedA = JSON.parse(jsonA.value)
    const parsedB = JSON.parse(jsonB.value)

    const differences = deepCompare(parsedA, parsedB)

    diffResult.value = {
      identical: differences.length === 0,
      differences
    }
  } catch (error) {
    console.error('JSON对比失败:', error)
  }
}

// 导出差异结果
const exportDiff = () => {
  if (!diffResult.value) return

  const diffReport = {
    timestamp: new Date().toISOString(),
    identical: diffResult.value.identical,
    differences: diffResult.value.differences,
    summary: {
      totalDifferences: diffResult.value.differences.length,
      added: diffResult.value.differences.filter(d => d.type === 'added').length,
      removed: diffResult.value.differences.filter(d => d.type === 'removed').length,
      changed: diffResult.value.differences.filter(d => d.type === 'changed').length
    }
  }

  const blob = new Blob([JSON.stringify(diffReport, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `json-diff-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 新增高亮方法
const highlightedJson = computed(() => {
  if (!formattedJson.value) return ''
  let json = formattedJson.value
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  // 先高亮key（带冒号）
  json = json.replace(/("[^"]+")(?=\s*:)/g, '<span class="json-key">$1</span>')
  // 再高亮value的字符串（冒号后，非key）
  json = json.replace(/(:\s*)"(.*?)"/g, '$1<span class="json-string">"$2"</span>')
  // 数字
  json = json.replace(/(:\s*)(-?\d+(?:\.\d+)?)/g, '$1<span class="json-number">$2</span>')
  // 布尔
  json = json.replace(/(:\s*)(true|false)/g, '$1<span class="json-boolean">$2</span>')
  // null
  json = json.replace(/(:\s*)(null)/g, '$1<span class="json-null">$2</span>')
  return json
})
</script>

<style scoped>
.json-highlight {
  color: hsl(var(--bc));
}

/* JSON语法高亮样式 */
.json-highlight .string {
  color: #22c55e;
}

.json-highlight .number {
  color: #3b82f6;
}

.json-highlight .boolean {
  color: #f59e0b;
}

.json-highlight .null {
  color: #ef4444;
}

.json-highlight .key {
  color: #8b5cf6;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .textarea {
    height: calc(100vh - 20rem);
    min-height: 16rem;
    font-size: 14px;
  }

  pre {
    font-size: 14px;
  }

  .btn {
    min-height: 2.5rem;
    height: 2.5rem;
    min-width: 2.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .btn-sm {
    min-height: 2rem;
    height: 2rem;
    min-width: 2rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    font-size: 0.875rem;
  }

  pre {
    height: 16rem;
  }
}

.custom-json-viewer {
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  /* 与 rounded-lg 一致 */
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
  background: #fff;
  /* 与 textarea-bordered 默认一致 */
  padding: 0;
  /* 移除容器内边距，由内部json-pre控制 */
  min-height: 20rem;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Menlo', 'Courier', monospace;
}

.dark .custom-json-viewer {
  background: #23272e;
  border-color: #2a2e37;
}

.textarea,
textarea {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Menlo', 'Courier', monospace;
  font-size: 15px;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
  background: #fff;
  padding: 0.75rem !important;
  /* 统一内边距 */
  line-height: 1.7;
  /* 与格式化结果保持一致 */
  white-space: pre-wrap;
  /* 与格式化结果完全一致 */
  word-break: break-all;
  /* 与格式化结果完全一致 */
}

.json-pre {
  margin: 0;
  font-size: 15px;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Menlo', 'Courier', monospace;
  background: transparent;
  color: #22292f;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-all;
  padding: 0.75rem;
  /* 统一内边距 */
}

.dark .json-pre {
  color: #e5e7eb;
}

/* VSCode风格的JSON语法高亮 */
.json-key {
  color: #0ea5e9;
  font-weight: 500;
}

/* 蓝色键名 */
.json-string {
  color: #dc2626;
}

/* 红色字符串值 */
.json-number {
  color: #059669;
}

/* 绿色数字 */
.json-boolean {
  color: #7c3aed;
}

/* 紫色布尔值 */
.json-null {
  color: #6b7280;
  font-style: italic;
}

/* 灰色null值 */
</style>
