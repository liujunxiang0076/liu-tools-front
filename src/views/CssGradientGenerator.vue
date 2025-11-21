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
          <span class="text-2xl md:text-3xl">🎨</span>
          <h1 class="text-xl md:text-2xl font-bold text-base-content">CSS 渐变生成器</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          可视化生成 CSS 渐变，支持线性、径向、圆锥渐变，一键复制代码
        </p>
      </div>

      <!-- 渐变类型选择 -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-lg mb-6">
        <h2 class="text-lg font-semibold text-base-content mb-4">渐变类型</h2>
        <div class="grid grid-cols-3 gap-3">
          <button
            @click="gradientType = 'linear'"
            class="btn"
            :class="gradientType === 'linear' ? 'btn-primary' : 'btn-outline'"
          >
            线性渐变
          </button>
          <button
            @click="gradientType = 'radial'"
            class="btn"
            :class="gradientType === 'radial' ? 'btn-primary' : 'btn-outline'"
          >
            径向渐变
          </button>
          <button
            @click="gradientType = 'conic'"
            class="btn"
            :class="gradientType === 'conic' ? 'btn-primary' : 'btn-outline'"
          >
            圆锥渐变
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 配置区域 -->
        <div class="space-y-6">
          <!-- 方向/位置 -->
          <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
            <h3 class="font-semibold text-base-content mb-4">
              {{ gradientType === 'linear' ? '方向' : '位置' }}
            </h3>
            
            <div v-if="gradientType === 'linear'" class="form-control">
              <label class="label">
                <span class="label-text">角度: {{ angle }}°</span>
              </label>
              <input
                v-model.number="angle"
                type="range"
                min="0"
                max="360"
                class="range range-primary"
              />
              <div class="flex justify-between text-xs text-base-content/60 mt-1">
                <span>0°</span>
                <span>180°</span>
                <span>360°</span>
              </div>
            </div>

            <div v-else>
              <div class="grid grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">X: {{ positionX }}%</span>
                  </label>
                  <input
                    v-model.number="positionX"
                    type="range"
                    min="0"
                    max="100"
                    class="range range-primary range-sm"
                  />
                </div>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Y: {{ positionY }}%</span>
                  </label>
                  <input
                    v-model.number="positionY"
                    type="range"
                    min="0"
                    max="100"
                    class="range range-primary range-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 颜色停止点 -->
          <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-base-content">颜色停止点</h3>
              <button 
                @click="addColorStop"
                class="btn btn-sm btn-primary"
              >
                + 添加颜色
              </button>
            </div>

            <div class="space-y-3">
              <div
                v-for="(stop, index) in colorStops"
                :key="index"
                class="flex items-center gap-3 p-3 bg-base-200 rounded-lg"
              >
                <input
                  v-model="stop.color"
                  type="color"
                  class="w-12 h-12 rounded cursor-pointer"
                />
                <div class="flex-1">
                  <input
                    v-model="stop.color"
                    type="text"
                    class="input input-bordered input-sm w-full font-mono"
                  />
                </div>
                <div class="w-24">
                  <input
                    v-model.number="stop.position"
                    type="number"
                    min="0"
                    max="100"
                    class="input input-bordered input-sm w-full text-center"
                  />
                </div>
                <span class="text-sm text-base-content/60">%</span>
                <button
                  @click="removeColorStop(index)"
                  class="btn btn-sm btn-ghost btn-circle"
                  :disabled="colorStops.length <= 2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 预设模板 -->
          <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
            <h3 class="font-semibold text-base-content mb-4">预设模板</h3>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="preset in presets"
                :key="preset.name"
                @click="applyPreset(preset)"
                class="btn btn-sm btn-outline text-left justify-start"
              >
                {{ preset.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- 预览和代码 -->
        <div class="space-y-6">
          <!-- 预览 -->
          <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
            <h3 class="font-semibold text-base-content mb-4">预览</h3>
            <div
              class="w-full h-64 rounded-lg border-2 border-base-300"
              :style="{ background: gradientCSS }"
            ></div>
          </div>

          <!-- CSS 代码 -->
          <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-base-content">CSS 代码</h3>
              <button 
                @click="copyCSS"
                class="btn btn-sm btn-primary"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                复制
              </button>
            </div>
            <pre class="p-4 bg-base-200 rounded-lg overflow-x-auto"><code class="text-sm font-mono">background: {{ gradientCSS }};</code></pre>
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

const gradientType = ref<'linear' | 'radial' | 'conic'>('linear')
const angle = ref(90)
const positionX = ref(50)
const positionY = ref(50)

interface ColorStop {
  color: string
  position: number
}

const colorStops = ref<ColorStop[]>([
  { color: '#667eea', position: 0 },
  { color: '#764ba2', position: 100 }
])

const presets = [
  {
    name: '日落',
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#ff6b6b', position: 0 },
      { color: '#feca57', position: 100 }
    ]
  },
  {
    name: '海洋',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#667eea', position: 0 },
      { color: '#764ba2', position: 100 }
    ]
  },
  {
    name: '森林',
    type: 'linear',
    angle: 180,
    stops: [
      { color: '#56ab2f', position: 0 },
      { color: '#a8e063', position: 100 }
    ]
  },
  {
    name: '彩虹',
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#ee0979', position: 0 },
      { color: '#ff6a00', position: 50 },
      { color: '#ffd700', position: 100 }
    ]
  }
]


const gradientCSS = computed(() => {
  const stops = colorStops.value
    .sort((a, b) => a.position - b.position)
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ')

  if (gradientType.value === 'linear') {
    return `linear-gradient(${angle.value}deg, ${stops})`
  } else if (gradientType.value === 'radial') {
    return `radial-gradient(circle at ${positionX.value}% ${positionY.value}%, ${stops})`
  } else {
    return `conic-gradient(from ${angle.value}deg at ${positionX.value}% ${positionY.value}%, ${stops})`
  }
})

const addColorStop = () => {
  const lastPosition = colorStops.value[colorStops.value.length - 1].position
  colorStops.value.push({
    color: '#000000',
    position: Math.min(lastPosition + 10, 100)
  })
}

const removeColorStop = (index: number) => {
  if (colorStops.value.length > 2) {
    colorStops.value.splice(index, 1)
  }
}

const applyPreset = (preset: any) => {
  gradientType.value = preset.type
  angle.value = preset.angle
  colorStops.value = JSON.parse(JSON.stringify(preset.stops))
}

const copyCSS = async () => {
  try {
    await navigator.clipboard.writeText(`background: ${gradientCSS.value};`)
  } catch (error) {
    console.error('复制失败:', error)
  }
}
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
