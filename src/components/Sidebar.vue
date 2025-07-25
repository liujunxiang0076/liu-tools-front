<template>
  <aside :class="['sidebar scale-in', { 'open': isOpen }]">
    <!-- 侧边栏头部 -->
    <div class="sidebar-header">
      <h2 class="sidebar-title">工具分类</h2>
      <div class="badge badge-outline badge-sm">
        共 {{ totalTools }} 个
      </div>
    </div>

    <!-- 分类菜单 -->
    <div class="flex-1 overflow-y-auto px-4 pb-2">
      <nav class="space-y-1 py-2">
        <div 
          v-for="category in categories"
          :key="category.id"
          @click="emit('category-select', category.id)"
          :class="[
            'category-menu-item', 
            { 
              'active': selectedCategoryId === category.id,
              'all-tools': category.id === 'all' && selectedCategoryId === category.id
            }
          ]"
        >
          <div class="flex items-center">
            <!-- 分类图标 -->
            <span class="category-icon mr-3">
              {{ getCategoryEmoji(category.id) }}
            </span>
            
            <!-- 分类名称和数量徽章 -->
            <div class="flex-1 flex items-center justify-between">
              <span class="category-name">{{ category.name }}</span>
              <div :class="['badge badge-sm', getCategoryBadgeClass(category.id)]">
                {{ getCategoryToolCount(category.id) }}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- 收藏区域：优化后的显示 -->
    <div v-if="favoriteTools.length > 0" class="border-t border-base-200 px-4 py-3 flex-shrink-0">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-semibold text-base-content/70">我的收藏</h3>
        
        <!-- 右侧按钮组：收藏数量徽章 + 管理收藏按钮 -->
        <div class="flex items-center gap-2">
          <!-- 收藏数量徽章 -->
          <div class="badge badge-error badge-sm">
            {{ favoriteTools.length }}
          </div>
          
          <!-- 管理收藏按钮 - 只在收藏超过3个时显示 -->
          <button 
            v-if="favoriteTools.length > 3"
            @click="emit('show-all-favorites')"
            class="btn btn-xs btn-primary btn-outline hover:btn-primary transition-colors favorite-manage-btn"
            title="管理收藏"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
            </svg>
            <span class="hidden sm:inline">管理</span>
          </button>
        </div>
      </div>
      
      <div class="space-y-1.5">
        <!-- 显示最多3个收藏工具，按最先收藏的顺序 -->
        <div 
          v-for="tool in visibleFavorites"
          :key="tool.id"
          @click="emit('tool-select', tool)"
          class="favorite-tool-card group"
        >
          <div class="flex items-center gap-2.5">
            <!-- 工具图标 -->
            <span class="text-base flex-shrink-0">{{ tool.icon }}</span>
            
            <!-- 工具信息 -->
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-base-content truncate">
                {{ tool.name }}
              </div>
              <div class="flex items-center gap-1.5 mt-0.5">
                <!-- 添加分类徽章 -->
                <div :class="['badge badge-xs badge-outline', getCategoryBadgeClass(tool.category)]">
                  {{ getCategoryName(tool.category) }}
                </div>
              </div>
            </div>
            
            <!-- 快速操作按钮 -->
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                @click.stop="emit('remove-favorite', tool)"
                class="btn btn-xs btn-circle btn-ghost text-error"
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
    </div>

    <!-- 空收藏状态：优化后的引导 -->
    <div v-else class="border-t border-base-200 px-4 py-3 flex-shrink-0">
      <div class="text-center py-3">
        <div class="text-xl mb-2">❤️</div>
        <div class="text-sm text-base-content/60 mb-1">
          还没有收藏的工具
        </div>
        <div class="text-xs text-base-content/40 flex items-center justify-center gap-1">
          点击工具卡片的 
          <svg class="w-3 h-3 text-error" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
          图标收藏
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Category, Tool } from '@/types'
import { getCategoryCount } from '@/store/data'

// Props
const props = defineProps<{
  categories: Category[]
  selectedCategoryId: string
  favoriteTools: Tool[]
  totalTools: number
  isOpen?: boolean
}>()

// Emits
const emit = defineEmits<{
  'category-select': [categoryId: string]
  'tool-select': [tool: Tool]
  'show-all-favorites': []
  'remove-favorite': [tool: Tool]
}>()

// 可见的收藏工具 - 最多显示3个，按最先收藏的顺序
const visibleFavorites = computed(() => {
  // 最多显示前3个收藏工具
  return props.favoriteTools.slice(0, 3)
})

// 获取分类对应的emoji图标
const getCategoryEmoji = (categoryId: string): string => {
  const emojiMap: Record<string, string> = {
    'all': '📦',
    'design': '🎨',
    'dev': '💻', 
    'development': '💻',
    'efficiency': '⚡',
    'calc': '🧮',
    'calculation': '🧮',
    'text': '📝',
    'image': '🖼️',
    'network': '🌐',
    'favorites': '❤️'
  }
  return emojiMap[categoryId] || '🔧'
}

// 获取分类徽章样式类
const getCategoryBadgeClass = (categoryId: string): string => {
  const badgeClassMap: Record<string, string> = {
    'all': 'badge-neutral',
    'favorites': 'badge-error',
    'design': 'badge-secondary', 
    'development': 'badge-info',
    'efficiency': 'badge-success',
    'calculation': 'badge-accent',
    'text': 'badge-warning',
    'image': 'badge-error',
    'network': 'badge-info'
  }
  return badgeClassMap[categoryId] || 'badge-neutral'
}

// 获取分类名称
const getCategoryName = (categoryId: string): string => {
  const category = props.categories.find(c => c.id === categoryId)
  return category?.name || '其他'
}

// 获取分类工具数量
const getCategoryToolCount = (categoryId: string): number => {
  if (categoryId === 'all') {
    return props.totalTools
  }
  if (categoryId === 'favorites') {
    return props.favoriteTools.length
  }
  return getCategoryCount(categoryId)
}

// 获取图标组件（预留给图标库）
const getIconComponent = (iconName: string) => {
  // 这里可以根据需要导入和返回对应的图标组件
  // 目前使用emoji代替
  return null
}
</script>

<script lang="ts">
export default {
  name: 'Sidebar'
}
</script>

<style scoped>
/* 组件特定样式 */
.sidebar {
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 40;
    width: 16rem;
    transform: translateX(-100%);
    height: 100vh;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  /* 移动端收藏操作按钮始终显示 */
  .group .opacity-0 {
    opacity: 1;
  }
}
</style> 
