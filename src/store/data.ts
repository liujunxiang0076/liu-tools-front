import { Tool, Category } from '@/types'

// 分类数据
export const categories: Category[] = [
  {
    id: 'all',
    name: '全部工具',
    icon: 'Grid',
    color: '#6366f1'
  },
  {
    id: 'favorites',
    name: '我的收藏',
    icon: 'Heart',
    color: '#ef4444'
  },
  {
    id: 'design',
    name: '设计工具',
    icon: 'Palette',
    color: '#ec4899'
  },
  {
    id: 'development',
    name: '开发工具',
    icon: 'Code',
    color: '#10b981'
  },
  {
    id: 'efficiency',
    name: '效率工具',
    icon: 'Zap',
    color: '#f59e0b'
  },
  // {
  //   id: 'calculation',
  //   name: '计算工具',
  //   icon: 'Calculator',
  //   color: '#ef4444'
  // },
  // {
  //   id: 'text',
  //   name: '文本工具',
  //   icon: 'FileText',
  //   color: '#8b5cf6'
  // },
  // {
  //   id: 'image',
  //   name: '图像工具',
  //   icon: 'Image',
  //   color: '#84cc16'
  // },
  // {
  //   id: 'network',
  //   name: '网络工具',
  //   icon: 'Globe',
  //   color: '#06b6d4'
  // }
]

