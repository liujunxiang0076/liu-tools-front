<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- 顶部导航栏 -->
    <TopNavBar
      :search-query="searchQuery"
      :view-mode="viewMode"
      :sidebar-open="sidebarOpen"
      @update:search-query="searchQuery = $event"
      @update:view-mode="viewMode = $event"
      @toggle-sidebar="toggleSidebar"
    />

    <!-- 主体内容区域 -->
    <div class="flex flex-1 min-h-0">
      <!-- 侧边栏 -->
      <Sidebar
        :categories="categories"
        :selected-category-id="selectedCategory"
        :favorite-tools="favoriteTools"
        :total-tools="totalTools"
        :is-open="sidebarOpen"
        @category-select="handleCategorySelect"
        @tool-select="handleToolSelect"
        @show-all-favorites="handleShowAllFavorites"
        @remove-favorite="handleRemoveFavorite"
      />

      <!-- 移动端侧边栏遮罩 -->
      <div 
        v-if="sidebarOpen" 
        class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        @click="sidebarOpen = false"
      ></div>

      <!-- 主工作区 -->
      <MainWorkspace
        :selected-category="selectedCategory"
        :search-query="searchQuery"
        :view-mode="viewMode"
        :favorite-ids="favoriteIds"
        @update:favorite-ids="favoriteIds = $event"
        @update:search-query="searchQuery = $event"
        @tool-select="handleToolSelect"
      />
    </div>

    <!-- 收藏管理弹窗 -->
    <FavoritesModal
      :is-open="showFavoritesModal"
      :favorite-tools="favoriteTools"
      @close="showFavoritesModal = false"
      @tool-select="handleToolSelect"
      @tool-use="handleToolSelect"
      @remove-favorite="handleRemoveFavorite"
      @clear-all="handleClearAllFavorites"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'

import { categories, tools, getToolsByCategory } from '@/store/data'
import type { Tool } from '@/types'

// 使用路由
const router = useRouter()

// 响应式状态
const searchQuery = ref('')
const selectedCategory = ref('all')
const viewMode = ref<'grid' | 'list'>('grid')
const favoriteIds = ref<number[]>([])
const sidebarOpen = ref(false)
const showFavoritesModal = ref(false)

// 计算属性
const totalTools = computed(() => tools.length)

const favoriteTools = computed(() => {
  return tools.filter(tool => favoriteIds.value.includes(tool.id))
})

// 事件处理函数
const handleCategorySelect = (categoryId: string) => {
  selectedCategory.value = categoryId
  // 移动端选择分类后关闭侧边栏
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false
  }
}

const handleToolSelect = (tool: Tool) => {
  console.log('Selected tool:', tool)
  
  if (tool.path) {
    // 使用路由跳转
    router.push(tool.path)
  } else {
    console.log(`${tool.name} 工具页面还在开发中`)
  }
}

const handleShowAllFavorites = () => {
  showFavoritesModal.value = true
}

const handleRemoveFavorite = (tool: Tool) => {
  const currentFavorites = [...favoriteIds.value]
  const index = currentFavorites.indexOf(tool.id)
  
  if (index > -1) {
    currentFavorites.splice(index, 1)
    favoriteIds.value = currentFavorites
  }
}

const handleClearAllFavorites = () => {
  favoriteIds.value = []
}

// 切换侧边栏（移动端）
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// 监听窗口大小变化
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    sidebarOpen.value = false
  }
}

// 生命周期钩子
onMounted(() => {
  // 从localStorage恢复用户偏好
  const savedFavorites = localStorage.getItem('favoriteTools')
  if (savedFavorites) {
    try {
      favoriteIds.value = JSON.parse(savedFavorites)
    } catch (error) {
      console.error('Failed to parse favorite tools from localStorage:', error)
    }
  }

  const savedViewMode = localStorage.getItem('viewMode')
  if (savedViewMode && (savedViewMode === 'grid' || savedViewMode === 'list')) {
    viewMode.value = savedViewMode as 'grid' | 'list'
  }

  const savedCategory = localStorage.getItem('selectedCategory')
  if (savedCategory) {
    selectedCategory.value = savedCategory
  }

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

// 监听favoriteIds变化，同步到localStorage
watch(favoriteIds, (newFavorites) => {
  localStorage.setItem('favoriteTools', JSON.stringify(newFavorites))
}, { deep: true })

// 监听viewMode变化，同步到localStorage
watch(viewMode, (newViewMode) => {
  localStorage.setItem('viewMode', newViewMode)
})

// 监听selectedCategory变化，同步到localStorage
watch(selectedCategory, (newCategory) => {
  localStorage.setItem('selectedCategory', newCategory)
})

// 监听搜索查询变化，重置分类选择
watch(searchQuery, (newQuery) => {
  if (newQuery.trim() && selectedCategory.value !== 'all') {
    selectedCategory.value = 'all'
  }
})

// 清理函数
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<script lang="ts">
export default {
  name: 'MainLayout'
}
</script>

<style scoped>
/* 确保移动端侧边栏正确显示 */
@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 40;
    height: 100vh;
    width: 18rem; /* 增大移动端侧边栏宽度 */
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.95);
  }
  
  [data-theme="dark"] .sidebar {
    background: rgba(30, 41, 59, 0.95);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  /* 移动端侧边栏遮罩优化 */
  .sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 30;
    transition: opacity 0.3s ease;
    backdrop-filter: blur(4px);
  }
}

