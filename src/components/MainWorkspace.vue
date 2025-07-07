<template>
  <main class="main-workspace">
    <!-- 标题区域 -->
    <header class="workspace-header">
      <div class="header-content">
        <h2 class="section-title">
          {{ getCurrentCategoryName() }}
          <span class="tool-count">({{ filteredTools.length }})</span>
        </h2>
        
        <!-- 搜索结果提示 -->
        <div v-if="searchKeyword" class="search-info">
          <Search class="search-icon" />
          <span>搜索"{{ searchKeyword }}"的结果</span>
          <el-button text type="primary" @click="clearSearch">
            清除搜索
          </el-button>
        </div>
      </div>
    </header>

    <!-- 工具展示区 -->
    <div class="workspace-content">
      <!-- 空状态 -->
      <div v-if="filteredTools.length === 0" class="empty-state">
        <div class="empty-content">
          <component :is="getEmptyIcon()" class="empty-icon" />
          <h3 class="empty-title">{{ getEmptyTitle() }}</h3>
          <p class="empty-description">{{ getEmptyDescription() }}</p>
          <el-button
            v-if="searchKeyword"
            type="primary"
            @click="clearSearch"
          >
            清除搜索条件
          </el-button>
        </div>
      </div>

      <!-- 工具列表 -->
      <div
        v-else
        class="tools-container"
        :class="`tools-container--${viewType}`"
      >
        <ToolCard
          v-for="tool in filteredTools"
          :key="tool.id"
          :tool="tool"
          :view-type="viewType"
          :is-favorite="isFavorite(tool.id)"
          @tool-click="handleToolClick"
          @favorite-click="handleFavoriteClick"
          @use-click="handleUseClick"
          @detail-click="handleDetailClick"
        />
      </div>

      <!-- 加载更多按钮（预留分页功能） -->
      <div v-if="false" class="load-more">
        <el-button type="primary" plain size="large">
          加载更多工具
        </el-button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
// Vue APIs 现在自动导入，无需手动导入
import { Search, Package, AlertCircle, Inbox } from 'lucide-vue-next'
// ToolCard 组件现在自动导入，无需手动导入
import { Tool, Category, ViewType } from '@/types'

// 定义组件名称
defineOptions({
  name: 'MainWorkspace'
})

interface Props {
  filteredTools: Tool[]
  categories: Category[]
  selectedCategory: string
  searchKeyword: string
  viewType: ViewType
  isFavorite: (toolId: number) => boolean
}

interface Emits {
  (e: 'tool-click', tool: Tool): void
  (e: 'favorite-click', tool: Tool): void
  (e: 'use-click', tool: Tool): void
  (e: 'detail-click', tool: Tool): void
  (e: 'clear-search'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 获取当前分类名称
const getCurrentCategoryName = () => {
  if (props.selectedCategory === 'all') {
    return '全部工具'
  }
  const category = props.categories.find(cat => cat.id === props.selectedCategory)
  return category?.name || '未知分类'
}

// 获取空状态图标
const getEmptyIcon = () => {
  if (props.searchKeyword) {
    return Search
  }
  if (props.selectedCategory === 'all') {
    return Package
  }
  return Inbox
}

// 获取空状态标题
const getEmptyTitle = () => {
  if (props.searchKeyword) {
    return '未找到相关工具'
  }
  if (props.selectedCategory === 'all') {
    return '暂无工具'
  }
  return `暂无${getCurrentCategoryName()}`
}

// 获取空状态描述
const getEmptyDescription = () => {
  if (props.searchKeyword) {
    return '尝试使用其他关键词搜索，或者浏览其他分类的工具'
  }
  if (props.selectedCategory === 'all') {
    return '系统中还没有添加任何工具'
  }
  return `当前分类下暂时没有可用的工具，请尝试其他分类`
}

// 清除搜索
const clearSearch = () => {
  emit('clear-search')
}

// 处理工具点击
const handleToolClick = (tool: Tool) => {
  emit('tool-click', tool)
}

// 处理收藏点击
const handleFavoriteClick = (tool: Tool) => {
  emit('favorite-click', tool)
}

// 处理使用点击
const handleUseClick = (tool: Tool) => {
  emit('use-click', tool)
}

// 处理详情点击
const handleDetailClick = (tool: Tool) => {
  emit('detail-click', tool)
}
</script>

<style scoped>
.main-workspace {
  flex: 1;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
}

/* 标题区域 */
.workspace-header {
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  padding: 20px 32px;
  flex-shrink: 0;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tool-count {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-muted);
}

.search-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--primary-light);
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--primary-color);
}

.search-icon {
  width: 16px;
  height: 16px;
}

/* 工作区内容 */
.workspace-content {
  flex: 1;
  overflow-y: auto;
  position: relative;
}

/* 空状态 */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  padding: 40px;
}

.empty-content {
  text-align: center;
  max-width: 400px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: var(--text-muted);
  margin: 0 auto 24px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 12px 0;
}

.empty-description {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0 0 24px 0;
}

/* 工具容器 */
.tools-container {
  padding: 24px 32px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 网格布局 */
.tools-container--grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

/* 列表布局 */
.tools-container--list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 加载更多 */
.load-more {
  display: flex;
  justify-content: center;
  padding: 32px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .tools-container--grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .workspace-header {
    padding: 16px 20px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .tool-count {
    font-size: 16px;
  }
  
  .tools-container {
    padding: 20px;
  }
  
  .tools-container--grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .tools-container--list {
    gap: 12px;
  }
  
  .empty-state {
    min-height: 300px;
    padding: 20px;
  }
  
  .empty-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
  }
  
  .empty-title {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .workspace-header {
    padding: 12px 16px;
  }
  
  .section-title {
    font-size: 18px;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .tools-container {
    padding: 16px;
  }
  
  .search-info {
    flex-wrap: wrap;
  }
}

/* 滚动条样式 */
.workspace-content::-webkit-scrollbar {
  width: 8px;
}

.workspace-content::-webkit-scrollbar-track {
  background: var(--bg-color);
}

.workspace-content::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

.workspace-content::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* 平滑滚动 */
.workspace-content {
  scroll-behavior: smooth;
}

/* 工具卡片进入动画 */
.tools-container--grid .tool-card,
.tools-container--list .tool-card {
  animation: fadeInUp 0.4s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 为不同的卡片添加延迟动画 */
.tool-card:nth-child(1) { animation-delay: 0.1s; }
.tool-card:nth-child(2) { animation-delay: 0.2s; }
.tool-card:nth-child(3) { animation-delay: 0.3s; }
.tool-card:nth-child(4) { animation-delay: 0.4s; }
.tool-card:nth-child(5) { animation-delay: 0.5s; }
.tool-card:nth-child(6) { animation-delay: 0.6s; }
</style> 
