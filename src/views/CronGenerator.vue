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
          <h1 class="text-xl md:text-2xl font-bold text-base-content">Cron 表达式生成器</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          可视化生成 Cron 表达式，支持常用定时任务配置
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 配置区域 -->
        <div class="space-y-6">
          <!-- 快捷选择 -->
          <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
            <h3 class="font-semibold text-base-content mb-4">快捷选择</h3>
            <div class="grid grid-cols-1 gap-2">
              <button
                v-for="preset in presets"
                :key="preset.name"
                @click="applyPreset(preset)"
                class="btn btn-sm btn-outline text-left justify-between"
              >
                <span>{{ preset.name }}</span>
                <code class="text-xs">{{ preset.cron }}</code>
              </button>
            </div>
          </div>

          <!-- 自定义配置 -->
          <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
            <h3 class="font-semibold text-base-content mb-4">自定义配置</h3>
            
            <div class="space-y-4">
              <!-- 秒 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">秒 (0-59)</span>
                </label>
                <input
                  v-model="second"
                  type="text"
                  placeholder="* 或 0-59"
                  class="input input-bordered input-sm"
                />
              </div>

              <!-- 分钟 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">分钟 (0-59)</span>
                </label>
                <input
                  v-model="minute"
                  type="text"
                  placeholder="* 或 0-59"
                  class="input input-bordered input-sm"
                />
              </div>

              <!-- 小时 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">小时 (0-23)</span>
                </label>
                <input
                  v-model="hour"
                  type="text"
                  placeholder="* 或 0-23"
                  class="input input-bordered input-sm"
                />
              </div>

              <!-- 日 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">日 (1-31)</span>
                </label>
                <input
                  v-model="day"
                  type="text"
                  placeholder="* 或 1-31"
                  class="input input-bordered input-sm"
                />
              </div>

              <!-- 月 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">月 (1-12)</span>
                </label>
                <input
                  v-model="month"
                  type="text"
                  placeholder="* 或 1-12"
                  class="input input-bordered input-sm"
                />
              </div>

              <!-- 星期 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">星期 (0-7, 0和7都表示周日)</span>
                </label>
                <input
                  v-model="week"
                  type="text"
                  placeholder="* 或 0-7"
                  class="input input-bordered input-sm"
                />
              </div>
            </div>
          </div>

          <!-- 语法说明 -->
          <div class="bg-info/10 rounded-2xl p-4">
            <h4 class="font-semibold text-base-content mb-2">语法说明</h4>
            <div class="text-sm text-base-content/70 space-y-1">
              <p>• <code>*</code> - 任意值</p>
              <p>• <code>,</code> - 列举值，如 1,3,5</p>
              <p>• <code>-</code> - 范围，如 1-5</p>
              <p>• <code>/</code> - 步长，如 */5 表示每5个单位</p>
            </div>
          </div>
        </div>

        <!-- 结果区域 -->
        <div class="space-y-6">
          <!-- Cron 表达式 -->
          <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-base-content">Cron 表达式</h3>
              <div class="flex flex-col items-end gap-1">
                <button 
                  @click="copyCron"
                  class="btn btn-sm btn-primary"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                  复制
                </button>
                <span class="text-xs text-base-content/60">已按当前时区计算</span>
              </div>
            </div>
            <div class="p-4 bg-base-200 rounded-lg">
              <code class="text-lg font-mono text-primary">{{ cronExpression }}</code>
            </div>
          </div>

          <!-- 表达式解释 -->
          <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
            <h3 class="font-semibold text-base-content mb-4">表达式解释</h3>
            <div class="space-y-2">
              <div class="flex justify-between p-2 bg-base-200 rounded">
                <span class="text-sm text-base-content/70">秒</span>
                <code class="text-sm font-mono">{{ second }}</code>
              </div>
              <div class="flex justify-between p-2 bg-base-200 rounded">
                <span class="text-sm text-base-content/70">分钟</span>
                <code class="text-sm font-mono">{{ minute }}</code>
              </div>
              <div class="flex justify-between p-2 bg-base-200 rounded">
                <span class="text-sm text-base-content/70">小时</span>
                <code class="text-sm font-mono">{{ hour }}</code>
              </div>
              <div class="flex justify-between p-2 bg-base-200 rounded">
                <span class="text-sm text-base-content/70">日</span>
                <code class="text-sm font-mono">{{ day }}</code>
              </div>
              <div class="flex justify-between p-2 bg-base-200 rounded">
                <span class="text-sm text-base-content/70">月</span>
                <code class="text-sm font-mono">{{ month }}</code>
              </div>
              <div class="flex justify-between p-2 bg-base-200 rounded">
                <span class="text-sm text-base-content/70">星期</span>
                <code class="text-sm font-mono">{{ week }}</code>
              </div>
            </div>
          </div>

          <!-- 执行时间说明 -->
          <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
            <h3 class="font-semibold text-base-content mb-4">执行时间说明</h3>
            <p class="text-sm text-base-content/70">{{ description }}</p>
          </div>

          <!-- 下次执行时间预览 -->
          <div class="bg-success/10 rounded-2xl p-4">
            <h4 class="font-semibold text-base-content mb-3">🕒 真实预览（本地时区）</h4>
            <p v-if="previewError" class="text-sm text-error">
              {{ previewError }}
            </p>
            <div v-else class="space-y-3 text-sm text-base-content/80">
              <div>
                <p class="text-base-content/70 mb-1">下一次执行时间</p>
                <p class="font-medium">{{ nextRunText }}</p>
              </div>
              <div>
                <p class="text-base-content/70 mb-1">接下来 5 次执行时间</p>
                <ul class="space-y-1 list-decimal pl-5">
                  <li v-for="run in nextRuns" :key="run">{{ run }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToolNavigation } from '@/composables/useToolNavigation'

