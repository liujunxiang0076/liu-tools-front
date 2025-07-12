<template>
  <nav class="toolbar fade-in">
    <!-- Logo 品牌区域 -->
    <div class="navbar-start">
      <div class="flex items-center gap-4">
        <!-- 移动端菜单按钮 -->
        <div class="dropdown lg:hidden">
          <div 
            @click="handleMobileMenuToggle"
            tabindex="0" 
            role="button" 
            class="btn btn-ghost btn-circle"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
            </svg>
          </div>
        </div>
        
        <!-- Logo 容器 -->
        <div class="logo-container">
          <!-- 32x32像素闪电图标Logo -->
          <div class="logo-icon">
            ⚡
          </div>
          <div class="hidden sm:flex flex-col">
            <h1 class="logo-text">工具箱</h1>
            <span class="logo-subtitle">专业在线工具集合</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 中间搜索区域 - 最大宽度512px -->
    <div class="navbar-center flex-1 max-w-[512px] mx-8">
      <div class="form-control w-full">
        <div class="relative">
          <!-- 搜索图标在左侧内部，距离左边16像素 -->
          <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40 pointer-events-none">
            <svg v-if="!isSearching" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <!-- 搜索加载动画 -->
            <div v-else class="w-5 h-5 animate-spin">
              <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
          </div>
          
          <input 
            ref="searchInputRef"
            type="text" 
            :value="searchQuery" 
            @input="handleSearchInput"
            @keydown.enter="handleSearchEnter"
            @keydown.escape="handleSearchEscape"
            @focus="handleSearchFocus"
            @blur="handleSearchBlur"
            placeholder="搜索工具..." 
            class="search-input"
            autocomplete="off"
            spellcheck="false"
          />
          
          <!-- 清空按钮 - 增大点击区域 -->
          <button 
            v-if="searchQuery.trim()"
            @click="handleClearSearch"
            class="search-clear-button"
            title="清空搜索"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- 搜索建议下拉框 -->
        <div 
          v-if="showSuggestions && searchSuggestions.length > 0"
          class="search-suggestions-dropdown"
        >
          <div 
            v-for="(suggestion, index) in searchSuggestions"
            :key="index"
            @click="handleSuggestionClick(suggestion)"
            class="search-suggestion-item"
          >
            <svg class="w-5 h-5 text-base-content/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span class="text-base text-base-content font-medium">{{ suggestion }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧控制区 -->
    <div class="navbar-end">
      <div class="flex items-center gap-3">
        <!-- 视图切换按钮组 -->
        <div class="view-toggle">
          <!-- 网格视图按钮 -->
          <button 
            @click="emit('update:viewMode', 'grid')" 
            :class="['view-toggle-btn', { 'active': viewMode === 'grid' }]"
            title="网格视图"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <!-- 列表视图按钮 -->
          <button 
            @click="emit('update:viewMode', 'list')" 
            :class="['view-toggle-btn', { 'active': viewMode === 'list' }]"
            title="列表视图"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- 主题切换按钮 -->
        <button 
          @click="toggleDarkMode" 
          class="btn btn-ghost btn-circle" 
          :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
        >
          <!-- 浅色模式显示月亮图标 -->
          <svg v-if="!isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <!-- 深色模式显示太阳图标 -->
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick, onBeforeUnmount } from 'vue'
import { tools } from '@/store/data'

// Props
const props = defineProps<{
  searchQuery: string
  viewMode: 'grid' | 'list'
  sidebarOpen?: boolean
}>()

// Emits
const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:viewMode': [mode: 'grid' | 'list']
  'toggle-sidebar': []
}>()

// 搜索相关状态
const searchInputRef = ref<HTMLInputElement>()
const isSearching = ref(false)
const showSuggestions = ref(false)
const searchTimeout = ref<NodeJS.Timeout>()

// 深色模式状态
const isDark = ref(false)

// 搜索建议
const searchSuggestions = computed(() => {
  if (!props.searchQuery.trim()) return []
  
  const query = props.searchQuery.toLowerCase()
  const suggestions = new Set<string>()
  
  // 从工具名称中提取建议
  tools.forEach(tool => {
    if (tool.name.toLowerCase().includes(query)) {
      suggestions.add(tool.name)
    }
    // 从标签中提取建议
    tool.tags.forEach(tag => {
      if (tag.toLowerCase().includes(query)) {
        suggestions.add(tag)
      }
    })
  })
  
  return Array.from(suggestions).slice(0, 5)
})

// 初始化主题状态
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  let currentTheme = 'light'
  if (savedTheme) {
    currentTheme = savedTheme
  } else if (prefersDark) {
    currentTheme = 'dark'
  }
  
  isDark.value = currentTheme === 'dark'
  
  // 监听主题变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        const theme = document.documentElement.getAttribute('data-theme')
        isDark.value = theme === 'dark'
      }
    })
  })
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  })
  
  // 监听系统主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      isDark.value = e.matches
    }
  })
}

// 切换深色模式
const toggleDarkMode = () => {
  const newTheme = isDark.value ? 'light' : 'dark'
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
}

// 防抖处理搜索输入
const debouncedSearch = (value: string) => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  isSearching.value = true
  
  searchTimeout.value = setTimeout(() => {
    emit('update:searchQuery', value)
    isSearching.value = false
  }, 300) // 300ms 防抖延迟
}

// 处理搜索输入
const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // 立即更新本地显示
  debouncedSearch(value)
}

// 处理回车键搜索
const handleSearchEnter = (event: KeyboardEvent) => {
  event.preventDefault()
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  const target = event.target as HTMLInputElement
  emit('update:searchQuery', target.value)
  isSearching.value = false
  showSuggestions.value = false
  
  // 失去焦点
  target.blur()
}

// 处理ESC键清空搜索
const handleSearchEscape = (event: KeyboardEvent) => {
  event.preventDefault()
  handleClearSearch()
}

// 处理搜索框获得焦点
const handleSearchFocus = () => {
  showSuggestions.value = true
}

// 处理搜索框失去焦点
const handleSearchBlur = () => {
  // 延迟隐藏建议，允许点击建议项
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

// 处理建议点击
const handleSuggestionClick = (suggestion: string) => {
  emit('update:searchQuery', suggestion)
  showSuggestions.value = false
  
  // 重新聚焦到搜索框
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

// 清空搜索
const handleClearSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  emit('update:searchQuery', '')
  isSearching.value = false
  showSuggestions.value = false
  
  // 重新聚焦到搜索框
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

// 处理移动端菜单切换
const handleMobileMenuToggle = () => {
  emit('toggle-sidebar')
}

// 监听点击外部隐藏建议
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.navbar-center')) {
    showSuggestions.value = false
  }
}

// 组件挂载时恢复主题设置
onMounted(() => {
  initializeTheme()
  
  // 添加全局点击事件监听
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时清理
onBeforeUnmount(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  document.removeEventListener('click', handleClickOutside)
})
</script>

<script lang="ts">
export default {
  name: 'TopNavBar'
}
</script>

<style scoped>
/* 组件特定样式可以在这里添加 */
</style>
