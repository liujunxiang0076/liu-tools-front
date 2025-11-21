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
          <span class="text-2xl md:text-3xl">📊</span>
          <h1 class="text-xl md:text-2xl font-bold text-base-content">文本统计分析</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          统计文本的字数、词数、字符等信息，支持中英文分析
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
          @input="analyze"
          placeholder="请输入需要统计的文本..."
          class="textarea textarea-bordered w-full h-64 font-mono text-sm resize-none"
        ></textarea>
      </div>

      <!-- 统计结果 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <!-- 总字符数 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg text-center">
          <div class="text-3xl font-bold text-primary mb-2">{{ stats.totalChars }}</div>
          <div class="text-sm text-base-content/60">总字符数</div>
        </div>

        <!-- 不含空格 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg text-center">
          <div class="text-3xl font-bold text-secondary mb-2">{{ stats.charsNoSpaces }}</div>
          <div class="text-sm text-base-content/60">不含空格</div>
        </div>

        <!-- 单词数 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg text-center">
          <div class="text-3xl font-bold text-accent mb-2">{{ stats.words }}</div>
          <div class="text-sm text-base-content/60">单词数</div>
        </div>

        <!-- 行数 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg text-center">
          <div class="text-3xl font-bold text-info mb-2">{{ stats.lines }}</div>
          <div class="text-sm text-base-content/60">行数</div>
        </div>

        <!-- 段落数 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg text-center">
          <div class="text-3xl font-bold text-success mb-2">{{ stats.paragraphs }}</div>
          <div class="text-sm text-base-content/60">段落数</div>
        </div>

        <!-- 中文字符 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg text-center">
          <div class="text-3xl font-bold text-warning mb-2">{{ stats.chineseChars }}</div>
          <div class="text-sm text-base-content/60">中文字符</div>
        </div>

        <!-- 英文字符 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg text-center">
          <div class="text-3xl font-bold text-error mb-2">{{ stats.englishChars }}</div>
          <div class="text-sm text-base-content/60">英文字符</div>
        </div>

        <!-- 数字字符 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg text-center">
          <div class="text-3xl font-bold text-primary mb-2">{{ stats.numbers }}</div>
          <div class="text-sm text-base-content/60">数字字符</div>
        </div>
      </div>

      <!-- 详细信息 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 阅读时间 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h3 class="text-lg font-semibold text-base-content mb-4">阅读时间估算</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-base-content/70">慢速阅读 (150字/分)</span>
              <span class="font-semibold text-base-content">{{ readingTime.slow }} 分钟</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-base-content/70">正常阅读 (250字/分)</span>
              <span class="font-semibold text-base-content">{{ readingTime.normal }} 分钟</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-base-content/70">快速阅读 (400字/分)</span>
              <span class="font-semibold text-base-content">{{ readingTime.fast }} 分钟</span>
            </div>
          </div>
        </div>

        <!-- 字符分布 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h3 class="text-lg font-semibold text-base-content mb-4">字符分布</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-base-content/70">字母</span>
              <span class="font-semibold text-base-content">{{ stats.letters }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-base-content/70">空格</span>
              <span class="font-semibold text-base-content">{{ stats.spaces }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-base-content/70">标点符号</span>
              <span class="font-semibold text-base-content">{{ stats.punctuation }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-base-content/70">其他字符</span>
              <span class="font-semibold text-base-content">{{ stats.others }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const input = ref('')
const stats = reactive({
  totalChars: 0,
  charsNoSpaces: 0,
  words: 0,
  lines: 0,
  paragraphs: 0,
  chineseChars: 0,
  englishChars: 0,
  numbers: 0,
  letters: 0,
  spaces: 0,
  punctuation: 0,
  others: 0
})

const readingTime = computed(() => {
  const chars = stats.charsNoSpaces
  return {
    slow: Math.ceil(chars / 150),
    normal: Math.ceil(chars / 250),
    fast: Math.ceil(chars / 400)
  }
})

const goBack = () => {
  router.push('/')
}

const analyze = () => {
  if (!input.value) {
    Object.keys(stats).forEach(key => {
      stats[key as keyof typeof stats] = 0
    })
    return
  }

  const text = input.value

  // 总字符数
  stats.totalChars = text.length

  // 不含空格字符数
  stats.charsNoSpaces = text.replace(/\s/g, '').length

  // 单词数（英文单词 + 中文字符）
  const englishWords = text.match(/[a-zA-Z]+/g) || []
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || []
  stats.words = englishWords.length + chineseChars.length

  // 行数
  stats.lines = text.split('\n').length

  // 段落数（非空行）
  stats.paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length

  // 中文字符数
  stats.chineseChars = chineseChars.length

  // 英文字符数
  stats.englishChars = (text.match(/[a-zA-Z]/g) || []).length

  // 数字字符数
  stats.numbers = (text.match(/\d/g) || []).length

  // 字母数
  stats.letters = stats.englishChars

  // 空格数
  stats.spaces = (text.match(/\s/g) || []).length

  // 标点符号数
  stats.punctuation = (text.match(/[.,;:!?'"()[\]{}<>\/\\|@#$%^&*_+=~`-]/g) || []).length

  // 其他字符数
  stats.others = stats.totalChars - stats.letters - stats.chineseChars - stats.numbers - stats.spaces - stats.punctuation
}

const clearInput = () => {
  input.value = ''
  analyze()
}

const loadExample = () => {
  input.value = `这是一个文本统计示例。
This is a text statistics example.

包含中文、English、数字123和标点符号！
支持多行文本分析。`
  analyze()
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