const { goBack } = useToolNavigation()

const second = ref('0')
const minute = ref('0')
const hour = ref('0')
const day = ref('*')
const month = ref('*')
const week = ref('*')

const presets = [
  { name: '每秒执行', cron: '* * * * * *', values: ['*', '*', '*', '*', '*', '*'] },
  { name: '每分钟执行', cron: '0 * * * * *', values: ['0', '*', '*', '*', '*', '*'] },
  { name: '每小时执行', cron: '0 0 * * * *', values: ['0', '0', '*', '*', '*', '*'] },
  { name: '每天凌晨执行', cron: '0 0 0 * * *', values: ['0', '0', '0', '*', '*', '*'] },
  { name: '每天上午9点', cron: '0 0 9 * * *', values: ['0', '0', '9', '*', '*', '*'] },
  { name: '每周一上午9点', cron: '0 0 9 * * 1', values: ['0', '0', '9', '*', '*', '1'] },
  { name: '每月1号凌晨', cron: '0 0 0 1 * *', values: ['0', '0', '0', '1', '*', '*'] },
  { name: '每5分钟', cron: '0 */5 * * * *', values: ['0', '*/5', '*', '*', '*', '*'] },
  { name: '每30分钟', cron: '0 */30 * * * *', values: ['0', '*/30', '*', '*', '*', '*'] },
  { name: '工作日上午9点', cron: '0 0 9 * * 1-5', values: ['0', '0', '9', '*', '*', '1-5'] }
]


const cronExpression = computed(() => {
  return `${second.value} ${minute.value} ${hour.value} ${day.value} ${month.value} ${week.value}`
})

