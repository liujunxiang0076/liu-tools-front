<template>
  <!-- 收藏管理弹窗 -->
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center"
    @click.self="handleClose"
  >
    <!-- 遮罩层 -->
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
    
    <!-- 弹窗主体 -->
    <div class="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-base-100 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      <!-- 弹窗头部 -->
      <div class="flex items-center justify-between p-6 border-b border-base-200">
        <div>
          <h2 class="text-xl font-bold text-base-content">我的收藏</h2>
          <p class="text-sm text-base-content/60 mt-1">
            管理您收藏的 {{ favoriteTools.length }} 个工具
          </p>
        </div>
        
        <!-- 关闭按钮 -->
        <button 
          @click="handleClose"
          class="btn btn-sm btn-circle btn-ghost"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- 搜索和排序工具栏 -->
      <div class="p-6 border-b border-base-200 bg-base-50/50">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- 搜索框 -->
          <div class="flex-1 relative">
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="搜索收藏的工具..."
              class="input input-bordered w-full pl-10"
            >
            <svg 
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          
          <!-- 排序选择 -->
          <select 
            v-model="sortBy" 
            class="select select-bordered min-w-[160px]"
          >
            <option value="recent">最近收藏</option>
            <option value="name">按名称排序</option>
            <option value="category">按分类排序</option>
          </select>
          
          <!-- 清空收藏按钮 -->
          <button 
            v-if="favoriteTools.length > 0"
            @click="handleClearAll"
            class="btn btn-outline btn-error"
          >
            清空收藏
          </button>
        </div>
      </div>
      
      <!-- 工具列表 -->
      <div class="flex-1 overflow-hidden">
        <!-- 有收藏工具时 -->
        <div v-if="filteredFavorites.length > 0" class="h-full">
          <!-- 滚动区域 -->
          <div class="h-full overflow-y-auto p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="tool in paginatedFavorites"
                :key="tool.id"
                class="favorite-item-card group"
                @click="handleToolClick(tool)"
              >
                <!-- 工具内容 -->
                <div class="flex items-start gap-4">
                  <!-- 工具图标 -->
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-base-200">
                      {{ tool.icon }}
                    </div>
                  </div>
                  
                  <!-- 工具信息 -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between mb-2">
                      <h3 class="text-base font-semibold text-base-content truncate pr-2">
                        {{ tool.name }}
                      </h3>
                      
                      <!-- 操作按钮组 -->
                      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <!-- 快速使用按钮 -->
                        <button 
                          @click.stop="handleToolUse(tool)"
                          class="btn btn-xs btn-primary"
                          title="立即使用"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                          </svg>
                        </button>
                        
                        <!-- 移除收藏按钮 -->
                        <button 
                          @click.stop="handleRemoveFavorite(tool)"
                          class="btn btn-xs btn-error btn-outline"
                          title="取消收藏"
                        >
                          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <!-- 分类标签 -->
                    <div :class="['category-tag', tool.category, 'mb-2 inline-block']">
                      {{ getCategoryName(tool.category) }}
                    </div>
                    
                    <!-- 工具描述 -->
                    <p class="text-sm text-base-content/70 line-clamp-2 mb-3">
                      {{ tool.description }}
                    </p>
                    
                    <!-- 标签 -->
                    <div class="flex flex-wrap gap-1">
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
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 分页控制 -->
            <div v-if="totalPages > 1" class="flex justify-center mt-8">
              <div class="join">
                <button 
                  v-for="page in visiblePages"
                  :key="page"
                  @click="currentPage = Number(page)"
                  :class="[
                    'join-item btn btn-sm',
                    { 'btn-active': currentPage === page }
                  ]"
                >
                  {{ page }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-else class="flex-1 flex items-center justify-center p-8">
          <div class="text-center max-w-sm">
            <!-- 空状态图标 -->
            <div class="text-6xl mb-4">
              {{ searchQuery ? '🔍' : '❤️' }}
            </div>
            
            <h3 class="text-lg font-semibold text-base-content mb-2">
              {{ searchQuery ? '没有找到匹配的收藏' : '还没有收藏的工具' }}
            </h3>
            
            <p class="text-sm text-base-content/60 mb-4">
              {{ searchQuery 
                ? '尝试使用其他关键词搜索您的收藏' 
                : '点击工具卡片的爱心图标来收藏喜欢的工具'
              }}
            </p>
            
            <!-- 操作按钮 -->
            <div class="space-y-2">
              <button 
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="btn btn-sm btn-primary"
              >
                清除搜索
              </button>
              
              <button 
                v-else
                @click="handleClose"
                class="btn btn-sm btn-outline"
              >
                去发现工具
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 弹窗底部 -->
      <div v-if="filteredFavorites.length > 0" class="p-4 border-t border-base-200 bg-base-50/50">
        <div class="flex items-center justify-between text-sm text-base-content/60">
          <div>
            显示 {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredFavorites.length) }} - 
            {{ Math.min(currentPage * itemsPerPage, filteredFavorites.length) }} 
            / 共 {{ filteredFavorites.length }} 个收藏
          </div>
          
          <div class="flex items-center gap-2">
            <span>每页显示</span>
            <select 
              v-model="itemsPerPage" 
              class="select select-xs select-bordered"
              @change="currentPage = 1"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Tool } from '@/types'
import { categories } from '@/store/data'
import { Message } from '@/utils/message'

// Props
const props = defineProps<{
  isOpen: boolean
  favoriteTools: Tool[]
}>()

