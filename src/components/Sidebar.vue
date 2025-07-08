<template>
  <aside :class="['sidebar scale-in', { 'open': isOpen }]">
    <!-- 侧边栏头部 -->
    <div class="sidebar-header">
      <h2 class="sidebar-title">工具分类</h2>
      <div class="tools-count-badge">
        共 {{ totalTools }} 个工具
      </div>
    </div>

    <!-- 分类菜单 -->
    <div class="flex-1 overflow-y-auto p-4">
      <nav class="space-y-1">
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
            <div class="category-icon-wrapper">
              <svg v-if="category.id === 'all'" class="category-icon-svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
              
              <svg v-else-if="category.id === 'design'" class="category-icon-svg" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clip-rule="evenodd"/>
              </svg>
              
              <svg v-else-if="category.id === 'development'" class="category-icon-svg" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              
              <svg v-else-if="category.id === 'efficiency'" class="category-icon-svg" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
              </svg>
              
              <svg v-else-if="category.id === 'calculation'" class="category-icon-svg" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clip-rule="evenodd"/>
              </svg>
              
              <svg v-else-if="category.id === 'text'" class="category-icon-svg" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M8 6a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd"/>
              </svg>
              
              <svg v-else-if="category.id === 'image'" class="category-icon-svg" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
              </svg>
              
              <svg v-else-if="category.id === 'network'" class="category-icon-svg" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.029 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd"/>
              </svg>
              
              <span v-else class="category-icon-emoji">{{ getCategoryEmoji(category.id) }}</span>
            </div>
            
            <!-- 分类名称 -->
            <span class="font-medium">{{ category.name }}</span>
          </div>
          
          <!-- 工具数量徽章 -->
          <div class="category-count-badge">
            {{ getCategoryCount(category.id) }}
          </div>
        </div>
      </nav>
    </div>

    <!-- 收藏工具快速访问 -->
    <div v-if="favoriteTools.length > 0" class="border-t border-base-200 p-4">
      <h3 class="text-sm font-semibold text-base-content/70 mb-3">我的收藏</h3>
      <div class="space-y-2">
        <div 
          v-for="tool in favoriteTools.slice(0, 5)"
          :key="tool.id"
          @click="emit('tool-select', tool)"
          class="favorite-tool-card"
        >
          <div class="flex items-center gap-3">
            <!-- 工具图标 -->
            <span class="text-lg">{{ tool.icon }}</span>
            
            <!-- 工具信息 -->
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-base-content truncate">
                {{ tool.name }}
              </div>
              <div class="text-xs text-base-content/60 truncate">
                {{ getCategoryName(tool.category) }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- 显示更多收藏 -->
        <div v-if="favoriteTools.length > 5" class="text-center pt-2">
          <button 
            @click="emit('show-all-favorites')"
            class="text-xs text-primary hover:text-primary/80 font-medium"
          >
            查看全部 {{ favoriteTools.length }} 个收藏
          </button>
        </div>
      </div>
    </div>

    <!-- 空收藏状态 -->
    <div v-else class="border-t border-base-200 p-4">
      <div class="text-center py-4">
        <div class="text-2xl mb-2">❤️</div>
        <div class="text-sm text-base-content/60">
          还没有收藏的工具
        </div>
        <div class="text-xs text-base-content/40 mt-1">
          点击工具卡片的爱心图标收藏
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
}>()

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
    'network': '🌐'
  }
  return emojiMap[categoryId] || '🔧'
}

// 获取分类名称
const getCategoryName = (categoryId: string): string => {
  const category = props.categories.find(c => c.id === categoryId)
  return category?.name || '其他'
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
}
</style> 
