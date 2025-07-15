<template>
  <div class="min-h-screen bg-base-200 py-4 md:py-8">
    <div class="container mx-auto px-4 max-w-5xl">
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
          <span class="text-2xl md:text-3xl">🔑</span>
          <h1 class="text-xl md:text-2xl font-bold text-base-content">密码生成器</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          生成安全的随机密码，可自定义长度和字符类型，确保密码强度
        </p>
      </div>

      <!-- 密码生成设置 -->
      <div class="mb-6 bg-base-100 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-semibold text-base-content mb-4">密码设置</h2>
        
        <div class="space-y-6">
          <!-- 密码长度 -->
          <div>
            <label class="block text-sm font-medium text-base-content/70 mb-2">
              密码长度: {{ passwordLength }}
            </label>
            <div class="flex items-center gap-4">
              <input
                v-model="passwordLength"
                type="range"
                min="4"
                max="128"
                class="range range-primary flex-1"
                @input="generatePassword"
              >
              <input
                v-model="passwordLength"
                type="number"
                min="4"
                max="128"
                class="input input-bordered w-20 text-center"
                @input="generatePassword"
              >
            </div>
            <div class="flex justify-between text-xs text-base-content/60 mt-1">
              <span>4</span>
              <span>推荐: 12-16位</span>
              <span>128</span>
            </div>
          </div>

          <!-- 字符类型选择 -->
          <div>
            <label class="block text-sm font-medium text-base-content/70 mb-3">
              字符类型
            </label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label class="flex items-center gap-3 p-3 bg-base-200 rounded-lg cursor-pointer hover:bg-base-300 transition-colors">
                <input
                  v-model="charTypes.uppercase"
                  type="checkbox"
                  class="checkbox checkbox-primary"
                  @change="generatePassword"
                >
                <div class="flex-1">
                  <div class="font-medium text-base-content">大写字母</div>
                  <div class="text-xs text-base-content/60">A-Z (26 个字符)</div>
                </div>
              </label>
              
              <label class="flex items-center gap-3 p-3 bg-base-200 rounded-lg cursor-pointer hover:bg-base-300 transition-colors">
                <input
                  v-model="charTypes.lowercase"
                  type="checkbox"
                  class="checkbox checkbox-primary"
                  @change="generatePassword"
                >
                <div class="flex-1">
                  <div class="font-medium text-base-content">小写字母</div>
                  <div class="text-xs text-base-content/60">a-z (26 个字符)</div>
                </div>
              </label>
              
              <label class="flex items-center gap-3 p-3 bg-base-200 rounded-lg cursor-pointer hover:bg-base-300 transition-colors">
                <input
                  v-model="charTypes.numbers"
                  type="checkbox"
                  class="checkbox checkbox-primary"
                  @change="generatePassword"
                >
                <div class="flex-1">
                  <div class="font-medium text-base-content">数字</div>
                  <div class="text-xs text-base-content/60">0-9 (10 个字符)</div>
                </div>
              </label>
              
              <label class="flex items-center gap-3 p-3 bg-base-200 rounded-lg cursor-pointer hover:bg-base-300 transition-colors">
                <input
                  v-model="charTypes.symbols"
                  type="checkbox"
                  class="checkbox checkbox-primary"
                  @change="generatePassword"
                >
                <div class="flex-1">
                  <div class="font-medium text-base-content">特殊字符</div>
                  <div class="text-xs text-base-content/60">!@#$%^&* 等</div>
                </div>
              </label>
            </div>
          </div>

          <!-- 高级选项 -->
          <div class="collapse collapse-arrow bg-base-200">
            <input type="checkbox" class="peer">
            <div class="collapse-title text-sm font-medium text-base-content/70">
              高级选项
            </div>
            <div class="collapse-content space-y-4">
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="advancedOptions.excludeSimilar"
                  type="checkbox"
                  class="checkbox checkbox-primary"
                  @change="generatePassword"
                >
                <div class="flex-1">
                  <div class="font-medium text-base-content">排除相似字符</div>
                  <div class="text-xs text-base-content/60">排除 0, O, l, I, 1 等容易混淆的字符</div>
                </div>
              </label>
              
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="advancedOptions.excludeAmbiguous"
                  type="checkbox"
                  class="checkbox checkbox-primary"
                  @change="generatePassword"
                >
                <div class="flex-1">
                  <div class="font-medium text-base-content">排除模糊字符</div>
                  <div class="text-xs text-base-content/60">排除 {}, [], (), &lt;&gt;, ", ', ` 等</div>
                </div>
              </label>
              
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="advancedOptions.noRepeating"
                  type="checkbox"
                  class="checkbox checkbox-primary"
                  @change="generatePassword"
                >
                <div class="flex-1">
                  <div class="font-medium text-base-content">无重复字符</div>
                  <div class="text-xs text-base-content/60">确保每个字符只出现一次</div>
                </div>
              </label>
            </div>
          </div>

          <!-- 生成按钮 -->
          <div class="flex gap-2">
            <button 
              @click="generatePassword"
              class="btn btn-primary flex-1"
              :disabled="!hasSelectedCharTypes"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              重新生成
            </button>
            <button 
              @click="generateMultiplePasswords"
              class="btn btn-outline"
            >
              批量生成
            </button>
          </div>
        </div>
      </div>

      <!-- 生成的密码 -->
      <div class="mb-6 bg-base-100 rounded-2xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-base-content">生成的密码</h2>
          <div class="flex gap-2">
            <button 
              @click="copyPassword"
              class="btn btn-sm btn-primary"
              :disabled="!generatedPassword"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              复制
            </button>
          </div>
        </div>
        
        <div class="relative">
          <div class="p-4 bg-base-200 rounded-lg font-mono text-lg break-all min-h-[3rem] flex items-center">
            <span v-if="generatedPassword" class="text-base-content">{{ generatedPassword }}</span>
            <span v-else class="text-base-content/40 italic">点击生成密码</span>
          </div>
          
          <!-- 密码强度指示器 -->
          <div v-if="generatedPassword" class="mt-3">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-base-content/70">密码强度</span>
              <span :class="['text-sm font-medium', getStrengthColor(passwordStrength.score)]">
                {{ getStrengthText(passwordStrength.score) }}
              </span>
            </div>
            <div class="w-full bg-base-300 rounded-full h-2">
              <div 
                :class="['h-2 rounded-full transition-all duration-300', getStrengthColor(passwordStrength.score)]"
                :style="{ width: `${(passwordStrength.score / 4) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 密码强度分析 -->
      <div v-if="generatedPassword" class="mb-6 bg-base-100 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-semibold text-base-content mb-4">密码强度分析</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-4 bg-base-200 rounded-lg">
            <div class="text-sm font-medium text-base-content/70 mb-1">长度</div>
            <div class="text-lg font-bold text-base-content">{{ generatedPassword.length }}</div>
          </div>
          
          <div class="p-4 bg-base-200 rounded-lg">
            <div class="text-sm font-medium text-base-content/70 mb-1">字符种类</div>
            <div class="text-lg font-bold text-base-content">{{ passwordStrength.charTypes }}</div>
          </div>
          
          <div class="p-4 bg-base-200 rounded-lg">
            <div class="text-sm font-medium text-base-content/70 mb-1">熵值</div>
            <div class="text-lg font-bold text-base-content">{{ passwordStrength.entropy.toFixed(1) }} bits</div>
          </div>
          
          <div class="p-4 bg-base-200 rounded-lg">
            <div class="text-sm font-medium text-base-content/70 mb-1">破解时间</div>
            <div class="text-lg font-bold text-base-content">{{ passwordStrength.crackTime }}</div>
          </div>
        </div>
        
        <!-- 安全建议 -->
        <div v-if="passwordStrength.suggestions.length > 0" class="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div class="text-sm font-medium text-warning mb-2">安全建议</div>
          <ul class="text-sm text-warning/80 space-y-1">
            <li v-for="suggestion in passwordStrength.suggestions" :key="suggestion" class="flex items-start gap-2">
              <span class="text-warning">•</span>
              <span>{{ suggestion }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 批量生成的密码 -->
      <div v-if="multiplePasswords.length > 0" class="mb-6 bg-base-100 rounded-2xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-base-content">批量生成的密码</h2>
          <div class="flex gap-2">
            <button 
              @click="copyAllPasswords"
              class="btn btn-sm btn-primary"
            >
              复制全部
            </button>
            <button 
              @click="clearMultiplePasswords"
              class="btn btn-sm btn-ghost"
            >
              清空
            </button>
          </div>
        </div>
        
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <div v-for="(password, index) in multiplePasswords" :key="index" 
               class="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
            <span class="text-sm text-base-content/60 w-6">{{ index + 1 }}.</span>
            <span class="flex-1 font-mono text-sm break-all">{{ password }}</span>
            <button 
              @click="copyPassword(password)"
              class="btn btn-xs btn-ghost"
            >
              复制
            </button>
          </div>
        </div>
      </div>

      <!-- 密码历史记录 -->
      <div v-if="passwordHistory.length > 0" class="mb-6 bg-base-100 rounded-2xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-base-content">历史记录</h2>
          <div class="flex gap-2">
            <button 
              @click="clearHistory"
              class="btn btn-sm btn-ghost"
            >
              清空历史
            </button>
          </div>
        </div>
        
        <div class="space-y-2 max-h-48 overflow-y-auto">
          <div v-for="(item, index) in passwordHistory" :key="index" 
               class="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
            <span class="flex-1 font-mono text-sm break-all">{{ item.password }}</span>
            <span class="text-xs text-base-content/60">{{ item.timestamp }}</span>
            <button 
              @click="copyPassword(item.password)"
              class="btn btn-xs btn-ghost"
            >
              复制
            </button>
          </div>
        </div>
      </div>

      <!-- 密码安全提示 -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-semibold text-base-content mb-4">密码安全提示</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <div class="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div class="font-medium text-base-content">使用强密码</div>
                <div class="text-sm text-base-content/70">至少12位，包含大小写字母、数字和特殊字符</div>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <div class="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div class="font-medium text-base-content">每个账户使用不同密码</div>
                <div class="text-sm text-base-content/70">避免密码重复使用，降低安全风险</div>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <div class="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div class="font-medium text-base-content">定期更换密码</div>
                <div class="text-sm text-base-content/70">重要账户建议每3-6个月更换一次密码</div>
              </div>
            </div>
          </div>
          
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <div class="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div class="font-medium text-base-content">使用密码管理器</div>
                <div class="text-sm text-base-content/70">推荐使用专业的密码管理工具</div>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <div class="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div class="font-medium text-base-content">启用双因素认证</div>
                <div class="text-sm text-base-content/70">为重要账户启用2FA增强安全性</div>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <div class="w-2 h-2 bg-error rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div class="font-medium text-base-content">避免在公共场所输入密码</div>
                <div class="text-sm text-base-content/70">注意防范肩窥和键盘记录器</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const passwordLength = ref(12)
const generatedPassword = ref('')
const multiplePasswords = ref<string[]>([])
const passwordHistory = ref<Array<{password: string, timestamp: string}>>([])

// 字符类型选择
const charTypes = reactive({
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true
})

// 高级选项
const advancedOptions = reactive({
  excludeSimilar: false,
  excludeAmbiguous: false,
  noRepeating: false
})

// 字符集定义
const characterSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
}

