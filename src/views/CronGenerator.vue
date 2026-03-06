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
          可视化生成和解析 Cron 表达式，支持实时预览下次执行时间
        </p>
      </div>

      <!-- 交互式表达式展示 -->
      <div class="bg-base-100 rounded-2xl p-5 md:p-6 shadow-lg mb-6 cron-hero">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-base-content flex items-center gap-2">
            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
            </svg>
            Cron 表达式
          </h3>
          <div class="flex items-center gap-2">
            <button
              @click="toggleEditMode"
              class="btn btn-sm btn-ghost gap-1"
              :class="{ 'btn-active': isEditMode }"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              {{ isEditMode ? '完成' : '编辑' }}
            </button>
            <button 
              @click="copyCron"
              class="btn btn-sm btn-primary gap-1"
              :disabled="isCronInvalid"
            >
              <svg v-if="!copySuccess" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ copySuccess ? '已复制' : '复制' }}
            </button>
          </div>
        </div>

        <!-- 编辑模式：直接输入 -->
        <div v-if="isEditMode" class="space-y-3">
          <textarea
            v-model="cronInput"
            placeholder="例如：0 */5 * * * *"
            class="textarea textarea-bordered w-full h-20 font-mono text-lg"
            :class="{ 'textarea-error': structureError }"
          />
          <p class="text-xs text-base-content/60">格式：秒 分 时 日 月 周（共 6 段，空格分隔）</p>
          <p v-if="structureError" class="text-xs text-error">{{ structureError }}</p>
        </div>

        <!-- 展示模式：交互式字段 -->
        <div v-else>
          <div class="cron-fields-row">
            <div
              v-for="(field, index) in fieldConfigs"
              :key="field.key"
              class="cron-field-item"
              :class="{ 'cron-field-active': activeFieldIndex === index, 'cron-field-error': getFieldError(field.key) }"
              @click="activeFieldIndex = index"
            >
              <span class="cron-field-label">{{ field.label }}</span>
              <span class="cron-field-value">{{ fieldValues[index] }}</span>
            </div>
          </div>
          <p v-if="isCronInvalid" class="mt-3 text-sm text-error text-center">{{ invalidReason }}</p>
          <p v-else class="mt-3 text-sm text-base-content/60 text-center">{{ description }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <!-- 左侧配置区域 -->
        <div class="lg:col-span-3 space-y-6">
          <!-- 快捷选择 -->
          <div class="bg-base-100 rounded-2xl p-5 md:p-6 shadow-lg">
            <h3 class="font-semibold text-base-content mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              快捷模板
            </h3>
            <!-- 分类标签 -->
            <div class="flex flex-wrap gap-2 mb-4">
              <button
                v-for="cat in presetCategories"
                :key="cat.key"
                @click="activePresetCategory = cat.key"
                class="btn btn-xs"
                :class="activePresetCategory === cat.key ? 'btn-primary' : 'btn-ghost'"
              >
                {{ cat.icon }} {{ cat.name }}
              </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                v-for="preset in filteredPresets"
                :key="preset.name"
                @click="applyPreset(preset)"
                class="preset-btn"
                :class="{ 'preset-btn-active': cronExpression === preset.cron }"
              >
                <span class="preset-btn-name">{{ preset.name }}</span>
                <code class="preset-btn-cron">{{ preset.cron }}</code>
              </button>
            </div>
          </div>

          <!-- 自定义配置 - Tab 切换 -->
          <div class="bg-base-100 rounded-2xl p-5 md:p-6 shadow-lg">
            <h3 class="font-semibold text-base-content mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
              </svg>
              自定义配置
            </h3>

            <!-- 字段 Tab -->
            <div class="tabs tabs-box mb-4 overflow-x-auto">
              <button
                v-for="(field, index) in fieldConfigs"
                :key="field.key"
                @click="activeFieldIndex = index"
                class="tab"
                :class="{ 'tab-active': activeFieldIndex === index }"
              >
                {{ field.label }}
              </button>
            </div>

            <!-- 当前字段配置 -->
            <div class="space-y-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">
                    {{ activeField.label }}
                    <span class="text-base-content/50 font-normal ml-1">({{ activeField.range }})</span>
                  </span>
                </label>
                <input
                  :value="fieldValues[activeFieldIndex]"
                  @input="updatePartValue(activeFieldIndex, $event)"
                  type="text"
                  :placeholder="activeField.placeholder"
                  class="input input-bordered font-mono"
                  :class="{ 'input-error': activeFieldError }"
                />
                <p v-if="activeFieldError" class="mt-1.5 text-xs text-error">
                  {{ activeFieldError }}
                </p>
              </div>

              <!-- 快捷值按钮 -->
              <div>
                <p class="text-xs text-base-content/50 mb-2">快捷设置</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="qv in activeField.quickValues"
                    :key="qv.value"
                    @click="setFieldValue(activeFieldIndex, qv.value)"
                    class="btn btn-xs"
                    :class="fieldValues[activeFieldIndex] === qv.value ? 'btn-primary' : 'btn-outline'"
                  >
                    {{ qv.label }}
                  </button>
                </div>
              </div>

              <!-- 当前字段解释 -->
              <div class="p-3 bg-base-200 rounded-xl">
                <span class="text-sm text-base-content/70">
                  {{ fieldDescriptions[activeFieldIndex] }}
                </span>
              </div>
            </div>
          </div>

          <!-- 语法参考（可折叠） -->
          <div class="collapse collapse-arrow bg-base-100 rounded-2xl shadow-lg">
            <input type="checkbox" />
            <div class="collapse-title font-semibold text-base-content flex items-center gap-2">
              <svg class="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              语法参考
            </div>
            <div class="collapse-content">
              <div class="overflow-x-auto">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>符号</th>
                      <th>含义</th>
                      <th>示例</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="s in syntaxRef" :key="s.symbol">
                      <td><code class="syntax-code">{{ s.symbol }}</code></td>
                      <td class="text-base-content/80">{{ s.meaning }}</td>
                      <td><code class="syntax-code">{{ s.example }}</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧结果区域 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 表达式逐段解读 -->
          <div class="bg-base-100 rounded-2xl p-5 md:p-6 shadow-lg">
            <h3 class="font-semibold text-base-content mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              表达式解读
            </h3>
            <div class="space-y-2">
              <div
                v-for="(field, index) in fieldConfigs"
                :key="field.key"
                class="explain-row"
                :class="{ 'explain-row-active': activeFieldIndex === index }"
                @click="activeFieldIndex = index"
              >
                <span class="explain-label">{{ field.label }}</span>
                <code class="explain-value">{{ fieldValues[index] }}</code>
                <span class="explain-desc">{{ fieldDescriptions[index] }}</span>
              </div>
            </div>
          </div>

          <!-- 执行时间预览 -->
          <div class="bg-base-100 rounded-2xl p-5 md:p-6 shadow-lg">
            <h3 class="font-semibold text-base-content mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              执行时间预览
              <span class="badge badge-sm badge-ghost ml-auto">本地时区</span>
            </h3>

            <p v-if="previewError" class="text-sm text-error p-3 bg-error/10 rounded-lg">
              {{ previewError }}
            </p>

            <div v-else class="space-y-4">
              <!-- 下一次执行 -->
              <div class="next-run-highlight">
                <p class="text-xs text-base-content/50 mb-1">下一次执行</p>
                <p class="text-lg font-semibold text-primary font-mono">{{ nextRunText }}</p>
              </div>

              <!-- 接下来的执行时间 -->
              <div>
                <p class="text-xs text-base-content/50 mb-2">接下来 5 次执行时间</p>
                <div class="timeline-list">
                  <div
                    v-for="(run, i) in nextRuns"
                    :key="run"
                    class="timeline-item"
                  >
                    <span class="timeline-dot" :class="i === 0 ? 'timeline-dot-primary' : ''"></span>
                    <span class="timeline-text">{{ run }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 执行频率可视化 -->
          <div v-if="!isCronInvalid && frequencyText" class="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-5 md:p-6">
            <h3 class="font-semibold text-base-content mb-3 flex items-center gap-2">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              执行频率
            </h3>
            <p class="text-sm text-base-content/80">{{ frequencyText }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useToolNavigation } from '@/composables/useToolNavigation'
import { parseFieldToken, describeField, describeCronExpression, type CronFieldType } from '@/utils/cronExplain'

const { goBack } = useToolNavigation()

const second = ref('0')
const minute = ref('0')
const hour = ref('0')
const day = ref('*')
const month = ref('*')
const week = ref('*')
const cronInput = ref('0 0 0 * * *')
const isSyncing = ref(false)
const isEditMode = ref(false)
const copySuccess = ref(false)
const activeFieldIndex = ref(0)
const activePresetCategory = ref('all')

const FIELD_RANGES = {
  second: { label: '秒', min: 0, max: 59 },
  minute: { label: '分钟', min: 0, max: 59 },
  hour: { label: '小时', min: 0, max: 23 },
  day: { label: '日', min: 1, max: 31 },
  month: { label: '月', min: 1, max: 12 },
  week: { label: '星期', min: 0, max: 7 }
} as const

type FieldName = keyof typeof FIELD_RANGES

const fieldConfigs = [
  {
    key: 'second', label: '秒', range: '0-59', placeholder: '* 或 0-59',
    quickValues: [
      { label: '每秒', value: '*' },
      { label: '第0秒', value: '0' },
      { label: '每5秒', value: '*/5' },
      { label: '每10秒', value: '*/10' },
      { label: '每15秒', value: '*/15' },
      { label: '每30秒', value: '*/30' }
    ]
  },
  {
    key: 'minute', label: '分', range: '0-59', placeholder: '* 或 0-59',
    quickValues: [
      { label: '每分钟', value: '*' },
      { label: '第0分', value: '0' },
      { label: '每5分', value: '*/5' },
      { label: '每10分', value: '*/10' },
      { label: '每15分', value: '*/15' },
      { label: '每30分', value: '*/30' }
    ]
  },
  {
    key: 'hour', label: '时', range: '0-23', placeholder: '* 或 0-23',
    quickValues: [
      { label: '每小时', value: '*' },
      { label: '0点', value: '0' },
      { label: '8点', value: '8' },
      { label: '9点', value: '9' },
      { label: '12点', value: '12' },
      { label: '18点', value: '18' },
      { label: '每2小时', value: '*/2' },
      { label: '每6小时', value: '*/6' },
      { label: '工作时间', value: '9-18' }
    ]
  },
  {
    key: 'day', label: '日', range: '1-31', placeholder: '* 或 1-31',
    quickValues: [
      { label: '每天', value: '*' },
      { label: '1号', value: '1' },
      { label: '15号', value: '15' },
      { label: '月末前', value: '28' },
      { label: '1号和15号', value: '1,15' },
      { label: '每5天', value: '*/5' }
    ]
  },
  {
    key: 'month', label: '月', range: '1-12', placeholder: '* 或 1-12',
    quickValues: [
      { label: '每月', value: '*' },
      { label: '1月', value: '1' },
      { label: '每季度首月', value: '1,4,7,10' },
      { label: '每半年', value: '1,7' },
      { label: '每2个月', value: '*/2' }
    ]
  },
  {
    key: 'week', label: '周', range: '0-7', placeholder: '* 或 0-7 (0和7=周日)',
    quickValues: [
      { label: '每天', value: '*' },
      { label: '工作日', value: '1-5' },
      { label: '周末', value: '0,6' },
      { label: '周一', value: '1' },
      { label: '周五', value: '5' },
      { label: '周日', value: '0' }
    ]
  }
]

const activeField = computed(() => fieldConfigs[activeFieldIndex.value])

const getFieldError = (key: string) => fieldErrors.value[key as FieldName] || ''

const activeFieldError = computed(() => getFieldError(activeField.value.key))

const presetCategories = [
  { key: 'all', name: '全部', icon: '📋' },
  { key: 'seconds', name: '秒级', icon: '⚡' },
  { key: 'minutes', name: '分钟', icon: '⏱' },
  { key: 'hours', name: '小时', icon: '🕐' },
  { key: 'daily', name: '每天', icon: '📅' },
  { key: 'weekly', name: '每周', icon: '📆' },
  { key: 'monthly', name: '每月', icon: '🗓' }
]

const presets = [
  { name: '每秒执行', cron: '* * * * * *', values: ['*', '*', '*', '*', '*', '*'], category: 'seconds' },
  { name: '每5秒', cron: '*/5 * * * * *', values: ['*/5', '*', '*', '*', '*', '*'], category: 'seconds' },
  { name: '每10秒', cron: '*/10 * * * * *', values: ['*/10', '*', '*', '*', '*', '*'], category: 'seconds' },
  { name: '每30秒', cron: '*/30 * * * * *', values: ['*/30', '*', '*', '*', '*', '*'], category: 'seconds' },
  { name: '每分钟执行', cron: '0 * * * * *', values: ['0', '*', '*', '*', '*', '*'], category: 'minutes' },
  { name: '每5分钟', cron: '0 */5 * * * *', values: ['0', '*/5', '*', '*', '*', '*'], category: 'minutes' },
  { name: '每10分钟', cron: '0 */10 * * * *', values: ['0', '*/10', '*', '*', '*', '*'], category: 'minutes' },
  { name: '每15分钟', cron: '0 */15 * * * *', values: ['0', '*/15', '*', '*', '*', '*'], category: 'minutes' },
  { name: '每30分钟', cron: '0 */30 * * * *', values: ['0', '*/30', '*', '*', '*', '*'], category: 'minutes' },
  { name: '每小时执行', cron: '0 0 * * * *', values: ['0', '0', '*', '*', '*', '*'], category: 'hours' },
  { name: '每2小时', cron: '0 0 */2 * * *', values: ['0', '0', '*/2', '*', '*', '*'], category: 'hours' },
  { name: '每6小时', cron: '0 0 */6 * * *', values: ['0', '0', '*/6', '*', '*', '*'], category: 'hours' },
  { name: '每天凌晨', cron: '0 0 0 * * *', values: ['0', '0', '0', '*', '*', '*'], category: 'daily' },
  { name: '每天上午9点', cron: '0 0 9 * * *', values: ['0', '0', '9', '*', '*', '*'], category: 'daily' },
  { name: '每天中午12点', cron: '0 0 12 * * *', values: ['0', '0', '12', '*', '*', '*'], category: 'daily' },
  { name: '每天下午6点', cron: '0 0 18 * * *', values: ['0', '0', '18', '*', '*', '*'], category: 'daily' },
  { name: '每天9点和18点', cron: '0 0 9,18 * * *', values: ['0', '0', '9,18', '*', '*', '*'], category: 'daily' },
  { name: '每周一上午9点', cron: '0 0 9 * * 1', values: ['0', '0', '9', '*', '*', '1'], category: 'weekly' },
  { name: '每周五下午6点', cron: '0 0 18 * * 5', values: ['0', '0', '18', '*', '*', '5'], category: 'weekly' },
  { name: '工作日上午9点', cron: '0 0 9 * * 1-5', values: ['0', '0', '9', '*', '*', '1-5'], category: 'weekly' },
  { name: '周末上午10点', cron: '0 0 10 * * 0,6', values: ['0', '0', '10', '*', '*', '0,6'], category: 'weekly' },
  { name: '每月1号凌晨', cron: '0 0 0 1 * *', values: ['0', '0', '0', '1', '*', '*'], category: 'monthly' },
  { name: '每月15号凌晨', cron: '0 0 0 15 * *', values: ['0', '0', '0', '15', '*', '*'], category: 'monthly' },
  { name: '每月1号和15号', cron: '0 0 0 1,15 * *', values: ['0', '0', '0', '1,15', '*', '*'], category: 'monthly' },
  { name: '每季度首日', cron: '0 0 0 1 1,4,7,10 *', values: ['0', '0', '0', '1', '1,4,7,10', '*'], category: 'monthly' }
]

const filteredPresets = computed(() => {
  if (activePresetCategory.value === 'all') return presets
  return presets.filter(p => p.category === activePresetCategory.value)
})

const syntaxRef = [
  { symbol: '*', meaning: '任意值，匹配所有', example: '* (每秒/分/时…)' },
  { symbol: ',', meaning: '列举多个值', example: '1,3,5 (第1、3、5)' },
  { symbol: '-', meaning: '连续范围', example: '1-5 (1到5)' },
  { symbol: '/', meaning: '步长 / 间隔', example: '*/5 (每隔5个单位)' },
  { symbol: 'a-b/n', meaning: '范围内按步长', example: '1-30/5 (1到30每5)' }
]

const normalizeExpression = (expression: string): string => expression.trim().split(/\s+/).filter(Boolean).join(' ')

const cronParts = computed(() => normalizeExpression(cronInput.value).split(' ').filter(Boolean))

const structureError = computed(() => {
  const expression = normalizeExpression(cronInput.value)
  if (!expression) return 'Cron 表达式不能为空'
  if (cronParts.value.length !== 6) return `Cron 表达式需要 6 段，当前为 ${cronParts.value.length} 段`
  return ''
})

const validateCronField = (fieldName: FieldName, value: string): string => {
  const config = FIELD_RANGES[fieldName]
  const text = value.trim()
  if (!text) return `${config.label}不能为空`

  const isInRange = (numText: string): boolean => {
    if (!/^\d+$/.test(numText)) return false
    const num = Number(numText)
    return num >= config.min && num <= config.max
  }

  if (text === '*') return ''

  if (text.includes(',')) {
    const items = text.split(',').map(item => item.trim())
    if (items.some(item => !item || !isInRange(item))) return `${config.label}取值必须在 ${config.min}-${config.max}`
    return ''
  }

  const stepMatch = text.match(/^((\*)|(\d+-\d+))\/(\d+)$/)
  if (stepMatch) {
    const base = stepMatch[1]
    const step = Number(stepMatch[4])
    if (step <= 0) return `${config.label}步长必须大于 0`
    if (base !== '*') {
      const [start, end] = base.split('-').map(Number)
      if (Number.isNaN(start) || Number.isNaN(end) || start > end || start < config.min || end > config.max) {
        return `${config.label}范围必须在 ${config.min}-${config.max}`
      }
    }
    return ''
  }

  if (text.includes('/')) return `${config.label}步长语法仅支持 */n 或 a-b/n`

  const rangeMatch = text.match(/^(\d+)-(\d+)$/)
  if (rangeMatch) {
    const start = Number(rangeMatch[1])
    const end = Number(rangeMatch[2])
    if (start > end || start < config.min || end > config.max) return `${config.label}范围必须在 ${config.min}-${config.max}`
    return ''
  }

  if (isInRange(text)) return ''
  return `${config.label}格式无效，支持 *、a,b,c、a-b、*/n、a-b/n`
}

const fieldErrors = computed(() => ({
  second: structureError.value ? '' : validateCronField('second', getPartValue(0, second.value)),
  minute: structureError.value ? '' : validateCronField('minute', getPartValue(1, minute.value)),
  hour: structureError.value ? '' : validateCronField('hour', getPartValue(2, hour.value)),
  day: structureError.value ? '' : validateCronField('day', getPartValue(3, day.value)),
  month: structureError.value ? '' : validateCronField('month', getPartValue(4, month.value)),
  week: structureError.value ? '' : validateCronField('week', getPartValue(5, week.value))
}))

const isCronInvalid = computed(() => Boolean(structureError.value) || Object.values(fieldErrors.value).some(Boolean))

watch(
  [second, minute, hour, day, month, week],
  () => {
    if (isSyncing.value) return
    isSyncing.value = true
    cronInput.value = cronExpression.value
    isSyncing.value = false
  },
  { immediate: true }
)

watch(cronInput, (value) => {
  if (isSyncing.value) return
  const parts = value.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 6) {
    isSyncing.value = true
    ;[second.value, minute.value, hour.value, day.value, month.value, week.value] = parts
    isSyncing.value = false
  }
})

const fieldTypes: CronFieldType[] = ['second', 'minute', 'hour', 'day', 'month', 'week']

const fieldValues = computed(() => [
  second.value, minute.value, hour.value, day.value, month.value, week.value
])

const fieldDescriptions = computed(() => {
  return fieldValues.value.map((value, index) =>
    describeField(parseFieldToken(value, fieldTypes[index]), fieldTypes[index])
  )
})

const cronExpression = computed(() => {
  return `${second.value} ${minute.value} ${hour.value} ${day.value} ${month.value} ${week.value}`
})

const invalidReason = computed(() => {
  if (structureError.value) return structureError.value
  const errors = Object.entries(fieldErrors.value).filter(([, error]) => error).map(([, error]) => error)
  return errors[0] || ''
})

const getPartValue = (index: number, fallback: string) => {
  const parts = cronExpression.value.split(' ')
  return parts[index] || fallback
}

const updatePartValue = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.trim()
  const fields = [second, minute, hour, day, month, week]
  fields[index].value = value
}

