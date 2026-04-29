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
          <span class="text-2xl md:text-3xl">🕐</span>
          <h1 class="text-xl md:text-2xl font-bold text-base-content">时间格式展示</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          查看时间的各种标准格式表示，支持 ISO 8601、RFC 2822、时间戳等，可手动修改时间
        </p>
      </div>

      <!-- 时间选择器 -->
      <div class="mb-6 bg-base-100 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-semibold text-base-content mb-4">选择时间</h2>
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-base-content/70 mb-2">
              日期与时间
            </label>
            <input
              v-model="datetimeLocal"
              type="datetime-local"
              step="1"
              class="input input-bordered w-full"
              @input="onDatetimeChange"
            >
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-base-content/70 mb-2">
              时区
            </label>
            <select v-model="selectedTimezone" class="select select-bordered w-full">
              <option v-for="tz in timezones" :key="tz.value" :value="tz.value">
                {{ tz.label }}
              </option>
            </select>
          </div>
          <div class="flex items-end">
            <button @click="resetToNow" class="btn btn-primary">
              回到当前时间
            </button>
          </div>
        </div>
      </div>

      <!-- ISO 8601 系列 -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-lg mb-6">
        <h2 class="text-lg font-semibold text-base-content mb-4">ISO 8601 标准格式</h2>
        <div class="space-y-3">
          <div v-for="item in isoFormats" :key="item.label" class="format-row flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors group">
            <div class="sm:w-64 flex-shrink-0">
              <div class="text-sm font-medium text-base-content">{{ item.label }}</div>
              <div class="text-xs text-base-content/50 mt-0.5">{{ item.desc }}</div>
            </div>
            <div class="flex-1 font-mono text-sm text-base-content break-all">{{ item.value }}</div>
            <button @click="copyText(item.value)" class="btn btn-xs btn-ghost opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">复制</button>
          </div>
        </div>
      </div>

      <!-- RFC 系列 -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-lg mb-6">
        <h2 class="text-lg font-semibold text-base-content mb-4">RFC 标准格式</h2>
        <div class="space-y-3">
          <div v-for="item in rfcFormats" :key="item.label" class="format-row flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors group">
            <div class="sm:w-64 flex-shrink-0">
              <div class="text-sm font-medium text-base-content">{{ item.label }}</div>
              <div class="text-xs text-base-content/50 mt-0.5">{{ item.desc }}</div>
            </div>
            <div class="flex-1 font-mono text-sm text-base-content break-all">{{ item.value }}</div>
            <button @click="copyText(item.value)" class="btn btn-xs btn-ghost opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">复制</button>
          </div>
        </div>
      </div>

      <!-- 时间戳 -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-lg mb-6">
        <h2 class="text-lg font-semibold text-base-content mb-4">时间戳格式</h2>
        <div class="space-y-3">
          <div v-for="item in timestampFormats" :key="item.label" class="format-row flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors group">
            <div class="sm:w-64 flex-shrink-0">
              <div class="text-sm font-medium text-base-content">{{ item.label }}</div>
              <div class="text-xs text-base-content/50 mt-0.5">{{ item.desc }}</div>
            </div>
            <div class="flex-1 font-mono text-sm text-base-content break-all">{{ item.value }}</div>
            <button @click="copyText(item.value)" class="btn btn-xs btn-ghost opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">复制</button>
          </div>
        </div>
      </div>

      <!-- 本地化格式 -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-lg mb-6">
        <h2 class="text-lg font-semibold text-base-content mb-4">本地化格式</h2>
        <div class="space-y-3">
          <div v-for="item in localeFormats" :key="item.label" class="format-row flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors group">
            <div class="sm:w-64 flex-shrink-0">
              <div class="text-sm font-medium text-base-content">{{ item.label }}</div>
              <div class="text-xs text-base-content/50 mt-0.5">{{ item.desc }}</div>
            </div>
            <div class="flex-1 font-mono text-sm text-base-content break-all">{{ item.value }}</div>
            <button @click="copyText(item.value)" class="btn btn-xs btn-ghost opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">复制</button>
          </div>
        </div>
      </div>

      <!-- 编程语言格式 -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-lg mb-6">
        <h2 class="text-lg font-semibold text-base-content mb-4">编程常用格式</h2>
        <div class="space-y-3">
          <div v-for="item in progFormats" :key="item.label" class="format-row flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors group">
            <div class="sm:w-64 flex-shrink-0">
              <div class="text-sm font-medium text-base-content">{{ item.label }}</div>
              <div class="text-xs text-base-content/50 mt-0.5">{{ item.desc }}</div>
            </div>
            <div class="flex-1 font-mono text-sm text-base-content break-all">{{ item.value }}</div>
            <button @click="copyText(item.value)" class="btn btn-xs btn-ghost opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">复制</button>
          </div>
        </div>
      </div>

      <!-- 特殊格式 -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-semibold text-base-content mb-4">特殊格式</h2>
        <div class="space-y-3">
          <div v-for="item in specialFormats" :key="item.label" class="format-row flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors group">
            <div class="sm:w-64 flex-shrink-0">
              <div class="text-sm font-medium text-base-content">{{ item.label }}</div>
              <div class="text-xs text-base-content/50 mt-0.5">{{ item.desc }}</div>
            </div>
            <div class="flex-1 font-mono text-sm text-base-content break-all">{{ item.value }}</div>
            <button @click="copyText(item.value)" class="btn btn-xs btn-ghost opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">复制</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useToolNavigation } from '@/composables/useToolNavigation'

