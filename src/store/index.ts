import { reactive, computed } from 'vue'
import { Tool, Category, ViewType } from '@/types'
import { tools, categories, getCategoryCount, getToolsByCategory, searchTools } from './data'

// 应用状态
interface AppState {
  tools: Tool[]
  categories: Category[]
  favorites: number[]
  searchKeyword: string
  selectedCategory: string
  viewType: ViewType
  showDetailPanel: boolean
  selectedTool: Tool | null
}

// 创建响应式状态
const state = reactive<AppState>({
  tools: tools,
  categories: categories,
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
  searchKeyword: '',
  selectedCategory: 'all',
  viewType: 'grid',
  showDetailPanel: false,
  selectedTool: null
})

// 计算属性
const getters = {
  // 获取过滤后的工具列表
  filteredTools: computed(() => {
    let result = state.tools
    
    // 按分类筛选
    if (state.selectedCategory !== 'all') {
      result = result.filter(tool => tool.category === state.selectedCategory)
    }
    
    // 按关键词搜索
    if (state.searchKeyword.trim()) {
      const keyword = state.searchKeyword.toLowerCase()
      result = result.filter(tool => 
        tool.name.toLowerCase().includes(keyword) ||
        tool.description.toLowerCase().includes(keyword) ||
        tool.tags.some(tag => tag.toLowerCase().includes(keyword))
      )
    }
    
    return result
  }),
  
  // 获取分类列表（包含工具数量）
  categoriesWithCount: computed(() => {
    return state.categories.map(category => ({
      ...category,
      count: getCategoryCount(category.id)
    }))
  }),
  
  // 获取收藏的工具列表
  favoriteTools: computed(() => {
    return state.tools.filter(tool => state.favorites.includes(tool.id))
  }),
  
  // 检查工具是否已收藏
  isFavorite: (toolId: number) => {
    return state.favorites.includes(toolId)
  }
}

// 操作方法
const actions = {
  // 设置搜索关键词
  setSearchKeyword(keyword: string) {
    state.searchKeyword = keyword
  },
  
  // 设置选中的分类
  setSelectedCategory(categoryId: string) {
    state.selectedCategory = categoryId
  },
  
  // 切换视图类型
  setViewType(viewType: ViewType) {
    state.viewType = viewType
  },
  
  // 显示工具详情面板
  showToolDetail(tool: Tool) {
    state.selectedTool = tool
    state.showDetailPanel = true
  },
  
  // 隐藏工具详情面板
  hideToolDetail() {
    state.showDetailPanel = false
    state.selectedTool = null
  },
  
  // 切换工具收藏状态
  toggleFavorite(toolId: number) {
    const index = state.favorites.indexOf(toolId)
    if (index > -1) {
      // 取消收藏
      state.favorites.splice(index, 1)
    } else {
      // 添加收藏
      state.favorites.push(toolId)
    }
    
    // 保存到本地存储
    localStorage.setItem('favorites', JSON.stringify(state.favorites))
  },
  
  // 添加工具到收藏
  addToFavorites(toolId: number) {
    if (!state.favorites.includes(toolId)) {
      state.favorites.push(toolId)
      localStorage.setItem('favorites', JSON.stringify(state.favorites))
    }
  },
  
  // 从收藏中移除工具
  removeFromFavorites(toolId: number) {
    const index = state.favorites.indexOf(toolId)
    if (index > -1) {
      state.favorites.splice(index, 1)
      localStorage.setItem('favorites', JSON.stringify(state.favorites))
    }
  },
  
  // 清空所有收藏
  clearFavorites() {
    state.favorites = []
    localStorage.removeItem('favorites')
  },
  
  // 根据ID获取工具
  getToolById(id: number): Tool | undefined {
    return state.tools.find(tool => tool.id === id)
  },
  
  // 根据分类获取工具
  getToolsByCategory(categoryId: string): Tool[] {
    return getToolsByCategory(categoryId)
  },
  
  // 搜索工具
  searchTools(keyword: string): Tool[] {
    return searchTools(keyword)
  }
}

// 导出store
export const useStore = () => {
  return {
    state,
    getters,
    actions
  }
}

export default useStore 