const setFieldValue = (index: number, value: string) => {
  const fields = [second, minute, hour, day, month, week]
  fields[index].value = value
}

const description = computed(() => describeCronExpression(fieldValues.value))

const frequencyText = computed(() => {
  if (isCronInvalid.value) return ''
  try {
    const runs = getNextRuns(cronExpression.value, 2)
    if (runs.length < 2) return ''
    const diffMs = runs[1].getTime() - runs[0].getTime()
    if (diffMs < 1000) return ''
    if (diffMs < 60_000) return `约每 ${Math.round(diffMs / 1000)} 秒执行一次`
    if (diffMs < 3_600_000) return `约每 ${Math.round(diffMs / 60_000)} 分钟执行一次`
    if (diffMs < 86_400_000) return `约每 ${Math.round(diffMs / 3_600_000)} 小时执行一次`
    return `约每 ${Math.round(diffMs / 86_400_000)} 天执行一次`
  } catch {
    return ''
  }
})

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
}

const parseField = (field: string, min: number, max: number) => {
  const allowed = new Set<number>()
  const segments = field.split(',').map(item => item.trim()).filter(Boolean)
  if (segments.length === 0) throw new Error(`字段 "${field}" 为空`)

  const addRange = (start: number, end: number, step = 1) => {
    if (start < min || end > max || start > end || step <= 0) throw new Error(`字段 "${field}" 超出范围 ${min}-${max}`)
    for (let i = start; i <= end; i += step) allowed.add(i)
  }

  for (const segment of segments) {
    if (segment === '*') { addRange(min, max); continue }
    if (segment.includes('/')) {
      const [base, stepStr] = segment.split('/')
      const step = Number(stepStr)
      if (!Number.isInteger(step) || step <= 0) throw new Error(`字段 "${field}" 的步长无效`)
      if (base === '*') { addRange(min, max, step); continue }
      if (base.includes('-')) {
        const [startStr, endStr] = base.split('-')
        addRange(Number(startStr), Number(endStr), step)
        continue
      }
      addRange(Number(base), max, step)
      continue
    }
    if (segment.includes('-')) {
      const [startStr, endStr] = segment.split('-')
      addRange(Number(startStr), Number(endStr))
      continue
    }
    const value = Number(segment)
    if (!Number.isInteger(value) || value < min || value > max) throw new Error(`字段 "${field}" 的值无效`)
    allowed.add(value)
  }
  return allowed
}

