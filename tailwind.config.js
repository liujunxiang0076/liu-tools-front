/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主品牌色系
        brand: {
          primary: '#3b82f6',    // 蓝色
          secondary: '#8b5cf6',  // 紫色
        },
        // 工具分类配色 - 浅色模式
        category: {
          design: { bg: '#fdf2f8', text: '#ec4899' },      // 设计工具 pink
          development: { bg: '#eff6ff', text: '#2563eb' }, // 开发工具 blue
          efficiency: { bg: '#f0fdf4', text: '#16a34a' },  // 效率工具 green
          calculation: { bg: '#faf5ff', text: '#9333ea' }, // 计算工具 purple
          text: { bg: '#fff7ed', text: '#ea580c' },         // 文本工具 orange
          image: { bg: '#fef2f2', text: '#dc2626' },        // 图像工具 red
          network: { bg: '#ecfeff', text: '#0891b2' },      // 网络工具 cyan
        },
        // 工具分类配色 - 深色模式
        'category-dark': {
          design: { bg: '#831843', text: '#f9a8d4' },      // pink-900/20 + pink-300
          development: { bg: '#1e3a8a', text: '#93c5fd' }, // blue-900/20 + blue-300
          efficiency: { bg: '#14532d', text: '#86efac' },  // green-900/20 + green-300
          calculation: { bg: '#581c87', text: '#c4b5fd' }, // purple-900/20 + purple-300
          text: { bg: '#9a3412', text: '#fdba74' },         // orange-900/20 + orange-300
          image: { bg: '#7f1d1d', text: '#fca5a5' },        // red-900/20 + red-300
          network: { bg: '#164e63', text: '#67e8f9' },      // cyan-900/20 + cyan-300
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        // 浅色模式阴影
        'light-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'light-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'light-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.15)',
        // 深色模式阴影
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.2)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
        // 品牌阴影
        'brand': '0 4px 14px 0 rgba(59, 130, 246, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        // 浅色主题配置
        light: {
          "primary": "#3b82f6",          // 主品牌蓝色
          "primary-content": "#ffffff",   // 主色文字（白色）
          "secondary": "#8b5cf6",        // 次要品牌紫色
          "secondary-content": "#ffffff", // 次要色文字（白色）
          "accent": "#10b981",           // 强调色（成功绿）
          "accent-content": "#ffffff",    // 强调色文字（白色）
          "neutral": "#374151",          // 中性色
          "neutral-content": "#f9fafb",  // 中性色文字
          "base-100": "#ffffff",         // 卡片背景（白色）
          "base-200": "#f3f4f6",         // 次要背景（gray-100）
          "base-300": "#e5e7eb",         // 主要边框（gray-200）
          "base-content": "#111827",     // 主要文字（gray-900）
          "info": "#3b82f6",             // 信息色（蓝色）
          "info-content": "#ffffff",      // 信息色文字
          "success": "#10b981",          // 成功色（emerald-500）
          "success-content": "#ffffff",   // 成功色文字
          "warning": "#f59e0b",          // 警告色（amber-500）
          "warning-content": "#ffffff",   // 警告色文字
          "error": "#ef4444",            // 错误色（red-500）
          "error-content": "#ffffff",     // 错误色文字
          
          // 自定义变量
          "--rounded-box": "0.75rem",    // 卡片圆角
          "--rounded-btn": "0.5rem",     // 按钮圆角
          "--rounded-badge": "1.9rem",   // 徽章圆角
          "--animation-btn": "0.2s",     // 按钮动画时长
          "--animation-input": "0.2s",   // 输入框动画时长
          "--btn-text-case": "uppercase", // 按钮文字大小写
          "--btn-focus-scale": "0.95",   // 按钮聚焦缩放
          "--border-btn": "1px",         // 按钮边框
          "--tab-border": "1px",         // 选项卡边框
          "--tab-radius": "0.5rem",      // 选项卡圆角
        },
        // 深色主题配置
        dark: {
          "primary": "#3b82f6",          // 主品牌蓝色
          "primary-content": "#ffffff",   // 主色文字（白色）
          "secondary": "#8b5cf6",        // 次要品牌紫色
          "secondary-content": "#ffffff", // 次要色文字（白色）
          "accent": "#10b981",           // 强调色（成功绿）
          "accent-content": "#ffffff",    // 强调色文字（白色）
          "neutral": "#1f2937",          // 中性色（slate-800）
          "neutral-content": "#f1f5f9",  // 中性色文字（slate-100）
          "base-100": "#1e293b",         // 卡片背景（slate-800，90%透明度通过CSS处理）
          "base-200": "#0f172a",         // 页面主背景（slate-900）
          "base-300": "#475569",         // 主要边框（slate-600，50%透明度通过CSS处理）
          "base-content": "#f1f5f9",     // 主要文字（slate-100）
          "info": "#3b82f6",             // 信息色（蓝色）
          "info-content": "#ffffff",      // 信息色文字
          "success": "#10b981",          // 成功色（emerald-500）
          "success-content": "#ffffff",   // 成功色文字
          "warning": "#f59e0b",          // 警告色（amber-500）
          "warning-content": "#ffffff",   // 警告色文字
          "error": "#ef4444",            // 错误色（red-500）
          "error-content": "#ffffff",     // 错误色文字
          
          // 自定义变量
          "--rounded-box": "0.75rem",    // 卡片圆角
          "--rounded-btn": "0.5rem",     // 按钮圆角
          "--rounded-badge": "1.9rem",   // 徽章圆角
          "--animation-btn": "0.2s",     // 按钮动画时长
          "--animation-input": "0.2s",   // 输入框动画时长
          "--btn-text-case": "uppercase", // 按钮文字大小写
          "--btn-focus-scale": "0.95",   // 按钮聚焦缩放
          "--border-btn": "1px",         // 按钮边框
          "--tab-border": "1px",         // 选项卡边框
          "--tab-radius": "0.5rem",      // 选项卡圆角
        }
      }
    ],
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: false,
  },
} 
