<template>
  <div class="min-h-screen bg-base-200 py-4 md:py-8">
    <div class="container mx-auto px-4 max-w-7xl">
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
          <span class="text-2xl md:text-3xl">📄</span>
          <h1 class="text-xl md:text-2xl font-bold text-base-content">JSON格式化工具</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          JSON数据格式化、压缩和验证工具，支持语法高亮和错误提示
        </p>
      </div>

      <!-- 主要内容区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 输入区域 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">JSON输入</h2>
            <div class="flex gap-2">
              <button 
                @click="clearInput"
                class="btn btn-sm btn-ghost"
                :disabled="!inputJson"
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
          
          <div class="relative">
            <textarea
              v-model="inputJson"
              @input="handleInputChange"
              placeholder="请输入JSON数据..."
              class="textarea textarea-bordered w-full h-[38rem] font-mono text-sm resize-none"
              :class="{ 'textarea-error': hasError }"
            ></textarea>
            
            <!-- 字符计数 -->
            <div class="absolute bottom-2 right-2 text-xs text-base-content/50">
              {{ inputJson.length }} 字符
            </div>
          </div>
          
          <!-- 错误提示 -->
          <div v-if="hasError" class="mt-3 p-3 bg-error/10 border border-error/20 rounded-lg">
            <div class="flex items-start gap-2">
              <svg class="w-4 h-4 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
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
              <button 
                @click="copyResult"
                class="btn btn-sm btn-primary"
                :disabled="!formattedJson || hasError"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                复制
              </button>
              <button 
                @click="downloadJson"
                class="btn btn-sm btn-outline"
                :disabled="!formattedJson || hasError"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
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
            <button 
              @click="formatJson"
              class="btn btn-primary"
              :disabled="!inputJson || hasError"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              格式化
            </button>
            
            <button 
              @click="compressJson"
              class="btn btn-outline"
              :disabled="!inputJson || hasError"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
              </svg>
              压缩
            </button>
            
            <button 
              @click="validateJson"
              class="btn btn-outline"
              :disabled="!inputJson"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
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
// 移除json-viewer相关import
// import { JsonViewer } from 'vue3-json-viewer'
// import 'vue3-json-viewer/dist/vue3-json-viewer.css'

const router = useRouter()

// 响应式数据
const inputJson = ref('')
const formattedJson = ref('')
const hasError = ref(false)
const errorMessage = ref('')
const indentSize = ref('2')

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

// 移除parsedJson和isDarkTheme相关内容
// const parsedJson = computed(() => {
//   if (hasError.value || !inputJson.value.trim()) return null
//   try {
//     return JSON.parse(inputJson.value)
//   } catch {
//     return null
//   }
// })

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
}

// 监听输入变化
watch(inputJson, () => {
  if (inputJson.value.trim()) {
    formatJson()
  }
})

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
    height: 16rem;
  }
  
  pre {
    height: 16rem;
  }
}

.custom-json-viewer {
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem; /* 与 rounded-lg 一致 */
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.06);
  background: #fff; /* 与 textarea-bordered 默认一致 */
  padding: 1.25rem; /* 与输入区内边距一致 */
  min-height: 20rem;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Menlo', 'Courier', monospace;
}
.dark .custom-json-viewer {
  background: #23272e;
  border-color: #2a2e37;
}
.textarea, textarea {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Menlo', 'Courier', monospace;
  font-size: 15px;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.06);
  background: #fff;
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
}
.dark .json-pre {
  color: #e5e7eb;
}
.json-key { color: #8b5cf6; }
.json-string { color: #22c55e; }
.json-number { color: #3b82f6; }
.json-boolean { color: #f59e0b; }
.json-null { color: #ef4444; }
</style> 