type CronFields = {
  secSet: Set<number>; minSet: Set<number>; hrSet: Set<number>
  daySet: Set<number>; monSet: Set<number>; weekSet: Set<number>
}

const getSortedValues = (values: Set<number>) => Array.from(values).sort((a, b) => a - b)

const findNextOrSame = (values: number[], current: number) => {
  for (const value of values) { if (value >= current) return value }
  return null
}

const parseCronFields = (expression: string): CronFields => {
  const [sec, min, hr, dayOfMonth, mon, dayOfWeek] = expression.trim().split(/\s+/)
  if (!dayOfWeek) throw new Error('Cron 表达式必须为 6 段：秒 分 时 日 月 周')
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
    if (!nextRun) break
    result.push(nextRun)
    cursor = nextRun
  }
  if (result.length < count) throw new Error('未能在合理时间范围内计算到可执行时间，请检查表达式')
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
  if (formattedNextRuns.value instanceof Error) return []
  try {
    return formattedNextRuns.value.map(run => run.toLocaleString())
  } catch {
    return []
  }
})

const previewError = computed(() => {
  if (formattedNextRuns.value instanceof Error) return formattedNextRuns.value.message
  return ''
})

const nextRunText = computed(() => nextRuns.value[0] ?? '暂无')

const applyPreset = (preset: typeof presets[number]) => {
  [second.value, minute.value, hour.value, day.value, month.value, week.value] = preset.values
  cronInput.value = preset.cron
}

