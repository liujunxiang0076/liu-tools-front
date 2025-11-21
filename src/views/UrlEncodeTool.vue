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
          <h1 class="text-xl md:text-2xl font-bold text-base-content">URL编码解码</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          URL编码和解码工具，支持URL参数解析和查询字符串构建
        </p>
      </div>

      <!-- 操作选择 -->
      <div class="mb-6 bg-base-100 rounded-2xl p-6 shadow-lg">
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
          <button 
            @click="operation = 'parse'"
            :class="['btn', operation === 'parse' ? 'btn-primary' : 'btn-outline']"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            参数解析
          </button>
        </div>
      </div>

      <!-- 编码/解码模式 -->
      <div v-if="operation !== 'parse'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 输入区域 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">
              {{ operation === 'encode' ? '原始文本' : 'URL编码文本' }}
            </h2>
            <div class="flex gap-2">
              <button 
                @click="clearInput"
                class="btn btn-sm btn-ghost"
                :disabled="!input"
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
              v-model="input"
              @input="handleProcess"
              :placeholder="operation === 'encode' ? '请输入需要编码的文本...' : '请输入需要解码的URL编码文本...'"
              class="textarea textarea-bordered w-full h-64 font-mono text-sm resize-none"
            ></textarea>
            
            <div class="absolute bottom-2 right-2 text-xs text-base-content/50">
              {{ input.length }} 字符
            </div>
          </div>
        </div>

        <!-- 输出区域 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">
              {{ operation === 'encode' ? 'URL编码结果' : '解码结果' }}
            </h2>
            <button 
              @click="copyOutput"
              class="btn btn-sm btn-primary"
              :disabled="!output"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              复制
            </button>
          </div>
          
          <div class="relative">
            <textarea
              v-model="output"
              readonly
              placeholder="处理结果将在此显示..."
              class="textarea textarea-bordered w-full h-64 font-mono text-sm resize-none bg-base-200"
            ></textarea>
            
            <div class="absolute bottom-2 right-2 text-xs text-base-content/50">
              {{ output.length }} 字符
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-if="hasError" class="mt-3 p-3 bg-error/10 border border-error/20 rounded-lg">
            <div class="flex items-start gap-2">
              <svg class="w-4 h-4 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <div>
                <div class="text-sm font-medium text-error">处理失败</div>
                <div class="text-xs text-error/80 mt-1">{{ errorMessage }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- URL参数解析模式 -->
      <div v-else class="space-y-6">
        <!-- URL输入 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">URL地址</h2>
            <div class="flex gap-2">
              <button 
                @click="clearInput"
                class="btn btn-sm btn-ghost"
                :disabled="!input"
              >
                清空
              </button>
              <button 
                @click="loadUrlExample"
                class="btn btn-sm btn-outline"
              >
                示例
              </button>
            </div>
          </div>
          
          <input
            v-model="input"
            @input="parseUrl"
            type="text"
            placeholder="请输入完整的URL地址..."
            class="input input-bordered w-full font-mono text-sm"
          />
        </div>

        <!-- 解析结果 -->
        <div v-if="parsedUrl" class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h2 class="text-lg font-semibold text-base-content mb-4">解析结果</h2>
          
          <div class="space-y-4">
            <!-- 协议 -->
            <div class="flex items-start gap-3">
              <div class="text-sm font-medium text-base-content/60 w-24">协议:</div>
              <div class="flex-1 font-mono text-sm text-base-content">{{ parsedUrl.protocol }}</div>
            </div>

            <!-- 主机 -->
            <div class="flex items-start gap-3">
              <div class="text-sm font-medium text-base-content/60 w-24">主机:</div>
              <div class="flex-1 font-mono text-sm text-base-content">{{ parsedUrl.host }}</div>
            </div>

            <!-- 路径 -->
            <div class="flex items-start gap-3">
              <div class="text-sm font-medium text-base-content/60 w-24">路径:</div>
              <div class="flex-1 font-mono text-sm text-base-content">{{ parsedUrl.pathname }}</div>
            </div>

            <!-- 查询参数 -->
            <div v-if="Object.keys(parsedUrl.params).length > 0">
              <div class="text-sm font-medium text-base-content/60 mb-2">查询参数:</div>
              <div class="overflow-x-auto">
                <table class="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th class="text-base-content/70">参数名</th>
                      <th class="text-base-content/70">参数值</th>
                      <th class="text-base-content/70">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(value, key) in parsedUrl.params" :key="key">
                      <td class="font-mono text-sm">{{ key }}</td>
                      <td class="font-mono text-sm">{{ value }}</td>
                      <td>
                        <button 
                          @click="copyParam(key, value)"
                          class="btn btn-xs btn-ghost"
                        >
                          复制
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Hash -->
            <div v-if="parsedUrl.hash" class="flex items-start gap-3">
              <div class="text-sm font-medium text-base-content/60 w-24">Hash:</div>
              <div class="flex-1 font-mono text-sm text-base-content">{{ parsedUrl.hash }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToolNavigation } from '@/composables/useToolNavigation'

const { goBack } = useToolNavigation()

const operation = ref<'encode' | 'decode' | 'parse'>('encode')
const input = ref('')
const output = ref('')
const hasError = ref(false)
const errorMessage = ref('')

interface ParsedUrl {
  protocol: string
  host: string
  pathname: string
  params: Record<string, string>
  hash: string
}

const parsedUrl = ref<ParsedUrl | null>(null)


const handleProcess = () => {
  hasError.value = false
  errorMessage.value = ''
  
  if (!input.value.trim()) {
    output.value = ''
    return
  }

  try {
    if (operation.value === 'encode') {
      output.value = encodeURIComponent(input.value)
    } else {
      output.value = decodeURIComponent(input.value)
    }
  } catch (error) {
    hasError.value = true
    errorMessage.value = error instanceof Error ? error.message : '处理失败'
    output.value = ''
  }
}

const parseUrl = () => {
  if (!input.value.trim()) {
    parsedUrl.value = null
    return
  }

  try {
    const url = new URL(input.value)
    const params: Record<string, string> = {}
    
    url.searchParams.forEach((value, key) => {
      params[key] = value
    })

    parsedUrl.value = {
      protocol: url.protocol,
      host: url.host,
      pathname: url.pathname,
      params,
      hash: url.hash
    }
  } catch (error) {
    parsedUrl.value = null
  }
}

const clearInput = () => {
  input.value = ''
  output.value = ''
  parsedUrl.value = null
  hasError.value = false
  errorMessage.value = ''
}

const loadExample = () => {
  if (operation.value === 'encode') {
    input.value = 'https://example.com/search?q=前端开发&page=1'
  } else {
    input.value = 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3D%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%26page%3D1'
  }
  handleProcess()
}

const loadUrlExample = () => {
  input.value = 'https://example.com/search?q=前端开发&category=技术&page=1#results'
  parseUrl()
}

const copyOutput = async () => {
  if (!output.value) return
  
  try {
    await navigator.clipboard.writeText(output.value)
  } catch (error) {
    console.error('复制失败:', error)
  }
}

const copyParam = async (key: string, value: string) => {
  try {
    await navigator.clipboard.writeText(`${key}=${value}`)
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
  
  .table {
    font-size: 0.875rem;
  }
}
</style>
