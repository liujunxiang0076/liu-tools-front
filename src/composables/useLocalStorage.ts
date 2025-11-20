/**
 * LocalStorage 操作 Hook
 */
import { ref, watch, Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  // 初始化值
  const storedValue = localStorage.getItem(key)
  const data = ref<T>(
    storedValue ? JSON.parse(storedValue) : defaultValue
  ) as Ref<T>

  // 监听变化并同步到 localStorage
  watch(
    data,
    (newValue) => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue))
      } catch (error) {
        console.error(`保存到 localStorage 失败 (key: ${key}):`, error)
      }
    },
    { deep: true }
  )

  return data
}

/**
 * 移除 localStorage 项
 */
export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`从 localStorage 移除失败 (key: ${key}):`, error)
  }
}

/**
 * 清空 localStorage
 */
export function clearLocalStorage(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('清空 localStorage 失败:', error)
  }
}
