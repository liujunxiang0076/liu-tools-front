// 工具接口定义
export interface Tool {
  id: number
  name: string
  description: string
  icon: string
  category: string
  tags: string[]
  path?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  isPro?: boolean
  isNew?: boolean
}

// 分类接口定义
export interface Category {
  id: string
  name: string
  icon: string
  color?: string
  count?: number
}

// 视图类型
export type ViewType = 'grid' | 'list'

// 重新导出布局相关类型
export * from './layout'

// 收藏工具接口
export interface FavoriteTool {
  id: number
  addedAt: string
}

// 应用状态接口
export interface AppState {
  tools: Tool[]
  categories: Category[]
  favorites: number[]
  searchKeyword: string
  selectedCategory: string
  viewType: ViewType
  showDetailPanel: boolean
  selectedTool: Tool | null
}

// API 响应接口（为后端预留）
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 分页接口
export interface Pagination {
  page: number
  pageSize: number
  total: number
} 