const description = computed(() => {
  const parts = []
  
  if (second.value === '*') {
    parts.push('每秒')
  } else if (second.value.includes('/')) {
    const step = second.value.split('/')[1]
    parts.push(`每${step}秒`)
  } else if (second.value !== '0') {
    parts.push(`第${second.value}秒`)
  }
  
  if (minute.value === '*') {
    parts.push('每分钟')
  } else if (minute.value.includes('/')) {
    const step = minute.value.split('/')[1]
    parts.push(`每${step}分钟`)
  } else {
    parts.push(`第${minute.value}分钟`)
  }
  
  if (hour.value === '*') {
    parts.push('每小时')
  } else if (hour.value.includes('/')) {
    const step = hour.value.split('/')[1]
    parts.push(`每${step}小时`)
  } else {
    parts.push(`${hour.value}点`)
  }
  
  if (day.value !== '*') {
    parts.push(`每月${day.value}号`)
  }
  
  if (month.value !== '*') {
    parts.push(`${month.value}月`)
  }
  
  if (week.value !== '*') {
    const weekMap: Record<string, string> = {
      '0': '周日', '1': '周一', '2': '周二', '3': '周三',
      '4': '周四', '5': '周五', '6': '周六', '7': '周日'
    }
    if (week.value.includes('-')) {
      parts.push('工作日')
    } else {
      parts.push(weekMap[week.value] || `星期${week.value}`)
    }
  }
  
  return parts.length > 0 ? parts.join(' ') + ' 执行' : '请配置执行时间'
})

const parseField = (field: string, min: number, max: number) => {
  const allowed = new Set<number>()
  const segments = field.split(',').map(item => item.trim()).filter(Boolean)

  if (segments.length === 0) {
    throw new Error(`字段 "${field}" 为空`)
  }

  const addRange = (start: number, end: number, step = 1) => {
    if (start < min || end > max || start > end || step <= 0) {
      throw new Error(`字段 "${field}" 超出范围 ${min}-${max}`)
    }
    for (let i = start; i <= end; i += step) {
      allowed.add(i)
    }
  }

  for (const segment of segments) {
    if (segment === '*') {
      addRange(min, max)
      continue
    }

    if (segment.includes('/')) {
      const [base, stepStr] = segment.split('/')
      const step = Number(stepStr)
      if (!Number.isInteger(step) || step <= 0) {
        throw new Error(`字段 "${field}" 的步长无效`)
      }

      if (base === '*') {
        addRange(min, max, step)
        continue
      }

      if (base.includes('-')) {
        const [startStr, endStr] = base.split('-')
        addRange(Number(startStr), Number(endStr), step)
        continue
      }

      const start = Number(base)
      addRange(start, max, step)
      continue
    }

    if (segment.includes('-')) {
      const [startStr, endStr] = segment.split('-')
      addRange(Number(startStr), Number(endStr))
      continue
    }

    const value = Number(segment)
    if (!Number.isInteger(value) || value < min || value > max) {
      throw new Error(`字段 "${field}" 的值无效`)
    }
    allowed.add(value)
  }

  return allowed
}

type CronFields = {
  secSet: Set<number>
  minSet: Set<number>
  hrSet: Set<number>
  daySet: Set<number>
  monSet: Set<number>
  weekSet: Set<number>
}

const getSortedValues = (values: Set<number>) => Array.from(values).sort((a, b) => a - b)

const findNextOrSame = (values: number[], current: number) => {
  for (const value of values) {
    if (value >= current) {
      return value
    }
  }
  return null
}

const parseCronFields = (expression: string): CronFields => {
  const [sec, min, hr, dayOfMonth, mon, dayOfWeek] = expression.trim().split(/\s+/)
  if (!dayOfWeek) {
    throw new Error('Cron 表达式必须为 6 段：秒 分 时 日 月 周')
  }

  return {
    secSet: parseField(sec, 0, 59),
    minSet: parseField(min, 0, 59),
    hrSet: parseField(hr, 0, 23),
    daySet: parseField(dayOfMonth, 1, 31),
    monSet: parseField(mon, 1, 12),
    weekSet: parseField(dayOfWeek, 0, 7)
  }
}

