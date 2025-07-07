<template>
  <div
    class="tool-card"
    :class="[`tool-card--${viewType}`, { 'is-favorite': isFavorite }]"
    @click="handleToolClick"
  >
    <!-- 工具图标 -->
    <div class="tool-icon-wrapper">
      <span class="tool-icon">{{ tool.icon }}</span>
    </div>
    
    <!-- 工具信息 -->
    <div class="tool-content">
      <div class="tool-header">
        <h3 class="tool-name">{{ tool.name }}</h3>
        <el-button
          class="favorite-btn"
          :type="isFavorite ? 'danger' : 'default'"
          :icon="Heart"
          circle
          size="small"
          @click.stop="handleFavoriteClick"
        />
      </div>
      
      <p class="tool-description">{{ tool.description }}</p>
      
      <div class="tool-footer">
        <div class="tool-tags">
          <el-tag
            v-for="tag in tool.tags.slice(0, viewType === 'grid' ? 3 : 6)"
            :key="tag"
            size="small"
            effect="plain"
          >
            {{ tag }}
          </el-tag>
          <span
            v-if="tool.tags.length > (viewType === 'grid' ? 3 : 6)"
            class="more-tags"
          >
            +{{ tool.tags.length - (viewType === 'grid' ? 3 : 6) }}
          </span>
        </div>
        
        <div class="tool-actions">
          <el-button
            type="primary"
            size="small"
            @click.stop="handleUseClick"
          >
            立即使用
          </el-button>
          <el-button
            size="small"
            @click.stop="handleDetailClick"
          >
            详情
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Heart } from 'lucide-vue-next'
import { Tool, ViewType } from '@/types'

// 定义组件名称
defineOptions({
  name: 'ToolCard'
})

interface Props {
  tool: Tool
  viewType: ViewType
  isFavorite: boolean
}

interface Emits {
  (e: 'tool-click', tool: Tool): void
  (e: 'favorite-click', tool: Tool): void
  (e: 'use-click', tool: Tool): void
  (e: 'detail-click', tool: Tool): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 处理工具点击
const handleToolClick = () => {
  emit('tool-click', props.tool)
}

// 处理收藏点击
const handleFavoriteClick = () => {
  emit('favorite-click', props.tool)
}

// 处理使用点击
const handleUseClick = () => {
  emit('use-click', props.tool)
}

// 处理详情点击
const handleDetailClick = () => {
  emit('detail-click', props.tool)
}
</script>

<style scoped>
.tool-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  transition: var(--transition);
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.tool-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
  border-color: var(--primary-color);
}

.tool-card.is-favorite {
  border-color: var(--error-color);
}

/* 网格视图样式 */
.tool-card--grid {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 280px;
}

.tool-card--grid .tool-icon-wrapper {
  margin-bottom: 16px;
  align-self: center;
}

.tool-card--grid .tool-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tool-card--grid .tool-footer {
  margin-top: auto;
}

.tool-card--grid .tool-tags {
  margin-bottom: 12px;
}

.tool-card--grid .tool-actions {
  justify-content: center;
  gap: 8px;
}

/* 列表视图样式 */
.tool-card--list {
  padding: 16px 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  min-height: 100px;
}

.tool-card--list .tool-icon-wrapper {
  flex-shrink: 0;
  margin-top: 4px;
}

.tool-card--list .tool-content {
  flex: 1;
  min-width: 0;
}

.tool-card--list .tool-header {
  margin-bottom: 8px;
}

.tool-card--list .tool-description {
  margin-bottom: 12px;
}

.tool-card--list .tool-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
}

.tool-card--list .tool-tags {
  flex: 1;
}

.tool-card--list .tool-actions {
  flex-shrink: 0;
  gap: 8px;
}

/* 工具图标 */
.tool-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--primary-light), var(--secondary-color)opacity(0.1));
  border-radius: var(--radius-xl);
  position: relative;
}

.tool-icon {
  font-size: 32px;
  line-height: 1;
}

/* 工具头部 */
.tool-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.tool-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
  flex: 1;
}

.favorite-btn {
  opacity: 0;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
}

.tool-card:hover .favorite-btn {
  opacity: 1;
}

.tool-card.is-favorite .favorite-btn {
  opacity: 1;
}

/* 工具描述 */
.tool-description {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tool-card--list .tool-description {
  -webkit-line-clamp: 1;
}

/* 工具底部 */
.tool-footer {
  margin-top: 16px;
}

.tool-card--grid .tool-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 标签区域 */
.tool-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.tool-tags .el-tag {
  font-size: 11px;
  height: 20px;
  line-height: 18px;
  padding: 0 6px;
  border-radius: var(--radius-sm);
}

.more-tags {
  font-size: 11px;
  color: var(--text-muted);
  padding: 0 4px;
}

/* 操作按钮 */
.tool-actions {
  display: flex;
  align-items: center;
}

.tool-actions .el-button {
  font-size: 12px;
  height: 28px;
  padding: 0 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tool-card--grid {
    height: auto;
    min-height: 240px;
    padding: 16px;
  }
  
  .tool-card--list {
    padding: 12px 16px;
    flex-direction: column;
    align-items: stretch;
  }
  
  .tool-card--list .tool-icon-wrapper {
    align-self: flex-start;
    margin-bottom: 12px;
  }
  
  .tool-card--list .tool-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .tool-card--list .tool-actions {
    justify-content: center;
  }
  
  .tool-name {
    font-size: 16px;
  }
  
  .tool-icon-wrapper {
    width: 48px;
    height: 48px;
  }
  
  .tool-icon {
    font-size: 28px;
  }
}

/* 动画效果 */
@keyframes favoriteAdd {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.tool-card.is-favorite .favorite-btn {
  animation: favoriteAdd 0.3s ease;
}

/* 深色模式支持预留 */
@media (prefers-color-scheme: dark) {
  .tool-card {
    background: #1f2937;
    border-color: #374151;
  }
  
  .tool-icon-wrapper {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  }
}
</style> 
