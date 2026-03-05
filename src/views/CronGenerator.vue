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
              <button 
                @click="copyCron"
                class="btn btn-sm btn-primary"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                复制
              </button>
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
                <code class="text-sm font-mono">{{ fieldDescriptions[0] }}</code>
              </div>
              <div class="flex justify-between p-2 bg-base-200 rounded">
                <span class="text-sm text-base-content/70">分钟</span>
                <code class="text-sm font-mono">{{ fieldDescriptions[1] }}</code>
              </div>
              <div class="flex justify-between p-2 bg-base-200 rounded">
                <span class="text-sm text-base-content/70">小时</span>
                <code class="text-sm font-mono">{{ fieldDescriptions[2] }}</code>
              </div>
              <div class="flex justify-between p-2 bg-base-200 rounded">
                <span class="text-sm text-base-content/70">日</span>
                <code class="text-sm font-mono">{{ fieldDescriptions[3] }}</code>
              </div>
              <div class="flex justify-between p-2 bg-base-200 rounded">
                <span class="text-sm text-base-content/70">月</span>
                <code class="text-sm font-mono">{{ fieldDescriptions[4] }}</code>
              </div>
              <div class="flex justify-between p-2 bg-base-200 rounded">
                <span class="text-sm text-base-content/70">星期</span>
                <code class="text-sm font-mono">{{ fieldDescriptions[5] }}</code>
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
            <h4 class="font-semibold text-base-content mb-2">💡 提示</h4>
            <p class="text-sm text-base-content/70">
              Cron 表达式格式：秒 分 时 日 月 周
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToolNavigation } from '@/composables/useToolNavigation'
import { parseFieldToken, describeField, describeCronExpression, type CronFieldType } from '@/utils/cronExplain'

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

const fieldTypes: CronFieldType[] = ['second', 'minute', 'hour', 'day', 'month', 'week']

const fieldValues = computed(() => [
  second.value,
  minute.value,
  hour.value,
  day.value,
  month.value,
  week.value
])

const fieldDescriptions = computed(() => {
  return fieldValues.value.map((value, index) =>
    describeField(parseFieldToken(value, fieldTypes[index]), fieldTypes[index])
  )
})

const description = computed(() => {
  return describeCronExpression(fieldValues.value)
})

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
