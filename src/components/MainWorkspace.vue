<template>
  <div class="flex-1 flex flex-col bg-base-200 min-h-0 relative">
    <!-- 工作区头部 -->
    <div class="bg-base-100 border-b border-base-300 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-base-content">
            {{ getCurrentCategoryName() }}
          </h1>
          <p class="text-sm text-base-content/60 mt-1">
            找到 {{ getFilteredTools().length }} 个工具
            {{ searchQuery ? `· 搜索 '${searchQuery}'` : '' }}
          </p>
        </div>
        
        <!-- 排序选择 -->
        <div class="flex items-center gap-3">
          <label class="text-sm text-base-content/70 font-medium">排序:</label>
          <select 
            v-model="sortBy" 
            class="select select-sm select-bordered bg-base-100"
          >
            <option value="default">默认排序</option>
            <option value="name">按名称</option>
            <option value="category">按分类</option>
            <option value="updated">最近更新</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 工具展示区域 -->
    <div class="flex-1 overflow-y-auto p-6">
      <!-- 有工具时显示 -->
      <div v-if="getFilteredTools().length > 0">
        <!-- 网格视图 -->
        <div v-if="viewMode === 'grid'" class="tools-grid">
          <ToolCard
            v-for="tool in getSortedTools()"
            :key="tool.id"
            :tool="tool"
            :is-favorite="isFavorite(tool.id)"
            @favorite-toggle="handleFavoriteToggle"
            @tool-use="handleToolUse"
            @tool-details="handleToolDetails"
            @tool-click="handleToolDetails"
          />
        </div>

        <!-- 列表视图 -->
        <div v-else class="tools-list">
          <div 
            v-for="tool in getSortedTools()"
            :key="tool.id"
            class="tool-list-item"
            @click="handleToolDetails(tool)"
          >
            <!-- 收藏按钮 -->
            <button 
              @click.stop="handleFavoriteToggle(tool)"
              :class="['favorite-btn', { 'favorited': isFavorite(tool.id) }]"
              :title="isFavorite(tool.id) ? '取消收藏' : '添加收藏'"
            >
              <svg 
                class="w-4 h-4" 
                :fill="isFavorite(tool.id) ? 'currentColor' : 'none'" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            <div class="flex items-center gap-4">
              <!-- 工具图标 -->
              <div class="flex-shrink-0">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl">
                  {{ tool.icon }}
                </div>
              </div>
              
              <!-- 工具信息 -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-semibold text-base-content truncate">
                    {{ tool.name }}
                  </h3>
                  <div :class="['category-tag', tool.category, 'flex-shrink-0']">
                    {{ getCategoryName(tool.category) }}
                  </div>
                </div>
                
                <p class="text-sm text-base-content/70 line-clamp-2 mb-2">
                  {{ tool.description }}
                </p>
                
                <!-- 标签 -->
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="tag in tool.tags.slice(0, 4)" 
                    :key="tag"
                    class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-base-200 text-base-content/60"
                  >
                    {{ tag }}
                  </span>
                  <span 
                    v-if="tool.tags.length > 4"
                    class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-base-200 text-base-content/40"
                  >
                    +{{ tool.tags.length - 4 }}
                  </span>
                </div>
              </div>
              
              <!-- 操作按钮 -->
              <div class="flex items-center gap-2 flex-shrink-0">
                <!-- 使用按钮 -->
                <button 
                  @click.stop="handleToolUse(tool)"
                  class="action-btn primary"
                >
                  立即使用
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态显示 -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <h3 class="empty-title">
          {{ searchQuery ? '没有找到匹配的工具' : '该分类暂无工具' }}
        </h3>
        <p class="empty-description">
          {{ searchQuery 
            ? `尝试使用其他关键词搜索，或浏览其他分类的工具` 
            : '请选择其他分类查看可用工具，或尝试搜索功能'
          }}
        </p>
        <div v-if="searchQuery" class="mt-4">
          <button 
            @click="handleClearSearch"
            class="action-btn secondary"
          >
            清除搜索
          </button>
        </div>
      </div>
    </div>

    <!-- 工具详情面板 -->
    <ToolDetailPanel
      :tool="selectedTool"
      :is-open="showDetailPanel"
      :is-favorite="selectedTool ? isFavorite(selectedTool.id) : false"
      @close="handleDetailPanelClose"
      @tool-use="handleToolUse"
      @favorite-toggle="handleFavoriteToggle"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Tool } from '@/types'
