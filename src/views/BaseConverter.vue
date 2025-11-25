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
          <span class="text-2xl md:text-3xl">🔢</span>
          <h1 class="text-xl md:text-2xl font-bold text-base-content">进制转换器</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          数字进制转换工具，支持二进制、八进制、十进制、十六进制互转
        </p>
      </div>

      <!-- 输入区域 -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-lg mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-base-content">输入数值</h2>
          <button 
            @click="clearAll"
            class="btn btn-sm btn-ghost"
          >
            清空
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 二进制 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">二进制 (Binary)</span>
              <span class="label-text-alt text-base-content/60">0-1</span>
            </label>
            <input
              v-model="binary"
              @input="handleBinaryInput"
              type="text"
              placeholder="例如: 1010"
              class="input input-bordered font-mono"
              :class="{ 'input-error': errors.binary }"
            />
            <label v-if="errors.binary" class="label">
              <span class="label-text-alt text-error">{{ errors.binary }}</span>
            </label>
          </div>

          <!-- 八进制 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">八进制 (Octal)</span>
              <span class="label-text-alt text-base-content/60">0-7</span>
            </label>
            <input
              v-model="octal"
              @input="handleOctalInput"
              type="text"
              placeholder="例如: 12"
              class="input input-bordered font-mono"
              :class="{ 'input-error': errors.octal }"
            />
            <label v-if="errors.octal" class="label">
              <span class="label-text-alt text-error">{{ errors.octal }}</span>
            </label>
          </div>

          <!-- 十进制 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">十进制 (Decimal)</span>
              <span class="label-text-alt text-base-content/60">0-9</span>
            </label>
            <input
              v-model="decimal"
              @input="handleDecimalInput"
              type="text"
              placeholder="例如: 10"
              class="input input-bordered font-mono"
              :class="{ 'input-error': errors.decimal }"
            />
            <label v-if="errors.decimal" class="label">
              <span class="label-text-alt text-error">{{ errors.decimal }}</span>
            </label>
          </div>

          <!-- 十六进制 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">十六进制 (Hexadecimal)</span>
              <span class="label-text-alt text-base-content/60">0-9, A-F</span>
            </label>
            <input
              v-model="hexadecimal"
              @input="handleHexInput"
              type="text"
              placeholder="例如: A"
              class="input input-bordered font-mono"
              :class="{ 'input-error': errors.hexadecimal }"
            />
            <label v-if="errors.hexadecimal" class="label">
              <span class="label-text-alt text-error">{{ errors.hexadecimal }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 快速示例 -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-semibold text-base-content mb-4">快速示例</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            @click="loadExample(10)"
            class="btn btn-outline btn-sm"
          >
            10
          </button>
          <button 
            @click="loadExample(255)"
            class="btn btn-outline btn-sm"
          >
            255
          </button>
          <button 
            @click="loadExample(1024)"
            class="btn btn-outline btn-sm"
          >
            1024
          </button>
          <button 
            @click="loadExample(65535)"
            class="btn btn-outline btn-sm"
          >
            65535
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToolNavigation } from '@/composables/useToolNavigation'

const { goBack } = useToolNavigation()

const binary = ref('')
const octal = ref('')
const decimal = ref('')
const hexadecimal = ref('')

const errors = ref({
  binary: '',
  octal: '',
  decimal: '',
  hexadecimal: ''
})


const clearAll = () => {
  binary.value = ''
  octal.value = ''
  decimal.value = ''
  hexadecimal.value = ''
  errors.value = {
    binary: '',
    octal: '',
    decimal: '',
    hexadecimal: ''
  }
}

const handleBinaryInput = () => {
  errors.value.binary = ''
  
  if (!binary.value.trim()) {
    octal.value = ''
    decimal.value = ''
    hexadecimal.value = ''
    return
  }

  if (!/^[01]+$/.test(binary.value)) {
    errors.value.binary = '只能输入0和1'
    return
  }

  try {
    const dec = parseInt(binary.value, 2)
    decimal.value = dec.toString()
    octal.value = dec.toString(8)
    hexadecimal.value = dec.toString(16).toUpperCase()
  } catch (error) {
    errors.value.binary = '转换失败'
  }
}

const handleOctalInput = () => {
  errors.value.octal = ''
  
  if (!octal.value.trim()) {
    binary.value = ''
    decimal.value = ''
    hexadecimal.value = ''
    return
  }

  if (!/^[0-7]+$/.test(octal.value)) {
    errors.value.octal = '只能输入0-7'
    return
  }

  try {
    const dec = parseInt(octal.value, 8)
    decimal.value = dec.toString()
    binary.value = dec.toString(2)
    hexadecimal.value = dec.toString(16).toUpperCase()
  } catch (error) {
    errors.value.octal = '转换失败'
  }
}

const handleDecimalInput = () => {
  errors.value.decimal = ''
  
  if (!decimal.value.trim()) {
    binary.value = ''
    octal.value = ''
    hexadecimal.value = ''
    return
  }

  if (!/^\d+$/.test(decimal.value)) {
    errors.value.decimal = '只能输入数字'
    return
  }

  try {
    const dec = parseInt(decimal.value, 10)
    binary.value = dec.toString(2)
    octal.value = dec.toString(8)
    hexadecimal.value = dec.toString(16).toUpperCase()
  } catch (error) {
    errors.value.decimal = '转换失败'
  }
}

const handleHexInput = () => {
  errors.value.hexadecimal = ''
  
  if (!hexadecimal.value.trim()) {
    binary.value = ''
    octal.value = ''
    decimal.value = ''
    return
  }

  if (!/^[0-9A-Fa-f]+$/.test(hexadecimal.value)) {
    errors.value.hexadecimal = '只能输入0-9和A-F'
    return
  }

  try {
    const dec = parseInt(hexadecimal.value, 16)
    decimal.value = dec.toString()
    binary.value = dec.toString(2)
    octal.value = dec.toString(8)
  } catch (error) {
    errors.value.hexadecimal = '转换失败'
  }
}

const loadExample = (num: number) => {
  decimal.value = num.toString()
  handleDecimalInput()
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
</style>