// 相似字符和模糊字符
const similarChars = '0Ol1I'
const ambiguousChars = '{}[]()<>"\''

// 计算属性
const hasSelectedCharTypes = computed(() => {
  return Object.values(charTypes).some(selected => selected)
})

// 密码强度分析
const passwordStrength = computed(() => {
  if (!generatedPassword.value) {
    return { score: 0, charTypes: 0, entropy: 0, crackTime: '', suggestions: [] }
  }
  
  const password = generatedPassword.value
  let score = 0
  let charTypeCount = 0
  const suggestions: string[] = []
  
  // 检查字符类型
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)
  
  if (hasUpper) charTypeCount++
  if (hasLower) charTypeCount++
  if (hasNumber) charTypeCount++
  if (hasSymbol) charTypeCount++
  
  // 长度评分
  if (password.length >= 12) score += 2
  else if (password.length >= 8) score += 1
  else suggestions.push('密码长度至少应为8位')
  
  // 字符类型评分
  if (charTypeCount >= 3) score += 2
  else if (charTypeCount >= 2) score += 1
  else suggestions.push('建议使用多种字符类型')
  
  // 计算熵值
  const charset = getCharacterSet()
  const entropy = password.length * Math.log2(charset.length)
  
  // 计算破解时间
  const crackTime = calculateCrackTime(entropy)
  
  if (score < 2) suggestions.push('建议增加密码长度和复杂度')
  if (password.length < 12) suggestions.push('建议使用至少12位字符')
  if (!hasSymbol) suggestions.push('建议包含特殊字符')
  
  return {
    score: Math.min(score, 4),
    charTypes: charTypeCount,
    entropy,
    crackTime,
    suggestions
  }
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 获取字符集
const getCharacterSet = (): string => {
  let charset = ''
  
  if (charTypes.uppercase) charset += characterSets.uppercase
  if (charTypes.lowercase) charset += characterSets.lowercase
  if (charTypes.numbers) charset += characterSets.numbers
  if (charTypes.symbols) charset += characterSets.symbols
  
  // 排除相似字符
  if (advancedOptions.excludeSimilar) {
    charset = charset.split('').filter(char => !similarChars.includes(char)).join('')
  }
  
  // 排除模糊字符
  if (advancedOptions.excludeAmbiguous) {
    charset = charset.split('').filter(char => !ambiguousChars.includes(char)).join('')
  }
  
  return charset
}

// 生成密码
const generatePassword = () => {
  if (!hasSelectedCharTypes.value) {
    generatedPassword.value = ''
    return
  }
  
  const charset = getCharacterSet()
  if (charset.length === 0) {
    generatedPassword.value = ''
    return
  }
  
  let password = ''
  const usedChars = new Set<string>()
  
  // 确保至少包含每种选中的字符类型
  const requiredChars: string[] = []
  if (charTypes.uppercase) requiredChars.push(getRandomChar(characterSets.uppercase))
  if (charTypes.lowercase) requiredChars.push(getRandomChar(characterSets.lowercase))
  if (charTypes.numbers) requiredChars.push(getRandomChar(characterSets.numbers))
  if (charTypes.symbols) requiredChars.push(getRandomChar(characterSets.symbols))
  
  // 打乱必需字符的顺序
  const shuffledRequired = requiredChars.sort(() => Math.random() - 0.5)
  
  // 生成密码
  for (let i = 0; i < passwordLength.value; i++) {
    let char: string
    
    if (i < shuffledRequired.length) {
      char = shuffledRequired[i]
    } else {
      do {
        char = getRandomChar(charset)
      } while (advancedOptions.noRepeating && usedChars.has(char))
    }
    
    if (advancedOptions.noRepeating) {
      usedChars.add(char)
    }
    
    password += char
  }
  
  // 最终打乱
  generatedPassword.value = password.split('').sort(() => Math.random() - 0.5).join('')
  
  // 添加到历史记录
  addToHistory(generatedPassword.value)
}

// 获取随机字符
const getRandomChar = (charset: string): string => {
  return charset.charAt(Math.floor(Math.random() * charset.length))
}

// 批量生成密码
const generateMultiplePasswords = () => {
  const passwords: string[] = []
  for (let i = 0; i < 10; i++) {
    generatePassword()
    if (generatedPassword.value) {
      passwords.push(generatedPassword.value)
    }
  }
  multiplePasswords.value = passwords
}

// 计算破解时间
const calculateCrackTime = (entropy: number): string => {
  // 假设每秒可以尝试10^9次
  const attemptsPerSecond = 1e9
  const totalCombinations = Math.pow(2, entropy)
  const averageAttempts = totalCombinations / 2
  const seconds = averageAttempts / attemptsPerSecond
  
  if (seconds < 60) return '< 1分钟'
  if (seconds < 3600) return `${Math.round(seconds / 60)}分钟`
  if (seconds < 86400) return `${Math.round(seconds / 3600)}小时`
  if (seconds < 31536000) return `${Math.round(seconds / 86400)}天`
  if (seconds < 31536000000) return `${Math.round(seconds / 31536000)}年`
  return '> 1000年'
}

// 获取强度颜色
const getStrengthColor = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return 'bg-error text-error'
    case 2:
      return 'bg-warning text-warning'
    case 3:
      return 'bg-info text-info'
    case 4:
      return 'bg-success text-success'
    default:
      return 'bg-base-300 text-base-content'
  }
}