import ToolCard from './ToolCard.vue'
import ToolDetailPanel from './ToolDetailPanel.vue'
import { categories, tools, getToolsByCategory, searchTools } from '@/store/data'
import { Message } from '@/utils/message'

// Props
const props = defineProps<{
  selectedCategory: string
  searchQuery: string
  viewMode: 'grid' | 'list'
  favoriteIds: number[]
}>()

// Emits
const emit = defineEmits<{
  'update:favoriteIds': [ids: number[]]
  'update:searchQuery': [query: string]
  'tool-select': [tool: Tool]
}>()

// 响应式状态
const sortBy = ref<'default' | 'name' | 'category' | 'updated'>('default')
const selectedTool = ref<Tool | null>(null)
const showDetailPanel = ref(false)

// 排序方式
const getCurrentCategoryName = (): string => {
  if (props.selectedCategory === 'all') {
    return '全部工具'
  }
  const category = categories.find(c => c.id === props.selectedCategory)
  return category?.name || '未知分类'
}

// 获取分类名称
const getCategoryName = (categoryId: string): string => {
  const category = categories.find(c => c.id === categoryId)
  return category?.name || '其他'
}

// 获取筛选后的工具
const getFilteredTools = (): Tool[] => {
  let filteredTools: Tool[] = []
  
  if (props.searchQuery.trim()) {
    // 如果有搜索关键词，搜索所有工具
    filteredTools = searchTools(props.searchQuery)
  } else {
    // 否则按分类筛选
    filteredTools = getToolsByCategory(props.selectedCategory)
  }
  
  return filteredTools
}

// 获取排序后的工具
const getSortedTools = (): Tool[] => {
  const filtered = getFilteredTools()
  
  switch (sortBy.value) {
    case 'name':
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    case 'category':
      return [...filtered].sort((a, b) => a.category.localeCompare(b.category))
    case 'updated':
      return [...filtered].sort((a, b) => b.id - a.id) // 简单按ID倒序，实际应该按更新时间
    default:
      return filtered
  }
}

// 检查工具是否已收藏
const isFavorite = (toolId: number): boolean => {
  return props.favoriteIds.includes(toolId)
}

// 处理收藏切换
const handleFavoriteToggle = (tool: Tool) => {
  const currentFavorites = [...props.favoriteIds]
  const index = currentFavorites.indexOf(tool.id)
  
  if (index > -1) {
    // 取消收藏
    currentFavorites.splice(index, 1)
    Message.success(`已取消收藏 ${tool.name}`)
  } else {
    // 添加收藏
    currentFavorites.push(tool.id)
    Message.success(`已收藏 ${tool.name}`)
  }
  
  emit('update:favoriteIds', currentFavorites)
}

// 处理工具使用
const handleToolUse = (tool: Tool) => {
  // 这里可以添加使用统计等逻辑
  emit('tool-select', tool)
  Message.info(`正在打开 ${tool.name}...`)
}

// 处理工具详情
const handleToolDetails = (tool: Tool) => {
  selectedTool.value = tool
  showDetailPanel.value = true
}

// 处理工具点击
const handleToolClick = (tool: Tool) => {
  emit('tool-select', tool)
}

// 清除搜索
const handleClearSearch = () => {
  emit('update:searchQuery', '')
}

// 处理详情面板关闭
const handleDetailPanelClose = () => {
  showDetailPanel.value = false
  selectedTool.value = null
}
</script>

<script lang="ts">
export default {
  name: 'MainWorkspace'
}
</script>

<style scoped>
/* 列表视图的行裁剪 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .flex-1 {
    padding: 1rem;
  }
  
  .tools-grid {
    gap: 1rem;
  }
}
</style> 
 