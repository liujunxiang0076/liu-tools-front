<template>
  <div class="number-to-chinese-container min-h-screen bg-base-100">
    <!-- 页面标题 -->
    <div class="bg-gradient-to-r from-primary/5 to-secondary/5 py-6 md:py-8">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <div class="flex items-center justify-center mb-4">
            <button 
              @click="goBack"
              class="btn btn-ghost btn-circle mr-4"
              title="返回主页"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 class="text-2xl md:text-4xl font-bold text-base-content">
              🔢 数字转中文大写
            </h1>
          </div>
          <p class="text-sm md:text-lg text-base-content/70 max-w-2xl mx-auto">
            将阿拉伯数字转换为中文大写金额或普通中文数字
          </p>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="container mx-auto px-4 py-6 md:py-8">
      <div class="max-w-4xl mx-auto space-y-6">
        
        <!-- 转换模式选择 -->
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-4 md:p-6">
            <h3 class="card-title text-base md:text-lg mb-4">📋 转换模式</h3>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="mode in modes" 
                :key="mode.id"
                class="btn btn-sm md:btn-md"
                :class="currentMode === mode.id ? 'btn-primary' : 'btn-ghost'"
                @click="currentMode = mode.id"
              >
                {{ mode.icon }} {{ mode.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-4 md:p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="card-title text-base md:text-lg">✏️ 输入数字</h3>
              <button 
                class="btn btn-ghost btn-sm"
                @click="clearInput"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                清空
              </button>
            </div>
            
            <input
              v-model="inputNumber"
              type="text"
              class="input input-bordered w-full text-lg md:text-xl font-mono"
              :placeholder="currentMode === 'money' ? '请输入金额，如：12345.67' : '请输入数字，如：12345'"
              @input="handleInput"
            />
            
            <div class="flex items-center gap-4 mt-3 text-sm text-base-content/60">
              <span>支持范围：</span>
              <span v-if="currentMode === 'money'">0 ~ 9999999999999.99（万亿级）</span>
              <span v-else>0 ~ 9999999999999（万亿级）</span>
            </div>
          </div>
        </div>

        <!-- 转换结果 -->
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-4 md:p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="card-title text-base md:text-lg">📝 转换结果</h3>
              <button 
                class="btn btn-primary btn-sm"
                @click="copyResult"
                :disabled="!result"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                复制
              </button>
            </div>
            
            <div 
              class="min-h-24 p-4 bg-base-100 rounded-lg border border-base-300 flex items-center justify-center"
              :class="{ 'text-error': hasError }"
            >
              <p v-if="result" class="text-xl md:text-2xl font-bold text-center break-all">
                {{ result }}
              </p>
              <p v-else class="text-base-content/40">
                转换结果将显示在这里
              </p>
            </div>

            <!-- 错误提示 -->
            <div v-if="hasError" class="alert alert-error mt-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
          </div>
        </div>

        <!-- 快捷示例 -->
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-4 md:p-6">
            <h3 class="card-title text-base md:text-lg mb-4">💡 快捷示例</h3>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="example in examples" 
                :key="example"
                class="btn btn-outline btn-sm"
                @click="useExample(example)"
              >
                {{ example }}
              </button>
            </div>
          </div>
        </div>

        <!-- 转换说明 -->
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-4 md:p-6">
            <h3 class="card-title text-base md:text-lg mb-4">📖 使用说明</h3>
            <div class="space-y-3 text-sm text-base-content/70">
              <div class="flex items-start gap-2">
                <span class="badge badge-primary badge-sm mt-0.5">1</span>
                <p><strong>金额模式：</strong>将数字转换为中文大写金额格式，如"壹佰贰拾叁元肆角伍分"，常用于财务、发票、支票等场景。</p>
              </div>
              <div class="flex items-start gap-2">
                <span class="badge badge-primary badge-sm mt-0.5">2</span>
                <p><strong>普通模式：</strong>将数字转换为普通中文数字，如"一百二十三"，适用于一般文档书写。</p>
              </div>
              <div class="flex items-start gap-2">
                <span class="badge badge-primary badge-sm mt-0.5">3</span>
                <p><strong>大写模式：</strong>将数字转换为大写中文数字，如"壹佰贰拾叁"，适用于正式文件。</p>
              </div>
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

// 转换模式
const modes = [
  { id: 'money', name: '金额大写', icon: '💰' },
  { id: 'normal', name: '普通中文', icon: '📝' },
  { id: 'upper', name: '大写中文', icon: '🔠' }
]

const currentMode = ref('money')
const inputNumber = ref('')
const result = ref('')
const hasError = ref(false)
const errorMessage = ref('')

// 快捷示例
const examples = computed(() => {
  if (currentMode.value === 'money') {
    return ['0', '10.5', '100', '1234.56', '10000', '123456.78', '1000000', '9876543210.12']
  }
  return ['0', '10', '100', '1234', '10000', '123456', '1000000', '9876543210']
})

// 中文数字映射
const chineseNormal = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
const chineseUpper = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
const unitsNormal = ['', '十', '百', '千']
const unitsUpper = ['', '拾', '佰', '仟']
const bigUnits = ['', '万', '亿', '兆']

// 金额转换
const numberToMoney = (num: number): string => {
  if (num === 0) return '零元整'
  if (num < 0) return '负' + numberToMoney(-num)
  if (num > 9999999999999.99) return '数字超出范围'

  const fraction = ['角', '分']
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const unit = [
    ['元', '万', '亿', '兆'],
    ['', '拾', '佰', '仟']
  ]

  let head = num < 0 ? '负' : ''
  num = Math.abs(num)

  let s = ''

  // 处理小数部分
  const numStr = num.toFixed(2)
  const [intPart, decPart] = numStr.split('.')
  
  const jiao = parseInt(decPart[0])
  const fen = parseInt(decPart[1])

  // 处理整数部分
  const intNum = parseInt(intPart)
  
  if (intNum === 0) {
    if (jiao === 0 && fen === 0) {
      return '零元整'
    }
  } else {
    let intStr = ''
    let zeroFlag = false
    const intNumStr = intNum.toString()
    const len = intNumStr.length
    
    for (let i = 0; i < len; i++) {
      const n = parseInt(intNumStr[i])
      const pos = len - i - 1
      const posInSection = pos % 4
      const section = Math.floor(pos / 4)
      
      if (n === 0) {
        zeroFlag = true
        if (posInSection === 0 && section > 0) {
          // 万、亿、兆位
          intStr += unit[0][section]
          zeroFlag = false
        }
      } else {
        if (zeroFlag) {
          intStr += digit[0]
          zeroFlag = false
        }
        intStr += digit[n] + unit[1][posInSection]
        if (posInSection === 0 && section > 0) {
          intStr += unit[0][section]
        }
      }
    }
    
    // 添加"元"
    if (!intStr.endsWith('万') && !intStr.endsWith('亿') && !intStr.endsWith('兆')) {
      intStr += '元'
    } else {
      intStr += '元'
    }
    
    s = intStr
  }

  // 处理角分
  if (jiao === 0 && fen === 0) {
    s += '整'
  } else {
    if (intNum === 0) {
      // 没有整数部分
      if (jiao > 0) {
        s += digit[jiao] + '角'
      } else {
        s += '零'
      }
      if (fen > 0) {
        s += digit[fen] + '分'
      }
    } else {
      if (jiao > 0) {
        s += digit[jiao] + '角'
      } else if (fen > 0) {
        s += '零'
      }
      if (fen > 0) {
        s += digit[fen] + '分'
      }
    }
  }

  return head + s
}

// 普通中文数字转换
const numberToNormalChinese = (num: number, useUpper: boolean = false): string => {
  if (num === 0) return useUpper ? '零' : '零'
  if (num < 0) return '负' + numberToNormalChinese(-num, useUpper)
  if (num > 9999999999999) return '数字超出范围'

  const digits = useUpper ? chineseUpper : chineseNormal
  const units = useUpper ? unitsUpper : unitsNormal

  num = Math.floor(num)
  
  const convertSection = (n: number): string => {
    if (n === 0) return ''
    
    let result = ''
    let zeroFlag = false
    const str = n.toString()
    const len = str.length
    
    for (let i = 0; i < len; i++) {
      const digit = parseInt(str[i])
      const pos = len - i - 1
      
      if (digit === 0) {
        zeroFlag = true
      } else {
        if (zeroFlag && result) {
          result += digits[0]
          zeroFlag = false
        }
        // 处理"一十"简化为"十"
        if (!useUpper && digit === 1 && pos === 1 && i === 0) {
          result += units[pos]
        } else {
          result += digits[digit] + units[pos]
        }
      }
    }
    
    return result
  }

  let result = ''
  let unitIndex = 0
  
  while (num > 0) {
    const section = num % 10000
    const sectionStr = convertSection(section)
    
    if (sectionStr) {
      result = sectionStr + bigUnits[unitIndex] + result
    } else if (result && !result.startsWith(digits[0])) {
      result = digits[0] + result
    }
    
    num = Math.floor(num / 10000)
    unitIndex++
  }

  // 清理多余的零
  result = result.replace(/零+$/, '')
  result = result.replace(/零+/g, '零')

  return result || digits[0]
}

// 处理输入
const handleInput = () => {
  hasError.value = false
  errorMessage.value = ''
  
  const value = inputNumber.value.trim()
  
  if (!value) {
    result.value = ''
    return
  }

  // 验证输入
  if (currentMode.value === 'money') {
    if (!/^-?\d+(\.\d{0,2})?$/.test(value)) {
      hasError.value = true
      errorMessage.value = '请输入有效的金额格式（最多两位小数）'
      result.value = ''
      return
    }
  } else {
    if (!/^-?\d+$/.test(value)) {
      hasError.value = true
      errorMessage.value = '请输入有效的整数'
      result.value = ''
      return
    }
  }

  const num = parseFloat(value)
  
  if (isNaN(num)) {
    hasError.value = true
    errorMessage.value = '请输入有效的数字'
    result.value = ''
    return
  }

  // 转换
  try {
    if (currentMode.value === 'money') {
      result.value = numberToMoney(num)
    } else if (currentMode.value === 'normal') {
      result.value = numberToNormalChinese(num, false)
    } else {
      result.value = numberToNormalChinese(num, true)
    }
  } catch (e) {
    hasError.value = true
    errorMessage.value = '转换失败，请检查输入'
    result.value = ''
  }
}

// 监听模式变化
watch(currentMode, () => {
  if (inputNumber.value) {
    handleInput()
  }
})

// 清空输入
const clearInput = () => {
  inputNumber.value = ''
  result.value = ''
  hasError.value = false
  errorMessage.value = ''
}

// 使用示例
const useExample = (example: string) => {
  inputNumber.value = example
  handleInput()
}

// 复制结果
const copyResult = async () => {
  if (!result.value) return
  
  try {
    await navigator.clipboard.writeText(result.value)
    // 可以添加 toast 提示
  } catch (e) {
    console.error('复制失败:', e)
  }
}
</script>

<style lang="scss" scoped>
/* 组件特定样式 */
</style>
