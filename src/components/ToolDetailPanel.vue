<template>
  <!-- 面板遮罩 -->
  <div 
    v-if="isOpen" 
    class="fixed inset-0 bg-black bg-opacity-50 z-40"
    @click="handleClose"
  ></div>

  <!-- 详情面板 -->
  <div 
    :class="[
      'tool-detail-panel',
      'fixed right-0 top-0 h-full z-50',
      'bg-base-100 shadow-2xl',
      'transition-transform duration-300 ease-out',
      {
        'translate-x-0': isOpen,
        'translate-x-full': !isOpen
      }
    ]"
    :style="{
      width: panelWidth
    }"
  >
    <!-- 面板头部 -->
    <div class="panel-header border-b border-base-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <!-- 工具图标 30像素 -->
          <span class="text-3xl">{{ tool?.icon }}</span>
          <!-- 工具标题 20像素字体 -->
          <h2 class="text-xl font-semibold text-base-content">
            {{ tool?.name }}
          </h2>
        </div>
        
        <!-- 关闭按钮 -->
        <button 
          @click="handleClose"
          class="btn btn-ghost btn-circle btn-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- 工具描述 -->
      <p class="text-base text-base-content/70 leading-relaxed">
        {{ tool?.description }}
      </p>
    </div>

    <!-- 面板内容区域 -->
    <div class="panel-content flex-1 overflow-y-auto">
      <!-- 工具标签显示 -->
      <div class="p-6 border-b border-base-200">
        <h3 class="text-sm font-semibold text-base-content/70 mb-3">标签</h3>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="tag in tool?.tags" 
            :key="tag"
            class="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-base-200 text-base-content border border-base-300"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- 操作按钮区域 -->
      <div class="p-6 border-b border-base-200">
        <div class="flex gap-3">
          <!-- 立即使用按钮 -->
          <button 
            @click="handleToolUse"
            class="btn btn-primary flex-1"
          >
            立即使用
          </button>
          
          <!-- 收藏按钮 -->
          <button 
            @click="handleFavoriteToggle"
            :class="[
              'btn btn-outline',
              { 'btn-error': isFavorite, 'btn-ghost': !isFavorite }
            ]"
          >
            <svg 
              class="w-4 h-4" 
              :fill="isFavorite ? 'currentColor' : 'none'" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {{ isFavorite ? '已收藏' : '收藏' }}
          </button>
        </div>
      </div>

      <!-- 选项卡内容 -->
      <div class="p-6">
        <!-- 选项卡标题 -->
        <div class="tabs tabs-bordered mb-6">
          <button 
            @click="activeTab = 'usage'"
            :class="['tab tab-bordered', { 'tab-active': activeTab === 'usage' }]"
          >
            使用说明
          </button>
          <button 
            @click="activeTab = 'examples'"
            :class="['tab tab-bordered', { 'tab-active': activeTab === 'examples' }]"
          >
            使用示例
          </button>
        </div>

        <!-- 使用说明内容 -->
        <div v-if="activeTab === 'usage'" class="space-y-4">
          <div>
            <h4 class="text-sm font-semibold text-base-content mb-2">工具介绍</h4>
            <p class="text-sm text-base-content/70 leading-relaxed">
              {{ tool?.description }}
            </p>
          </div>
          
          <div>
            <h4 class="text-sm font-semibold text-base-content mb-2">主要功能</h4>
            <ul class="text-sm text-base-content/70 space-y-1 list-disc list-inside">
              <li>功能点 1：快速处理和转换</li>
              <li>功能点 2：支持多种格式</li>
              <li>功能点 3：实时预览结果</li>
              <li>功能点 4：一键复制和下载</li>
            </ul>
          </div>
        </div>

        <!-- 使用示例内容 -->
        <div v-if="activeTab === 'examples'" class="space-y-4">
          <div>
            <h4 class="text-sm font-semibold text-base-content mb-2">示例说明</h4>
            <p class="text-sm text-base-content/70 leading-relaxed">
              以下是一些常见的使用示例，帮助您快速上手。
            </p>
          </div>
          
          <div>
            <h4 class="text-sm font-semibold text-base-content mb-2">代码示例</h4>
            <div class="bg-base-200 border border-base-300 rounded-lg p-4">
              <pre class="text-sm font-mono text-base-content/80 whitespace-pre-wrap">
// 示例代码
function example() {
  console.log("Hello World");
  return "示例输出";
}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Tool } from '@/types'

// Props
const props = defineProps<{
  tool: Tool | null
  isOpen: boolean
  isFavorite?: boolean
}>()

// Emits
const emit = defineEmits<{
  'close': []
  'tool-use': [tool: Tool]
  'favorite-toggle': [tool: Tool]
}>()

// 响应式状态
const activeTab = ref<'usage' | 'examples'>('usage')

// 计算面板宽度
const panelWidth = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 768 ? '100vw' : '540px'
  }
  return '540px'
})

// 处理关闭
const handleClose = () => {
  emit('close')
}

// 处理工具使用
const handleToolUse = () => {
  if (props.tool) {
    emit('tool-use', props.tool)
  }
}

// 处理收藏切换
const handleFavoriteToggle = () => {
  if (props.tool) {
    emit('favorite-toggle', props.tool)
  }
}

// 监听面板打开状态，重置选项卡
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    activeTab.value = 'usage'
  }
})

// 防止背景滚动
watch(() => props.isOpen, (isOpen) => {
  if (typeof document !== 'undefined') {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})
</script>

<script lang="ts">
export default {
  name: 'ToolDetailPanel'
}
</script>

<style scoped>
.tool-detail-panel {
  width: 540px;
  max-width: 100vw;
}

@media (max-width: 768px) {
  .tool-detail-panel {
    width: 100vw;
  }
}

/* 面板头部样式 */
.panel-header {
  flex-shrink: 0;
}

/* 面板内容样式 */
.panel-content {
  height: calc(100vh - 200px);
}

/* 选项卡样式优化 */
.tabs .tab {
  flex: 1;
}

/* 代码块样式 */
pre {
  font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
  line-height: 1.5;
}
</style> 
