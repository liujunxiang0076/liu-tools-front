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
          <span class="text-2xl md:text-3xl">🔤</span>
          <h1 class="text-xl md:text-2xl font-bold text-base-content">大小写转换</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          文本大小写格式转换工具，支持多种命名规范转换
        </p>
      </div>

      <!-- 输入区域 -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-lg mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-base-content">输入文本</h2>
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
        
        <textarea
          v-model="input"
          @input="handleConvert"
          placeholder="请输入需要转换的文本..."
          class="textarea textarea-bordered w-full h-32 font-mono text-sm resize-none"
        ></textarea>
        
        <div class="mt-2 text-xs text-base-content/50">
          {{ input.length }} 字符
        </div>
      </div>

      <!-- 转换结果 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 大写 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-base-content">全部大写</h3>
            <button 
              @click="copyResult(results.uppercase)"
              class="btn btn-xs btn-ghost"
              :disabled="!results.uppercase"
            >
              复制
            </button>
          </div>
          <div class="p-3 bg-base-200 rounded-lg min-h-[4rem]">
            <code class="text-sm text-base-content break-all">{{ results.uppercase || '转换结果...' }}</code>
          </div>
        </div>

        <!-- 小写 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-base-content">全部小写</h3>
            <button 
              @click="copyResult(results.lowercase)"
              class="btn btn-xs btn-ghost"
              :disabled="!results.lowercase"
            >
              复制
            </button>
          </div>
          <div class="p-3 bg-base-200 rounded-lg min-h-[4rem]">
            <code class="text-sm text-base-content break-all">{{ results.lowercase || '转换结果...' }}</code>
          </div>
        </div>

        <!-- 首字母大写 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-base-content">首字母大写</h3>
            <button 
              @click="copyResult(results.capitalize)"
              class="btn btn-xs btn-ghost"
              :disabled="!results.capitalize"
            >
              复制
            </button>
          </div>
          <div class="p-3 bg-base-200 rounded-lg min-h-[4rem]">
            <code class="text-sm text-base-content break-all">{{ results.capitalize || '转换结果...' }}</code>
          </div>
        </div>

        <!-- 标题格式 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-base-content">标题格式</h3>
            <button 
              @click="copyResult(results.title)"
              class="btn btn-xs btn-ghost"
              :disabled="!results.title"
            >
              复制
            </button>
          </div>
          <div class="p-3 bg-base-200 rounded-lg min-h-[4rem]">
            <code class="text-sm text-base-content break-all">{{ results.title || '转换结果...' }}</code>
          </div>
        </div>

        <!-- 驼峰命名 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-base-content">驼峰命名 (camelCase)</h3>
            <button 
              @click="copyResult(results.camelCase)"
              class="btn btn-xs btn-ghost"
              :disabled="!results.camelCase"
            >
              复制
            </button>
          </div>
          <div class="p-3 bg-base-200 rounded-lg min-h-[4rem]">
            <code class="text-sm text-base-content break-all">{{ results.camelCase || '转换结果...' }}</code>
          </div>
        </div>

        <!-- 帕斯卡命名 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-base-content">帕斯卡命名 (PascalCase)</h3>
            <button 
              @click="copyResult(results.pascalCase)"
              class="btn btn-xs btn-ghost"
              :disabled="!results.pascalCase"
            >
              复制
            </button>
          </div>
          <div class="p-3 bg-base-200 rounded-lg min-h-[4rem]">
            <code class="text-sm text-base-content break-all">{{ results.pascalCase || '转换结果...' }}</code>
          </div>
        </div>

        <!-- 蛇形命名 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-base-content">蛇形命名 (snake_case)</h3>
            <button 
              @click="copyResult(results.snakeCase)"
              class="btn btn-xs btn-ghost"
              :disabled="!results.snakeCase"
            >
              复制
            </button>
          </div>
          <div class="p-3 bg-base-200 rounded-lg min-h-[4rem]">
            <code class="text-sm text-base-content break-all">{{ results.snakeCase || '转换结果...' }}</code>
          </div>
        </div>

        <!-- 短横线命名 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-base-content">短横线命名 (kebab-case)</h3>
            <button 
              @click="copyResult(results.kebabCase)"
              class="btn btn-xs btn-ghost"
              :disabled="!results.kebabCase"
            >
              复制
            </button>
          </div>
          <div class="p-3 bg-base-200 rounded-lg min-h-[4rem]">
            <code class="text-sm text-base-content break-all">{{ results.kebabCase || '转换结果...' }}</code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useToolNavigation } from '@/composables/useToolNavigation'

const { goBack } = useToolNavigation()

const input = ref('')
const results = reactive({
  uppercase: '',
  lowercase: '',
  capitalize: '',
  title: '',
  camelCase: '',
  pascalCase: '',
  snakeCase: '',
  kebabCase: ''
})


const handleConvert = () => {
  if (!input.value.trim()) {
    Object.keys(results).forEach(key => {
      results[key as keyof typeof results] = ''
    })
    return
  }

  const text = input.value

  // 全部大写
  results.uppercase = text.toUpperCase()

  // 全部小写
  results.lowercase = text.toLowerCase()

  // 首字母大写
  results.capitalize = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

  // 标题格式（每个单词首字母大写）
  results.title = text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())

  // 分词（用于后续转换）
  const words = text
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase -> camel Case
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // PASCALCase -> PASCAL Case
    .replace(/[_-]/g, ' ') // snake_case, kebab-case -> space
    .split(/\s+/)
    .filter(word => word.length > 0)

  // 驼峰命名
  results.camelCase = words
    .map((word, index) => 
      index === 0 
        ? word.toLowerCase() 
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('')

  // 帕斯卡命名
  results.pascalCase = words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')

  // 蛇形命名
  results.snakeCase = words
    .map(word => word.toLowerCase())
    .join('_')

  // 短横线命名
  results.kebabCase = words
    .map(word => word.toLowerCase())
    .join('-')
}

const clearInput = () => {
  input.value = ''
  handleConvert()
}

const loadExample = () => {
  input.value = 'hello world example'
  handleConvert()
}

const copyResult = async (text: string) => {
  if (!text) return
  
  try {
    await navigator.clipboard.writeText(text)
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
</style>