const { goBack } = useToolNavigation()

// 状态
const selectedDate = ref(new Date())
const selectedTimezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)
const datetimeLocal = ref('')

// 时区选项
const timezones = [
  { value: 'Asia/Shanghai', label: '北京时间 (UTC+8)' },
  { value: 'UTC', label: 'UTC 时间 (UTC+0)' },
  { value: 'America/New_York', label: '纽约时间 (UTC-5/-4)' },
  { value: 'America/Los_Angeles', label: '洛杉矶时间 (UTC-8/-7)' },
  { value: 'Europe/London', label: '伦敦时间 (UTC+0/+1)' },
  { value: 'Europe/Paris', label: '巴黎时间 (UTC+1/+2)' },
  { value: 'Asia/Tokyo', label: '东京时间 (UTC+9)' },
  { value: 'Asia/Seoul', label: '首尔时间 (UTC+9)' },
  { value: 'Asia/Singapore', label: '新加坡时间 (UTC+8)' },
  { value: 'Asia/Dubai', label: '迪拜时间 (UTC+4)' },
  { value: 'Australia/Sydney', label: '悉尼时间 (UTC+10/+11)' }
]

// 复制文本
const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}

// 同步 datetime-local 输入框
const pad = (n: number, len = 2) => n.toString().padStart(len, '0')

const syncDatetimeLocal = () => {
  const d = selectedDate.value
  datetimeLocal.value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const onDatetimeChange = () => {
  if (datetimeLocal.value) {
    const parsed = new Date(datetimeLocal.value)
    if (!isNaN(parsed.getTime())) {
      selectedDate.value = parsed
    }
  }
}

const resetToNow = () => {
  selectedDate.value = new Date()
  syncDatetimeLocal()
}

// 获取指定时区的偏移字符串
const getTimezoneOffset = (date: Date, tz: string): string => {
  const utcStr = date.toLocaleString('en-US', { timeZone: 'UTC', hour12: false })
  const tzStr = date.toLocaleString('en-US', { timeZone: tz, hour12: false })
  const diff = (new Date(tzStr).getTime() - new Date(utcStr).getTime()) / 60000
  const sign = diff >= 0 ? '+' : '-'
  const absDiff = Math.abs(diff)
  return `${sign}${pad(Math.floor(absDiff / 60))}:${pad(absDiff % 60)}`
}

// 获取指定时区的各部件
const getTzParts = (date: Date, tz: string) => {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    weekday: 'short'
  })
  const parts = fmt.formatToParts(date)
  const map: Record<string, string> = {}
  for (const p of parts) {
    if (p.type !== 'literal') map[p.type] = p.value
  }
  return {
    year: map.year,
    month: map.month,
    day: map.day,
    hour: map.hour,
    minute: map.minute,
    second: map.second,
    weekday: map.weekday
  }
}

// ISO 8601 周数
const getISOWeek = (date: Date): string => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return `${d.getUTCFullYear()}-W${pad(weekNo)}-${dayNum}`
}

// ISO 8601 序数日期
const getISOOrdinal = (date: Date): string => {
  const yearStart = new Date(date.getFullYear(), 0, 1)
  const ordinal = Math.floor((date.getTime() - yearStart.getTime()) / 86400000) + 1
  return `${date.getFullYear()}-${pad(ordinal, 3)}`
}

// 周几/月份名称
const weekdayMap: Record<string, string> = {
  Sun: 'Sun', Mon: 'Mon', Tue: 'Tue', Wed: 'Wed', Thu: 'Thu', Fri: 'Fri', Sat: 'Sat'
}
const monthMap: Record<string, string> = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
  '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
}

// 格式项类型
interface FormatItem {
  label: string
  value: string
  desc: string
}

// ISO 8601 格式组
const isoFormats = computed<FormatItem[]>(() => {
  const d = selectedDate.value
  const tz = selectedTimezone.value
  const p = getTzParts(d, tz)
  const offset = getTimezoneOffset(d, tz)

  return [
    { label: 'ISO 8601（本地时间）', value: `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`, desc: 'YYYY-MM-DDTHH:mm:ss' },
    { label: 'ISO 8601（UTC）', value: d.toISOString(), desc: 'YYYY-MM-DDTHH:mm:ss.sssZ' },
    { label: 'ISO 8601（带时区偏移）', value: `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}${offset}`, desc: 'YYYY-MM-DDTHH:mm:ss+08:00' },
    { label: 'ISO 8601（仅日期）', value: `${p.year}-${p.month}-${p.day}`, desc: 'YYYY-MM-DD' },
    { label: 'ISO 8601（仅时间）', value: `${p.hour}:${p.minute}:${p.second}`, desc: 'HH:mm:ss' },
    { label: 'ISO 8601（周数）', value: getISOWeek(d), desc: 'YYYY-Www-D' },
    { label: 'ISO 8601（序数日期）', value: getISOOrdinal(d), desc: 'YYYY-DDD' }
  ]
})

