<template>
  <aside class="sidebar">
    <div class="sidebar-content">
      <!-- 分类导航 -->
      <div class="category-section">
        <h3 class="section-title">工具分类</h3>
        <nav class="category-nav">
          <div
            v-for="category in categoriesWithCount"
            :key="category.id"
            class="category-item"
            :class="{ active: selectedCategory === category.id }"
            @click="handleCategorySelect(category.id)"
          >
            <div class="category-main">
              <component
                :is="getCategoryIcon(category.icon)"
                class="category-icon"
                :style="{ color: category.color }"
              />
              <span class="category-name">{{ category.name }}</span>
            </div>
            <el-badge
              :value="category.count"
              class="category-badge"
              :type="selectedCategory === category.id ? 'primary' : 'info'"
            />
          </div>
        </nav>
      </div>

      <!-- 我的收藏 -->
      <div class="favorites-section">
        <div class="section-header">
          <h3 class="section-title">我的收藏</h3>
          <el-button
            v-if="favoriteTools.length > 0"
            text
            type="danger"
            size="small"
            @click="handleClearFavorites"
          >
            清空
          </el-button>
        </div>
        
        <div v-if="favoriteTools.length === 0" class="empty-favorites">
          <Heart class="empty-icon" />
          <p class="empty-text">暂无收藏工具</p>
          <p class="empty-hint">点击工具卡片上的心形图标收藏工具</p>
        </div>
        
        <div v-else class="favorites-list">
          <div
            v-for="tool in favoriteTools"
            :key="tool.id"
            class="favorite-item"
            @click="handleToolSelect(tool)"
          >
            <span class="tool-icon">{{ tool.icon }}</span>
            <div class="tool-info">
              <div class="tool-name">{{ tool.name }}</div>
              <div class="tool-category">{{ getCategoryName(tool.category) }}</div>
            </div>
            <el-button
              text
              type="danger"
              size="small"
              :icon="X"
              @click.stop="handleRemoveFromFavorites(tool.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
// Vue APIs 现在自动导入，无需手动导入
import {
  Grid,
  Palette,
  Code,
  Zap,
  FileText,
  Globe,
  Calculator,
  Image,
  Heart,
  X
} from 'lucide-vue-next'
import { Category, Tool } from '@/types'

// 定义组件名称
defineOptions({
  name: 'Sidebar'
})

interface Props {
  categoriesWithCount: Category[]
  selectedCategory: string
  favoriteTools: Tool[]
}

interface Emits {
  (e: 'category-select', categoryId: string): void
  (e: 'tool-select', tool: Tool): void
  (e: 'remove-favorite', toolId: number): void
  (e: 'clear-favorites'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 图标映射
const iconMap = {
  Grid,
  Palette,
  Code,
  Zap,
  FileText,
  Globe,
  Calculator,
  Image
}

// 获取分类图标组件
const getCategoryIcon = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || Grid
}

// 获取分类名称
const getCategoryName = (categoryId: string) => {
  const category = props.categoriesWithCount.find(cat => cat.id === categoryId)
  return category?.name || '未知分类'
}

// 处理分类选择
const handleCategorySelect = (categoryId: string) => {
  emit('category-select', categoryId)
}

// 处理工具选择
const handleToolSelect = (tool: Tool) => {
  emit('tool-select', tool)
}

// 处理从收藏中移除工具
const handleRemoveFromFavorites = (toolId: number) => {
  emit('remove-favorite', toolId)
}

// 处理清空收藏
const handleClearFavorites = () => {
  emit('clear-favorites')
}
</script>

<style scoped>
.sidebar {
  width: 264px;
  height: 100vh;
  background: var(--card-bg);
  border-right: 1px solid var(--border-color);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sidebar-content {
  height: 100%;
  overflow-y: auto;
  padding: 24px 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
  padding: 0 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  margin-bottom: 16px;
}

.section-header .section-title {
  margin-bottom: 0;
  padding: 0;
}

/* 分类导航样式 */
.category-section {
  margin-bottom: 32px;
}

.category-nav {
  display: flex;
  flex-direction: column;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  cursor: pointer;
  transition: var(--transition);
  border-left: 3px solid transparent;
}

.category-item:hover {
  background: var(--primary-light);
}

.category-item.active {
  background: var(--primary-light);
  border-left-color: var(--primary-color);
}

.category-main {
  display: flex;
  align-items: center;
  flex: 1;
}

.category-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.category-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.category-badge {
  margin-left: 8px;
}

.category-badge :deep(.el-badge__content) {
  font-size: 11px;
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  padding: 0 4px;
}

/* 收藏区域样式 */
.favorites-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.empty-favorites {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  text-align: center;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
}

.favorites-list {
  flex: 1;
  overflow-y: auto;
}

.favorite-item {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  cursor: pointer;
  transition: var(--transition);
}

.favorite-item:hover {
  background: var(--primary-light);
}

.tool-icon {
  font-size: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.tool-info {
  flex: 1;
  min-width: 0;
}

.tool-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.tool-category {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.favorite-item .el-button {
  opacity: 0;
  transition: opacity 0.2s ease;
  margin-left: 8px;
}

.favorite-item:hover .el-button {
  opacity: 1;
}

/* 滚动条样式 */
.sidebar-content::-webkit-scrollbar {
  width: 4px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 2px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 64px;
    height: calc(100vh - 64px);
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  .sidebar::before {
    content: '';
    position: fixed;
    top: 0;
    left: 264px;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: -1;
  }
}
</style> 
