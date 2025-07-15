<template>
  <div class="min-h-screen bg-base-200 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- 页面标题 -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <button 
            @click="goBack"
            class="btn btn-ghost btn-circle"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span class="text-3xl">🎨</span>
          <h1 class="text-2xl font-bold text-base-content">颜色选择器</h1>
        </div>
        <p class="text-base-content/70">
          专业的颜色选择和调色板工具，支持多种颜色格式转换
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 颜色选择区域 -->
        <div class="space-y-6">
          <!-- 主功能卡片 -->
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h2 class="card-title text-lg mb-4">颜色选择</h2>
              
              <!-- 颜色输入区域 -->
              <div class="space-y-4">
                <!-- 颜色选择器和文本输入 -->
                <div class="flex items-center gap-4">
                  <!-- 64x64像素颜色选择器 -->
                  <input 
                    type="color" 
                    v-model="selectedColor"
                    @input="handleColorChange"
                    class="w-16 h-16 rounded-lg border-2 border-base-300 cursor-pointer hover:border-primary transition-colors"
                  />
                  <!-- HEX文本输入框 -->
                  <div class="flex-1">
                    <label class="label">
                      <span class="label-text font-medium">HEX 颜色值</span>
                    </label>
                    <input 
                      type="text" 
                      v-model="hexInput"
                      @input="handleHexInput"
                      @blur="validateHexInput"
                      placeholder="#FF5733"
                      class="input input-bordered w-full font-mono"
                    />
                  </div>
                </div>

                <!-- RGB输入 -->
                <div class="grid grid-cols-3 gap-3">
                  <div>
                    <label class="label">
                      <span class="label-text font-medium">红 (R)</span>
                    </label>
                    <input 
                      type="number" 
                      v-model.number="rgbValues.r"
                      @input="handleRgbChange"
                      min="0" 
                      max="255"
                      class="input input-bordered w-full"
                    />
                  </div>
                  <div>
                    <label class="label">
                      <span class="label-text font-medium">绿 (G)</span>
                    </label>
                    <input 
                      type="number" 
                      v-model.number="rgbValues.g"
                      @input="handleRgbChange"
                      min="0" 
                      max="255"
                      class="input input-bordered w-full"
                    />
                  </div>
                  <div>
                    <label class="label">
                      <span class="label-text font-medium">蓝 (B)</span>
                    </label>
                    <input 
                      type="number" 
                      v-model.number="rgbValues.b"
                      @input="handleRgbChange"
                      min="0" 
                      max="255"
                      class="input input-bordered w-full"
                    />
                  </div>
                </div>

                <!-- HSL输入 -->
                <div class="grid grid-cols-3 gap-3">
                  <div>
                    <label class="label">
                      <span class="label-text font-medium">色相 (H)</span>
                    </label>
                    <input 
                      type="number" 
                      v-model.number="hslValues.h"
                      @input="handleHslChange"
                      min="0" 
                      max="360"
                      class="input input-bordered w-full"
                    />
                  </div>
                  <div>
                    <label class="label">
                      <span class="label-text font-medium">饱和度 (S%)</span>
                    </label>
                    <input 
                      type="number" 
                      v-model.number="hslValues.s"
                      @input="handleHslChange"
                      min="0" 
                      max="100"
                      class="input input-bordered w-full"
                    />
                  </div>
                  <div>
                    <label class="label">
                      <span class="label-text font-medium">亮度 (L%)</span>
                    </label>
                    <input 
                      type="number" 
                      v-model.number="hslValues.l"
                      @input="handleHslChange"
                      min="0" 
                      max="100"
                      class="input input-bordered w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 预设颜色 -->
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h3 class="card-title text-lg mb-4">预设颜色</h3>
              <div class="grid grid-cols-8 gap-2">
                <button
                  v-for="color in presetColors"
                  :key="color"
                  @click="selectPresetColor(color)"
                  class="w-10 h-10 rounded-lg border-2 border-base-300 hover:border-primary transition-colors cursor-pointer"
                  :style="{ backgroundColor: color }"
                  :title="color"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <!-- 预览和结果区域 -->
        <div class="space-y-6">
          <!-- 颜色预览区域 -->
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h3 class="card-title text-lg mb-4">颜色预览</h3>
              <!-- 128像素高度预览块 -->
              <div 
                class="w-full h-32 rounded-lg border-2 border-base-300 mb-4"
                :style="{ backgroundColor: selectedColor }"
              ></div>
              
              <!-- 对比示例 -->
              <div class="space-y-3">
                <div 
                  class="p-4 rounded-lg text-center font-semibold"
                  :style="{ backgroundColor: selectedColor, color: '#ffffff' }"
                >
                  白色文字示例
                </div>
                <div 
                  class="p-4 rounded-lg text-center font-semibold"
                  :style="{ backgroundColor: selectedColor, color: '#000000' }"
                >
                  黑色文字示例
                </div>
              </div>
            </div>
          </div>

          <!-- 颜色格式显示 -->
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h3 class="card-title text-lg mb-4">颜色格式</h3>
              <div class="space-y-3">
                <!-- HEX格式 -->
                <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div>
                    <div class="font-medium">HEX</div>
                    <div class="text-sm text-base-content/70 font-mono">{{ formatHex }}</div>
                  </div>
                  <button 
                    @click="copyToClipboard(formatHex)"
                    class="btn btn-sm btn-ghost"
                  >
                    复制
                  </button>
                </div>

                <!-- RGB格式 -->
                <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div>
                    <div class="font-medium">RGB</div>
                    <div class="text-sm text-base-content/70 font-mono">{{ formatRgb }}</div>
                  </div>
                  <button 
                    @click="copyToClipboard(formatRgb)"
                    class="btn btn-sm btn-ghost"
                  >
                    复制
                  </button>
                </div>

                <!-- HSL格式 -->
                <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div>
                    <div class="font-medium">HSL</div>
                    <div class="text-sm text-base-content/70 font-mono">{{ formatHsl }}</div>
                  </div>
                  <button 
                    @click="copyToClipboard(formatHsl)"
                    class="btn btn-sm btn-ghost"
                  >
                    复制
                  </button>
                </div>

                <!-- CSS颜色值 -->
                <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div>
                    <div class="font-medium">CSS</div>
                    <div class="text-sm text-base-content/70 font-mono">color: {{ selectedColor }};</div>
                  </div>
                  <button 
                    @click="copyToClipboard(`color: ${selectedColor};`)"
                    class="btn btn-sm btn-ghost"
                  >
                    复制
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 快速操作 -->
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h3 class="card-title text-lg mb-4">快速操作</h3>
              <div class="grid grid-cols-2 gap-3">
                <button 
                  @click="generateRandomColor"
                  class="btn btn-outline"
                >
                  随机颜色
                </button>
                <button 
                  @click="resetColor"
                  class="btn btn-outline"
                >
                  重置颜色
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, getCurrentInstance } from 'vue'