// 工具数据
export const tools: Tool[] = [
  // 设计工具
  {
    id: 1,
    name: '颜色选择器',
    description: '专业的颜色选择和调色板工具，支持HEX、RGB、HSL格式，一键复制颜色值',
    category: 'design',
    icon: '🎨',
    tags: ['颜色', '调色板', 'HEX', 'RGB', 'HSL', '拾色器'],
    path: '/tool/color-picker'
  },
  
  // 图像工具
  // {
  //   id: 2,
  //   name: '图片压缩',
  //   description: '在线图片压缩和优化工具，支持JPG、PNG等多种格式',
  //   category: 'image',
  //   icon: '🖼️',
  //   tags: ['图片', '压缩', '优化', 'JPG', 'PNG', '文件大小'],
  //   path: '/tool/image-compress'
  // },
  
  // 开发工具
  {
    id: 3,
    name: 'JSON格式化',
    description: 'JSON数据格式化、压缩和验证工具，支持语法高亮和错误提示',
    category: 'development',
    icon: '📄',
    tags: ['JSON', '格式化', '验证', '压缩', '语法高亮'],
    path: '/tool/json-formatter'
  },
  {
    id: 4,
    name: 'Base64编码',
    description: 'Base64编码和解码工具，支持文本和文件的编码转换',
    category: 'development',
    icon: '🔐',
    tags: ['Base64', '编码', '解码', '加密', '文件转换'],
    path: '/tool/base64'
  },
  {
    id: 5,
    name: 'MD5加密',
    description: 'MD5哈希值计算工具，支持文本和文件的MD5加密验证',
    category: 'development',
    icon: '🔒',
    tags: ['MD5', '哈希', '加密', '验证', '文件校验'],
    path: '/tool/md5'
  },
  {
    id: 6,
    name: '时间戳转换',
    description: 'Unix时间戳与日期时间相互转换工具，支持多种时区和格式',
    category: 'development',
    icon: '⏰',
    tags: ['时间戳', '日期', '转换', 'Unix', '时区'],
    path: '/tool/timestamp'
  },
  {
    id: 7,
    name: '正则表达式测试',
    description: '正则表达式在线测试和验证工具，实时匹配结果预览',
    category: 'development',
    icon: '🔍',
    tags: ['正则', '表达式', '测试', '验证', '匹配'],
    path: '/tool/regex-test'
  },
  
  // 效率工具
  {
    id: 8,
    name: '二维码生成器',
    description: '快速生成各种类型的二维码，支持自定义样式和尺寸，可下载PNG格式',
    category: 'efficiency',
    icon: '📱',
    tags: ['二维码', 'QR码', '生成器', '扫码', 'PNG下载'],
    path: '/tool/qrcode'
  },
  {
    id: 9,
    name: '密码生成器',
    description: '生成安全的随机密码，可自定义长度和字符类型，确保密码强度',
    category: 'efficiency',
    icon: '🔑',
    tags: ['密码', '生成器', '随机', '安全', '强度检测'],
    path: '/tool/password-generator'
  },
  
  // 文本工具
  // {
  //   id: 10,
  //   name: '文本差异对比',
  //   description: '比较两段文本的差异，高亮显示不同之处，支持逐行对比',
  //   category: 'text',
  //   icon: '📝',
  //   tags: ['文本', '对比', '差异', '比较', '高亮显示'],
  //   path: '/tool/text-diff'
  // },
  
  // 网络工具
  // {
  //   id: 11,
  //   name: 'URL编码解码',
  //   description: 'URL编码和解码工具，处理特殊字符，确保网络传输安全',
  //   category: 'network',
  //   icon: '🌐',
  //   tags: ['URL', '编码', '解码', '网络', '特殊字符'],
  //   path: '/tool/url-encode'
  // },
  
  // 计算工具
  // {
  //   id: 12,
  //   name: '单位转换器',
  //   description: '各种单位之间的转换工具，支持长度、重量、温度、面积等多种单位',
  //   category: 'calculation',
  //   icon: '📏',
  //   tags: ['单位', '转换', '长度', '重量', '温度', '面积'],
  //   path: '/tool/unit-converter'
  // },
  
  // 开发工具 - 雪花ID生成器
  {
    id: 13,
    name: '雪花ID生成器',
    description: '生成全局唯一的雪花ID，支持批量生成、自定义配置和ID解析，便于复制到数据库表中',
    category: 'development',
    icon: '❄️',
    tags: ['雪花ID', 'Snowflake', 'ID生成', '唯一ID', '分布式', '数据库'],
    path: '/tool/snowflake-generator'
  },
  
  // 网络工具
  {
    id: 14,
    name: 'URL编码解码',
    description: 'URL编码和解码工具，支持URL参数解析和查询字符串构建',
    category: 'development',
    icon: '🌐',
    tags: ['URL', '编码', '解码', '网络', '参数解析', 'URI'],
    path: '/tool/url-encode'
  },
  
  // 计算工具
  {
    id: 15,
    name: '进制转换器',
    description: '数字进制转换工具，支持二进制、八进制、十进制、十六进制互转',
    category: 'development',
    icon: '🔢',
    tags: ['进制', '转换', '二进制', '十六进制', '八进制', '计算'],
    path: '/tool/base-converter'
  }
]

// 根据分类ID获取工具数量
export const getCategoryCount = (categoryId: string): number => {
  if (categoryId === 'all') {
    return tools.length
  }
  return tools.filter(tool => tool.category === categoryId).length
}

// 根据分类筛选工具
export const getToolsByCategory = (categoryId: string): Tool[] => {
  if (categoryId === 'all') {
    return tools
  }
  return tools.filter(tool => tool.category === categoryId)
}

// 搜索工具
export const searchTools = (keyword: string): Tool[] => {
  if (!keyword.trim()) {
    return tools
  }
  
  const lowerKeyword = keyword.toLowerCase()
  return tools.filter(tool => 
    tool.name.toLowerCase().includes(lowerKeyword) ||
    tool.description.toLowerCase().includes(lowerKeyword) ||
    tool.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
  )
}

// 根据ID获取工具详情
export const getToolById = (id: number): Tool | undefined => {
  return tools.find(tool => tool.id === id)
}

// 获取随机推荐工具
export const getRandomTools = (count: number = 3): Tool[] => {
  const shuffled = [...tools].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// 获取热门工具（这里简单按ID排序，实际可以根据使用频率）
export const getPopularTools = (count: number = 6): Tool[] => {
  return tools.slice(0, count)
} 
