export interface LayoutProps {
  // 是否显示顶部导航栏
  showHeader?: boolean
  // 是否显示侧边栏
  showSidebar?: boolean
  // 侧边栏是否可折叠
  sidebarCollapsible?: boolean
  // 移动端侧边栏状态
  mobileSidebarVisible?: boolean
}

export interface MobileLayoutState {
  // 移动端遮罩层显示状态
  showOverlay: boolean
  // 侧边栏是否展开
  sidebarExpanded: boolean
}

export interface LayoutEvents {
  // 移动端侧边栏切换
  'toggle-mobile-sidebar': () => void
  // 关闭移动端侧边栏
  'close-mobile-sidebar': () => void
  // 布局大小变化
  'layout-resize': (width: number, height: number) => void
} 
