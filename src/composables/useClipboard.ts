/**
 * 剪贴板操作 Hook
 */
import { ref } from 'vue'

export function useClipboard() {
  const isSupported = ref(!!navigator?.clipboard)
  const copiedText = ref('')
  const error = ref<Error | null>(null)

  /**
   * 复制文本到剪贴板
   */
  const copy = async (text: string): Promise<boolean> => {
    if (!isSupported.value) {
      error.value = new Error('剪贴板API不支持')
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      copiedText.value = text
      error.value = null
      return true
    } catch (err) {
      error.value = err as Error
      return false
    }
  }

  /**
   * 从剪贴板读取文本
   */
  const read = async (): Promise<string | null> => {
    if (!isSupported.value) {
      error.value = new Error('剪贴板API不支持')
      return null
    }

    try {
      const text = await navigator.clipboard.readText()
      error.value = null
      return text
    } catch (err) {
      error.value = err as Error
      return null
    }
  }

  return {
    isSupported,
    copiedText,
    error,
    copy,
    read,
  }
}
