# 刘工具箱 - 在线工具集合

一个基于 Vue 3 + TypeScript + Vite + DaisyUI 的现代化在线工具箱。

## ✨ 特性

- 🎨 现代化的玻璃质感设计
- 🌙 深色/浅色主题切换
- 📱 完全响应式设计，支持移动端
- 🔍 智能搜索功能，支持实时建议
- ❤️ 工具收藏功能
- 🎯 分类浏览和排序
- ⚡ **渐进式滚动模糊效果** - 页面向上滚动时工具区域头部自动添加动态毛玻璃模糊背景
- 🚀 基于 Vite 的快速开发体验

## 🆕 渐进式滚动模糊效果

参考了 iOS/macOS 风格的毛玻璃设计，实现了业界领先的滚动模糊效果：

### ✨ 核心特性
- **🎨 渐进式模糊** - 根据滚动距离动态调整模糊强度（4px → 16px）
- **🌈 温和饱和度** - 滚动时饱和度从 1.1 提升到 1.7，避免过度饱和
- **💫 自然透明度** - 背景透明度从 65% 渐变到 90%，层次感更自然
- **⚡ 高性能优化** - requestAnimationFrame + 8ms 防抖延迟
- **🎯 敏感触发** - 5px 滚动阈值，80px 优雅完全激活
- **🎭 平滑过渡** - easeOutQuart 缓动函数，0.4s 过渡动画

### 🎭 视觉效果（UI 优化版）
- **浅色模式**: `rgba(255, 255, 255, 0.65-0.9)` + 温和亮度增强
- **深色模式**: `rgba(30, 41, 59, 0.65-0.9)` + 优雅对比度调整
- **层次阴影**: 20px + 8px + 3px 三层自然阴影
- **柔和边框**: 降低边框透明度，减少突兀感
- **内光效果**: 顶部内嵌高光，增强立体感但不过度

### 🎨 UI设计原则
- **避免过度效果**: 模糊和饱和度适中，保持文字可读性
- **自然过渡曲线**: 使用 easeOutQuart 缓动函数替代线性变化
- **渐进激活**: 80px 滚动距离让用户有充分的适应时间
- **性能优先**: requestAnimationFrame 确保 60fps 流畅体验
- **跨设备兼容**: 在不同设备和浏览器上保持一致的视觉效果

## 🎨 神奇的"像素画"滚动效果

在原有毛玻璃效果基础上，新增了创新的像素化视觉效果，让滚动区域呈现出独特的"像素画"风格：

### ✨ 像素化核心特性
- **🎮 像素化遮罩** - 使用 `backdrop-filter: blur()` + `radial-gradient` 网格圆点背景
- **🔄 渐进式变化** - 模糊强度 4px → 12px，网格密度 16px → 10px 动态调整
- **🌈 双重效果** - 背景模糊 + 圆点网格叠加，创造"低分辨率"视觉效果
- **⚡ 动态参数** - 圆点透明度、网格大小、模糊强度实时响应滚动进度

### 🎭 像素化视觉原理
- **模糊层**: `backdrop-filter: blur(4-12px)` 让背景内容变得模糊
- **网格层**: `radial-gradient` 创建一格格"透明+白色/深色"的小圆点
- **密度控制**: `background-size: 16px → 10px` 控制像素密度
- **叠加效果**: 人眼看到部分清晰 + 部分圆点模糊 = "像素画"效果

### 🚀 性能优化特性
- **GPU 硬件加速** - `transform: translateZ(0)` + `will-change` 优化
- **响应式适配** - 移动端自动降低像素密度和模糊强度
- **浏览器兼容** - 为不支持 `backdrop-filter` 的浏览器提供降级方案
- **Safari 专用优化** - 针对 Safari 浏览器的特殊渲染优化

### 🎨 视觉效果详解
- **浅色模式**: 白色圆点网格 + 温和模糊，呈现清新像素风格
- **深色模式**: 深灰圆点网格 + 对比度调整，保持暗黑美学
- **渐进激活**: 5px 触发，80px 完全激活，过渡自然流畅
- **层次叠加**: 圆点透明度 0.3 → 0.8，整体强度 0.5 → 0.9

### 🔧 技术实现

- 使用 `backdrop-filter: blur() saturate() brightness()` 创建毛玻璃效果
- CSS 自定义属性 `--dynamic-blur` 和 `--dynamic-opacity` 实现动态调整
- Vue 3 响应式系统 + easeOutQuart 缓动函数计算滚动进度
- requestAnimationFrame 优化，确保 60fps 流畅动画
- 支持 `-webkit-backdrop-filter` 前缀确保 Safari 兼容性
- 使用 `@supports` 查询为老旧浏览器提供降级方案

### 🎨 像素化技术实现细节

#### 核心CSS结构
```css
/* 像素化遮罩层 */
.workspace-header-scrolled::before {
  backdrop-filter: var(--pixel-blur, blur(8px));
  background-image: radial-gradient(circle at center, 
    rgba(255, 255, 255, var(--pixel-opacity)) 30%, 
    transparent 35%
  );
  background-size: var(--pixel-size, 12px) var(--pixel-size, 12px);
}
```

#### 动态参数控制
```javascript
// 像素化参数计算
const pixelBlur = 4 + (scrollProgress * 8)      // 模糊强度
const pixelSize = 16 - (scrollProgress * 6)     // 网格密度  
const pixelOpacity = 0.3 + (scrollProgress * 0.5) // 圆点透明度
const pixelIntensity = 0.5 + (scrollProgress * 0.4) // 整体强度
```

### 📱 浏览器兼容性
- **Chrome 76+** - 完整支持所有像素化效果
- **Safari 9+** - 通过 -webkit- 前缀支持，专用优化
- **Firefox 103+** - 原生支持 backdrop-filter 和网格效果
- **Edge 79+** - 基于 Chromium 完整支持
- **降级方案** - 不支持的浏览器自动使用增强网格背景

## 🛠️ 技术栈
 