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
          <span class="text-2xl md:text-3xl">📅</span>
          <h1 class="text-xl md:text-2xl font-bold text-base-content">日期计算器</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          日期相关计算工具，支持日期加减、日期差计算、年龄计算等
        </p>
      </div>

      <!-- 功能选择 -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-lg mb-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            @click="mode = 'diff'"
            class="btn"
            :class="mode === 'diff' ? 'btn-primary' : 'btn-outline'"
          >
            日期差计算
          </button>
          <button
            @click="mode = 'add'"
            class="btn"
            :class="mode === 'add' ? 'btn-primary' : 'btn-outline'"
          >
            日期加减
          </button>
          <button
            @click="mode = 'age'"
            class="btn"
            :class="mode === 'age' ? 'btn-primary' : 'btn-outline'"
          >
            年龄计算
          </button>
          <button
            @click="mode = 'workday'"
            class="btn"
            :class="mode === 'workday' ? 'btn-primary' : 'btn-outline'"
          >
            工作日计算
          </button>
        </div>
      </div>

      <!-- 日期差计算 -->
      <div v-if="mode === 'diff'" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
            <h3 class="font-semibold text-base-content mb-4">开始日期</h3>
            <input
              v-model="startDate"
              @change="calculateDiff"
              type="date"
              class="input input-bordered w-full"
            />
          </div>

          <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
            <h3 class="font-semibold text-base-content mb-4">结束日期</h3>
            <input
              v-model="endDate"
              @change="calculateDiff"
              type="date"
              class="input input-bordered w-full"
            />
          </div>
        </div>

        <div v-if="diffResult" class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h3 class="font-semibold text-base-content mb-4">计算结果</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-primary/10 rounded-lg">
              <div class="text-3xl font-bold text-primary">{{ diffResult.days }}</div>
              <div class="text-sm text-base-content/60 mt-1">天</div>
            </div>
            <div class="text-center p-4 bg-secondary/10 rounded-lg">
              <div class="text-3xl font-bold text-secondary">{{ diffResult.weeks }}</div>
              <div class="text-sm text-base-content/60 mt-1">周</div>
            </div>
            <div class="text-center p-4 bg-accent/10 rounded-lg">
              <div class="text-3xl font-bold text-accent">{{ diffResult.months }}</div>
              <div class="text-sm text-base-content/60 mt-1">月</div>
            </div>
            <div class="text-center p-4 bg-info/10 rounded-lg">
              <div class="text-3xl font-bold text-info">{{ diffResult.years }}</div>
              <div class="text-sm text-base-content/60 mt-1">年</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 日期加减 -->
      <div v-if="mode === 'add'" class="space-y-6">
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h3 class="font-semibold text-base-content mb-4">基准日期</h3>
          <input
            v-model="baseDate"
            type="date"
            class="input input-bordered w-full"
          />
        </div>

        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h3 class="font-semibold text-base-content mb-4">增减数值</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">数值</span>
              </label>
              <input
                v-model.number="addValue"
                type="number"
                class="input input-bordered"
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">单位</span>
              </label>
              <select v-model="addUnit" class="select select-bordered">
                <option value="days">天</option>
                <option value="weeks">周</option>
                <option value="months">月</option>
                <option value="years">年</option>
              </select>
            </div>
          </div>
          <button @click="calculateAdd" class="btn btn-primary w-full mt-4">
            计算
          </button>
        </div>

        <div v-if="addResult" class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h3 class="font-semibold text-base-content mb-4">计算结果</h3>
          <div class="text-center p-6 bg-success/10 rounded-lg">
            <div class="text-2xl font-bold text-success">{{ addResult }}</div>
          </div>
        </div>
      </div>

      <!-- 年龄计算 -->
      <div v-if="mode === 'age'" class="space-y-6">
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h3 class="font-semibold text-base-content mb-4">出生日期</h3>
          <input
            v-model="birthDate"
            @change="calculateAge"
            type="date"
            class="input input-bordered w-full"
          />
        </div>

        <div v-if="ageResult" class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h3 class="font-semibold text-base-content mb-4">年龄信息</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-6 bg-primary/10 rounded-lg">
              <div class="text-4xl font-bold text-primary">{{ ageResult.years }}</div>
              <div class="text-sm text-base-content/60 mt-2">岁</div>
            </div>
            <div class="text-center p-6 bg-secondary/10 rounded-lg">
              <div class="text-4xl font-bold text-secondary">{{ ageResult.months }}</div>
              <div class="text-sm text-base-content/60 mt-2">个月</div>
            </div>
            <div class="text-center p-6 bg-accent/10 rounded-lg">
              <div class="text-4xl font-bold text-accent">{{ ageResult.days }}</div>
              <div class="text-sm text-base-content/60 mt-2">天</div>
            </div>
          </div>
          <div class="mt-4 p-4 bg-base-200 rounded-lg text-center">
            <p class="text-base-content/70">
              总共活了 <span class="font-bold text-primary">{{ ageResult.totalDays }}</span> 天
            </p>
          </div>
        </div>
      </div>

      <!-- 工作日计算 -->
      <div v-if="mode === 'workday'" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
            <h3 class="font-semibold text-base-content mb-4">开始日期</h3>
            <input
              v-model="workStartDate"
              @change="calculateWorkdays"
              type="date"
              class="input input-bordered w-full"
            />
          </div>

          <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
            <h3 class="font-semibold text-base-content mb-4">结束日期</h3>
            <input
              v-model="workEndDate"
              @change="calculateWorkdays"
              type="date"
              class="input input-bordered w-full"
            />
          </div>
        </div>

        <div v-if="workdayResult" class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h3 class="font-semibold text-base-content mb-4">工作日统计</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-success/10 rounded-lg">
              <div class="text-3xl font-bold text-success">{{ workdayResult.workdays }}</div>
              <div class="text-sm text-base-content/60 mt-1">工作日</div>
            </div>
            <div class="text-center p-4 bg-warning/10 rounded-lg">
              <div class="text-3xl font-bold text-warning">{{ workdayResult.weekends }}</div>
              <div class="text-sm text-base-content/60 mt-1">周末</div>
            </div>
            <div class="text-center p-4 bg-info/10 rounded-lg">
              <div class="text-3xl font-bold text-info">{{ workdayResult.total }}</div>
              <div class="text-sm text-base-content/60 mt-1">总天数</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const mode = ref<'diff' | 'add' | 'age' | 'workday'>('diff')

