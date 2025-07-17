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
          <span class="text-2xl md:text-3xl">⏰</span>
          <h1 class="text-xl md:text-2xl font-bold text-base-content">时间戳转换工具</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          Unix时间戳与日期时间相互转换工具，支持多种时区和格式
        </p>
      </div>

      <!-- 当前时间显示 -->
      <div class="mb-6 bg-base-100 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-semibold text-base-content mb-4">当前时间</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-base-200 rounded-lg">
            <div class="text-sm font-medium text-base-content/70 mb-2">当前时间戳</div>
            <div class="font-mono text-lg text-base-content">{{ currentTimestamp }}</div>
            <div class="text-xs text-base-content/60 mt-1">秒级时间戳</div>
          </div>
          <div class="p-4 bg-base-200 rounded-lg">
            <div class="text-sm font-medium text-base-content/70 mb-2">当前日期时间</div>
            <div class="font-mono text-lg text-base-content">{{ currentDateTime }}</div>
            <div class="text-xs text-base-content/60 mt-1">{{ currentTimezone }}</div>
          </div>
        </div>
        <div class="mt-4 flex gap-2">
          <button 
            @click="copyCurrentTimestamp"
            class="btn btn-sm btn-outline"
          >
            复制时间戳
          </button>
          <button 
            @click="copyCurrentDateTime"
            class="btn btn-sm btn-outline"
          >
            复制日期时间
          </button>
        </div>
      </div>

      <!-- 转换工具 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 时间戳转日期 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h2 class="text-lg font-semibold text-base-content mb-4">时间戳转日期</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-base-content/70 mb-2">
                时间戳输入
              </label>
              <div class="flex gap-2">
                <input
                  v-model="timestampInput"
                  type="text"
                  placeholder="请输入时间戳..."
                  class="input input-bordered flex-1 font-mono"
                  @input="handleTimestampInput"
                >
                <button 
                  @click="useCurrentTimestamp"
                  class="btn btn-outline"
                >
                  当前
                </button>
              </div>
              <div class="text-xs text-base-content/60 mt-1">
                支持秒级(10位)和毫秒级(13位)时间戳
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-base-content/70 mb-2">
                时区选择
              </label>
              <select v-model="selectedTimezone" class="select select-bordered w-full">
                <option v-for="tz in timezones" :key="tz.value" :value="tz.value">
                  {{ tz.label }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-base-content/70 mb-2">
                格式选择
              </label>
              <select v-model="selectedFormat" class="select select-bordered w-full">
                <option v-for="fmt in dateFormats" :key="fmt.value" :value="fmt.value">
                  {{ fmt.label }}
                </option>
              </select>
            </div>
          </div>
          
          <!-- 转换结果 -->
          <div v-if="timestampResult" class="mt-6 p-4 bg-base-200 rounded-lg">
            <div class="text-sm font-medium text-base-content/70 mb-2">转换结果</div>
            <div class="font-mono text-base-content break-all">{{ timestampResult }}</div>
            <div class="mt-2 flex gap-2">
              <button 
                @click="copyTimestampResult"
                class="btn btn-xs btn-primary"
              >
                复制
              </button>
            </div>
          </div>
          
          <!-- 错误提示 -->
          <div v-if="timestampError" class="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
            <div class="text-sm text-error">{{ timestampError }}</div>
          </div>
        </div>

        <!-- 日期转时间戳 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h2 class="text-lg font-semibold text-base-content mb-4">日期转时间戳</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-base-content/70 mb-2">
                日期时间输入
              </label>
              <input
                v-model="dateTimeInput"
                type="datetime-local"
                class="input input-bordered w-full"
                @input="handleDateTimeInput"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-base-content/70 mb-2">
                或输入自定义格式
              </label>
              <input
                v-model="customDateInput"
                type="text"
                placeholder="例如: 2024-01-01 12:00:00"
                class="input input-bordered w-full font-mono"
                @input="handleCustomDateInput"
              >
              <div class="text-xs text-base-content/60 mt-1">
                支持格式: YYYY-MM-DD HH:mm:ss, YYYY/MM/DD HH:mm:ss 等
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-base-content/70 mb-2">
                时区选择
              </label>
              <select v-model="dateTimezone" class="select select-bordered w-full">
                <option v-for="tz in timezones" :key="tz.value" :value="tz.value">
                  {{ tz.label }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-base-content/70 mb-2">
                输出格式
              </label>
              <select v-model="timestampFormat" class="select select-bordered w-full">
                <option value="seconds">秒级时间戳 (10位)</option>
                <option value="milliseconds">毫秒级时间戳 (13位)</option>
              </select>
            </div>
          </div>
          
          <!-- 转换结果 -->
          <div v-if="dateTimeResult" class="mt-6 p-4 bg-base-200 rounded-lg">
            <div class="text-sm font-medium text-base-content/70 mb-2">转换结果</div>
            <div class="font-mono text-base-content">{{ dateTimeResult }}</div>
            <div class="mt-2 flex gap-2">
              <button 
                @click="copyDateTimeResult"
                class="btn btn-xs btn-primary"
              >
                复制
              </button>
            </div>
          </div>
          
          <!-- 错误提示 -->
          <div v-if="dateTimeError" class="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
            <div class="text-sm text-error">{{ dateTimeError }}</div>
          </div>
        </div>
      </div>

      <!-- 批量转换 -->
      <div class="mt-6 bg-base-100 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-semibold text-base-content mb-4">批量转换</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 批量输入 -->
          <div>
            <label class="block text-sm font-medium text-base-content/70 mb-2">
              批量输入 (每行一个时间戳或日期)
            </label>
            <textarea
              v-model="batchInput"
              placeholder="1640995200&#10;2024-01-01 12:00:00&#10;1641081600"
              class="textarea textarea-bordered w-full h-32 font-mono text-sm resize-none"
            ></textarea>
            <div class="mt-2 flex gap-2">
              <button 
                @click="processBatch"
                class="btn btn-primary"
                :disabled="!batchInput.trim()"
              >
                批量转换
              </button>
              <button 
                @click="clearBatch"
                class="btn btn-outline"
              >
                清空
              </button>
            </div>
          </div>
          
          <!-- 批量结果 -->
          <div>
            <label class="block text-sm font-medium text-base-content/70 mb-2">
              转换结果
            </label>
            <div class="bg-base-200 rounded-lg p-4 h-32 overflow-y-auto">
              <div v-if="batchResults.length === 0" class="text-base-content/40 italic">
                批量转换结果将在此显示...
              </div>
              <div v-else class="space-y-1">
                <div v-for="(result, index) in batchResults" :key="index" class="text-sm font-mono">
                  <span class="text-base-content/60">{{ index + 1 }}.</span>
                  <span v-if="result.error" class="text-error">{{ result.error }}</span>
                  <span v-else class="text-base-content">{{ result.result }}</span>
                </div>
              </div>
            </div>
            <div v-if="batchResults.length > 0" class="mt-2">
              <button 
                @click="copyBatchResults"
                class="btn btn-sm btn-primary"
              >
                复制结果
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 常用时间戳 -->
      <div class="mt-6 bg-base-100 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-semibold text-base-content mb-4">常用时间戳</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="common in commonTimestamps" :key="common.label" 
               class="p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors cursor-pointer"
               @click="useCommonTimestamp(common.timestamp)">
            <div class="text-sm font-medium text-base-content">{{ common.label }}</div>
            <div class="font-mono text-xs text-base-content/60 mt-1">{{ common.timestamp }}</div>
            <div class="text-xs text-base-content/60 mt-1">{{ common.date }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const currentTimestamp = ref(0)
const currentDateTime = ref('')
const currentTimezone = ref('')
const timestampInput = ref('')
const timestampResult = ref('')
const timestampError = ref('')
const dateTimeInput = ref('')
const customDateInput = ref('')
const dateTimeResult = ref('')
const dateTimeError = ref('')
const selectedTimezone = ref('Asia/Shanghai')
const dateTimezone = ref('Asia/Shanghai')
const selectedFormat = ref('YYYY-MM-DD HH:mm:ss')
const timestampFormat = ref('seconds')
const batchInput = ref('')
const batchResults = ref<Array<{result?: string, error?: string}>>([])

// 时区选项
const timezones = [
  { value: 'Asia/Shanghai', label: '北京时间 (UTC+8)' },
  { value: 'UTC', label: 'UTC 时间 (UTC+0)' },
  { value: 'America/New_York', label: '纽约时间 (UTC-5/-4)' },
  { value: 'America/Los_Angeles', label: '洛杉矶时间 (UTC-8/-7)' },
  { value: 'Europe/London', label: '伦敦时间 (UTC+0/+1)' },
  { value: 'Asia/Tokyo', label: '东京时间 (UTC+9)' },
  { value: 'Australia/Sydney', label: '悉尼时间 (UTC+10/+11)' }
]

// 日期格式选项
const dateFormats = [
  { value: 'YYYY-MM-DD HH:mm:ss', label: '2024-01-01 12:00:00' },
  { value: 'YYYY/MM/DD HH:mm:ss', label: '2024/01/01 12:00:00' },
  { value: 'MM-DD-YYYY HH:mm:ss', label: '01-01-2024 12:00:00' },
  { value: 'DD/MM/YYYY HH:mm:ss', label: '01/01/2024 12:00:00' },
  { value: 'YYYY-MM-DD', label: '2024-01-01' },
  { value: 'ISO', label: 'ISO 8601 格式' }
]

// 常用时间戳
const commonTimestamps = computed(() => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  
  return [
    {
      label: '今天开始',
      timestamp: Math.floor(today.getTime() / 1000),
      date: formatDate(today)
    },
    {
      label: '明天开始',
      timestamp: Math.floor(tomorrow.getTime() / 1000),
      date: formatDate(tomorrow)
    },
    {
      label: '昨天开始',
      timestamp: Math.floor(yesterday.getTime() / 1000),
      date: formatDate(yesterday)
    },
    {
      label: 'Unix 纪元',
      timestamp: 0,
      date: '1970-01-01 08:00:00'
    },
    {
      label: '2024年开始',
      timestamp: 1704067200,
      date: '2024-01-01 00:00:00'
    },
    {
      label: '2025年开始',
      timestamp: 1735689600,
      date: '2025-01-01 00:00:00'
    }
  ]
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 更新当前时间
const updateCurrentTime = () => {
  const now = new Date()
  currentTimestamp.value = Math.floor(now.getTime() / 1000)
  currentDateTime.value = formatDate(now)
  currentTimezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone
}

// 格式化日期
const formatDate = (date: Date, format?: string, timezone?: string): string => {
  const fmt = format || selectedFormat.value
  const tz = timezone || selectedTimezone.value
  
  try {
    if (fmt === 'ISO') {
      return date.toISOString()
    }
    
    const options: Intl.DateTimeFormatOptions = {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }
    
    const formatted = new Intl.DateTimeFormat('zh-CN', options).format(date)
    
    // 根据格式调整输出
    switch (fmt) {
      case 'YYYY-MM-DD HH:mm:ss':
        return formatted.replace(/\//g, '-')
      case 'YYYY/MM/DD HH:mm:ss':
        return formatted
      case 'MM-DD-YYYY HH:mm:ss':
        return formatted.replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$2-$3-$1')
      case 'DD/MM/YYYY HH:mm:ss':
        return formatted.replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$3/$2/$1')
      case 'YYYY-MM-DD':
        return formatted.split(' ')[0].replace(/\//g, '-')
      default:
        return formatted.replace(/\//g, '-')
    }
  } catch (error) {
    return date.toLocaleString()
  }
}

// 处理时间戳输入
const handleTimestampInput = () => {
  timestampError.value = ''
  
  if (!timestampInput.value.trim()) {
    timestampResult.value = ''
    return
  }
  
  try {
    let timestamp = parseInt(timestampInput.value.trim())
    
    if (isNaN(timestamp)) {
      throw new Error('无效的时间戳格式')
    }
    
    // 判断是秒级还是毫秒级时间戳
    if (timestamp.toString().length === 10) {
      // 秒级时间戳
      timestamp = timestamp * 1000
    } else if (timestamp.toString().length === 13) {
      // 毫秒级时间戳
      // 保持不变
    } else {
      throw new Error('时间戳位数不正确，应为10位或13位')
    }
    
    const date = new Date(timestamp)
    
    if (isNaN(date.getTime())) {
      throw new Error('无效的时间戳值')
    }
    
    timestampResult.value = formatDate(date)
    
  } catch (error) {
    timestampError.value = error instanceof Error ? error.message : '转换失败'
    timestampResult.value = ''
  }
}

// 处理日期时间输入
const handleDateTimeInput = () => {
  dateTimeError.value = ''
  
  if (!dateTimeInput.value) {
    dateTimeResult.value = ''
    return
  }
  
  try {
    const date = new Date(dateTimeInput.value)
    
    if (isNaN(date.getTime())) {
      throw new Error('无效的日期时间格式')
    }
    
    const timestamp = date.getTime()
    
    if (timestampFormat.value === 'seconds') {
      dateTimeResult.value = Math.floor(timestamp / 1000).toString()
    } else {
      dateTimeResult.value = timestamp.toString()
    }
    
  } catch (error) {
    dateTimeError.value = error instanceof Error ? error.message : '转换失败'
    dateTimeResult.value = ''
  }
}

// 处理自定义日期输入
const handleCustomDateInput = () => {
  dateTimeError.value = ''
  
  if (!customDateInput.value.trim()) {
    dateTimeResult.value = ''
    return
  }
  
  try {
    // 尝试解析各种格式
    let date: Date
    const input = customDateInput.value.trim()
    
    // 替换常见分隔符
    const normalized = input
      .replace(/[年月]/g, '-')
      .replace(/[日时]/g, ' ')
      .replace(/[分秒]/g, ':')
      .replace(/：/g, ':')
    
    date = new Date(normalized)
    
    if (isNaN(date.getTime())) {
      // 尝试其他格式
      const formats = [
        input.replace(/\//g, '-'),
        input.replace(/-/g, '/'),
        input + ' 00:00:00'
      ]
      
      for (const fmt of formats) {
        date = new Date(fmt)
        if (!isNaN(date.getTime())) break
      }
    }
    
    if (isNaN(date.getTime())) {
      throw new Error('无法解析的日期格式')
    }
    
    const timestamp = date.getTime()
    
    if (timestampFormat.value === 'seconds') {
      dateTimeResult.value = Math.floor(timestamp / 1000).toString()
    } else {
      dateTimeResult.value = timestamp.toString()
    }
    
  } catch (error) {
    dateTimeError.value = error instanceof Error ? error.message : '转换失败'
    dateTimeResult.value = ''
  }
}

// 使用当前时间戳
const useCurrentTimestamp = () => {
  timestampInput.value = currentTimestamp.value.toString()
  handleTimestampInput()
}

// 使用常用时间戳
const useCommonTimestamp = (timestamp: number) => {
  timestampInput.value = timestamp.toString()
  handleTimestampInput()
}

// 批量处理
const processBatch = () => {
  const lines = batchInput.value.trim().split('\n').filter(line => line.trim())
  batchResults.value = []
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    try {
      // 判断是时间戳还是日期
      if (/^\d{10}$|^\d{13}$/.test(trimmed)) {
        // 时间戳
        let timestamp = parseInt(trimmed)
        if (trimmed.length === 10) timestamp *= 1000
        
        const date = new Date(timestamp)
        if (isNaN(date.getTime())) throw new Error('无效时间戳')
        
        batchResults.value.push({
          result: formatDate(date)
        })
      } else {
        // 日期
        const date = new Date(trimmed)
        if (isNaN(date.getTime())) throw new Error('无效日期')
        
        const timestamp = timestampFormat.value === 'seconds' 
          ? Math.floor(date.getTime() / 1000)
          : date.getTime()
        
        batchResults.value.push({
          result: timestamp.toString()
        })
      }
    } catch (error) {
      batchResults.value.push({
        error: `${trimmed} - ${error instanceof Error ? error.message : '转换失败'}`
      })
    }
  }
}

// 清空批量输入
const clearBatch = () => {
  batchInput.value = ''
  batchResults.value = []
}

// 复制函数
const copyCurrentTimestamp = async () => {
  await navigator.clipboard.writeText(currentTimestamp.value.toString())
}

const copyCurrentDateTime = async () => {
  await navigator.clipboard.writeText(currentDateTime.value)
}

const copyTimestampResult = async () => {
  if (timestampResult.value) {
    await navigator.clipboard.writeText(timestampResult.value)
  }
}

const copyDateTimeResult = async () => {
  if (dateTimeResult.value) {
    await navigator.clipboard.writeText(dateTimeResult.value)
  }
}

const copyBatchResults = async () => {
  const results = batchResults.value.map(r => r.result || r.error).join('\n')
  await navigator.clipboard.writeText(results)
}

// 生命周期
let timer: NodeJS.Timeout | undefined

onMounted(() => {
  updateCurrentTime()
  timer = setInterval(updateCurrentTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
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
 