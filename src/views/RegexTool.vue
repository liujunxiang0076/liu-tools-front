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
          <span class="text-2xl md:text-3xl">🔍</span>
          <h1 class="text-xl md:text-2xl font-bold text-base-content">正则表达式测试</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          正则表达式在线测试和验证工具，实时匹配结果预览
        </p>
      </div>

      <!-- 正则表达式输入区域 -->
      <div class="mb-6 bg-base-100 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-semibold text-base-content mb-4">正则表达式</h2>
        
        <div class="space-y-4">
          <!-- 正则表达式输入 -->
          <div>
            <label class="block text-sm font-medium text-base-content/70 mb-2">
              正则表达式
            </label>
            <div class="flex gap-2 items-center">
              <span class="text-lg font-mono text-base-content/60">/</span>
              <input
                v-model="regexPattern"
                type="text"
                placeholder="请输入正则表达式..."
                class="input input-bordered flex-1 font-mono"
                :class="{ 'input-error': regexError }"
                @input="handleRegexInput"
              >
              <span class="text-lg font-mono text-base-content/60">/</span>
              <input
                v-model="regexFlags"
                type="text"
                placeholder="flags"
                class="input input-bordered w-20 font-mono text-center"
                @input="handleRegexInput"
              >
            </div>
            <div class="text-xs text-base-content/60 mt-1">
              常用标志: g(全局), i(忽略大小写), m(多行), s(单行), u(Unicode), y(粘性)
            </div>
          </div>
          
          <!-- 快捷按钮 -->
          <div class="flex flex-wrap gap-2">
            <button 
              @click="loadExample('email')"
              class="btn btn-xs btn-outline"
            >
              邮箱
            </button>
            <button 
              @click="loadExample('phone')"
              class="btn btn-xs btn-outline"
            >
              手机号
            </button>
            <button 
              @click="loadExample('url')"
              class="btn btn-xs btn-outline"
            >
              网址
            </button>
            <button 
              @click="loadExample('ip')"
              class="btn btn-xs btn-outline"
            >
              IP地址
            </button>
            <button 
              @click="loadExample('date')"
              class="btn btn-xs btn-outline"
            >
              日期
            </button>
            <button 
              @click="loadExample('number')"
              class="btn btn-xs btn-outline"
            >
              数字
            </button>
            <button 
              @click="clearRegex"
              class="btn btn-xs btn-ghost"
            >
              清空
            </button>
          </div>
          
          <!-- 错误提示 -->
          <div v-if="regexError" class="p-3 bg-error/10 border border-error/20 rounded-lg">
            <div class="flex items-start gap-2">
              <svg class="w-4 h-4 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <div>
                <div class="text-sm font-medium text-error">正则表达式错误</div>
                <div class="text-xs text-error/80 mt-1">{{ regexError }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 测试文本区域 -->
      <div class="mb-6 bg-base-100 rounded-2xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-base-content">测试文本</h2>
          <div class="flex gap-2">
            <button 
              @click="clearTestText"
              class="btn btn-sm btn-ghost"
              :disabled="!testText"
            >
              清空
            </button>
            <button 
              @click="loadTestExample"
              class="btn btn-sm btn-outline"
            >
              示例
            </button>
          </div>
        </div>
        
        <div class="relative">
          <textarea
            v-model="testText"
            @input="handleTestTextInput"
            placeholder="请输入要测试的文本..."
            class="textarea textarea-bordered w-full h-32 font-mono text-sm resize-none"
          ></textarea>
          
          <!-- 字符计数 -->
          <div class="absolute bottom-2 right-2 text-xs text-base-content/50">
            {{ testText.length }} 字符
          </div>
        </div>
      </div>

      <!-- 匹配结果区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 匹配结果列表 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">匹配结果</h2>
            <div class="flex gap-2">
              <span class="text-sm text-base-content/60">
                {{ matchResults.length }} 个匹配
              </span>
              <button 
                v-if="matchResults.length > 0"
                @click="copyMatches"
                class="btn btn-xs btn-primary"
              >
                复制
              </button>
            </div>
          </div>
          
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div v-if="matchResults.length === 0" class="text-center py-8 text-base-content/40">
              {{ regexError ? '正则表达式有误' : '暂无匹配结果' }}
            </div>
            
            <div v-for="(match, index) in matchResults" :key="index" 
                 class="p-3 bg-base-200 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-base-content">匹配 {{ index + 1 }}</span>
                <span class="text-xs text-base-content/60">
                  位置: {{ match.index }} - {{ match.index + match.match.length }}
                </span>
              </div>
              <div class="font-mono text-sm text-base-content break-all">
                "{{ match.match }}"
              </div>
              
              <!-- 捕获组 -->
              <div v-if="match.groups.length > 0" class="mt-2 space-y-1">
                <div class="text-xs font-medium text-base-content/70">捕获组:</div>
                <div v-for="(group, groupIndex) in match.groups" :key="groupIndex" 
                     class="text-xs font-mono text-base-content/80">
                  <span class="text-base-content/60">{{ groupIndex + 1 }}:</span>
                  "{{ group }}"
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 高亮预览 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">高亮预览</h2>
            <div class="flex items-center gap-2">
              <label class="text-sm text-base-content/60">
                <input 
                  v-model="showLineNumbers"
                  type="checkbox"
                  class="checkbox checkbox-xs mr-1"
                >
                行号
              </label>
            </div>
          </div>
          
          <div class="bg-base-200 rounded-lg p-4 max-h-64 overflow-auto">
            <div v-if="!testText" class="text-center py-8 text-base-content/40">
              输入测试文本后将显示高亮预览
            </div>
            
            <div v-else class="font-mono text-sm whitespace-pre-wrap" v-html="highlightedText"></div>
          </div>
        </div>
      </div>

      <!-- 正则表达式解释 -->
      <div class="mt-6 bg-base-100 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-semibold text-base-content mb-4">正则表达式解释</h2>
        
        <div v-if="!regexPattern" class="text-center py-8 text-base-content/40">
          输入正则表达式后将显示详细解释
        </div>
        
        <div v-else-if="regexError" class="text-center py-8 text-error/60">
          正则表达式有误，无法解释
        </div>
        
        <div v-else class="space-y-4">
          <!-- 基本信息 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-base-200 rounded-lg">
              <div class="text-sm font-medium text-base-content/70 mb-1">表达式</div>
              <div class="font-mono text-sm text-base-content break-all">
                /{{ regexPattern }}/{{ regexFlags }}
              </div>
            </div>
            <div class="p-4 bg-base-200 rounded-lg">
              <div class="text-sm font-medium text-base-content/70 mb-1">标志</div>
              <div class="text-sm text-base-content">
                {{ regexFlags || '无' }}
                <span v-if="regexFlags" class="text-base-content/60 ml-2">
                  ({{ getFlagDescription(regexFlags) }})
                </span>
              </div>
            </div>
            <div class="p-4 bg-base-200 rounded-lg">
              <div class="text-sm font-medium text-base-content/70 mb-1">匹配数量</div>
              <div class="text-sm text-base-content">{{ matchResults.length }}</div>
            </div>
          </div>
          
          <!-- 语法解释 -->
          <div class="p-4 bg-base-200 rounded-lg">
            <div class="text-sm font-medium text-base-content/70 mb-2">语法解释</div>
            <div class="text-sm text-base-content space-y-1">
              <div v-for="explanation in regexExplanation" :key="explanation" 
                   class="flex items-start gap-2">
                <span class="text-primary">•</span>
                <span>{{ explanation }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 常用正则表达式参考 -->
      <div class="mt-6 bg-base-100 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-semibold text-base-content mb-4">常用正则表达式参考</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="ref in regexReference" :key="ref.name" 
               class="p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors cursor-pointer"
               @click="useReference(ref)">
            <div class="flex items-center justify-between mb-2">
              <div class="font-medium text-base-content">{{ ref.name }}</div>
              <button class="btn btn-xs btn-ghost">使用</button>
            </div>
            <div class="font-mono text-xs text-base-content/70 break-all mb-1">
              {{ ref.pattern }}
            </div>
            <div class="text-xs text-base-content/60">{{ ref.description }}</div>
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
const regexPattern = ref('')
const regexFlags = ref('g')
const regexError = ref('')
const testText = ref('')
const matchResults = ref<Array<{
  match: string
  index: number
  groups: string[]
}>>([])
const showLineNumbers = ref(false)

// 正则表达式示例
const regexExamples = {
  email: {
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    flags: 'g',
    testText: 'Contact us at: support@example.com or sales@company.org'
  },
  phone: {
    pattern: '1[3-9]\\d{9}',
    flags: 'g',
    testText: '联系电话：13812345678 或 15987654321'
  },
  url: {
    pattern: 'https?://[\\w\\-]+(\\.[\\w\\-]+)+([\\w\\-\\.,@?^=%&:/~\\+#]*[\\w\\-\\@?^=%&/~\\+#])?',
    flags: 'g',
    testText: 'Visit our website: https://www.example.com or http://blog.example.org/post'
  },
  ip: {
    pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
    flags: 'g',
    testText: 'Server IPs: 192.168.1.1, 10.0.0.1, and 255.255.255.0'
  },
  date: {
    pattern: '\\d{4}-\\d{2}-\\d{2}',
    flags: 'g',
    testText: 'Important dates: 2024-01-01, 2024-12-31, and 2023-06-15'
  },
  number: {
    pattern: '-?\\d+(\\.\\d+)?',
    flags: 'g',
    testText: 'Numbers: 123, -456, 78.9, -0.123, and 1000'
  }
}

// 常用正则表达式参考
const regexReference = [
  {
    name: '邮箱地址',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    description: '匹配标准邮箱地址格式'
  },
  {
    name: '手机号码',
    pattern: '1[3-9]\\d{9}',
    description: '匹配中国大陆手机号码'
  },
  {
    name: '身份证号',
    pattern: '[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]',
    description: '匹配18位身份证号码'
  },
  {
    name: 'URL地址',
    pattern: 'https?://[\\w\\-]+(\\.[\\w\\-]+)+([\\w\\-\\.,@?^=%&:/~\\+#]*[\\w\\-\\@?^=%&/~\\+#])?',
    description: '匹配HTTP/HTTPS网址'
  },
  {
    name: 'IP地址',
    pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
    description: '匹配IPv4地址'
  },
  {
    name: '日期格式',
    pattern: '\\d{4}-\\d{2}-\\d{2}',
    description: '匹配YYYY-MM-DD格式日期'
  },
  {
    name: '数字',
    pattern: '-?\\d+(\\.\\d+)?',
    description: '匹配整数和小数'
  },
  {
    name: '中文字符',
    pattern: '[\\u4e00-\\u9fa5]+',
    description: '匹配中文字符'
  }
]

// 高亮显示的文本
const highlightedText = computed(() => {
  if (!testText.value || !regexPattern.value || regexError.value) {
    return showLineNumbers.value ? addLineNumbers(testText.value) : testText.value
  }
  
  try {
    const regex = new RegExp(regexPattern.value, regexFlags.value)
    let highlighted = testText.value
    
    // 按匹配位置倒序排列，避免替换时位置偏移
    const matches = Array.from(testText.value.matchAll(regex))
      .map(match => ({
        match: match[0],
        index: match.index || 0,
        length: match[0].length
      }))
      .sort((a, b) => b.index - a.index)
    
    // 替换匹配项为高亮标签
    matches.forEach(match => {
      const before = highlighted.slice(0, match.index)
      const matched = highlighted.slice(match.index, match.index + match.length)
      const after = highlighted.slice(match.index + match.length)
      
      highlighted = before + `<mark class="bg-yellow-200 text-yellow-800 px-1 rounded">${matched}</mark>` + after
    })
    
    return showLineNumbers.value ? addLineNumbers(highlighted) : highlighted
  } catch (error) {
    return showLineNumbers.value ? addLineNumbers(testText.value) : testText.value
  }
})

// 添加行号
const addLineNumbers = (text: string): string => {
  const lines = text.split('\n')
  return lines.map((line, index) => {
    const lineNum = `<span class="text-base-content/40 select-none mr-2">${(index + 1).toString().padStart(2, ' ')}:</span>`
    return lineNum + line
  }).join('\n')
}

// 正则表达式解释
const regexExplanation = computed(() => {
  if (!regexPattern.value || regexError.value) return []
  
  const explanations: string[] = []
  const pattern = regexPattern.value
  
  // 基本语法解释
  if (pattern.includes('^')) explanations.push('^ 匹配字符串开始')
  if (pattern.includes('$')) explanations.push('$ 匹配字符串结束')
  if (pattern.includes('\\d')) explanations.push('\\d 匹配数字字符 (0-9)')
  if (pattern.includes('\\w')) explanations.push('\\w 匹配字母、数字、下划线')
  if (pattern.includes('\\s')) explanations.push('\\s 匹配空白字符')
  if (pattern.includes('.')) explanations.push('. 匹配任意字符（除换行符）')
  if (pattern.includes('*')) explanations.push('* 匹配前面的元素零次或多次')
  if (pattern.includes('+')) explanations.push('+ 匹配前面的元素一次或多次')
  if (pattern.includes('?')) explanations.push('? 匹配前面的元素零次或一次')
  if (pattern.includes('|')) explanations.push('| 表示或者（逻辑或）')
  if (pattern.includes('[')) explanations.push('[...] 字符类，匹配括号内的任意字符')
  if (pattern.includes('(')) explanations.push('(...) 捕获组，用于分组和捕获')
  if (pattern.includes('{')) explanations.push('{n,m} 匹配前面的元素n到m次')
  
  return explanations.length > 0 ? explanations : ['基本的字符串匹配']
})

// 获取标志描述
const getFlagDescription = (flags: string): string => {
  const descriptions: string[] = []
  if (flags.includes('g')) descriptions.push('全局匹配')
  if (flags.includes('i')) descriptions.push('忽略大小写')
  if (flags.includes('m')) descriptions.push('多行模式')
  if (flags.includes('s')) descriptions.push('单行模式')
  if (flags.includes('u')) descriptions.push('Unicode模式')
  if (flags.includes('y')) descriptions.push('粘性匹配')
  return descriptions.join(', ')
}

// 处理正则表达式输入
const handleRegexInput = () => {
  regexError.value = ''
  
  if (!regexPattern.value) {
    matchResults.value = []
    return
  }
  
  try {
    const regex = new RegExp(regexPattern.value, regexFlags.value)
    testRegex()
  } catch (error) {
    regexError.value = error instanceof Error ? error.message : '正则表达式语法错误'
    matchResults.value = []
  }
}

// 处理测试文本输入
const handleTestTextInput = () => {
  if (regexPattern.value && !regexError.value) {
    testRegex()
  }
}

// 测试正则表达式
const testRegex = () => {
  if (!regexPattern.value || !testText.value || regexError.value) {
    matchResults.value = []
    return
  }
  
  try {
    const regex = new RegExp(regexPattern.value, regexFlags.value)
    const matches = Array.from(testText.value.matchAll(regex))
    
    matchResults.value = matches.map(match => ({
      match: match[0],
      index: match.index || 0,
      groups: match.slice(1).filter(group => group !== undefined)
    }))
  } catch (error) {
    matchResults.value = []
  }
}

// 加载示例
const loadExample = (type: keyof typeof regexExamples) => {
  const example = regexExamples[type]
  regexPattern.value = example.pattern
  regexFlags.value = example.flags
  testText.value = example.testText
  handleRegexInput()
}

// 加载测试示例
const loadTestExample = () => {
  testText.value = `Hello World! 这是一个测试文本。
邮箱: test@example.com, admin@site.org
电话: 13812345678, 15987654321
网址: https://www.example.com, http://blog.test.org
日期: 2024-01-01, 2023-12-31
数字: 123, -456, 78.9, -0.123`
  handleTestTextInput()
}

// 使用参考
const useReference = (ref: typeof regexReference[0]) => {
  regexPattern.value = ref.pattern
  regexFlags.value = 'g'
  handleRegexInput()
}

// 清空
const clearRegex = () => {
  regexPattern.value = ''
  regexFlags.value = 'g'
  regexError.value = ''
  matchResults.value = []
}

const clearTestText = () => {
  testText.value = ''
  matchResults.value = []
}

// 复制匹配结果
const copyMatches = async () => {
  if (matchResults.value.length === 0) return
  
  const results = matchResults.value.map((match, index) => {
    let result = `匹配 ${index + 1}: "${match.match}"`
    if (match.groups.length > 0) {
      result += `\n  捕获组: ${match.groups.map((group, i) => `${i + 1}:"${group}"`).join(', ')}`
    }
    return result
  }).join('\n\n')
  
  try {
    await navigator.clipboard.writeText(results)
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 监听变化
watch([regexPattern, regexFlags], () => {
  handleRegexInput()
})

watch(testText, () => {
  handleTestTextInput()
})
</script>

<style lang="scss" scoped>
/* 高亮样式 */
:deep(mark) {
  background-color: rgb(254 240 138);
  color: rgb(146 64 14);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .textarea {
    height: 8rem;
  }
}
</style> 
