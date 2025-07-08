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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import TopNavBar from '@/components/TopNavBar.vue'
import Sidebar from '@/components/Sidebar.vue'
import MainWorkspace from '@/components/MainWorkspace.vue'
import { categories, tools, getToolsByCategory } from '@/store/data'
import type { Tool } from '@/types'
import { Message } from '@/utils/message'

// 响应式状态
const searchQuery = ref('')
const selectedCategory = ref('all')
const viewMode = ref<'grid' | 'list'>('grid')
const favoriteIds = ref<number[]>([])
const sidebarOpen = ref(false)

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
  // 模拟工具页面跳转
  console.log('Selected tool:', tool)
  
  // 这里可以实现真正的路由跳转
  if (tool.path) {
    // 示例：window.open(tool.path, '_blank')
    Message.success(`正在打开 ${tool.name}...`)
    
    // 简单的页面跳转模拟
    setTimeout(() => {
      Message.info(`${tool.name} 工具页面还在开发中，敬请期待！`)
    }, 500)
  } else {
    Message.warning(`${tool.name} 暂未配置页面路径`)
  }
}

const handleShowAllFavorites = () => {
  selectedCategory.value = 'favorites'
  Message.info('显示所有收藏的工具')
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
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
}

/* 防止背景滚动 */
.overflow-hidden {
  overflow: hidden;
}
</style> 
