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
          <span class="text-2xl md:text-3xl">📝</span>
          <h1 class="text-xl md:text-2xl font-bold text-base-content">文本差异对比</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          比较两段文本的差异，高亮显示不同之处，支持逐行对比
        </p>
      </div>

      <!-- 对比选项 -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-lg mb-6">
        <h2 class="text-lg font-semibold text-base-content mb-4">对比选项</h2>
        <div class="flex flex-wrap gap-4">
          <label class="label cursor-pointer gap-2">
            <input
              v-model="ignoreCase"
              type="checkbox"
              class="checkbox checkbox-primary"
              @change="compareTexts"
            />
            <span class="label-text">忽略大小写</span>
          </label>
          <label class="label cursor-pointer gap-2">
            <input
              v-model="ignoreWhitespace"
              type="checkbox"
              class="checkbox checkbox-primary"
              @change="compareTexts"
            />
            <span class="label-text">忽略空格</span>
          </label>
          <label class="label cursor-pointer gap-2">
            <input
              v-model="trimLines"
              type="checkbox"
              class="checkbox checkbox-primary"
              @change="compareTexts"
            />
            <span class="label-text">忽略行首尾空格</span>
          </label>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- 文本A -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">文本 A</h2>
            <div class="flex gap-2">
              <button 
                @click="clearTextA"
                class="btn btn-sm btn-ghost"
                :disabled="!textA"
              >
                清空
              </button>
              <button 
                @click="loadExampleA"
                class="btn btn-sm btn-outline"
              >
                示例
              </button>
            </div>
          </div>
          
          <textarea
            v-model="textA"
            @input="compareTexts"
            placeholder="请输入第一段文本..."
            class="textarea textarea-bordered w-full h-64 font-mono text-sm resize-none"
          ></textarea>
          
          <div class="mt-2 text-xs text-base-content/50">
            {{ textA.split('\n').length }} 行 · {{ textA.length }} 字符
          </div>
        </div>

        <!-- 文本B -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">文本 B</h2>
            <div class="flex gap-2">
              <button 
                @click="clearTextB"
                class="btn btn-sm btn-ghost"
                :disabled="!textB"
              >
                清空
              </button>
              <button 
                @click="loadExampleB"
                class="btn btn-sm btn-outline"
              >
                示例
              </button>
            </div>
          </div>
          
          <textarea
            v-model="textB"
            @input="compareTexts"
            placeholder="请输入第二段文本..."
            class="textarea textarea-bordered w-full h-64 font-mono text-sm resize-none"
          ></textarea>
          
          <div class="mt-2 text-xs text-base-content/50">
            {{ textB.split('\n').length }} 行 · {{ textB.length }} 字符
          </div>
        </div>
      </div>

      <!-- 对比结果 -->
      <div v-if="diffResult" class="bg-base-100 rounded-2xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-base-content">
            对比结果
            <span v-if="diffResult.identical" class="text-success ml-2">✓ 完全相同</span>
            <span v-else class="text-warning ml-2">
              ⚠ 发现 {{ diffResult.differences }} 处差异
            </span>
          </h2>
        </div>

        <!-- 统计信息 -->
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="text-center p-3 bg-success/10 rounded-lg">
            <div class="text-2xl font-bold text-success">{{ diffResult.added }}</div>
            <div class="text-sm text-base-content/60">新增行</div>
          </div>
          <div class="text-center p-3 bg-error/10 rounded-lg">
            <div class="text-2xl font-bold text-error">{{ diffResult.removed }}</div>
            <div class="text-sm text-base-content/60">删除行</div>
          </div>
          <div class="text-center p-3 bg-warning/10 rounded-lg">
            <div class="text-2xl font-bold text-warning">{{ diffResult.modified }}</div>
            <div class="text-sm text-base-content/60">修改行</div>
          </div>
        </div>

        <!-- 差异详情 -->
        <div class="overflow-x-auto max-h-96 overflow-y-auto border border-base-300 rounded-lg">
          <div class="font-mono text-sm">
            <div
              v-for="(line, index) in diffResult.lines"
              :key="index"
              class="flex items-start hover:bg-base-200/50"
              :class="{
                'bg-success/10': line.type === 'added',
                'bg-error/10': line.type === 'removed',
                'bg-warning/10': line.type === 'modified'
              }"
            >
              <div class="w-16 text-center py-2 px-2 text-base-content/50 border-r border-base-300 flex-shrink-0">
                {{ line.lineNum }}
              </div>
              <div class="w-8 text-center py-2 px-2 border-r border-base-300 flex-shrink-0">
                <span v-if="line.type === 'added'" class="text-success">+</span>
                <span v-else-if="line.type === 'removed'" class="text-error">-</span>
                <span v-else-if="line.type === 'modified'" class="text-warning">~</span>
                <span v-else class="text-base-content/30">=</span>
              </div>
              <div class="flex-1 py-2 px-4 whitespace-pre-wrap break-all">{{ line.content }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="bg-base-100 rounded-2xl p-12 shadow-lg text-center">
        <div class="text-6xl mb-4">📝</div>
        <p class="text-base-content/60">输入两段文本开始对比</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useToolNavigation } from '@/composables/useToolNavigation'

