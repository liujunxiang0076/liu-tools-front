<template>
  <div v-if="tabs.length > 0" class="bg-base-100 border-b border-base-300">
    <div class="flex items-center overflow-x-auto scrollbar-thin">
      <!-- 标签列表 -->
      <div class="flex items-center flex-1 min-w-0">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          :class="[
            'group flex items-center gap-2 px-4 py-2.5 border-r border-base-300 cursor-pointer transition-colors min-w-0 max-w-xs',
            tab.isActive 
              ? 'bg-base-200 text-base-content' 
              : 'bg-base-100 text-base-content/70 hover:bg-base-200/50'
          ]"
          @click="activateTab(tab.id)"
          @contextmenu.prevent="showContextMenu($event, tab)"
        >
          <!-- 工具图标 -->
          <span class="text-lg flex-shrink-0">{{ tab.tool.icon }}</span>
          
          <!-- 工具名称 -->
          <span class="text-sm font-medium truncate flex-1">
            {{ tab.tool.name }}
          </span>
          
          <!-- 关闭按钮 -->
          <button
            @click.stop="closeTab(tab.id)"
            class="flex-shrink-0 p-1 rounded hover:bg-base-300 opacity-0 group-hover:opacity-100 transition-opacity"
            :class="tab.isActive && 'opacity-100'"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center gap-1 px-2 border-l border-base-300 flex-shrink-0">
        <div class="dropdown dropdown-end">
          <button
            tabindex="0"
            class="btn btn-ghost btn-xs btn-square"
            title="更多操作"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
            </svg>
          </button>
          <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300">
            <li>
              <a @click="activeTabId && closeOtherTabs(activeTabId)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                关闭其他标签
              </a>
            </li>
            <li>
              <a @click="closeAllTabs">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                关闭所有标签
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 右键菜单 -->
    <div
      v-if="contextMenu.show"
      :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
      class="fixed z-50 menu bg-base-100 rounded-box shadow-lg border border-base-300 w-48"
      @click="contextMenu.show = false"
    >
      <li>
        <a @click="contextMenu.tab && closeTab(contextMenu.tab.id)">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          关闭
        </a>
      </li>
      <li>
        <a @click="contextMenu.tab && closeOtherTabs(contextMenu.tab.id)">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          关闭其他标签
        </a>
      </li>
      <li>
        <a @click="contextMenu.tab && closeRightTabs(contextMenu.tab.id)">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
          关闭右侧标签
        </a>
      </li>
      <div class="divider my-0"></div>
      <li>
        <a @click="closeAllTabs">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          关闭所有标签
        </a>
      </li>
    </div>

    <!-- 点击其他地方关闭右键菜单 -->
    <div
      v-if="contextMenu.show"
      class="fixed inset-0 z-40"
      @click="contextMenu.show = false"
      @contextmenu.prevent="contextMenu.show = false"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue'
import { useTabs, type TabItem } from '@/composables/useTabs'

const { tabs, activeTabId, activateTab, closeTab, closeOtherTabs, closeAllTabs, closeRightTabs } = useTabs()

const contextMenu = reactive<{
  show: boolean
  x: number
  y: number
  tab: TabItem | null
}>({
  show: false,
  x: 0,
  y: 0,
  tab: null
})

const showContextMenu = (event: MouseEvent, tab: TabItem) => {
  contextMenu.show = true
  contextMenu.x = event.clientX
  contextMenu.y = event.clientY
  contextMenu.tab = tab
}

// 监听点击事件关闭右键菜单
const handleClick = () => {
  if (contextMenu.show) {
    contextMenu.show = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClick)
})
</script>

<style lang="scss" scoped>
.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: hsl(var(--b2));
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: hsl(var(--bc) / 0.2);
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--bc) / 0.3);
}
</style>
