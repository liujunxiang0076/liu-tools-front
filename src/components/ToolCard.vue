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
/* 基础卡片样式 */
.tool-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.tool-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--brand-gradient);
  opacity: 0;
  transition: var(--transition);
  z-index: 0;
}

.tool-card:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-4px);
  border-color: var(--primary-color);
}

.tool-card:hover::before {
  opacity: 0.02;
}

.tool-card.is-favorite {
  border-color: var(--error-color);
  background: linear-gradient(135deg, var(--card-bg) 0%, var(--category-design-bg) 100%);
}

.tool-card.is-favorite::before {
  background: var(--category-design-color);
  opacity: 0.03;
}

/* 网格视图样式 */
.tool-card--grid {
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 300px;
  position: relative;
}

.tool-card--grid .tool-icon-wrapper {
  margin-bottom: 20px;
  align-self: center;
}

.tool-card--grid .tool-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.tool-card--grid .tool-footer {
  margin-top: auto;
}

.tool-card--grid .tool-tags {
  margin-bottom: 16px;
}

.tool-card--grid .tool-actions {
  justify-content: center;
  gap: 8px;
}

/* 列表视图样式 */
.tool-card--list {
  padding: 20px 24px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  min-height: 120px;
  position: relative;
}

.tool-card--list .tool-icon-wrapper {
  flex-shrink: 0;
  margin-top: 4px;
}

.tool-card--list .tool-content {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.tool-card--list .tool-header {
  margin-bottom: 10px;
}

.tool-card--list .tool-description {
  margin-bottom: 16px;
}

.tool-card--list .tool-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
}

.tool-card--list .tool-tags {
  flex: 1;
}

.tool-card--list .tool-actions {
  flex-shrink: 0;
  gap: 8px;
}

/* 工具图标 - 增强版 */
.tool-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--primary-light) 100%);
  border-radius: var(--radius-2xl);
  position: relative;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

.tool-card:hover .tool-icon-wrapper {
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--category-efficiency-bg) 100%);
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.tool-icon {
  font-size: 36px;
  line-height: 1;
  transition: var(--transition);
}

.tool-card:hover .tool-icon {
  transform: scale(1.1);
}

/* 工具头部 - 增强版 */
.tool-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.tool-name {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
  flex: 1;
  transition: var(--transition);
  letter-spacing: -0.025em;
}

.tool-card:hover .tool-name {
  color: var(--primary-color);
}

.favorite-btn {
  opacity: 0;
  transition: var(--transition);
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-lg);
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  transform: scale(0.8);
}

.tool-card:hover .favorite-btn {
  opacity: 1;
  transform: scale(1);
}

.tool-card.is-favorite .favorite-btn {
  opacity: 1;
  background: var(--category-design-bg);
  border-color: var(--category-design-color);
  color: var(--category-design-color);
  transform: scale(1);
}

.favorite-btn:hover {
  background: var(--category-design-bg);
  border-color: var(--category-design-color);
  color: var(--category-design-color);
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

/* 工具描述 - 增强版 */
.tool-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.6;
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
  gap: 16px;
}

/* 标签区域 - 增强版 */
.tool-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.tool-tags .el-tag {
  font-size: var(--text-xs);
  height: 22px;
  line-height: 20px;
  padding: 0 8px;
  border-radius: var(--radius-md);
  border: none;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-weight: 500;
  transition: var(--transition);
}

.tool-tags .el-tag:hover {
  background: var(--primary-light);
  color: var(--primary-color);
  transform: scale(1.05);
}

.tool-tags .el-tag:nth-child(odd) {
  background: var(--category-efficiency-bg);
  color: var(--category-efficiency-color);
}

.tool-tags .el-tag:nth-child(even) {
  background: var(--category-development-bg);
  color: var(--category-development-color);
}

.more-tags {
  font-size: var(--text-xs);
  color: var(--text-muted);
  padding: 0 4px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  padding: 2px 6px;
}

/* 操作按钮 - 增强版 */
.tool-actions {
  display: flex;
  align-items: center;
}

.tool-actions .el-button {
  font-size: var(--text-xs);
  height: 32px;
  padding: 0 16px;
  border-radius: var(--radius-lg);
  font-weight: 500;
  transition: var(--transition);
  border: 1px solid var(--border-color);
  background: var(--card-bg);
}

.tool-actions .el-button--primary {
  background: var(--brand-gradient);
  border: none;
  color: white;
}

.tool-actions .el-button--primary:hover {
  background: var(--brand-gradient-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.tool-actions .el-button:not(.el-button--primary) {
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.tool-actions .el-button:not(.el-button--primary):hover {
  background: var(--primary-light);
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tool-card--grid {
    padding: 20px;
    height: 280px;
  }
  
  .tool-card--list {
    padding: 16px 20px;
    gap: 16px;
    min-height: 100px;
  }
  
  .tool-icon-wrapper {
    width: 56px;
    height: 56px;
  }
  
  .tool-icon {
    font-size: 32px;
  }
  
  .tool-name {
    font-size: var(--text-base);
  }
  
  .favorite-btn {
    width: 28px;
    height: 28px;
  }
  
  .tool-actions .el-button {
    font-size: var(--text-xs);
    height: 28px;
    padding: 0 12px;
  }
}

@media (max-width: 480px) {
  .tool-card--grid {
    padding: 16px;
    height: 260px;
  }
  
  .tool-card--list {
    padding: 12px 16px;
    gap: 12px;
  }
  
  .tool-icon-wrapper {
    width: 48px;
    height: 48px;
  }
  
  .tool-icon {
    font-size: 28px;
  }
  
  .tool-footer {
    margin-top: 12px;
  }
  
  .tool-card--grid .tool-footer {
    gap: 12px;
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
 