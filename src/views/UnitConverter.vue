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
          <span class="text-2xl md:text-3xl">📏</span>
          <h1 class="text-xl md:text-2xl font-bold text-base-content">单位转换器</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          各种单位之间的转换工具，支持长度、重量、温度、面积、体积、数据大小等
        </p>
      </div>

      <!-- 类别选择 -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-lg mb-6">
        <h2 class="text-lg font-semibold text-base-content mb-4">转换类别</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="category = cat.id"
            class="btn"
            :class="category === cat.id ? 'btn-primary' : 'btn-outline'"
          >
            {{ cat.icon }} {{ cat.name }}
          </button>
        </div>
      </div>

      <!-- 转换区域 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 输入 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h3 class="font-semibold text-base-content mb-4">从</h3>
          
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">单位</span>
            </label>
            <select v-model="fromUnit" @change="convert" class="select select-bordered">
              <option v-for="unit in currentUnits" :key="unit.id" :value="unit.id">
                {{ unit.name }} ({{ unit.symbol }})
              </option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">数值</span>
            </label>
            <input
              v-model.number="fromValue"
              @input="convert"
              type="number"
              step="any"
              placeholder="请输入数值"
              class="input input-bordered font-mono"
            />
          </div>
        </div>

        <!-- 输出 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h3 class="font-semibold text-base-content mb-4">到</h3>
          
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">单位</span>
            </label>
            <select v-model="toUnit" @change="convert" class="select select-bordered">
              <option v-for="unit in currentUnits" :key="unit.id" :value="unit.id">
                {{ unit.name }} ({{ unit.symbol }})
              </option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">结果</span>
            </label>
            <input
              :value="toValue"
              readonly
              type="text"
              class="input input-bordered font-mono bg-base-200"
            />
          </div>
        </div>
      </div>

      <!-- 常用转换 -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-lg mt-6">
        <h3 class="font-semibold text-base-content mb-4">常用转换</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            v-for="preset in currentPresets"
            :key="preset.label"
            @click="applyPreset(preset)"
            class="btn btn-sm btn-outline text-left justify-start"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const category = ref('length')
const fromUnit = ref('meter')
const toUnit = ref('kilometer')
const fromValue = ref<number>(0)
const toValue = ref('')

interface Unit {
  id: string
  name: string
  symbol: string
  toBase: number // 转换到基础单位的系数
}

interface Category {
  id: string
  name: string
  icon: string
  units: Unit[]
  presets: { label: string; from: string; to: string; value: number }[]
}