const { goBack } = useToolNavigation()

const textA = ref('')
const textB = ref('')
const ignoreCase = ref(false)
const ignoreWhitespace = ref(false)
const trimLines = ref(false)

interface DiffLine {
  lineNum: number
  type: 'added' | 'removed' | 'modified' | 'unchanged'
  content: string
}

interface DiffResult {
  identical: boolean
  differences: number
  added: number
  removed: number
  modified: number
  lines: DiffLine[]
}

const diffResult = ref<DiffResult | null>(null)


const processLine = (line: string): string => {
  let processed = line
  
  if (trimLines.value) {
    processed = processed.trim()
  }
  
  if (ignoreWhitespace.value) {
    processed = processed.replace(/\s+/g, '')
  }
  
  if (ignoreCase.value) {
    processed = processed.toLowerCase()
  }
  
  return processed
}

const compareTexts = () => {
  if (!textA.value && !textB.value) {
    diffResult.value = null
    return
  }

  const linesA = textA.value.split('\n')
  const linesB = textB.value.split('\n')
  const maxLines = Math.max(linesA.length, linesB.length)
  
  const lines: DiffLine[] = []
  let added = 0
  let removed = 0
  let modified = 0
  let differences = 0

  for (let i = 0; i < maxLines; i++) {
    const lineA = linesA[i] || ''
    const lineB = linesB[i] || ''
    
    const processedA = processLine(lineA)
    const processedB = processLine(lineB)

    if (i >= linesA.length) {
      // B中新增的行
      lines.push({
        lineNum: i + 1,
        type: 'added',
        content: lineB
      })
      added++
      differences++
    } else if (i >= linesB.length) {
      // A中被删除的行
      lines.push({
        lineNum: i + 1,
        type: 'removed',
        content: lineA
      })
      removed++
      differences++
    } else if (processedA !== processedB) {
      // 修改的行
      lines.push({
        lineNum: i + 1,
        type: 'modified',
        content: `A: ${lineA}\nB: ${lineB}`
      })
      modified++
      differences++
    } else {
      // 相同的行
      lines.push({
        lineNum: i + 1,
        type: 'unchanged',
        content: lineA
      })
    }
  }

  diffResult.value = {
    identical: differences === 0,
    differences,
    added,
    removed,
    modified,
    lines
  }
}

const clearTextA = () => {
  textA.value = ''
  compareTexts()
}

const clearTextB = () => {
  textB.value = ''
  compareTexts()
}

const loadExampleA = () => {
  textA.value = `Hello World
This is a test
Line 3
Line 4`
  compareTexts()
}

const loadExampleB = () => {
  textB.value = `Hello World
This is a TEST
Line 3 modified
Line 5`
  compareTexts()
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
