import { ref, computed } from 'vue'
import type { Tool } from '@/types'

export interface TabItem {
  id: string
  tool: Tool
  isActive: boolean
}

const tabs = ref<TabItem[]>([])
const activeTabId = ref<string | null>(null)

export function useTabs() {
  // 打开新标签
  const openTab = (tool: Tool) => {
    const tabId = `tab-${tool.id}-${Date.now()}`
    
    // 检查是否已经打开
    const existingTab = tabs.value.find(tab => tab.tool.id === tool.id)
    if (existingTab) {
      // 如果已打开，直接激活
      activateTab(existingTab.id)
      return existingTab.id
    }

    // 创建新标签
    const newTab: TabItem = {
      id: tabId,
      tool,
      isActive: true
    }

    // 将所有标签设为非激活
    tabs.value.forEach(tab => tab.isActive = false)
    
    // 添加新标签
    tabs.value.push(newTab)
    activeTabId.value = tabId

    return tabId
  }

  // 激活标签
  const activateTab = (tabId: string) => {
    tabs.value.forEach(tab => {
      tab.isActive = tab.id === tabId
    })
    activeTabId.value = tabId
  }

  // 关闭标签
  const closeTab = (tabId: string) => {
    const index = tabs.value.findIndex(tab => tab.id === tabId)
    if (index === -1) return

    const wasActive = tabs.value[index].isActive
    tabs.value.splice(index, 1)

    // 如果关闭的是激活标签，激活相邻标签
    if (wasActive && tabs.value.length > 0) {
      const newIndex = Math.min(index, tabs.value.length - 1)
      activateTab(tabs.value[newIndex].id)
    } else if (tabs.value.length === 0) {
      activeTabId.value = null
    }
  }

  // 关闭其他标签
  const closeOtherTabs = (tabId: string) => {
    tabs.value = tabs.value.filter(tab => tab.id === tabId)
    activateTab(tabId)
  }

  // 关闭所有标签
  const closeAllTabs = () => {
    tabs.value = []
    activeTabId.value = null
  }

  // 关闭右侧标签
  const closeRightTabs = (tabId: string) => {
    const index = tabs.value.findIndex(tab => tab.id === tabId)
    if (index === -1) return
    
    tabs.value = tabs.value.slice(0, index + 1)
    
    // 如果当前激活的标签被关闭了，激活最后一个
    if (!tabs.value.find(tab => tab.id === activeTabId.value)) {
      activateTab(tabs.value[tabs.value.length - 1].id)
    }
  }

  // 获取激活的标签
  const activeTab = computed(() => {
    return tabs.value.find(tab => tab.isActive) || null
  })

  // 获取激活的工具
  const activeTool = computed(() => {
    return activeTab.value?.tool || null
  })

  return {
    tabs,
    activeTabId,
    activeTab,
    activeTool,
    openTab,
    activateTab,
    closeTab,
    closeOtherTabs,
    closeAllTabs,
    closeRightTabs
  }
}
