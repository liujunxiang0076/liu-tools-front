import { useTabs } from './useTabs'

export function useToolNavigation() {
  const { closeTab, activeTabId, tabs } = useTabs()

  // 返回操作：关闭当前标签
  const goBack = () => {
    if (activeTabId.value) {
      closeTab(activeTabId.value)
    }
  }

  // 检查是否在标签页模式
  const isInTabMode = () => {
    return tabs.value.length > 0
  }

  return {
    goBack,
    isInTabMode
  }
}