const categories: Category[] = [
  {
    id: 'length',
    name: '长度',
    icon: '📏',
    units: [
      { id: 'kilometer', name: '千米', symbol: 'km', toBase: 1000 },
      { id: 'meter', name: '米', symbol: 'm', toBase: 1 },
      { id: 'centimeter', name: '厘米', symbol: 'cm', toBase: 0.01 },
      { id: 'millimeter', name: '毫米', symbol: 'mm', toBase: 0.001 },
      { id: 'mile', name: '英里', symbol: 'mi', toBase: 1609.34 },
      { id: 'yard', name: '码', symbol: 'yd', toBase: 0.9144 },
      { id: 'foot', name: '英尺', symbol: 'ft', toBase: 0.3048 },
      { id: 'inch', name: '英寸', symbol: 'in', toBase: 0.0254 }
    ],
    presets: [
      { label: '1 千米 = ? 米', from: 'kilometer', to: 'meter', value: 1 },
      { label: '1 英里 = ? 千米', from: 'mile', to: 'kilometer', value: 1 },
      { label: '1 英尺 = ? 厘米', from: 'foot', to: 'centimeter', value: 1 }
    ]
  },
  {
    id: 'weight',
    name: '重量',
    icon: '⚖️',
    units: [
      { id: 'ton', name: '吨', symbol: 't', toBase: 1000000 },
      { id: 'kilogram', name: '千克', symbol: 'kg', toBase: 1000 },
      { id: 'gram', name: '克', symbol: 'g', toBase: 1 },
      { id: 'milligram', name: '毫克', symbol: 'mg', toBase: 0.001 },
      { id: 'pound', name: '磅', symbol: 'lb', toBase: 453.592 },
      { id: 'ounce', name: '盎司', symbol: 'oz', toBase: 28.3495 }
    ],
    presets: [
      { label: '1 千克 = ? 克', from: 'kilogram', to: 'gram', value: 1 },
      { label: '1 磅 = ? 千克', from: 'pound', to: 'kilogram', value: 1 },
      { label: '1 吨 = ? 千克', from: 'ton', to: 'kilogram', value: 1 }
    ]
  },
  {
    id: 'temperature',
    name: '温度',
    icon: '🌡️',
    units: [
      { id: 'celsius', name: '摄氏度', symbol: '°C', toBase: 1 },
      { id: 'fahrenheit', name: '华氏度', symbol: '°F', toBase: 1 },
      { id: 'kelvin', name: '开尔文', symbol: 'K', toBase: 1 }
    ],
    presets: [
      { label: '0°C = ? °F', from: 'celsius', to: 'fahrenheit', value: 0 },
      { label: '100°C = ? °F', from: 'celsius', to: 'fahrenheit', value: 100 },
      { label: '32°F = ? °C', from: 'fahrenheit', to: 'celsius', value: 32 }
    ]
  },
  {
    id: 'data',
    name: '数据',
    icon: '💾',
    units: [
      { id: 'terabyte', name: '太字节', symbol: 'TB', toBase: 1099511627776 },
      { id: 'gigabyte', name: '吉字节', symbol: 'GB', toBase: 1073741824 },
      { id: 'megabyte', name: '兆字节', symbol: 'MB', toBase: 1048576 },
      { id: 'kilobyte', name: '千字节', symbol: 'KB', toBase: 1024 },
      { id: 'byte', name: '字节', symbol: 'B', toBase: 1 }
    ],
    presets: [
      { label: '1 GB = ? MB', from: 'gigabyte', to: 'megabyte', value: 1 },
      { label: '1 TB = ? GB', from: 'terabyte', to: 'gigabyte', value: 1 },
      { label: '1024 MB = ? GB', from: 'megabyte', to: 'gigabyte', value: 1024 }
    ]
  }
]

const currentCategory = computed(() => categories.find(c => c.id === category.value)!)
const currentUnits = computed(() => currentCategory.value.units)
const currentPresets = computed(() => currentCategory.value.presets)

const goBack = () => {
  router.push('/')
}

const convertTemperature = (value: number, from: string, to: string): number => {
  let celsius: number
  
  // 转换到摄氏度
  if (from === 'celsius') {
    celsius = value
  } else if (from === 'fahrenheit') {
    celsius = (value - 32) * 5 / 9
  } else { // kelvin
    celsius = value - 273.15
  }
  
  // 从摄氏度转换到目标单位
  if (to === 'celsius') {
    return celsius
  } else if (to === 'fahrenheit') {
    return celsius * 9 / 5 + 32
  } else { // kelvin
    return celsius + 273.15
  }
}

const convert = () => {
  if (!fromValue.value && fromValue.value !== 0) {
    toValue.value = ''
    return
  }

  if (category.value === 'temperature') {
    const result = convertTemperature(fromValue.value, fromUnit.value, toUnit.value)
    toValue.value = result.toFixed(6).replace(/\.?0+$/, '')
  } else {
    const fromUnitData = currentUnits.value.find(u => u.id === fromUnit.value)!
    const toUnitData = currentUnits.value.find(u => u.id === toUnit.value)!
    
    const baseValue = fromValue.value * fromUnitData.toBase
    const result = baseValue / toUnitData.toBase
    
    toValue.value = result.toFixed(6).replace(/\.?0+$/, '')
  }
}

const applyPreset = (preset: { from: string; to: string; value: number }) => {
  fromUnit.value = preset.from
  toUnit.value = preset.to
  fromValue.value = preset.value
  convert()
}

// 初始化
convert()
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
