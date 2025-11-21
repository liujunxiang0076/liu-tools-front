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
          <h1 class="text-xl md:text-2xl font-bold text-base-content">颜色选择器</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          专业的颜色选择和调色板工具，支持多种颜色格式转换
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <!-- 颜色选择区域 -->
        <div class="space-y-4 md:space-y-6">
          <!-- 主功能卡片 -->
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body p-4 md:p-6">
              <h2 class="card-title text-base md:text-lg mb-3 md:mb-4">颜色选择</h2>
              
              <!-- 颜色输入区域 -->
              <div class="space-y-3 md:space-y-4">
                <!-- 颜色选择器和文本输入 -->
                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
                  <!-- 颜色选择器 -->
                  <div class="flex-shrink-0">
                    <label class="label">
                      <span class="label-text font-medium text-sm md:text-base">颜色选择</span>
                    </label>
                    <input 
                      type="color" 
                      v-model="selectedColor"
                      @input="handleColorChange"
                      class="w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 border-base-300 cursor-pointer hover:border-primary transition-colors touch-manipulation"
                    />
                  </div>
                  <!-- HEX文本输入框 -->
                  <div class="flex-1 w-full sm:w-auto">
                    <label class="label">
                      <span class="label-text font-medium text-sm md:text-base">HEX 颜色值</span>
                    </label>
                    <input 
                      type="text" 
                      v-model="hexInput"
                      @input="handleHexInput"
                      @blur="validateHexInput"
                      placeholder="#FF5733"
                      class="input input-bordered w-full font-mono text-sm md:text-base"
                    />
                  </div>
                </div>

                <!-- RGB输入 -->
                <div class="grid grid-cols-3 gap-2 md:gap-3">
                  <div>
                    <label class="label">
                      <span class="label-text font-medium text-xs md:text-sm">红 (R)</span>
                    </label>
                    <input 
                      type="number" 
                      v-model.number="rgbValues.r"
                      @input="handleRgbChange"
                      min="0" 
                      max="255"
                      class="input input-bordered w-full text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label class="label">
                      <span class="label-text font-medium text-xs md:text-sm">绿 (G)</span>
                    </label>
                    <input 
                      type="number" 
                      v-model.number="rgbValues.g"
                      @input="handleRgbChange"
                      min="0" 
                      max="255"
                      class="input input-bordered w-full text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label class="label">
                      <span class="label-text font-medium text-xs md:text-sm">蓝 (B)</span>
                    </label>
                    <input 
                      type="number" 
                      v-model.number="rgbValues.b"
                      @input="handleRgbChange"
                      min="0" 
                      max="255"
                      class="input input-bordered w-full text-sm md:text-base"
                    />
                  </div>
                </div>

                <!-- HSL输入 -->
                <div class="grid grid-cols-3 gap-2 md:gap-3">
                  <div>
                    <label class="label">
                      <span class="label-text font-medium text-xs md:text-sm">色相 (H)</span>
                    </label>
                    <input 
                      type="number" 
                      v-model.number="hslValues.h"
                      @input="handleHslChange"
                      min="0" 
                      max="360"
                      class="input input-bordered w-full text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label class="label">
                      <span class="label-text font-medium text-xs md:text-sm">饱和度 (S%)</span>
                    </label>
                    <input 
                      type="number" 
                      v-model.number="hslValues.s"
                      @input="handleHslChange"
                      min="0" 
                      max="100"
                      class="input input-bordered w-full text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label class="label">
                      <span class="label-text font-medium text-xs md:text-sm">亮度 (L%)</span>
                    </label>
                    <input 
                      type="number" 
                      v-model.number="hslValues.l"
                      @input="handleHslChange"
                      min="0" 
                      max="100"
                      class="input input-bordered w-full text-sm md:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 预设颜色 -->
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body p-4 md:p-6">
              <h3 class="card-title text-base md:text-lg mb-3 md:mb-4">预设颜色</h3>
              <div class="grid grid-cols-6 sm:grid-cols-8 gap-2 md:gap-3">
                <button
                  v-for="color in presetColors"
                  :key="color"
                  @click="selectPresetColor(color)"
                  class="w-10 h-10 md:w-12 md:h-12 rounded-lg border-2 border-base-300 hover:border-primary transition-colors cursor-pointer touch-manipulation"
                  :style="{ backgroundColor: color }"
                  :title="color"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <!-- 预览和结果区域 -->
        <div class="space-y-4 md:space-y-6">
          <!-- 颜色预览区域 -->
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body p-4 md:p-6">
              <h3 class="card-title text-base md:text-lg mb-3 md:mb-4">颜色预览</h3>
              <!-- 预览块 -->
              <div 
                class="w-full h-24 md:h-32 rounded-lg border-2 border-base-300 mb-4"
                :style="{ backgroundColor: selectedColor }"
              ></div>
              
              <!-- 对比示例 -->
              <div class="space-y-2 md:space-y-3">
                <div 
                  class="p-3 md:p-4 rounded-lg text-center font-semibold text-sm md:text-base"
                  :style="{ backgroundColor: selectedColor, color: '#ffffff' }"
                >
                  白色文字示例
                </div>
                <div 
                  class="p-3 md:p-4 rounded-lg text-center font-semibold text-sm md:text-base"
                  :style="{ backgroundColor: selectedColor, color: '#000000' }"
                >
                  黑色文字示例
                </div>
              </div>
            </div>
          </div>

          <!-- 颜色格式显示 -->
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body p-4 md:p-6">
              <h3 class="card-title text-base md:text-lg mb-3 md:mb-4">颜色格式</h3>
              <div class="space-y-2 md:space-y-3">
                <!-- HEX格式 -->
                <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-sm md:text-base">HEX</div>
                    <div class="text-xs md:text-sm text-base-content/70 font-mono truncate">{{ formatHex }}</div>
                  </div>
                  <button 
                    @click="copyToClipboard(formatHex)"
                    class="btn btn-sm btn-ghost touch-manipulation ml-2"
                  >
                    <span class="text-xs md:text-sm">复制</span>
                  </button>
                </div>

                <!-- RGB格式 -->
                <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-sm md:text-base">RGB</div>
                    <div class="text-xs md:text-sm text-base-content/70 font-mono truncate">{{ formatRgb }}</div>
                  </div>
                  <button 
                    @click="copyToClipboard(formatRgb)"
                    class="btn btn-sm btn-ghost touch-manipulation ml-2"
                  >
                    <span class="text-xs md:text-sm">复制</span>
                  </button>
                </div>

                <!-- HSL格式 -->
                <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-sm md:text-base">HSL</div>
                    <div class="text-xs md:text-sm text-base-content/70 font-mono truncate">{{ formatHsl }}</div>
                  </div>
                  <button 
                    @click="copyToClipboard(formatHsl)"
                    class="btn btn-sm btn-ghost touch-manipulation ml-2"
                  >
                    <span class="text-xs md:text-sm">复制</span>
                  </button>
                </div>

                <!-- CSS颜色值 -->
                <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-sm md:text-base">CSS</div>
                    <div class="text-xs md:text-sm text-base-content/70 font-mono truncate">color: {{ selectedColor }};</div>
                  </div>
                  <button 
                    @click="copyToClipboard(`color: ${selectedColor};`)"
                    class="btn btn-sm btn-ghost touch-manipulation ml-2"
                  >
                    <span class="text-xs md:text-sm">复制</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 快速操作 -->
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body p-4 md:p-6">
              <h3 class="card-title text-base md:text-lg mb-3 md:mb-4">快速操作</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                <button 
                  @click="generateRandomColor"
                  class="btn btn-outline touch-manipulation"
                >
                  <span class="text-sm md:text-base">🎲 随机颜色</span>
                </button>
                <button 
                  @click="resetColor"
                  class="btn btn-outline touch-manipulation"
                >
                  <span class="text-sm md:text-base">🔄 重置颜色</span>
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
import { useToolNavigation } from '@/composables/useToolNavigation'