// 响应式状态
const selectedColor = ref('#FF5733')
const hexInput = ref('#FF5733')
const rgbValues = ref({ r: 255, g: 87, b: 51 })
const hslValues = ref({ h: 9, s: 100, l: 60 })

// 预设颜色
const presetColors = [
  '#FF5733', '#33FF57', '#3357FF', '#FF33F1',
  '#33FFF1', '#F1FF33', '#FF8C33', '#8C33FF',
  '#FF3333', '#33FF33', '#3333FF', '#FFFF33',
  '#FF33FF', '#33FFFF', '#000000', '#FFFFFF',
  '#808080', '#C0C0C0', '#800000', '#008000',
  '#000080', '#808000', '#800080', '#008080'
]

// 计算属性
const formatHex = computed(() => selectedColor.value.toUpperCase())
const formatRgb = computed(() => `rgb(${rgbValues.value.r}, ${rgbValues.value.g}, ${rgbValues.value.b})`)
const formatHsl = computed(() => `hsl(${hslValues.value.h}, ${hslValues.value.s}%, ${hslValues.value.l}%)`)

// 颜色转换函数
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

const hslToRgb = (h: number, s: number, l: number) => {
  h /= 360
  s /= 100
  l /= 100

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

// 事件处理函数
const handleColorChange = () => {
  hexInput.value = selectedColor.value
  updateFromHex(selectedColor.value)
}

const handleHexInput = () => {
  const hex = hexInput.value
  if (isValidHex(hex)) {
    selectedColor.value = hex
    updateFromHex(hex)
  }
}

const validateHexInput = () => {
  if (!isValidHex(hexInput.value)) {
    hexInput.value = selectedColor.value
  }
}

const handleRgbChange = () => {
  const hex = rgbToHex(rgbValues.value.r, rgbValues.value.g, rgbValues.value.b)
  selectedColor.value = hex
  hexInput.value = hex
  hslValues.value = rgbToHsl(rgbValues.value.r, rgbValues.value.g, rgbValues.value.b)
}

const handleHslChange = () => {
  const rgb = hslToRgb(hslValues.value.h, hslValues.value.s, hslValues.value.l)
  rgbValues.value = rgb
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
  selectedColor.value = hex
  hexInput.value = hex
}

const updateFromHex = (hex: string) => {
  const rgb = hexToRgb(hex)
  rgbValues.value = rgb
  hslValues.value = rgbToHsl(rgb.r, rgb.g, rgb.b)
}

const isValidHex = (hex: string) => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
}

const selectPresetColor = (color: string) => {
  selectedColor.value = color
  hexInput.value = color
  updateFromHex(color)
}

const generateRandomColor = () => {
  const color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
  selectPresetColor(color)
}

const resetColor = () => {
  selectPresetColor('#FF5733')
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // 这里可以添加成功提示
    console.log('已复制到剪贴板:', text)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const goBack = () => {
  // 尝试调用父组件的方法
  try {
    const parent = getCurrentInstance()?.parent
    if (parent && parent.exposed && parent.exposed.goBackToMain) {
      parent.exposed.goBackToMain()
    } else {
      // 兜底方案：刷新页面回到主页
      window.location.reload()
    }
  } catch (error) {
    console.error('返回主页失败:', error)
    window.location.reload()
  }
}

// 初始化
updateFromHex(selectedColor.value)
</script>

<script lang="ts">
export default {
  name: 'ColorPicker'
}
</script>

<style scoped>
/* 颜色选择器样式优化 */
input[type="color"] {
  appearance: none;
  -webkit-appearance: none;
  border: none;
  cursor: pointer;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 0.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .grid-cols-3 {
    grid-template-columns: 1fr;
  }
  
  .grid-cols-8 {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style> 
