<template>
  <div class="min-h-screen bg-base-200 py-4 md:py-8">
    <div class="container mx-auto px-4 max-w-7xl">
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
          <span class="text-2xl md:text-3xl">❄️</span>
          <h1 class="text-xl md:text-2xl font-bold text-base-content">雪花ID生成器</h1>
        </div>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between px-4 md:px-0">
          <p class="text-sm md:text-base text-base-content/70 mb-3 md:mb-0">
            生成全局唯一的雪花ID，支持批量生成和自定义配置，便于复制到数据库表中
          </p>
          
          <!-- 模式切换器 -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-base-content/60">模式:</span>
            <div class="join">
              <button 
                @click="switchMode('generator')"
                class="btn btn-sm join-item"
                :class="{ 'btn-primary': currentMode === 'generator', 'btn-outline': currentMode !== 'generator' }"
              >
                生成
              </button>
              <button 
                @click="switchMode('parser')"
                class="btn btn-sm join-item"
                :class="{ 'btn-primary': currentMode === 'parser', 'btn-outline': currentMode !== 'parser' }"
              >
                解析
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 生成模式 -->
      <div v-if="currentMode === 'generator'" class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <!-- 配置区域 -->
        <div class="bg-base-100 rounded-2xl p-4 md:p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">生成配置</h2>
            <button 
              @click="resetConfig"
              class="btn btn-sm btn-ghost"
            >
              重置
            </button>
          </div>
          
          <div class="space-y-4">
            <!-- 数据中心ID -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">数据中心ID (0-31)</span>
                <span class="label-text-alt text-base-content/60">{{ dataCenterId }}</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="31" 
                v-model.number="dataCenterId"
                class="range range-primary"
              />
              <div class="w-full flex justify-between text-xs px-2 text-base-content/60">
                <span>0</span>
                <span>15</span>
                <span>31</span>
              </div>
            </div>

            <!-- 机器ID -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">机器ID (0-31)</span>
                <span class="label-text-alt text-base-content/60">{{ machineId }}</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="31" 
                v-model.number="machineId"
                class="range range-secondary"
              />
              <div class="w-full flex justify-between text-xs px-2 text-base-content/60">
                <span>0</span>
                <span>15</span>
                <span>31</span>
              </div>
            </div>

            <!-- 生成数量 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">生成数量</span>
              </label>
              <select v-model="generateCount" class="select select-bordered">
                <option value="1">1个</option>
                <option value="10">10个</option>
                <option value="50">50个</option>
                <option value="100">100个</option>
                <option value="500">500个</option>
                <option value="1000">1000个</option>
              </select>
            </div>

            <!-- 输出格式 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">输出格式</span>
              </label>
              <div class="flex flex-wrap gap-2">
                <label class="label cursor-pointer">
                  <input 
                    type="radio" 
                    name="format" 
                    value="string"
                    v-model="outputFormat"
                    class="radio radio-primary radio-sm"
                  />
                  <span class="label-text ml-2">字符串</span>
                </label>
                <label class="label cursor-pointer">
                  <input 
                    type="radio" 
                    name="format" 
                    value="array"
                    v-model="outputFormat"
                    class="radio radio-primary radio-sm"
                  />
                  <span class="label-text ml-2">数组</span>
                </label>
                <label class="label cursor-pointer">
                  <input 
                    type="radio" 
                    name="format" 
                    value="sql"
                    v-model="outputFormat"
                    class="radio radio-primary radio-sm"
                  />
                  <span class="label-text ml-2">SQL</span>
                </label>
              </div>
            </div>

            <!-- 生成按钮 -->
            <button 
              @click="generateSnowflakeIds"
              class="btn btn-primary w-full touch-manipulation"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              生成雪花ID
            </button>
          </div>
        </div>

        <!-- 结果区域 -->
        <div class="bg-base-100 rounded-2xl p-4 md:p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">生成结果</h2>
            <div class="flex gap-2">
              <button 
                @click="copyResult"
                class="btn btn-sm btn-primary"
                :disabled="!generatedIds.length"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                复制
              </button>
              <button 
                @click="downloadResult"
                class="btn btn-sm btn-outline"
                :disabled="!generatedIds.length"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                下载
              </button>
            </div>
          </div>
          
          <div class="bg-base-200 rounded-lg h-[38rem] overflow-auto">
            <div v-if="!generatedIds.length" class="text-base-content/40 italic p-4">
              生成的雪花ID将在此显示...
            </div>
            <div v-else class="p-4">
              <pre class="font-mono text-sm text-base-content">{{ formattedResult }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- 解析模式 -->
      <div v-else-if="currentMode === 'parser'" class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <!-- 输入区域 -->
        <div class="bg-base-100 rounded-2xl p-4 md:p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">雪花ID输入</h2>
            <div class="flex gap-2">
              <button 
                @click="clearInput"
                class="btn btn-sm btn-ghost"
                :disabled="!inputSnowflakeId"
              >
                清空
              </button>
              <button 
                @click="loadExample"
                class="btn btn-sm btn-outline"
              >
                示例
              </button>
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">雪花ID</span>
              </label>
              <input
                type="text"
                v-model="inputSnowflakeId"
                @input="parseSnowflakeId"
                placeholder="请输入雪花ID，例如：1234567890123456789"
                class="input input-bordered w-full font-mono"
                :class="{ 'input-error': parseError }"
              />
              <label v-if="parseError" class="label">
                <span class="label-text-alt text-error">{{ parseError }}</span>
              </label>
            </div>

            <button 
              @click="parseSnowflakeId"
              class="btn btn-primary w-full"
              :disabled="!inputSnowflakeId"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              解析雪花ID
            </button>
          </div>
        </div>

        <!-- 解析结果 -->
        <div class="bg-base-100 rounded-2xl p-4 md:p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">解析结果</h2>
            <button 
              @click="copyParseResult"
              class="btn btn-sm btn-primary"
              :disabled="!parsedResult"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              复制
            </button>
          </div>
          
          <div class="bg-base-200 rounded-lg p-4 space-y-4">
            <div v-if="!parsedResult" class="text-base-content/40 italic">
              解析结果将在此显示...
            </div>
            <div v-else class="space-y-3">
              <div class="flex justify-between items-center p-3 bg-base-100 rounded-lg">
                <span class="text-sm font-medium text-base-content/70">原始ID</span>
                <span class="font-mono text-base-content">{{ parsedResult.originalId }}</span>
              </div>
              
              <div class="flex justify-between items-center p-3 bg-base-100 rounded-lg">
                <span class="text-sm font-medium text-base-content/70">生成时间</span>
                <span class="font-mono text-base-content">{{ parsedResult.timestamp }}</span>
              </div>
              
              <div class="flex justify-between items-center p-3 bg-base-100 rounded-lg">
                <span class="text-sm font-medium text-base-content/70">数据中心ID</span>
                <span class="font-mono text-base-content">{{ parsedResult.dataCenterId }}</span>
              </div>
              
              <div class="flex justify-between items-center p-3 bg-base-100 rounded-lg">
                <span class="text-sm font-medium text-base-content/70">机器ID</span>
                <span class="font-mono text-base-content">{{ parsedResult.machineId }}</span>
              </div>
              
              <div class="flex justify-between items-center p-3 bg-base-100 rounded-lg">
                <span class="text-sm font-medium text-base-content/70">序列号</span>
                <span class="font-mono text-base-content">{{ parsedResult.sequence }}</span>
              </div>
              
              <div class="flex justify-between items-center p-3 bg-base-100 rounded-lg">
                <span class="text-sm font-medium text-base-content/70">二进制表示</span>
                <span class="font-mono text-xs text-base-content break-all">{{ parsedResult.binary }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计信息和说明 -->
      <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 算法说明 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h3 class="text-lg font-semibold text-base-content mb-4">雪花ID算法说明</h3>
          <div class="space-y-3 text-sm text-base-content/70">
            <div class="flex items-start gap-2">
              <span class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <div>
                <strong>64位结构：</strong>1位符号位 + 41位时间戳 + 5位数据中心ID + 5位机器ID + 12位序列号
              </div>
            </div>
            <div class="flex items-start gap-2">
              <span class="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
              <div>
                <strong>全局唯一：</strong>在分布式系统中保证ID的全局唯一性
              </div>
            </div>
            <div class="flex items-start gap-2">
              <span class="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
              <div>
                <strong>时间有序：</strong>ID按生成时间递增，便于数据库索引
              </div>
            </div>
            <div class="flex items-start gap-2">
              <span class="w-2 h-2 bg-info rounded-full mt-2 flex-shrink-0"></span>
              <div>
                <strong>高性能：</strong>每毫秒最多可生成4096个ID
              </div>
            </div>
          </div>
        </div>

        <!-- 使用统计 -->
        <div v-if="generateStats" class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h3 class="text-lg font-semibold text-base-content mb-4">生成统计</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-primary">{{ generateStats.totalGenerated }}</div>
              <div class="text-sm text-base-content/60">总生成数</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-secondary">{{ generateStats.avgPerSecond }}</div>
              <div class="text-sm text-base-content/60">平均每秒</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-accent">{{ generateStats.currentDataCenter }}</div>
              <div class="text-sm text-base-content/60">数据中心</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-info">{{ generateStats.currentMachine }}</div>
              <div class="text-sm text-base-content/60">机器ID</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToolNavigation } from '@/composables/useToolNavigation'

const { goBack } = useToolNavigation()

// 响应式数据
const currentMode = ref<'generator' | 'parser'>('generator')
const dataCenterId = ref(1)
const machineId = ref(1)
const generateCount = ref(10)
const outputFormat = ref<'string' | 'array' | 'sql'>('string')
const generatedIds = ref<string[]>([])
const inputSnowflakeId = ref('')
const parseError = ref('')
const parsedResult = ref<any>(null)

// 雪花ID算法相关常量
const EPOCH = 1420070400000 // 2015-01-01 00:00:00 UTC
const DATACENTER_ID_BITS = 5
const MACHINE_ID_BITS = 5
const SEQUENCE_BITS = 12
const MAX_DATACENTER_ID = (1 << DATACENTER_ID_BITS) - 1
const MAX_MACHINE_ID = (1 << MACHINE_ID_BITS) - 1
const MAX_SEQUENCE = (1 << SEQUENCE_BITS) - 1

// 序列号和上次时间戳
let sequence = 0
let lastTimestamp = -1

// 统计信息
const generateStats = ref<any>(null)

// 模式切换
const switchMode = (mode: 'generator' | 'parser') => {
  currentMode.value = mode
  if (mode === 'parser') {
    parsedResult.value = null
    parseError.value = ''
  }
}

// 重置配置
const resetConfig = () => {
  dataCenterId.value = 1
  machineId.value = 1
  generateCount.value = 10
  outputFormat.value = 'string'
  generatedIds.value = []
}

// 生成雪花ID
const generateSnowflakeId = (): string => {
  let timestamp = Date.now()
  
  if (timestamp < lastTimestamp) {
    throw new Error('时钟回拨，拒绝生成ID')
  }
  
  if (timestamp === lastTimestamp) {
    sequence = (sequence + 1) & MAX_SEQUENCE
    if (sequence === 0) {
      // 序列号溢出，等待下一毫秒
      timestamp = waitNextMillis(lastTimestamp)
    }
  } else {
    sequence = 0
  }
  
  lastTimestamp = timestamp
  
  // 组装64位ID
  const id = ((timestamp - EPOCH) << (DATACENTER_ID_BITS + MACHINE_ID_BITS + SEQUENCE_BITS)) |
            (dataCenterId.value << (MACHINE_ID_BITS + SEQUENCE_BITS)) |
            (machineId.value << SEQUENCE_BITS) |
            sequence
  
  return id.toString()
}

// 等待下一毫秒
const waitNextMillis = (lastTimestamp: number): number => {
  let timestamp = Date.now()
  while (timestamp <= lastTimestamp) {
    timestamp = Date.now()
  }
  return timestamp
}

// 批量生成雪花ID
const generateSnowflakeIds = () => {
  try {
    const ids: string[] = []
    const startTime = Date.now()
    
    for (let i = 0; i < generateCount.value; i++) {
      ids.push(generateSnowflakeId())
    }
    
    generatedIds.value = ids
    
    // 更新统计信息
    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000
    generateStats.value = {
      totalGenerated: ids.length,
      avgPerSecond: Math.round(ids.length / Math.max(duration, 0.001)),
      currentDataCenter: dataCenterId.value,
      currentMachine: machineId.value
    }
  } catch (error) {
    console.error('生成雪花ID失败:', error)
    alert('生成雪花ID失败: ' + (error instanceof Error ? error.message : '未知错误'))
  }
}

// 格式化结果
const formattedResult = computed(() => {
  if (!generatedIds.value.length) return ''
  
  switch (outputFormat.value) {
    case 'array':
      return JSON.stringify(generatedIds.value, null, 2)
    case 'sql':
      const values = generatedIds.value.map(id => `(${id})`).join(',\n')
      return `INSERT INTO your_table (id) VALUES\n${values};`
    default:
      return generatedIds.value.join('\n')
  }
})

// 解析雪花ID
const parseSnowflakeId = () => {
  if (!inputSnowflakeId.value.trim()) {
    parsedResult.value = null
    parseError.value = ''
    return
  }
  
  try {
    const id = BigInt(inputSnowflakeId.value.trim())
    
    // 验证ID范围
    if (id < 0 || id > (BigInt(1) << BigInt(63)) - BigInt(1)) {
      throw new Error('ID超出有效范围')
    }
    
    // 解析各部分
    const timestamp = Number((id >> BigInt(DATACENTER_ID_BITS + MACHINE_ID_BITS + SEQUENCE_BITS)) + BigInt(EPOCH))
    const dataCenter = Number((id >> BigInt(MACHINE_ID_BITS + SEQUENCE_BITS)) & BigInt(MAX_DATACENTER_ID))
    const machine = Number((id >> BigInt(SEQUENCE_BITS)) & BigInt(MAX_MACHINE_ID))
    const seq = Number(id & BigInt(MAX_SEQUENCE))
    
    parsedResult.value = {
      originalId: inputSnowflakeId.value,
      timestamp: new Date(timestamp).toLocaleString('zh-CN'),
      dataCenterId: dataCenter,
      machineId: machine,
      sequence: seq,
      binary: id.toString(2).padStart(64, '0')
    }
    
    parseError.value = ''
  } catch (error) {
    parseError.value = '无效的雪花ID格式'
    parsedResult.value = null
  }
}

// 复制结果
const copyResult = async () => {
  if (!generatedIds.value.length) return
  
  try {
    await navigator.clipboard.writeText(formattedResult.value)
    // 这里可以添加成功提示
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 复制解析结果
const copyParseResult = async () => {
  if (!parsedResult.value) return
  
  try {
    const result = JSON.stringify(parsedResult.value, null, 2)
    await navigator.clipboard.writeText(result)
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 下载结果
const downloadResult = () => {
  if (!generatedIds.value.length) return
  
  const content = formattedResult.value
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `snowflake-ids-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 清空输入
const clearInput = () => {
  inputSnowflakeId.value = ''
  parsedResult.value = null
  parseError.value = ''
}

// 加载示例
const loadExample = () => {
  inputSnowflakeId.value = generateSnowflakeId()
  parseSnowflakeId()
}

// 组件挂载时初始化
onMounted(() => {
  // 设置默认统计信息
  generateStats.value = {
    totalGenerated: 0,
    avgPerSecond: 0,
    currentDataCenter: dataCenterId.value,
    currentMachine: machineId.value
  }
})
</script>

<style scoped>
/* 响应式调整 */
@media (max-width: 768px) {
  .textarea, .input {
    font-size: 16px; /* 防止iOS缩放 */
    line-height: 1.6;
    padding: 1rem !important;
  }
  
  .btn {
    min-height: 2.75rem; /* 44px 最小触摸目标 */
    height: 2.75rem;
    min-width: 2.75rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    font-size: 0.875rem;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
  
  .btn-sm {
    min-height: 2.25rem; /* 36px */
    height: 2.25rem;
    min-width: 2.25rem;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 0.8125rem;
    touch-action: manipulation;
  }
  
  .bg-base-100 {
    padding: 1rem !important;
    margin-bottom: 1rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
  
  .text-2xl {
    font-size: 1.25rem;
  }
  
  .text-3xl {
    font-size: 1.5rem;
  }
}

.range {
  height: 1.5rem;
}

.radio {
  width: 1rem;
  height: 1rem;
}

/* 数字显示优化 */
.font-mono {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Menlo', 'Courier', monospace;
}

/* 触摸反馈 */
.touch-manipulation:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}

/* 滑块样式优化 */
.range-primary::-webkit-slider-thumb {
  background: hsl(var(--p));
}

.range-secondary::-webkit-slider-thumb {
  background: hsl(var(--s));
}

/* 错误状态样式 */
.input-error {
  border-color: hsl(var(--er));
}

/* 结果显示区域 */
.bg-base-200 {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Menlo', 'Courier', monospace;
}
</style>
