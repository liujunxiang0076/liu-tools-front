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
          <h1 class="text-xl md:text-2xl font-bold text-base-content">CSS 阴影生成器</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          可视化生成 CSS box-shadow，支持多层阴影和内阴影
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 配置区域 -->
        <div class="space-y-6">
          <!-- 阴影类型 -->
          <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
            <h3 class="font-semibold text-base-content mb-4">阴影类型</h3>
            <div class="flex gap-3">
              <label class="label cursor-pointer gap-2">
                <input
                  v-model="inset"
                  type="checkbox"
                  class="checkbox checkbox-primary"
                />
                <span class="label-text">内阴影 (inset)</span>
              </label>
            </div>
          </div>

          <!-- 阴影参数 -->
          <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
            <h3 class="font-semibold text-base-content mb-4">阴影参数</h3>
            
            <div class="space-y-4">
              <!-- 水平偏移 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">水平偏移 (X): {{ offsetX }}px</span>
                </label>
                <input
                  v-model.number="offsetX"
                  type="range"
                  min="-50"
                  max="50"
                  class="range range-primary range-sm"
                />
              </div>

              <!-- 垂直偏移 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">垂直偏移 (Y): {{ offsetY }}px</span>
                </label>
                <input
                  v-model.number="offsetY"
                  type="range"
                  min="-50"
                  max="50"
                  class="range range-primary range-sm"
                />
              </div>

              <!-- 模糊半径 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">模糊半径: {{ blur }}px</span>
                </label>
                <input
                  v-model.number="blur"
                  type="range"
                  min="0"
                  max="100"
                  class="range range-primary range-sm"
                />
              </div>

              <!-- 扩展半径 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">扩展半径: {{ spread }}px</span>
                </label>
                <input
                  v-model.number="spread"
                  type="range"
                  min="-50"
                  max="50"
                  class="range range-primary range-sm"
                />
              </div>

              <!-- 颜色 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">阴影颜色</span>
                </label>
                <div class="flex gap-3">
                  <input
                    v-model="color"
                    type="color"
                    class="w-16 h-12 rounded cursor-pointer"
                  />
                  <input
                    v-model="color"
                    type="text"
                    class="input input-bordered flex-1 font-mono"
                  />
                </div>
              </div>

              <!-- 透明度 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">透明度: {{ opacity }}%</span>
                </label>
                <input
                  v-model.number="opacity"
                  type="range"
                  min="0"
                  max="100"
                  class="range range-primary range-sm"
                />
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
            <div class="flex items-center justify-center p-12 bg-base-200 rounded-lg">
              <div
                class="w-48 h-48 bg-base-100 rounded-lg flex items-center justify-center"
                :style="{ boxShadow: shadowCSS }"
              >
                <span class="text-base-content/50">预览区域</span>
              </div>
            </div>
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
            <pre class="p-4 bg-base-200 rounded-lg overflow-x-auto"><code class="text-sm font-mono">box-shadow: {{ shadowCSS }};</code></pre>
          </div>

          <!-- 多层阴影说明 -->
          <div class="bg-info/10 rounded-2xl p-4">
            <p class="text-sm text-base-content/70">
              💡 提示：可以通过逗号分隔添加多层阴影效果
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const inset = ref(false)
const offsetX = ref(0)
const offsetY = ref(8)
const blur = ref(15)
const spread = ref(0)
const color = ref('#000000')
const opacity = ref(20)

const presets = [
  {
    name: '轻微阴影',
    inset: false,
    offsetX: 0,
    offsetY: 2,
    blur: 4,
    spread: 0,
    color: '#000000',
    opacity: 10
  },
  {
    name: '中等阴影',
    inset: false,
    offsetX: 0,
    offsetY: 4,
    blur: 8,
    spread: 0,
    color: '#000000',
    opacity: 15
  },
  {
    name: '深度阴影',
    inset: false,
    offsetX: 0,
    offsetY: 10,
    blur: 25,
    spread: 0,
    color: '#000000',
    opacity: 25
  },
  {
    name: '内阴影',
    inset: true,
    offsetX: 0,
    offsetY: 2,
    blur: 4,
    spread: 0,
    color: '#000000',
    opacity: 15
  },
  {
    name: '浮起效果',
    inset: false,
    offsetX: 0,
    offsetY: 20,
    blur: 40,
    spread: -10,
    color: '#000000',
    opacity: 30
  },
  {
    name: '扁平阴影',
    inset: false,
    offsetX: 10,
    offsetY: 10,
    blur: 0,
    spread: 0,
    color: '#000000',
    opacity: 20
  }
]

const goBack = () => {
  router.push('/')
}

const shadowCSS = computed(() => {
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`
  }

  const parts = []
  
  if (inset.value) {
    parts.push('inset')
  }
  
  parts.push(`${offsetX.value}px`)
  parts.push(`${offsetY.value}px`)
  parts.push(`${blur.value}px`)
  parts.push(`${spread.value}px`)
  parts.push(hexToRgba(color.value, opacity.value))
  
  return parts.join(' ')
})

const applyPreset = (preset: any) => {
  inset.value = preset.inset
  offsetX.value = preset.offsetX
  offsetY.value = preset.offsetY
  blur.value = preset.blur
  spread.value = preset.spread
  color.value = preset.color
  opacity.value = preset.opacity
}

const copyCSS = async () => {
  try {
    await navigator.clipboard.writeText(`box-shadow: ${shadowCSS.value};`)
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