const copyCron = async () => {
  if (isCronInvalid.value) return
  try {
    await navigator.clipboard.writeText(cronExpression.value)
    copySuccess.value = true
    setTimeout(() => { copySuccess.value = false }, 2000)
  } catch (error) {
    console.error('复制失败:', error)
  }
}
</script>

<style lang="scss" scoped>
/* 交互式表达式字段行 */
.cron-fields-row {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cron-field-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  background: hsl(var(--b2));
  min-width: 4rem;

  &:hover {
    border-color: hsl(var(--p) / 0.3);
    transform: translateY(-1px);
  }
}

.cron-field-active {
  border-color: hsl(var(--p));
  background: hsl(var(--p) / 0.08);
  box-shadow: 0 0 0 3px hsl(var(--p) / 0.1);
}

.cron-field-error {
  border-color: hsl(var(--er));
  background: hsl(var(--er) / 0.05);
}

.cron-field-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: hsl(var(--bc) / 0.5);
}

.cron-field-value {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 1.125rem;
  font-weight: 700;
  color: hsl(var(--p));
}

.cron-field-error .cron-field-value {
  color: hsl(var(--er));
}

/* 快捷模板按钮 */
.preset-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-radius: 0.625rem;
  border: 1px solid hsl(var(--bc) / 0.1);
  background: hsl(var(--b2));
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    border-color: hsl(var(--p) / 0.4);
    background: hsl(var(--p) / 0.05);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px hsl(var(--p) / 0.1);
  }
}

