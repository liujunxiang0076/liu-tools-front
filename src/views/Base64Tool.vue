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
          <span class="text-2xl md:text-3xl">🔐</span>
          <h1 class="text-xl md:text-2xl font-bold text-base-content">Base64编码解码</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          Base64编码和解码工具，支持文本和文件的编码转换
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
        <!-- 操作选择 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex flex-wrap gap-4 items-center justify-center">
            <button 
              @click="operation = 'encode'"
              :class="['btn', operation === 'encode' ? 'btn-primary' : 'btn-outline']"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              编码
            </button>
            <button 
              @click="operation = 'decode'"
              :class="['btn', operation === 'decode' ? 'btn-primary' : 'btn-outline']"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
              </svg>
              解码
            </button>
          </div>
        </div>

        <!-- 文本处理区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 输入区域 -->
          <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-base-content">
                {{ operation === 'encode' ? '原始文本' : 'Base64编码' }}
              </h2>
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
                :placeholder="operation === 'encode' ? '请输入要编码的文本...' : '请输入要解码的Base64字符串...'"
                class="textarea textarea-bordered w-full h-64 font-mono text-sm resize-none"
                :class="{ 'textarea-error': textError }"
              ></textarea>
              
              <!-- 字符计数 -->
              <div class="absolute bottom-2 right-2 text-xs text-base-content/50">
                {{ textInput.length }} 字符
              </div>
            </div>
            
            <!-- 错误提示 -->
            <div v-if="textError" class="mt-3 p-3 bg-error/10 border border-error/20 rounded-lg">
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <div>
                  <div class="text-sm font-medium text-error">{{ operation === 'encode' ? '编码' : '解码' }}错误</div>
                  <div class="text-xs text-error/80 mt-1">{{ textErrorMessage }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 输出区域 -->
          <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-base-content">
                {{ operation === 'encode' ? 'Base64编码' : '解码结果' }}
              </h2>
              <div class="flex gap-2">
                <button 
                  @click="copyTextResult"
                  class="btn btn-sm btn-primary"
                  :disabled="!textOutput || textError"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                  复制
                </button>
                <button 
                  @click="downloadTextResult"
                  class="btn btn-sm btn-outline"
                  :disabled="!textOutput || textError"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  下载
                </button>
              </div>
            </div>
            
            <div class="relative">
              <pre 
                class="bg-base-200 p-4 rounded-lg h-64 overflow-auto text-sm font-mono whitespace-pre-wrap"
                :class="{ 'text-base-content/50': textError }"
              >{{ textOutput || (textError ? '处理失败，请检查输入' : '处理结果将在此显示...') }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- 文件模式 -->
      <div v-if="currentMode === 'file'" class="space-y-6">
        <!-- 文件上传区域 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h2 class="text-lg font-semibold text-base-content mb-4">文件处理</h2>
          
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
              支持所有文件类型，最大 10MB
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
              @click="encodeFile"
              class="btn btn-primary"
              :disabled="isProcessing"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              {{ isProcessing ? '处理中...' : '编码为Base64' }}
            </button>
          </div>
        </div>

        <!-- 文件处理结果 -->
        <div v-if="fileResult" class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">Base64编码结果</h2>
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
              <button 
                @click="downloadFileResult"
                class="btn btn-sm btn-outline"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                下载
              </button>
            </div>
          </div>
          
          <div class="relative">
            <pre class="bg-base-200 p-4 rounded-lg h-64 overflow-auto text-sm font-mono whitespace-pre-wrap break-all">{{ fileResult }}</pre>
          </div>
          
          <!-- 结果统计 -->
          <div class="mt-4 flex flex-wrap gap-4 text-sm text-base-content/60">
            <span>原始大小: {{ formatFileSize(selectedFile.size) }}</span>
            <span>编码后大小: {{ formatFileSize(fileResult.length) }}</span>
            <span>增长率: {{ ((fileResult.length / selectedFile.size - 1) * 100).toFixed(1) }}%</span>
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
const operation = ref<'encode' | 'decode'>('encode')
const textInput = ref('')
const textOutput = ref('')
const textError = ref(false)
const textErrorMessage = ref('')
const selectedFile = ref<File | null>(null)
const fileResult = ref('')
const isProcessing = ref(false)
const isDragging = ref(false)

// 文件输入引用
const fileInput = ref<HTMLInputElement>()

// 示例文本
const exampleTexts = {
  encode: 'Hello, World! 你好，世界！',
  decode: 'SGVsbG8sIFdvcmxkISDkvaDlpb3vvIzkuJbnlYzvvIE='
}

// 处理文本输入变化
const handleTextInputChange = () => {
  if (!textInput.value.trim()) {
    textOutput.value = ''
    textError.value = false
    textErrorMessage.value = ''
    return
  }
  
  processText()
}

// 处理文本编码/解码
const processText = () => {
  if (!textInput.value.trim()) return
  
  try {
    if (operation.value === 'encode') {
      // 编码
      textOutput.value = btoa(unescape(encodeURIComponent(textInput.value)))
    } else {
      // 解码
      textOutput.value = decodeURIComponent(escape(atob(textInput.value)))
    }
    textError.value = false
    textErrorMessage.value = ''
  } catch (error) {
    textError.value = true
    textErrorMessage.value = error instanceof Error ? error.message : '处理失败'
    textOutput.value = ''
  }
}

// 复制文本结果
const copyTextResult = async () => {
  if (!textOutput.value) return
  
  try {
    await navigator.clipboard.writeText(textOutput.value)
    // 可以添加成功提示
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 下载文本结果
const downloadTextResult = () => {
  if (!textOutput.value) return
  
  const blob = new Blob([textOutput.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${operation.value === 'encode' ? 'encoded' : 'decoded'}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 清空文本输入
const clearTextInput = () => {
  textInput.value = ''
  textOutput.value = ''
  textError.value = false
  textErrorMessage.value = ''
}

// 加载文本示例
const loadTextExample = () => {
  textInput.value = exampleTexts[operation.value]
  handleTextInputChange()
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedFile.value = file
    fileResult.value = ''
  }
}

// 处理文件拖拽
const handleFileDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  
  const file = event.dataTransfer?.files[0]
  if (file) {
    selectedFile.value = file
    fileResult.value = ''
  }
}

// 移除文件
const removeFile = () => {
  selectedFile.value = null
  fileResult.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 编码文件
const encodeFile = async () => {
  if (!selectedFile.value) return
  
  isProcessing.value = true
  
  try {
    const arrayBuffer = await selectedFile.value.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // 转换为Base64
    let binary = ''
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i])
    }
    
    fileResult.value = btoa(binary)
  } catch (error) {
    console.error('文件编码失败:', error)
  } finally {
    isProcessing.value = false
  }
}

// 复制文件结果
const copyFileResult = async () => {
  if (!fileResult.value) return
  
  try {
    await navigator.clipboard.writeText(fileResult.value)
    // 可以添加成功提示
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 下载文件结果
const downloadFileResult = () => {
  if (!fileResult.value) return
  
  const blob = new Blob([fileResult.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${selectedFile.value?.name || 'file'}.base64.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 监听操作变化
watch(operation, () => {
  if (textInput.value) {
    handleTextInputChange()
  }
})

// 监听模式变化
watch(currentMode, () => {
  // 清空状态
  clearTextInput()
  removeFile()
})
</script>

<style scoped>
/* 响应式调整 */
@media (max-width: 768px) {
  .textarea {
    height: 12rem;
  }
  
  pre {
    height: 12rem;
  }
}
</style> 
