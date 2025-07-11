<template>
  <div 
    class="tool-card fade-in"
    @click="handleCardClick"
  >
    <!-- 收藏按钮 -->
    <button 
      @click.stop="handleFavoriteClick"
      :class="['favorite-btn', { 'favorited': isFavorite }]"
      :title="isFavorite ? '取消收藏' : '添加收藏'"
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
    </button>

    <!-- 工具图标 -->
    <div class="tool-icon">
      {{ tool.icon }}
    </div>

    <!-- 工具标题 -->
    <h3 class="tool-title">
      {{ tool.name }}
    </h3>

    <!-- 分类标签 -->
    <div :class="['category-tag', tool.category]">
      {{ getCategoryName(tool.category) }}
    </div>

    <!-- 工具描述 -->
    <p class="tool-description">
      {{ tool.description }}
    </p>

    <!-- 标签列表 -->
    <div class="flex flex-wrap gap-1 mb-4 justify-center">
      <span 
        v-for="tag in tool.tags.slice(0, 3)" 
        :key="tag"
        class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-base-200 text-base-content/60"
      >
        {{ tag }}
      </span>
      <span 
        v-if="tool.tags.length > 3"
        class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-base-200 text-base-content/40"
      >
        +{{ tool.tags.length - 3 }}
      </span>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <button 
        @click.stop="handleUseClick"
        class="action-btn primary flex-1"
      >
        立即使用
      </button>
      
      <button 
        @click.stop="handleDetailsClick"
        class="action-btn secondary"
      >
        详情
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tool } from '@/types'
import { categories } from '@/store/data'

// Props
const props = defineProps<{
  tool: Tool
  isFavorite: boolean
}>()

// Emits
const emit = defineEmits<{
  'favorite-toggle': [tool: Tool]
  'tool-use': [tool: Tool]
  'tool-details': [tool: Tool]
  'tool-click': [tool: Tool]
}>()

// 获取分类名称
const getCategoryName = (categoryId: string): string => {
  const category = categories.find(c => c.id === categoryId)
  return category?.name || '其他'
}

// 处理卡片点击
const handleCardClick = () => {
  emit('tool-click', props.tool)
}

// 处理收藏切换
const handleFavoriteClick = () => {
  emit('favorite-toggle', props.tool)
}

// 处理使用按钮点击
const handleUseClick = () => {
  emit('tool-use', props.tool)
}

// 处理详情按钮点击
const handleDetailsClick = () => {
  emit('tool-details', props.tool)
}
</script>

<script lang="ts">
export default {
  name: 'ToolCard'
}
</script>

<style scoped>


/* 网格视图下的响应式调整 */
@media (max-width: 640px) {
  .tool-card {
    padding: 1.25rem;
  }
  
  .tool-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
  
  .tool-title {
    font-size: 1rem;
  }
  
  .tool-description {
    font-size: 0.8rem;
    margin-bottom: 0.75rem;
  }
}
</style> 