// 获取强度文本
const getStrengthText = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return '弱'
    case 2:
      return '中等'
    case 3:
      return '强'
    case 4:
      return '很强'
    default:
      return '未知'
  }
}

// 复制密码
const copyPassword = async (password?: string) => {
  const textToCopy = password || generatedPassword.value
  if (!textToCopy) return
  
  try {
    await navigator.clipboard.writeText(textToCopy)
    // 可以添加成功提示
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 复制所有密码
const copyAllPasswords = async () => {
  if (multiplePasswords.value.length === 0) return
  
  const allPasswords = multiplePasswords.value.join('\n')
  try {
    await navigator.clipboard.writeText(allPasswords)
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 清空批量密码
const clearMultiplePasswords = () => {
  multiplePasswords.value = []
}

// 添加到历史记录
const addToHistory = (password: string) => {
  const timestamp = new Date().toLocaleString()
  passwordHistory.value.unshift({ password, timestamp })
  
  // 限制历史记录数量
  if (passwordHistory.value.length > 20) {
    passwordHistory.value = passwordHistory.value.slice(0, 20)
  }
}

// 清空历史记录
const clearHistory = () => {
  passwordHistory.value = []
}

// 监听变化，自动生成密码
watch([passwordLength, charTypes, advancedOptions], () => {
  if (hasSelectedCharTypes.value) {
    generatePassword()
  }
}, { deep: true })

// 初始化
generatePassword()
</script>

<style scoped>
/* 响应式调整 */
@media (max-width: 768px) {
  .range {
    height: 1.5rem;
  }
}
</style> 