.preset-btn-active {
  border-color: hsl(var(--p));
  background: hsl(var(--p) / 0.1);

  .preset-btn-name {
    color: hsl(var(--p));
    font-weight: 600;
  }
}

.preset-btn-name {
  font-size: 0.875rem;
  color: hsl(var(--bc));
}

.preset-btn-cron {
  font-size: 0.75rem;
  color: hsl(var(--bc) / 0.5);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  background: hsl(var(--b3));
  padding: 0.125rem 0.375rem;
  border-radius: 0.375rem;
}

/* 语法参考 code */
.syntax-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8125rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  background: hsl(var(--b3));
  color: hsl(var(--p));
}

/* 表达式解读行 */
.explain-row {
  display: grid;
  grid-template-columns: 2.5rem 4rem 1fr;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.625rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: hsl(var(--b2));
  }
}

.explain-row-active {
  background: hsl(var(--p) / 0.08);

  .explain-label {
    color: hsl(var(--p));
    font-weight: 600;
  }
}

.explain-label {
  font-size: 0.8125rem;
  color: hsl(var(--bc) / 0.5);
  font-weight: 500;
}

.explain-value {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8125rem;
  font-weight: 600;
  color: hsl(var(--p));
  background: hsl(var(--b2));
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  text-align: center;
}

.explain-desc {
  font-size: 0.8125rem;
  color: hsl(var(--bc) / 0.7);
}

/* 下一次执行高亮 */
.next-run-highlight {
  background: hsl(var(--su) / 0.08);
  border: 1px solid hsl(var(--su) / 0.2);
  border-radius: 0.75rem;
  padding: 0.875rem 1rem;
}

/* 时间线列表 */
.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 0.25rem;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.timeline-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: hsl(var(--bc) / 0.2);
  flex-shrink: 0;
}

.timeline-dot-primary {
  background: hsl(var(--p));
  box-shadow: 0 0 0 3px hsl(var(--p) / 0.2);
}

.timeline-text {
  font-size: 0.8125rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: hsl(var(--bc) / 0.8);
}

/* 移动端优化 */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .cron-field-item {
    padding: 0.5rem 0.625rem;
    min-width: 3.25rem;
  }

  .cron-field-value {
    font-size: 0.9375rem;
  }

  .explain-row {
    grid-template-columns: 2rem 3.5rem 1fr;
    gap: 0.375rem;
    padding: 0.375rem 0.5rem;
  }
}

code {
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  background-color: hsl(var(--b3));
}
</style>