const getNextRunAfter = (start: Date, fields: CronFields, maxYears = 2) => {
  const secValues = getSortedValues(fields.secSet)
  const minValues = getSortedValues(fields.minSet)
  const hrValues = getSortedValues(fields.hrSet)
  const monValues = getSortedValues(fields.monSet)
  const minSecond = secValues[0]
  const minMinute = minValues[0]
  const minHour = hrValues[0]

  const weekMatches = (weekDay: number) => fields.weekSet.has(weekDay) || (weekDay === 0 && fields.weekSet.has(7))

  const cursor = new Date(start)
  cursor.setMilliseconds(0)
  cursor.setSeconds(cursor.getSeconds() + 1)

  const limit = new Date(start)
  limit.setFullYear(limit.getFullYear() + maxYears)

  while (cursor <= limit) {
    const currentMonth = cursor.getMonth() + 1
    const nextMonth = findNextOrSame(monValues, currentMonth)
    if (nextMonth === null) {
      cursor.setFullYear(cursor.getFullYear() + 1, monValues[0] - 1, 1)
      cursor.setHours(minHour, minMinute, minSecond, 0)
      continue
    }
    if (nextMonth !== currentMonth) {
      cursor.setMonth(nextMonth - 1, 1)
      cursor.setHours(minHour, minMinute, minSecond, 0)
      continue
    }

    const currentDay = cursor.getDate()
    if (!fields.daySet.has(currentDay) || !weekMatches(cursor.getDay())) {
      cursor.setDate(currentDay + 1)
      cursor.setHours(minHour, minMinute, minSecond, 0)
      continue
    }

    const currentHour = cursor.getHours()
    const nextHour = findNextOrSame(hrValues, currentHour)
    if (nextHour === null) {
      cursor.setDate(cursor.getDate() + 1)
      cursor.setHours(minHour, minMinute, minSecond, 0)
      continue
    }
    if (nextHour !== currentHour) {
      cursor.setHours(nextHour, minMinute, minSecond, 0)
      continue
    }

    const currentMinute = cursor.getMinutes()
    const nextMinute = findNextOrSame(minValues, currentMinute)
    if (nextMinute === null) {
      cursor.setHours(currentHour + 1, minMinute, minSecond, 0)
      continue
    }
    if (nextMinute !== currentMinute) {
      cursor.setMinutes(nextMinute, minSecond, 0)
      continue
    }

    const currentSecond = cursor.getSeconds()
    const nextSecond = findNextOrSame(secValues, currentSecond)
    if (nextSecond === null) {
      cursor.setMinutes(currentMinute + 1, minSecond, 0)
      continue
    }
    if (nextSecond !== currentSecond) {
      cursor.setSeconds(nextSecond, 0)
      continue
    }

    return new Date(cursor)
  }

  return null
}

const getNextRuns = (expression: string, count: number) => {
  const fields = parseCronFields(expression)

  const result: Date[] = []
  let cursor = new Date()

  for (let i = 0; i < count; i += 1) {
    const nextRun = getNextRunAfter(cursor, fields)
    if (!nextRun) {
      break
    }
    result.push(nextRun)
    cursor = nextRun
  }

  if (result.length < count) {
    throw new Error('未能在合理时间范围内计算到可执行时间，请检查表达式')
  }

  return result
}

const formattedNextRuns = computed(() => {
  try {
    return getNextRuns(cronExpression.value, 5)
  } catch (error) {
    return error instanceof Error ? error : new Error('表达式无效，请检查配置项')
  }
})

const nextRuns = computed(() => {
  if (formattedNextRuns.value instanceof Error) {
    return []
  }

  try {
    return formattedNextRuns.value.map(run => run.toLocaleString())
  } catch {
    return []
  }
})

const previewError = computed(() => {
  if (formattedNextRuns.value instanceof Error) {
    return formattedNextRuns.value.message
  }
  return ''
})

const nextRunText = computed(() => nextRuns.value[0] ?? '暂无')

const applyPreset = (preset: any) => {
  [second.value, minute.value, hour.value, day.value, month.value, week.value] = preset.values
}

const copyCron = async () => {
  try {
    await navigator.clipboard.writeText(cronExpression.value)
  } catch (error) {
    console.error('复制失败:', error)
  }
}
</script>

<style lang="scss" scoped>
/* 移动端优化 */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

code {
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  background-color: hsl(var(--b3));
}
</style>