/* 移动端导航优化 */
@media (max-width: 768px) {
  .sidebar {
    width: 16rem; /* 中等屏幕调整宽度 */
  }
  
  /* 主工作区移动端适配 */
  .main-workspace {
    padding: 0.5rem;
  }
  
  /* 工具网格移动端优化 */
  .tools-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  /* 工具卡片移动端优化 */
  .tool-card {
    padding: 1rem;
    border-radius: 0.75rem;
    min-height: 5rem; /* 确保足够的触摸区域 */
  }
  
  /* 搜索框移动端优化 */
  .search-container {
    padding: 0 1rem;
  }
  
  /* 分类选择移动端优化 */
  .category-tabs {
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .category-tabs::-webkit-scrollbar {
    display: none;
  }
  
  /* 收藏按钮移动端优化 */
  .favorite-btn {
    min-width: 2.5rem;
    min-height: 2.5rem;
    touch-action: manipulation;
  }
}

/* 小屏幕进一步优化 */
@media (max-width: 640px) {
  .sidebar {
    width: 14rem; /* 小屏幕进一步缩小宽度 */
  }
  
  /* 工具卡片小屏幕优化 */
  .tool-card {
    padding: 0.75rem;
    min-height: 4.5rem;
  }
  
  /* 按钮小屏幕优化 */
  .btn {
    min-height: 2.75rem; /* 44px 最小触摸目标 */
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }
  
  .btn-sm {
    min-height: 2.25rem; /* 36px */
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .sidebar {
    width: 12rem; /* 超小屏幕进一步缩小 */
  }
  
  /* 容器边距优化 */
  .container {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  
  /* 卡片间距优化 */
  .card {
    margin: 0.5rem 0;
  }
  
  .card-body {
    padding: 0.75rem;
  }
}

/* 防止背景滚动 */
.overflow-hidden {
  overflow: hidden;
}

/* 侧边栏打开时禁止背景滚动 */
body.sidebar-open {
  overflow: hidden;
}

/* 触摸优化 */
.touch-target {
  min-height: 2.75rem; /* 44px 最小触摸目标 */
  min-width: 2.75rem;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* 滑动手势优化 */
.sidebar {
  overscroll-behavior: contain;
}

/* 安全区域适配 */
@supports (padding: max(0px)) {
  .sidebar {
    padding-left: max(1rem, env(safe-area-inset-left));
    padding-right: max(1rem, env(safe-area-inset-right));
  }
  
  .main-workspace {
    padding-left: max(1rem, env(safe-area-inset-left));
    padding-right: max(1rem, env(safe-area-inset-right));
  }
}

/* 横屏模式优化 */
@media (max-height: 500px) and (orientation: landscape) {
  .sidebar {
    width: 12rem; /* 横屏时缩小侧边栏 */
  }
  
  .tool-card {
    min-height: 3.5rem; /* 横屏时减小卡片高度 */
    padding: 0.5rem;
  }
}

/* 高分辨率屏幕优化 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .sidebar {
    border-right: 0.5px solid hsl(var(--b3));
  }
  
  .tool-card {
    border: 0.5px solid hsl(var(--b3));
  }
}

/* 动画性能优化 */
.sidebar,
.sidebar-overlay {
  will-change: transform;
}

/* 减少动画以提高性能 */
@media (prefers-reduced-motion: reduce) {
  .sidebar,
  .sidebar-overlay {
    transition: none;
  }
}

/* 深色模式优化 */
[data-theme="dark"] .sidebar {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .tool-card {
  border-color: rgba(255, 255, 255, 0.1);
}

/* 焦点状态优化 */
.sidebar .btn:focus,
.main-workspace .btn:focus {
  outline: 2px solid hsl(var(--p));
  outline-offset: 2px;
}

/* 移动端焦点状态 */
@media (max-width: 768px) {
  .sidebar .btn:focus,
  .main-workspace .btn:focus {
    outline-width: 3px;
  }
}
</style> 
