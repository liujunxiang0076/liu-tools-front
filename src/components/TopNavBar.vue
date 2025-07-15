<template>
  <nav class="navbar toolbar fade-in">
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

    <!-- 中间搜索区域 -->
    <div class="navbar-center">
      <div class="form-control w-full max-w-xs relative">
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
            v-model="localSearchQuery" 
            @input="handleSearchInput"
            @keydown="handleKeyDown"
            @focus="handleSearchFocus"
            @blur="handleSearchBlur"
            placeholder="搜索工具..." 
            class="search-input"
            autocomplete="off"
            spellcheck="false"
          />
          
          <!-- 清空按钮 - 增大点击区域 -->
          <button 
            v-if="localSearchQuery.trim()"
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
          v-if="showSuggestions && localSuggestions.length > 0"
          class="search-suggestions-dropdown"
        >
          <div 
            v-for="(suggestion, index) in localSuggestions"
            :key="index"
            @click="handleSuggestionClick(suggestion)"
            @mouseenter="selectedSuggestionIndex = index"
            :class="[
              'search-suggestion-item',
              { 'highlighted': index === selectedSuggestionIndex }
            ]"
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
const selectedSuggestionIndex = ref(-1) // 新增：当前选中的建议索引

// 深色模式状态
const isDark = ref(false)

// 搜索建议
const searchSuggestions = computed(() => {
  if (!props.searchQuery.trim()) return []
  
  const query = props.searchQuery.toLowerCase()
  const suggestions = new Set<string>()
  
  // 优化搜索逻辑：优先匹配工具名称，然后匹配标签
  const toolNameMatches = new Set<string>()
  const tagMatches = new Set<string>()
  
  tools.forEach(tool => {
    // 工具名称匹配 - 优先级更高
    if (tool.name.toLowerCase().includes(query)) {
      toolNameMatches.add(tool.name)
    }
    
    // 标签匹配 - 优先级较低，且排除已在工具名称中的
    tool.tags.forEach(tag => {
      if (tag.toLowerCase().includes(query) && !toolNameMatches.has(tag)) {
        tagMatches.add(tag)
      }
    })
  })
  
  // 合并结果：工具名称优先，然后是标签
  const finalSuggestions = [
    ...Array.from(toolNameMatches).slice(0, 3), // 最多3个工具名称
    ...Array.from(tagMatches).slice(0, 2)       // 最多2个标签
  ]
  
  return finalSuggestions.slice(0, 5) // 总共最多5个建议
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

// 本地搜索建议状态 - 立即响应
const localSearchQuery = ref('')

// 同步props变化到本地状态
watch(() => props.searchQuery, (newValue) => {
  if (localSearchQuery.value !== newValue) {
    localSearchQuery.value = newValue
  }
}, { immediate: true })

const localSuggestions = computed(() => {
  if (!localSearchQuery.value.trim()) return []
  
  const query = localSearchQuery.value.toLowerCase()
  const suggestions = new Set<string>()
  
  // 优化搜索逻辑：优先匹配工具名称，然后匹配标签
  const toolNameMatches = new Set<string>()
  const tagMatches = new Set<string>()
  
  tools.forEach(tool => {
    // 工具名称匹配 - 优先级更高
    if (tool.name.toLowerCase().includes(query)) {
      toolNameMatches.add(tool.name)
    }
    
    // 标签匹配 - 优先级较低，且排除已在工具名称中的
    tool.tags.forEach(tag => {
      if (tag.toLowerCase().includes(query) && !toolNameMatches.has(tag)) {
        tagMatches.add(tag)
      }
    })
  })
  
  // 合并结果：工具名称优先，然后是标签
  const finalSuggestions = [
    ...Array.from(toolNameMatches).slice(0, 3), // 最多3个工具名称
    ...Array.from(tagMatches).slice(0, 2)       // 最多2个标签
  ]
  
  return finalSuggestions.slice(0, 5) // 总共最多5个建议
})

// 监听localSuggestions变化，重置选中索引
watch(localSuggestions, () => {
  selectedSuggestionIndex.value = -1
})

// 防抖处理搜索输入 - 减少延迟，避免删除冲突
const debouncedSearch = (value: string) => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  isSearching.value = true
  
  searchTimeout.value = setTimeout(() => {
    // 只有当本地状态和要更新的值一致时才更新父组件状态
    if (localSearchQuery.value === value) {
      emit('update:searchQuery', value)
    }
    isSearching.value = false
  }, 150) // 减少到150ms防抖延迟
}

// 处理搜索输入 - v-model已自动更新localSearchQuery
const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // 防抖更新父组件状态
  debouncedSearch(value)
}

// 新增：处理键盘事件 - 支持上下键导航和回车选择
const handleKeyDown = (event: KeyboardEvent) => {
  // 只在显示建议时处理键盘导航
  if (!showSuggestions.value || localSuggestions.value.length === 0) {
    // 如果没有建议，按原有逻辑处理
    if (event.key === 'Enter') {
      handleSearchEnter(event)
    } else if (event.key === 'Escape') {
      handleSearchEscape(event)
    }
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedSuggestionIndex.value = 
        selectedSuggestionIndex.value < localSuggestions.value.length - 1 
          ? selectedSuggestionIndex.value + 1 
          : 0 // 循环到第一个
      break
      
    case 'ArrowUp':
      event.preventDefault()
      selectedSuggestionIndex.value = 
        selectedSuggestionIndex.value > 0 
          ? selectedSuggestionIndex.value - 1 
          : localSuggestions.value.length - 1 // 循环到最后一个
      break
      
    case 'Enter':
      event.preventDefault()
      if (selectedSuggestionIndex.value >= 0 && selectedSuggestionIndex.value < localSuggestions.value.length) {
        // 选择当前高亮的建议
        const selectedSuggestion = localSuggestions.value[selectedSuggestionIndex.value]
        handleSuggestionClick(selectedSuggestion)
      } else {
        // 没有选中建议时，使用当前输入值搜索
        handleSearchEnter(event)
      }
      break
      
    case 'Escape':
      event.preventDefault()
      if (showSuggestions.value) {
        // 如果建议框打开，先关闭建议框
        showSuggestions.value = false
        selectedSuggestionIndex.value = -1
      } else {
        // 如果建议框已关闭，清空搜索
        handleClearSearch()
      }
      break
      
    case 'Tab':
      // Tab键关闭建议
      showSuggestions.value = false
      selectedSuggestionIndex.value = -1
      break
  }
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
  selectedSuggestionIndex.value = -1
  
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
  selectedSuggestionIndex.value = -1 // 重置选中索引
}

// 处理搜索框失去焦点
const handleSearchBlur = () => {
  // 延迟隐藏建议，允许点击建议项
  setTimeout(() => {
    showSuggestions.value = false
    selectedSuggestionIndex.value = -1
  }, 200)
}

// 处理建议点击
const handleSuggestionClick = (suggestion: string) => {
  emit('update:searchQuery', suggestion)
  showSuggestions.value = false
  selectedSuggestionIndex.value = -1
  
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
  
  // 同时清空本地状态和父组件状态
  localSearchQuery.value = ''
  emit('update:searchQuery', '')
  isSearching.value = false
  showSuggestions.value = false
  selectedSuggestionIndex.value = -1
  
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
    selectedSuggestionIndex.value = -1
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