const { goBack } = useToolNavigation()

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
  min-height: 4rem; /* 64px */
  min-width: 4rem; /* 64px */
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 0.75rem;
}

input[type="color"]:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

input[type="color"]:active {
  transform: scale(0.98);
}

/* 移动端颜色选择器优化 */
@media (max-width: 768px) {
  input[type="color"] {
    min-height: 5rem; /* 80px */
    min-width: 5rem; /* 80px */
    border-radius: 1rem;
  }
}

/* 预设颜色按钮优化 */
.preset-color-btn {
  transition: all 0.2s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.preset-color-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.preset-color-btn:active {
  transform: scale(0.95);
}

/* 输入框优化 */
.input,
.select {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* 移动端输入框优化 */
@media (max-width: 768px) {
  .input,
  .select {
    min-height: 2.75rem; /* 44px 最小触摸目标 */
    font-size: 1rem; /* 防止iOS缩放 */
  }
  
  .input[type="number"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: textfield;
  }
  
  .input[type="number"]::-webkit-outer-spin-button,
  .input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

/* 按钮优化 */
.btn {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

/* 移动端按钮优化 */
@media (max-width: 768px) {
  .btn {
    min-height: 2.75rem; /* 44px 最小触摸目标 */
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
  }
  
  .btn-sm {
    min-height: 2.25rem; /* 36px */
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
}

/* 卡片优化 */
.card {
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* 移动端卡片优化 */
@media (max-width: 768px) {
  .card {
    border-radius: 1rem;
  }
  
  .card-body {
    padding: 1rem;
  }
}

/* 颜色预览区域优化 */
.color-preview {
  transition: all 0.3s ease;
  border-radius: 0.75rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 格式显示区域优化 */
.format-display {
  transition: all 0.2s ease;
}

.format-display:hover {
  background-color: hsl(var(--b3) / 0.5);
}

/* 文本截断优化 */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 网格布局优化 */
@media (max-width: 640px) {
  .grid-cols-3 {
    gap: 0.5rem;
  }
  
  .grid-cols-6 {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 480px) {
  .grid-cols-3 {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .grid-cols-6 {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 容器优化 */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* 标签优化 */
.label {
  margin-bottom: 0.25rem;
}

.label-text {
  font-weight: 500;
}

/* 移动端标签优化 */
@media (max-width: 768px) {
  .label {
    margin-bottom: 0.125rem;
  }
  
  .label-text {
    font-size: 0.875rem;
  }
}

/* 间距优化 */
.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.5rem;
}

.space-y-3 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.75rem;
}

.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}

/* 移动端间距优化 */
@media (max-width: 768px) {
  .space-y-4 > :not([hidden]) ~ :not([hidden]) {
    margin-top: 0.75rem;
  }
  
  .space-y-6 > :not([hidden]) ~ :not([hidden]) {
    margin-top: 1rem;
  }
}

/* 滚动条优化 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

/* 深色模式滚动条 */
[data-theme="dark"] ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 防止文本选择 */
.btn,
.preset-color-btn {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* 焦点状态优化 */
input:focus,
select:focus,
button:focus {
  outline: 2px solid hsl(var(--p));
  outline-offset: 2px;
}

/* 移动端焦点状态 */
@media (max-width: 768px) {
  input:focus,
  select:focus,
  button:focus {
    outline-width: 3px;
  }
}
</style> 
