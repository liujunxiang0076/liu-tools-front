# 刘工具箱 - 现代化在线工具集合

一个基于 Vue 3 + TypeScript + Vite + DaisyUI 的现代化在线工具箱，提供丰富的日常开发和办公工具。

## 🚀 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/liu-tools-front&project-name=liu-tools-front&repository-name=liu-tools-front)

点击上方按钮即可一键部署到Vercel平台，无需额外配置。

## 🛠️ 本地开发

### 环境要求
- Node.js 18+ 
- pnpm 8+ (推荐) 或 npm 9+

### 开发命令
```bash
# 克隆项目
git clone https://github.com/your-username/liu-tools-front.git
cd liu-tools-front

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

## ✨ 核心特性

### 🎨 现代化设计
- **玻璃质感UI** - 采用现代毛玻璃设计风格，视觉层次丰富
- **深色/浅色主题** - 完整的双主题支持，自动适应系统偏好
- **响应式布局** - 完美适配桌面端、平板和移动设备
- **品牌渐变** - 蓝色到紫色的品牌渐变色彩系统

### 🔍 智能交互
- **实时搜索** - 支持工具名称、描述、标签的全文搜索
- **搜索建议** - 智能搜索建议和历史记录
- **工具收藏** - 一键收藏常用工具，快速访问
- **分类浏览** - 按功能分类整理，便于查找

### ⚡ 渐进式滚动模糊效果

参考 iOS/macOS 风格的毛玻璃设计，实现了业界领先的滚动视觉效果：

#### 🎭 核心特性
- **渐进式模糊** - 根据滚动距离动态调整模糊强度（4px → 16px）
- **温和饱和度** - 滚动时饱和度从 1.1 提升到 1.7，避免过度饱和
- **自然透明度** - 背景透明度从 65% 渐变到 90%，层次感更自然
- **高性能优化** - requestAnimationFrame + 防抖延迟确保 60fps 流畅体验

#### 🎨 创新"像素画"效果
在毛玻璃基础上叠加的独特像素化视觉效果：
- **像素化遮罩** - 使用 `backdrop-filter` + `radial-gradient` 创建网格圆点
- **动态密度** - 圆点网格密度 16px → 10px 实时响应滚动
- **双重叠加** - 背景模糊 + 圆点网格 = "低分辨率"视觉效果
- **GPU硬件加速** - `transform: translateZ(0)` + `will-change` 性能优化

#### 🚀 技术实现
```css
/* 动态模糊效果 */
.workspace-header-scrolled {
  backdrop-filter: var(--dynamic-blur, blur(16px) saturate(1.7));
  background: rgba(255, 255, 255, var(--dynamic-opacity, 0.65));
}