// 日期差计算
const startDate = ref('')
const endDate = ref('')
const diffResult = ref<any>(null)

// 日期加减
const baseDate = ref('')
const addValue = ref(0)
const addUnit = ref('days')
const addResult = ref('')

// 年龄计算
const birthDate = ref('')
const ageResult = ref<any>(null)

// 工作日计算
const workStartDate = ref('')
const workEndDate = ref('')
const workdayResult = ref<any>(null)

const goBack = () => {
  router.push('/')
}

const calculateDiff = () => {
  if (!startDate.value || !endDate.value) return

  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  const diffMs = Math.abs(end.getTime() - start.getTime())
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30.44)
  const years = Math.floor(days / 365.25)

  diffResult.value = { days, weeks, months, years }
}

const calculateAdd = () => {
  if (!baseDate.value) return

  const date = new Date(baseDate.value)
  
  switch (addUnit.value) {
    case 'days':
      date.setDate(date.getDate() + addValue.value)
      break
    case 'weeks':
      date.setDate(date.getDate() + addValue.value * 7)
      break
    case 'months':
      date.setMonth(date.getMonth() + addValue.value)
      break
    case 'years':
      date.setFullYear(date.getFullYear() + addValue.value)
      break
  }

  addResult.value = date.toISOString().split('T')[0]
}

const calculateAge = () => {
  if (!birthDate.value) return

  const birth = new Date(birthDate.value)
  const today = new Date()
  
  let years = today.getFullYear() - birth.getFullYear()
  let months = today.getMonth() - birth.getMonth()
  let days = today.getDate() - birth.getDate()

  if (days < 0) {
    months--
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
    days += lastMonth.getDate()
  }

  if (months < 0) {
    years--
    months += 12
  }

  const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))

  ageResult.value = { years, months, days, totalDays }
}

const calculateWorkdays = () => {
  if (!workStartDate.value || !workEndDate.value) return

  const start = new Date(workStartDate.value)
  const end = new Date(workEndDate.value)
  
  let workdays = 0
  let weekends = 0
  let current = new Date(start)

  while (current <= end) {
    const day = current.getDay()
    if (day === 0 || day === 6) {
      weekends++
    } else {
      workdays++
    }
    current.setDate(current.getDate() + 1)
  }

  const total = workdays + weekends

  workdayResult.value = { workdays, weekends, total }
}

// 初始化今天的日期
const today = new Date().toISOString().split('T')[0]
startDate.value = today
endDate.value = today
baseDate.value = today
workStartDate.value = today
workEndDate.value = today
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
