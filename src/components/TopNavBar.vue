<template>
  <header class="top-nav-bar">
    <div class="nav-content">
      <!-- Logo区域 -->
      <div class="logo-section">
        <Zap class="logo-icon" />
        <span class="logo-text">工具箱</span>
      </div>
      
      <!-- 搜索框 -->
      <div class="search-section">
        <el-input
          v-model="searchValue"
          placeholder="搜索工具名称、描述或标签"
          :prefix-icon="Search"
          class="search-input"
          clearable
          @input="handleSearch"
        />
      </div>
      
      <!-- 视图切换 -->
      <div class="view-section">
        <el-button-group>
          <el-button
            :type="viewType === 'grid' ? 'primary' : 'default'"
            :icon="Grid"
            @click="handleViewChange('grid')"
          />
          <el-button
            :type="viewType === 'list' ? 'primary' : 'default'"
            :icon="List"
            @click="handleViewChange('list')"
          />
        </el-button-group>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Vue APIs 现在自动导入，无需手动导入
import { Zap, Search, Grid, List } from 'lucide-vue-next'
import { ViewType } from '@/types'

// 定义组件名称
defineOptions({
  name: 'TopNavBar'
})

interface Props {
  viewType: ViewType
  searchKeyword: string
}

interface Emits {
  (e: 'view-change', viewType: ViewType): void
  (e: 'search', keyword: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchValue = ref(props.searchKeyword)

// 监听外部搜索关键词变化
watch(() => props.searchKeyword, (newValue) => {
  searchValue.value = newValue
})

// 处理搜索
const handleSearch = (value: string) => {
  emit('search', value)
}

// 处理视图切换
const handleViewChange = (viewType: ViewType) => {
  emit('view-change', viewType)
}
</script>

<style scoped>
.top-nav-bar {
  height: 64px;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.logo-section {
  display: flex;
  align-items: center;
  margin-right: 32px;
  min-width: 120px;
}

.logo-icon {
  width: 28px;
  height: 28px;
  color: var(--primary-color);
  margin-right: 8px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.search-section {
  flex: 1;
  max-width: 600px;
  margin: 0 32px;
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 20px;
  height: 40px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.search-input :deep(.el-input__wrapper):hover {
  border-color: var(--primary-color);
}

.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.view-section {
  min-width: 100px;
  display: flex;
  justify-content: flex-end;
}

.view-section :deep(.el-button-group .el-button) {
  border-radius: var(--radius-md);
}

.view-section :deep(.el-button-group .el-button:first-child) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.view-section :deep(.el-button-group .el-button:last-child) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-content {
    padding: 0 16px;
  }
  
  .logo-section {
    margin-right: 16px;
    min-width: 100px;
  }
  
  .logo-text {
    font-size: 18px;
  }
  
  .search-section {
    margin: 0 16px;
  }
  
  .view-section {
    min-width: 80px;
  }
}

@media (max-width: 480px) {
  .logo-text {
    display: none;
  }
  
  .logo-section {
    min-width: 40px;
    margin-right: 12px;
  }
  
  .search-section {
    margin: 0 12px;
  }
}</style> 