// RFC 格式组
const rfcFormats = computed<FormatItem[]>(() => {
  const d = selectedDate.value
  const tz = selectedTimezone.value
  const p = getTzParts(d, tz)
  const offset = getTimezoneOffset(d, tz)
  const rfcWeekday = weekdayMap[p.weekday] || p.weekday
  const rfcMonth = monthMap[p.month] || p.month
  const rfcOffsetNoColon = offset.replace(':', '')

  return [
    { label: 'RFC 2822', value: `${rfcWeekday}, ${p.day} ${rfcMonth} ${p.year} ${p.hour}:${p.minute}:${p.second} ${rfcOffsetNoColon}`, desc: 'Thu, 01 Jan 2024 00:00:00 +0800' },
    { label: 'RFC 3339', value: `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}${offset}`, desc: '2024-01-01T00:00:00+08:00' },
    { label: 'RFC 7231（HTTP 日期）', value: d.toUTCString(), desc: 'Thu, 01 Jan 2024 00:00:00 GMT' }
  ]
})

// 时间戳格式组
const timestampFormats = computed<FormatItem[]>(() => {
  const d = selectedDate.value
  return [
    { label: 'Unix 时间戳（秒）', value: Math.floor(d.getTime() / 1000).toString(), desc: '自 1970-01-01 00:00:00 UTC 起的秒数' },
    { label: 'Unix 时间戳（毫秒）', value: d.getTime().toString(), desc: '自 1970-01-01 00:00:00 UTC 起的毫秒数' }
  ]
})

// 本地化格式组
const localeFormats = computed<FormatItem[]>(() => {
  const d = selectedDate.value
  const tz = selectedTimezone.value
  return [
    { label: '中文格式', value: d.toLocaleString('zh-CN', { timeZone: tz }), desc: "toLocaleString('zh-CN')" },
    { label: '英文格式（US）', value: d.toLocaleString('en-US', { timeZone: tz }), desc: "toLocaleString('en-US')" },
    { label: '英文格式（UK）', value: d.toLocaleString('en-GB', { timeZone: tz }), desc: "toLocaleString('en-GB')" },
    { label: '日文格式', value: d.toLocaleString('ja-JP', { timeZone: tz }), desc: "toLocaleString('ja-JP')" },
    { label: '日期对象字符串', value: d.toString(), desc: 'Date.toString()' },
    { label: '日期字符串（UTC）', value: d.toUTCString(), desc: 'Date.toUTCString()' }
  ]
})

// 编程语言格式组
const progFormats = computed<FormatItem[]>(() => {
  const d = selectedDate.value
  const tz = selectedTimezone.value
  const p = getTzParts(d, tz)
  const offset = getTimezoneOffset(d, tz)

  return [
    { label: 'MySQL DATETIME', value: `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second}`, desc: 'YYYY-MM-DD HH:mm:ss' },
    { label: 'PostgreSQL TIMESTAMPTZ', value: `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second}${offset}`, desc: 'YYYY-MM-DD HH:mm:ss+08:00' },
    { label: 'Moment.js / dayjs', value: `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second}`, desc: 'YYYY-MM-DD HH:mm:ss' },
    { label: 'Python strftime', value: `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second}`, desc: '%Y-%m-%d %H:%M:%S' },
    { label: 'Java SimpleDateFormat', value: `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second}`, desc: 'yyyy-MM-dd HH:mm:ss' }
  ]
})

// 特殊格式组
const specialFormats = computed<FormatItem[]>(() => {
  const d = selectedDate.value
  const tz = selectedTimezone.value
  const p = getTzParts(d, tz)

  return [
    { label: '文件名安全格式', value: `${p.year}-${p.month}-${p.day}_${p.hour}-${p.minute}-${p.second}`, desc: '可用于文件命名' },
    { label: '紧凑格式', value: `${p.year}${p.month}${p.day}${p.hour}${p.minute}${p.second}`, desc: '无分隔符' },
    { label: '中文日期格式', value: `${p.year}年${p.month}月${p.day}日 ${p.hour}时${p.minute}分${p.second}秒`, desc: '中文习惯' }
  ]
})

onMounted(() => {
  syncDatetimeLocal()
})

onUnmounted(() => {})
</script>

<style lang="scss" scoped>
.format-row .font-mono {
  word-break: break-all;
}

@media (max-width: 640px) {
  .format-row .font-mono {
    font-size: 0.7rem;
  }
}
</style>
