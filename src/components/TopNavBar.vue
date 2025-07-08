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
          <!-- 闪电图标Logo -->
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
    <div class="navbar-center flex-1 max-w-md mx-4">
      <div class="form-control w-full">
        <div class="relative">
          <input 
            type="text" 
            :value="searchQuery" 
            @input="handleSearchInput" 
            placeholder="搜索工具名称、描述或标签..." 
            class="search-input"
          />
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧控制区 -->
    <div class="navbar-end">
      <div class="flex items-center gap-3">
        <!-- 视图切换按钮组 -->
        <div class="view-toggle">
          <button 
            @click="emit('update:viewMode', 'grid')" 
            :class="['view-toggle-btn', { 'active': viewMode === 'grid' }]"
            title="网格视图"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
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

        <!-- 深色模式切换 -->
        <button 
          @click="toggleDarkMode" 
          class="btn btn-ghost btn-circle" 
          :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
        >
          <svg v-if="!isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>

        <!-- 设置按钮 -->
        <button class="btn btn-ghost btn-circle" title="设置">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <!-- 用户头像 -->
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-8 rounded-lg">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium hover:scale-105 transition-transform duration-200 shadow-sm">
                <span class="text-sm">🧑‍💻</span>
              </div>
            </div>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a>个人资料</a></li>
            <li><a>我的收藏</a></li>
            <li><a>设置</a></li>
            <li class="border-t border-base-200 mt-2 pt-2"><a>退出登录</a></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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

// 深色模式状态
const isDark = ref(false)

// 切换深色模式
const toggleDarkMode = () => {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  
  // 保存用户偏好到localStorage
  localStorage.setItem('theme', theme)
}

// 处理搜索输入
const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:searchQuery', target.value)
}

// 处理移动端菜单切换
const handleMobileMenuToggle = () => {
  emit('toggle-sidebar')
}

// 组件挂载时恢复主题设置
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
    document.documentElement.setAttribute('data-theme', savedTheme)
  }
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