/* 像素化遮罩层 */
.workspace-header-scrolled::before {
  backdrop-filter: var(--pixel-blur, blur(12px));
  background-image: radial-gradient(circle at center, 
    rgba(255, 255, 255, var(--pixel-opacity)) 15%, 
    transparent 40%
  );
  background-size: var(--pixel-size, 16px) var(--pixel-size, 16px);
}
```

#### 📱 浏览器兼容性
- **Chrome 76+** - 完整支持所有视觉效果
- **Safari 9+** - 专用优化，通过 `-webkit-` 前缀支持
- **Firefox 103+** - 原生支持 `backdrop-filter`
- **Edge 79+** - 基于 Chromium 完整支持
- **降级方案** - 不支持的浏览器自动使用增强网格背景

## 🛠️ 工具列表

### 开发工具 (Development)
- **📄 JSON格式化工具** - JSON数据格式化、压缩和验证，支持语法高亮和错误提示
- **🔐 Base64编码解码** - 文本和文件的Base64编码转换，支持批量处理
- **🔒 MD5加密工具** - 文本和文件的MD5哈希计算，支持文件校验
- **⏰ 时间戳转换** - Unix时间戳与日期时间相互转换，支持多种时区和格式
- **🔍 正则表达式测试** - 正则表达式在线测试和验证，实时匹配结果预览和语法解释

### 设计工具 (Design)
- **🎨 颜色选择器** - 专业的颜色选择和调色板工具，支持HEX、RGB、HSL、HSV格式互转，一键复制颜色值

### 效率工具 (Efficiency)
- **🔑 密码生成器** - 生成安全的随机密码，支持自定义长度和字符类型，实时强度分析
- **📱 二维码生成器** - 快速生成各种类型的二维码（文本、URL、WiFi、联系人、电话、短信），支持自定义样式、尺寸和颜色，可下载PNG格式

### 🎯 工具特色功能

#### JSON格式化工具
- 语法高亮显示
- 错误提示和定位
- 格式化和压缩
- 数据统计信息

#### Base64编码解码
- 文本编码/解码
- 文件编码/解码
- 批量处理支持
- 实时预览

#### MD5加密工具
- 文本MD5计算
- 文件MD5校验
- 拖拽上传支持
- 进度显示

#### 时间戳转换
- Unix时间戳转换
- 多种日期格式
- 时区支持
- 实时转换

#### 正则表达式测试
- 实时匹配预览
- 语法解释
- 常用表达式模板
- 匹配结果高亮

#### 密码生成器
- 自定义长度（4-128位）
- 字符类型选择
- 实时强度分析
- 批量生成

#### 二维码生成器
- **多种内容类型**：文本、URL、WiFi、联系人、电话、短信
- **智能标签管理**：支持添加、编辑、删除、拖拽排序
- **自定义样式**：尺寸、颜色、纠错级别
- **优化编辑体验**：防止浏览器密码提示，自适应标签宽度
- **完整内容显示**：标签内容自动换行，不再截断

#### 颜色选择器
- 专业调色板
- 多种格式支持
- 颜色历史记录
- 一键复制功能

## 🛠️ 技术栈

### 前端技术
- **Vue 3** - 组合式API + `<script setup>` 语法
- **TypeScript** - 完整的类型安全
- **Vite** - 极速开发构建工具
- **Vue Router 4** - 现代化路由管理

### UI/UX
- **DaisyUI** - 语义化组件库
- **Tailwind CSS** - 原子化CSS框架
- **Lucide Vue Next** - 现代图标库
- **自定义CSS** - 渐进式滚动模糊效果

### 工具库
- **QRCode.js** - 二维码生成
- **自研算法** - MD5加密、Base64编码等

### 开发工具
- **unplugin-auto-import** - 自动导入优化
- **unplugin-vue-components** - 组件自动注册
- **PostCSS + Autoprefixer** - CSS兼容性处理

## 📦 项目结构

```
liu-tools-front/
├── src/
│   ├── components/          # 公共组件
│   │   ├── MainWorkspace.vue    # 主工作区（滚动模糊效果）
│   │   ├── Sidebar.vue          # 侧边栏导航
│   │   ├── TopNavBar.vue        # 顶部导航栏
│   │   └── ToolCard.vue         # 工具卡片组件
│   ├── layouts/            # 布局组件
│   │   └── MainLayout.vue       # 主布局
│   ├── views/              # 工具页面
│   │   ├── JsonFormatter.vue    # JSON格式化
│   │   ├── Base64Tool.vue       # Base64编码
│   │   ├── MD5Tool.vue          # MD5加密
│   │   ├── TimestampTool.vue    # 时间戳转换
│   │   ├── RegexTool.vue        # 正则表达式
│   │   ├── PasswordGenerator.vue # 密码生成器
│   │   ├── QRCodeGenerator.vue  # 二维码生成器
│   │   └── ColorPicker.vue      # 颜色选择器
│   ├── router/             # 路由配置
│   ├── store/              # 数据管理
│   │   └── data.ts             # 工具数据和分类
│   ├── styles/             # 样式文件
│   │   └── index.css           # 全局样式（包含滚动模糊效果）
│   ├── types/              # TypeScript类型定义
│   └── main.ts             # 入口文件
├── public/                 # 静态资源
├── vercel.json            # Vercel部署配置
├── vite.config.ts         # Vite配置
├── tailwind.config.js     # Tailwind配置
├── daisyui.config.js      # DaisyUI配置
└── package.json           # 项目配置
```

## 🎨 设计系统

### 色彩规范
- **主色调**: 蓝色到紫色渐变 (#3b82f6 → #8b5cf6)
- **功能色**: 成功(绿)、警告(黄)、错误(红)、信息(蓝)
- **中性色**: 基于HSL的语义化色彩系统

### 组件规范
- **卡片设计**: 圆角、阴影、悬停效果
- **按钮系统**: 多种尺寸和状态
- **输入框**: 统一的聚焦和验证状态
- **图标**: 一致的尺寸和颜色规范

### 响应式断点
- **移动端**: < 640px
- **平板**: 640px - 1024px  
- **桌面**: > 1024px

## 🚀 性能优化

### 构建优化
- **Vite HMR** - 极速热重载
- **Tree Shaking** - 自动移除未使用代码
- **代码分割** - 按路由懒加载
- **资源压缩** - 自动压缩JS/CSS/HTML

### 运行时优化
- **组合式API** - 更好的性能和类型推断
- **响应式优化** - 精确的依赖追踪
- **虚拟滚动** - 大列表性能优化
- **GPU加速** - 滚动模糊效果硬件加速

### 用户体验
- **渐进式加载** - 关键资源优先加载
- **错误边界** - 优雅的错误处理
- **加载状态** - 友好的等待提示
- **离线缓存** - Service Worker支持

## 🔧 开发指南

### 添加新工具
1. 在 `src/views/` 创建工具组件
2. 在 `src/store/data.ts` 添加工具配置
3. 在 `src/router/` 添加路由配置
4. 更新类型定义（如需要）

### 自定义主题
```css
/* 在 src/styles/index.css 中修改 */
:root {
  --primary: your-primary-color;
  --secondary: your-secondary-color;
  /* 更多主题变量... */
}
```

### 构建部署
```bash
# 本地构建
pnpm build

# 构建分析
pnpm build --analyze

# 预览构建结果
pnpm preview
```

## 🤝 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 提交规范
- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 样式修改
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具相关

## 📄 许可证

本项目采用 ISC 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [在线演示](https://liu-tools-front.vercel.app) (替换为您的实际部署地址)
- [GitHub 仓库](https://github.com/your-username/liu-tools-front)
- [问题反馈](https://github.com/your-username/liu-tools-front/issues)
- [功能建议](https://github.com/your-username/liu-tools-front/discussions)

## 🙏 致谢

感谢以下开源项目和社区：
- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [DaisyUI](https://daisyui.com/) - 最受欢迎的Tailwind组件库
- [Vercel](https://vercel.com/) - 现代化部署平台

感谢所有为这个项目做出贡献的开发者！

---

⭐ 如果这个项目对您有帮助，请给它一个星标！
 