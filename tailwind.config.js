/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 热带色彩系统
        tropical: {
          mint: '#00d4aa',
          coral: '#ff6b6b',
          sky: '#4ecdc4',
          sand: '#ffe66d',
          ocean: '#4dabf7',
          sunset: '#ff8cc8',
          lime: '#51cf66',
          lavender: '#b197fc'
        },
        // 中性色系统
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717'
        }
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
        'tropical': '0 4px 14px 0 rgba(0, 212, 170, 0.15)',
        'card': '0 2px 8px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 25px 0 rgba(0, 0, 0, 0.1)',
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
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light",  // DaisyUI默认浅色主题
      "dark",   // DaisyUI默认深色主题
      {
        tropical: {
          "primary": "#00d4aa",          // 薄荷绿
          "secondary": "#4ecdc4",        // 天空蓝
          "accent": "#ff6b6b",           // 珊瑚红
          "neutral": "#3d4451",          // 中性灰
          "base-100": "#ffffff",         // 卡片背景纯白色
          "base-200": "#f8fafc",         // 页面主背景浅灰
          "base-300": "#f1f5f9",         // 更浅的分割线和边框
          "base-content": "#1f2937",     // 主文字颜色
          "info": "#4dabf7",             // 信息蓝
          "success": "#51cf66",          // 成功绿
          "warning": "#ffe66d",          // 警告黄
          "error": "#ff6b6b",            // 错误红
        },
        "tropical-dark": {
          "primary": "#00d4aa",
          "secondary": "#4ecdc4", 
          "accent": "#ff6b6b",
          "neutral": "#191D24",
          "base-100": "#1f2937",         // 深色背景
          "base-200": "#111827",         // 更深背景
          "base-300": "#0f172a",         // 最深背景
          "base-content": "#f9fafb",     // 浅色文字
          "info": "#4dabf7",
          "success": "#51cf66",
          "warning": "#ffe66d",
          "error": "#ff6b6b",
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
