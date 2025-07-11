<template>
  <div 
    class="favorite-simple-card group"
    @click="handleCardClick"
  >
    <div class="flex items-center gap-3">
      <!-- 工具图标 -->
      <div class="flex-shrink-0">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg bg-base-200/50">
          {{ tool.icon }}
        </div>
      </div>
      
      <!-- 工具信息 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <div class="min-w-0 flex-1">
            <h4 class="text-sm font-medium text-base-content truncate">
              {{ tool.name }}
            </h4>
            <div class="flex items-center gap-2 mt-1">
              <!-- 分类标签（小尺寸） -->
              <span :class="['category-badge', tool.category]">
                {{ getCategoryName(tool.category) }}
              </span>
              <!-- 最近收藏指示器 -->
              <span v-if="isRecent" class="recent-badge">
                新收藏
              </span>
            </div>
          </div>
          
          <!-- 操作按钮组 -->
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            <!-- 快速使用 -->
            <button 
              @click.stop="handleUseClick"
              class="btn btn-xs btn-primary btn-circle"
              title="立即使用"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </button>
            
            <!-- 取消收藏 -->
            <button 
              @click.stop="handleRemoveClick"
              class="btn btn-xs btn-error btn-outline btn-circle"
              title="取消收藏"
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 悬停时显示的详细信息 -->
    <div class="favorite-tooltip opacity-0 group-hover:opacity-100 transition-opacity">
      <p class="text-xs text-base-content/70 line-clamp-2 mt-2">
        {{ tool.description }}
      </p>
      <div class="flex flex-wrap gap-1 mt-2">
        <span 
          v-for="tag in tool.tags.slice(0, 2)" 
          :key="tag"
          class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-base-200 text-base-content/60"
        >
          {{ tag }}
        </span>
        <span 
          v-if="tool.tags.length > 2"
          class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-base-200 text-base-content/40"
        >
          +{{ tool.tags.length - 2 }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tool } from '@/types'
import { categories } from '@/store/data'

// Props
const props = defineProps<{
  tool: Tool
  compact?: boolean
  showTooltip?: boolean
}>()

// Emits
const emit = defineEmits<{
  'tool-click': [tool: Tool]
  'tool-use': [tool: Tool]
  'remove-favorite': [tool: Tool]
}>()

// 获取分类名称
const getCategoryName = (categoryId: string): string => {
  const category = categories.find(c => c.id === categoryId)
  return category?.name || '其他'
}

// 判断是否是最近收藏（这里简单按ID判断，实际应该按收藏时间）
const isRecent = computed(() => {
  // 这里可以基于真实的收藏时间来判断
  // 目前简单地认为ID较大的是最近收藏的
  return props.tool.id > 40 // 假设ID大于40的是最近收藏
})

// 事件处理
const handleCardClick = () => {
  emit('tool-click', props.tool)
}

const handleUseClick = () => {
  emit('tool-use', props.tool)
}

const handleRemoveClick = () => {
  emit('remove-favorite', props.tool)
}
</script>

<script lang="ts">
export default {
  name: 'FavoriteToolCard'
}
</script>

<style scoped>
/* 简化的收藏卡片样式 */
.favorite-simple-card {
  background: 
    linear-gradient(145deg, hsl(var(--b1)) 0%, hsl(var(--b1)/0.98) 100%),
    radial-gradient(circle at 100% 0%, hsl(var(--p) / 0.015) 0%, transparent 50%);
  border: 1px solid hsl(var(--b3) / 0.6);
  border-radius: 0.75rem;
  padding: 0.75rem;
  transition: all 0.2s ease;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 1px 2px rgba(0, 0, 0, 0.02),
    inset 0 1px 0 hsl(var(--b1) / 0.3);
}

/* 深色模式 */
[data-theme="dark"] .favorite-simple-card {
  background: 
    linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(30, 41, 59, 0.75) 100%),
    radial-gradient(circle at 100% 0%, hsl(var(--p) / 0.02) 0%, transparent 50%);
  border: 1px solid rgba(71, 85, 105, 0.4);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.15),
    0 1px 2px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(30, 41, 59, 0.6);
}

.favorite-simple-card:hover {
  border-color: #93c5fd; /* blue-300 浅色模式 */
  background: 
    linear-gradient(145deg, hsl(var(--b1)) 0%, hsl(var(--b1)/0.96) 100%),
    radial-gradient(circle at 100% 0%, hsl(var(--p) / 0.03) 0%, transparent 50%);
  transform: translateY(-1px);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.08),
    0 2px 4px rgba(59, 130, 246, 0.1),
    inset 0 1px 0 hsl(var(--b1)),
    0 0 0 1px rgba(147, 197, 253, 0.1);
}

[data-theme="dark"] .favorite-simple-card:hover {
  border-color: #2563eb; /* blue-600 深色模式 */
  background: 
    linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(30, 41, 59, 0.85) 100%),
    radial-gradient(circle at 100% 0%, hsl(var(--p) / 0.04) 0%, transparent 50%);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.25),
    0 2px 4px rgba(37, 99, 235, 0.2),
    inset 0 1px 0 rgba(30, 41, 59, 0.8),
    0 0 0 1px rgba(37, 99, 235, 0.15);
}

/* 分类徽章样式 */
.category-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.375rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid transparent;
}

/* 工具分类配色 - 简化版本 */
.category-badge.design {
  background-color: rgba(236, 72, 153, 0.1);
  color: #ec4899;
  border-color: rgba(236, 72, 153, 0.2);
}

.category-badge.development {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.2);
}

.category-badge.efficiency {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border-color: rgba(34, 197, 94, 0.2);
}

.category-badge.calculation {
  background-color: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
  border-color: rgba(139, 92, 246, 0.2);
}

.category-badge.text {
  background-color: rgba(251, 146, 60, 0.1);
  color: #fb923c;
  border-color: rgba(251, 146, 60, 0.2);
}

.category-badge.image {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.2);
}

.category-badge.network {
  background-color: rgba(6, 182, 212, 0.1);
  color: #06b6d4;
  border-color: rgba(6, 182, 212, 0.2);
}

/* 最近收藏徽章 */
.recent-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.625rem;
  font-weight: 600;
  background-color: rgba(34, 197, 94, 0.15);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

/* 工具提示信息 */
.favorite-tooltip {
  border-top: 1px solid hsl(var(--b3) / 0.3);
  margin-top: 0.5rem;
  padding-top: 0.5rem;
}

/* 文本截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .favorite-simple-card {
    padding: 0.625rem;
  }
  
  .group .opacity-0 {
    opacity: 1; /* 移动端始终显示操作按钮 */
  }
  
  .favorite-tooltip {
    display: none; /* 移动端隐藏详细信息 */
  }
}
</style> 