// Emits
const emit = defineEmits<{
  'close': []
  'tool-select': [tool: Tool]
  'tool-use': [tool: Tool]
  'remove-favorite': [tool: Tool]
  'clear-all': []
}>()

// 响应式状态
const searchQuery = ref('')
const sortBy = ref<'recent' | 'name' | 'category'>('recent')
const currentPage = ref(1)
const itemsPerPage = ref(20)

// 获取分类名称
const getCategoryName = (categoryId: string): string => {
  const category = categories.find(c => c.id === categoryId)
  return category?.name || '其他'
}

// 过滤和排序收藏
const filteredFavorites = computed(() => {
  let filtered = [...props.favoriteTools]
  
  // 搜索过滤
  if (searchQuery.value.trim()) {
    const keyword = searchQuery.value.toLowerCase()
    filtered = filtered.filter(tool => 
      tool.name.toLowerCase().includes(keyword) ||
      tool.description.toLowerCase().includes(keyword) ||
      tool.tags.some(tag => tag.toLowerCase().includes(keyword)) ||
      getCategoryName(tool.category).toLowerCase().includes(keyword)
    )
  }
  
  // 排序
  switch (sortBy.value) {
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'category':
      filtered.sort((a, b) => {
        const categoryA = getCategoryName(a.category)
        const categoryB = getCategoryName(b.category)
        return categoryA.localeCompare(categoryB)
      })
      break
    case 'recent':
    default:
      // 按ID倒序排列（最近收藏的在前）
      filtered.sort((a, b) => b.id - a.id)
      break
  }
  
  return filtered
})

// 计算分页
const totalPages = computed(() => Math.ceil(filteredFavorites.value.length / itemsPerPage.value))

const paginatedFavorites = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredFavorites.value.slice(start, end)
})

// 计算可见页码
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    // 如果总页数小于等于7，显示全部页码
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 否则显示省略的页码
    if (current <= 4) {
      // 前部分页码
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    } else if (current >= total - 3) {
      // 后部分页码
      pages.push(1, '...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 中间页码
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }
  
  return pages.filter(page => page !== '...' || pages.indexOf(page) === pages.lastIndexOf(page))
})

// 监听搜索变化，重置页码
watch([searchQuery, sortBy, itemsPerPage], () => {
  currentPage.value = 1
})

// 监听弹窗打开状态，重置状态
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    searchQuery.value = ''
    sortBy.value = 'recent'
    currentPage.value = 1
  }
})

// 事件处理
const handleClose = () => {
  emit('close')
}

const handleToolClick = (tool: Tool) => {
  emit('tool-select', tool)
  handleClose()
}

const handleToolUse = (tool: Tool) => {
  emit('tool-use', tool)
  handleClose()
}

const handleRemoveFavorite = (tool: Tool) => {
  emit('remove-favorite', tool)
  Message.success(`已取消收藏 ${tool.name}`)
}

const handleClearAll = () => {
  if (confirm(`确定要清空所有 ${props.favoriteTools.length} 个收藏吗？此操作不可撤销。`)) {
    emit('clear-all')
    Message.success('已清空所有收藏')
  }
}

// 防止背景滚动
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* 收藏项卡片样式 */
.favorite-item-card {
  background: 
    linear-gradient(145deg, hsl(var(--b1)) 0%, hsl(var(--b1)/0.97) 100%),
    radial-gradient(circle at 100% 0%, hsl(var(--p) / 0.02) 0%, transparent 50%);
  border: 1px solid hsl(var(--b3) / 0.8);
  border-radius: 1rem;
  padding: 1.25rem;
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: 
    0 2px 6px rgba(0, 0, 0, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 hsl(var(--b1) / 0.5);
}

/* 深色模式收藏项卡片 */
[data-theme="dark"] .favorite-item-card {
  background: 
    linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(30, 41, 59, 0.87) 100%),
    radial-gradient(circle at 100% 0%, hsl(var(--p) / 0.03) 0%, transparent 50%);
  border: 1px solid rgba(71, 85, 105, 0.5);
  box-shadow: 
    0 2px 6px rgba(0, 0, 0, 0.2),
    0 1px 2px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(30, 41, 59, 0.8);
}

.favorite-item-card:hover {
  border-color: #93c5fd; /* blue-300 浅色模式 */
  background: 
    linear-gradient(145deg, hsl(var(--b1)) 0%, hsl(var(--b1)/0.95) 100%),
    radial-gradient(circle at 100% 0%, hsl(var(--p) / 0.04) 0%, transparent 50%);
  transform: translateY(-2px);
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.1),
    0 3px 8px rgba(59, 130, 246, 0.15),
    inset 0 1px 0 hsl(var(--b1)),
    0 0 0 1px rgba(147, 197, 253, 0.15);
}

[data-theme="dark"] .favorite-item-card:hover {
  border-color: #2563eb; /* blue-600 深色模式 */
  background: 
    linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(30, 41, 59, 0.92) 100%),
    radial-gradient(circle at 100% 0%, hsl(var(--p) / 0.05) 0%, transparent 50%);
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.3),
    0 3px 8px rgba(37, 99, 235, 0.25),
    inset 0 1px 0 rgba(30, 41, 59, 0.9),
    0 0 0 1px rgba(37, 99, 235, 0.2);
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
  .favorite-item-card {
    padding: 1rem;
  }
  
  .group .opacity-0 {
    opacity: 1; /* 移动端始终显示操作按钮 */
  }
}
</style> 
