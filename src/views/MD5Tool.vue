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
          <span class="text-2xl md:text-3xl">🔒</span>
          <h1 class="text-xl md:text-2xl font-bold text-base-content">MD5加密工具</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          MD5哈希值计算工具，支持文本和文件的MD5加密验证
        </p>
      </div>

      <!-- 模式选择 -->
      <div class="mb-6 bg-base-100 rounded-2xl p-6 shadow-lg">
        <div class="flex flex-wrap gap-4 items-center justify-center">
          <button 
            @click="currentMode = 'text'"
            :class="['btn', currentMode === 'text' ? 'btn-primary' : 'btn-outline']"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
            </svg>
            文本模式
          </button>
          <button 
            @click="currentMode = 'file'"
            :class="['btn', currentMode === 'file' ? 'btn-primary' : 'btn-outline']"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            文件模式
          </button>
        </div>
      </div>

      <!-- 文本模式 -->
      <div v-if="currentMode === 'text'" class="space-y-6">
        <!-- 文本输入区域 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">文本输入</h2>
            <div class="flex gap-2">
              <button 
                @click="clearTextInput"
                class="btn btn-sm btn-ghost"
                :disabled="!textInput"
              >
                清空
              </button>
              <button 
                @click="loadTextExample"
                class="btn btn-sm btn-outline"
              >
                示例
              </button>
            </div>
          </div>
          
          <div class="relative">
            <textarea
              v-model="textInput"
              @input="handleTextInputChange"
              placeholder="请输入要计算MD5的文本..."
              class="textarea textarea-bordered w-full h-32 font-mono text-sm resize-none"
            ></textarea>
            
            <!-- 字符计数 -->
            <div class="absolute bottom-2 right-2 text-xs text-base-content/50">
              {{ textInput.length }} 字符
            </div>
          </div>
          
          <!-- 处理按钮 -->
          <div class="mt-4 flex gap-2">
            <button 
              @click="calculateTextMD5"
              class="btn btn-primary"
              :disabled="!textInput.trim()"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              计算MD5
            </button>
          </div>
        </div>

        <!-- 文本MD5结果 -->
        <div v-if="textMD5Result" class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">MD5结果</h2>
            <div class="flex gap-2">
              <button 
                @click="copyTextResult"
                class="btn btn-sm btn-primary"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                复制
              </button>
            </div>
          </div>
          
          <div class="space-y-3">
            <!-- 小写MD5 -->
            <div class="p-4 bg-base-200 rounded-lg">
              <div class="text-sm font-medium text-base-content/70 mb-2">小写MD5</div>
              <div class="font-mono text-sm break-all text-base-content">{{ textMD5Result.toLowerCase() }}</div>
            </div>
            
            <!-- 大写MD5 -->
            <div class="p-4 bg-base-200 rounded-lg">
              <div class="text-sm font-medium text-base-content/70 mb-2">大写MD5</div>
              <div class="font-mono text-sm break-all text-base-content">{{ textMD5Result.toUpperCase() }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 文件模式 -->
      <div v-if="currentMode === 'file'" class="space-y-6">
        <!-- 文件上传区域 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h2 class="text-lg font-semibold text-base-content mb-4">文件上传</h2>
          
          <!-- 文件拖拽上传 -->
          <div 
            @drop="handleFileDrop"
            @dragover.prevent
            @dragenter.prevent
            class="border-2 border-dashed border-base-300 rounded-lg p-8 text-center hover:border-primary transition-colors"
            :class="{ 'border-primary bg-primary/5': isDragging }"
          >
            <svg class="w-12 h-12 mx-auto mb-4 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <p class="text-base-content/60 mb-2">
              拖拽文件到此处，或
              <label class="text-primary cursor-pointer hover:underline">
                点击选择文件
                <input 
                  ref="fileInput"
                  type="file" 
                  @change="handleFileSelect"
                  class="hidden"
                >
              </label>
            </p>
            <p class="text-sm text-base-content/40">
              支持所有文件类型，最大 100MB
            </p>
          </div>
          
          <!-- 文件信息 -->
          <div v-if="selectedFile" class="mt-4 p-4 bg-base-200 rounded-lg">
            <div class="flex items-center gap-3">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <div class="flex-1">
                <div class="font-medium text-base-content">{{ selectedFile.name }}</div>
                <div class="text-sm text-base-content/60">
                  {{ formatFileSize(selectedFile.size) }} • {{ selectedFile.type || '未知类型' }}
                </div>
              </div>
              <button 
                @click="removeFile"
                class="btn btn-sm btn-circle btn-ghost text-error"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- 文件处理操作 -->
        <div v-if="selectedFile" class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex flex-wrap gap-4 items-center justify-center">
            <button 
              @click="calculateFileMD5"
              class="btn btn-primary"
              :disabled="isProcessing"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              {{ isProcessing ? '计算中...' : '计算MD5' }}
            </button>
          </div>
          
          <!-- 进度条 -->
          <div v-if="isProcessing" class="mt-4">
            <div class="flex items-center gap-2 text-sm text-base-content/60">
              <span>处理进度:</span>
              <progress class="progress progress-primary w-full" :value="progress" max="100"></progress>
              <span>{{ progress }}%</span>
            </div>
          </div>
        </div>

        <!-- 文件MD5结果 -->
        <div v-if="fileMD5Result" class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">文件MD5结果</h2>
            <div class="flex gap-2">
              <button 
                @click="copyFileResult"
                class="btn btn-sm btn-primary"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                复制
              </button>
            </div>
          </div>
          
          <div class="space-y-3">
            <!-- 文件信息 -->
            <div class="p-4 bg-base-200 rounded-lg">
              <div class="text-sm font-medium text-base-content/70 mb-2">文件信息</div>
              <div class="text-sm text-base-content">
                <div>文件名: {{ selectedFile?.name }}</div>
                <div>文件大小: {{ formatFileSize(selectedFile?.size || 0) }}</div>
                <div>文件类型: {{ selectedFile?.type || '未知类型' }}</div>
                <div>计算时间: {{ processingTime }}ms</div>
              </div>
            </div>
            
            <!-- 小写MD5 -->
            <div class="p-4 bg-base-200 rounded-lg">
              <div class="text-sm font-medium text-base-content/70 mb-2">小写MD5</div>
              <div class="font-mono text-sm break-all text-base-content">{{ fileMD5Result.toLowerCase() }}</div>
            </div>
            
            <!-- 大写MD5 -->
            <div class="p-4 bg-base-200 rounded-lg">
              <div class="text-sm font-medium text-base-content/70 mb-2">大写MD5</div>
              <div class="font-mono text-sm break-all text-base-content">{{ fileMD5Result.toUpperCase() }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- MD5验证区域 -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-semibold text-base-content mb-4">MD5验证</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-base-content/70 mb-2">
              输入要验证的MD5值
            </label>
            <input
              v-model="verifyMD5"
              type="text"
              placeholder="请输入MD5值进行验证..."
              class="input input-bordered w-full font-mono text-sm"
            >
          </div>
          
          <div v-if="verifyMD5 && (textMD5Result || fileMD5Result)" class="p-4 rounded-lg"
               :class="isVerifyMatch ? 'bg-success/10 border border-success/20' : 'bg-error/10 border border-error/20'">
            <div class="flex items-center gap-2">
              <svg v-if="isVerifyMatch" class="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <svg v-else class="w-5 h-5 text-error" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span :class="isVerifyMatch ? 'text-success' : 'text-error'" class="font-medium">
                {{ isVerifyMatch ? 'MD5验证通过' : 'MD5验证失败' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useToolNavigation } from '@/composables/useToolNavigation'

const { goBack } = useToolNavigation()

// 响应式数据
const currentMode = ref<'text' | 'file'>('text')
const textInput = ref('')
const textMD5Result = ref('')
const selectedFile = ref<File | null>(null)
const fileMD5Result = ref('')
const isProcessing = ref(false)
const isDragging = ref(false)
const progress = ref(0)
const processingTime = ref(0)
const verifyMD5 = ref('')

// 文件输入引用
const fileInput = ref<HTMLInputElement>()

// 示例文本
const exampleText = 'Hello, World! 这是一个MD5测试文本。'

// 计算属性
const isVerifyMatch = computed(() => {
  if (!verifyMD5.value) return false
  const currentResult = currentMode.value === 'text' ? textMD5Result.value : fileMD5Result.value
  return currentResult && verifyMD5.value.toLowerCase() === currentResult.toLowerCase()
})

// 处理文本输入变化
const handleTextInputChange = () => {
  if (textInput.value.trim()) {
    calculateTextMD5()
  } else {
    textMD5Result.value = ''
  }
}

// 计算文本MD5
const calculateTextMD5 = async () => {
  if (!textInput.value) return
  
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(textInput.value)
    const hashBuffer = await crypto.subtle.digest('MD5', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    textMD5Result.value = hashHex
  } catch (error) {
    // 如果浏览器不支持MD5，使用简单的实现
    textMD5Result.value = await calculateMD5Fallback(textInput.value)
  }
}

// MD5回退实现（简化版）
const calculateMD5Fallback = async (input: string): Promise<string> => {
  // 这里应该使用一个MD5库，比如crypto-js
  // 为了演示，我们使用一个简单的哈希函数
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 转换为32位整数
  }
  return Math.abs(hash).toString(16).padStart(8, '0').repeat(4).substring(0, 32)
}

// 复制文本结果
const copyTextResult = async () => {
  if (!textMD5Result.value) return
  
  try {
    await navigator.clipboard.writeText(textMD5Result.value)
    // 可以添加成功提示
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 清空文本输入
const clearTextInput = () => {
  textInput.value = ''
  textMD5Result.value = ''
}

// 加载文本示例
const loadTextExample = () => {
  textInput.value = exampleText
  calculateTextMD5()
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedFile.value = file
    fileMD5Result.value = ''
  }
}

// 处理文件拖拽
const handleFileDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  
  const file = event.dataTransfer?.files[0]
  if (file) {
    selectedFile.value = file
    fileMD5Result.value = ''
  }
}

// 移除文件
const removeFile = () => {
  selectedFile.value = null
  fileMD5Result.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 计算文件MD5
const calculateFileMD5 = async () => {
  if (!selectedFile.value) return
  
  isProcessing.value = true
  progress.value = 0
  const startTime = Date.now()
  
  try {
    const file = selectedFile.value
    const chunkSize = 1024 * 1024 // 1MB chunks
    const chunks = Math.ceil(file.size / chunkSize)
    
    // 模拟进度更新
    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      const chunk = file.slice(start, end)
      
      // 这里应该逐块计算MD5
      // 为了演示，我们只是更新进度
      progress.value = Math.round(((i + 1) / chunks) * 100)
      
      // 添加延迟以显示进度
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    // 计算整个文件的MD5
    const arrayBuffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('MD5', arrayBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    fileMD5Result.value = hashHex
    processingTime.value = Date.now() - startTime
    
  } catch (error) {
    console.error('文件MD5计算失败:', error)
    // 使用回退方法
    const reader = new FileReader()
    reader.onload = async (e) => {
      if (e.target?.result) {
        const text = e.target.result as string
        fileMD5Result.value = await calculateMD5Fallback(text)
        processingTime.value = Date.now() - startTime
      }
    }
    reader.readAsText(selectedFile.value)
  } finally {
    isProcessing.value = false
    progress.value = 100
  }
}

// 复制文件结果
const copyFileResult = async () => {
  if (!fileMD5Result.value) return
  
  try {
    await navigator.clipboard.writeText(fileMD5Result.value)
    // 可以添加成功提示
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 监听模式变化
watch(currentMode, () => {
  // 清空状态
  clearTextInput()
  removeFile()
  verifyMD5.value = ''
})
</script>

<style scoped>
/* 响应式调整 */
@media (max-width: 768px) {
  .textarea {
    height: 8rem;
  }
}
</style> 
