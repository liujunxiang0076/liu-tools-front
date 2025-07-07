<template>
  <div class="main-layout">
    <!-- 顶部导航栏 -->
    <TopNavBar
      :view-type="store.state.viewType"
      :search-keyword="store.state.searchKeyword"
      @view-change="handleViewChange"
      @search="handleSearch"
    />

    <div class="layout-content">
      <!-- 侧边栏 -->
      <Sidebar
        :categories-with-count="store.getters.categoriesWithCount.value"
        :selected-category="store.state.selectedCategory"
        :favorite-tools="store.getters.favoriteTools.value"
        @category-select="handleCategorySelect"
        @tool-select="handleToolSelect"
        @remove-favorite="handleRemoveFromFavorites"
        @clear-favorites="handleClearFavorites"
      />

      <!-- 主工作区 -->
      <MainWorkspace
        :filtered-tools="store.getters.filteredTools.value"
        :categories="store.state.categories"
        :selected-category="store.state.selectedCategory"
        :search-keyword="store.state.searchKeyword"
        :view-type="store.state.viewType"
        :is-favorite="store.getters.isFavorite"
        @tool-click="handleToolClick"
        @favorite-click="handleFavoriteClick"
        @use-click="handleUseClick"
        @detail-click="handleDetailClick"
        @clear-search="handleClearSearch"
      />
    </div>

    <!-- 移动端遮罩层 -->
    <div
      v-if="mobileState.showOverlay"
      class="mobile-overlay"
      @click="closeMobileSidebar"
    />
  </div>
</template>

<script setup lang="ts">
// 定义组件名称
defineOptions({
  name: 'MainLayout'
})

import { useStore } from '@/store'
import { Tool, ViewType } from '@/types'
import { MobileLayoutState } from '@/types/layout'

// 使用状态管理
const store = useStore()

// 移动端布局状态
const mobileState = reactive<MobileLayoutState>({
  showOverlay: false,
  sidebarExpanded: false
})

// 处理视图切换
const handleViewChange = (viewType: ViewType) => {
  store.actions.setViewType(viewType)
}

// 处理搜索
const handleSearch = (keyword: string) => {
  store.actions.setSearchKeyword(keyword)
}

// 处理分类选择
const handleCategorySelect = (categoryId: string) => {
  store.actions.setSelectedCategory(categoryId)
  // 移动端自动关闭侧边栏
  if (window.innerWidth <= 768) {
    closeMobileSidebar()
  }
}

// 处理工具选择（从侧边栏收藏列表）
const handleToolSelect = (tool: Tool) => {
  store.actions.showToolDetail(tool)
}

// 处理工具点击
const handleToolClick = (tool: Tool) => {
  // 可以在这里添加工具点击的通用逻辑
  console.log('工具点击:', tool.name)
}

// 处理收藏点击
const handleFavoriteClick = (tool: Tool) => {
  store.actions.toggleFavorite(tool.id)
  
  // 显示提示消息
  const isFavorite = store.getters.isFavorite(tool.id)
  ElMessage({
    message: isFavorite ? `已收藏 ${tool.name}` : `已取消收藏 ${tool.name}`,
    type: isFavorite ? 'success' : 'info',
    duration: 2000
  })
}

// 处理使用工具
const handleUseClick = (tool: Tool) => {
  // 这里可以实现路由跳转到具体工具页面
  console.log('使用工具:', tool.name)
  ElMessage({
    message: `即将打开 ${tool.name}`,
    type: 'info'
  })
  
  // 示例：如果有路由，可以这样跳转
  // router.push(tool.path || `/tool/${tool.id}`)
}

// 处理工具详情
const handleDetailClick = (tool: Tool) => {
  store.actions.showToolDetail(tool)
  ElMessage({
    message: `查看 ${tool.name} 详情`,
    type: 'info'
  })
}

// 处理从收藏中移除
const handleRemoveFromFavorites = (toolId: number) => {
  const tool = store.actions.getToolById(toolId)
  store.actions.removeFromFavorites(toolId)
  
  if (tool) {
    ElMessage({
      message: `已从收藏中移除 ${tool.name}`,
      type: 'info'
    })
  }
}

// 处理清空收藏
const handleClearFavorites = () => {
  ElMessageBox.confirm(
    '确定要清空所有收藏吗？',
    '确认操作',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    store.actions.clearFavorites()
    ElMessage({
      message: '已清空所有收藏',
      type: 'success'
    })
  }).catch(() => {
    // 用户取消操作
  })
}

// 处理清除搜索
const handleClearSearch = () => {
  store.actions.setSearchKeyword('')
  store.actions.setSelectedCategory('all')
}

// 关闭移动端侧边栏
const closeMobileSidebar = () => {
  mobileState.showOverlay = false
  mobileState.sidebarExpanded = false
}

// 处理移动端侧边栏切换
const toggleMobileSidebar = () => {
  mobileState.showOverlay = !mobileState.showOverlay
  mobileState.sidebarExpanded = !mobileState.sidebarExpanded
}

// 监听窗口大小变化
const handleResize = () => {
  if (window.innerWidth > 768) {
    mobileState.showOverlay = false
    mobileState.sidebarExpanded = false
  }
}

// 暴露方法给父组件
defineExpose({
  toggleMobileSidebar,
  closeMobileSidebar
})

// 组件挂载时的初始化
onMounted(() => {
  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize)
})

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.layout-content {
  flex: 1;
  display: flex;
  height: calc(100vh - 64px);
  overflow: hidden;
}

/* 移动端遮罩层 */
.mobile-overlay {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .layout-content {
    height: calc(100vh - 64px);
  }
}

/* Element Plus 组件样式调整 */
:deep(.el-message) {
  z-index: 3000;
}

:deep(.el-button--primary) {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

:deep(.el-button--primary:hover) {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
}
</style> 
