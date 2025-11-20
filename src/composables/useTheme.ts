/**
 * 主题切换 Hook
 */
import { ref, watch, onMounted } from 'vue'
import { useLocalStorage } from './useLocalStorage'

export type Theme = 'light' | 'dark' | 'tropical' | 'tropical-dark'

export function useTheme() {
  const theme = useLocalStorage<Theme>('theme', 'tropical')
  const isDark = ref(false)

  /**
   * 设置主题
   */
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
    isDark.value = newTheme.includes('dark')
  }

  /**
   * 切换深色/浅色模式
   */
  const toggleTheme = () => {
    const newTheme = isDark.value ? 'tropical' : 'tropical-dark'
    setTheme(newTheme)
  }

  /**
   * 检测系统主题偏好
   */
  const detectSystemTheme = (): Theme => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'tropical-dark' : 'tropical'
  }

  /**
   * 初始化主题
   */
  const initTheme = () => {
    // 如果没有保存的主题，使用系统偏好
    if (!localStorage.getItem('theme')) {
      const systemTheme = detectSystemTheme()
      setTheme(systemTheme)
    } else {
      setTheme(theme.value)
    }

    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'tropical-dark' : 'tropical'
        setTheme(newTheme)
      }
    })
  }

  // 监听主题变化
  watch(theme, (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme)
    isDark.value = newTheme.includes('dark')
  })

  onMounted(() => {
    initTheme()
  })

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
    initTheme,
  }
}
