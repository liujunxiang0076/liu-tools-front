<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- 如果是二维码页面，直接显示二维码组件 -->
    <QRCodeGenerator v-if="currentPage === 'qrcode'" />
    
    <!-- 如果是颜色选择器页面，直接显示颜色选择器组件 -->
    <ColorPicker v-else-if="currentPage === 'color-picker'" />
    
    <!-- 否则显示主界面 -->
    <template v-else>
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

import { categories, tools, getToolsByCategory } from '@/store/data'
import type { Tool } from '@/types'
// import { Message } from '@/utils/message' // 暂时移除消息提示

// 导入页面组件
import QRCodeGenerator from '@/views/QRCodeGenerator.vue'
import ColorPicker from '@/views/ColorPicker.vue'

// 响应式状态
const searchQuery = ref('')
const selectedCategory = ref('all')
const viewMode = ref<'grid' | 'list'>('grid')
const favoriteIds = ref<number[]>([])
const sidebarOpen = ref(false)
const showFavoritesModal = ref(false)
const currentPage = ref<string>('')

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
  // 根据工具路径决定显示的页面
  console.log('Selected tool:', tool)
  
  if (tool.path) {
    // 解析路径，提取页面名称
    const pageName = tool.path.split('/').pop()
    if (pageName === 'qrcode') {
      currentPage.value = 'qrcode'
    } else if (pageName === 'color-picker') {
      currentPage.value = 'color-picker'
    } else {
      // 其他工具页面还在开发中
      console.log(`${tool.name} 工具页面还在开发中`)
      // Message.info(`${tool.name} 工具页面还在开发中，敬请期待！`) // 暂时移除消息提示
    }
  } else {
    // Message.warning(`${tool.name} 暂未配置页面路径`) // 暂时移除消息提示
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
    // Message.success(`已取消收藏 ${tool.name}`) // 暂时移除消息提示
  }
}

const handleClearAllFavorites = () => {
  favoriteIds.value = []
  // Message.success('已清空所有收藏') // 暂时移除消息提示
}

// 切换侧边栏（移动端）
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// 返回主页面
const goBackToMain = () => {
  currentPage.value = ''
}

// 全局暴露goBackToMain方法给子组件使用
defineExpose({
  goBackToMain
})

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
