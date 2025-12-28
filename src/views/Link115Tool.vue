<template>
  <div class="min-h-screen bg-base-200 py-4 md:py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- 页面标题 -->
      <div class="mb-6 md:mb-8">
        <div class="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <button @click="goBack" class="btn btn-ghost btn-circle touch-manipulation">
            <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span class="text-2xl md:text-3xl">🔗</span>
          <h1 class="text-xl md:text-2xl font-bold text-base-content">115链接解析器</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          解析115://协议链接，提取文件信息和SHA1哈希值，支持链接验证和格式转换
        </p>
      </div>

      <!-- 链接输入区域 -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-lg mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-base-content">115链接输入</h2>
          <div class="flex gap-2">
            <button @click="clearInput" class="btn btn-sm btn-ghost" :disabled="!linkInput">
              清空
            </button>
            <button @click="loadExample" class="btn btn-sm btn-outline">
              示例
            </button>
          </div>
        </div>

        <div class="relative">
          <textarea v-model="linkInput" @input="handleInputChange"
            placeholder="请输入115://协议链接，例如：115://390JAC-219.mp4|1078123477|E0C5FF29E8A084E97F3952E857FA261826D2C6FA|744A14A912F7B78F7446DDF552EEF7FF838973E0"
            class="textarea textarea-bordered w-full h-32 font-mono text-sm resize-none"
            :class="{ 'textarea-error': parseError }"></textarea>

          <!-- 字符计数 -->
          <div class="absolute bottom-2 right-2 text-xs text-base-content/50">
            {{ linkInput.length }} 字符
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="parseError" class="mt-3 p-3 bg-error/10 border border-error/20 rounded-lg">
          <div class="flex items-start gap-2">
            <svg class="w-4 h-4 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <div>
              <div class="text-sm font-medium text-error">链接解析错误</div>
              <div class="text-xs text-error/80 mt-1">{{ errorMessage }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 解析结果 -->
      <div v-if="parsedData && !parseError" class="space-y-6">
        <!-- 基本信息 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">文件信息</h2>
            <div class="flex gap-2">
              <button @click="copyAllInfo" class="btn btn-sm btn-primary">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                复制全部
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                <span class="text-sm font-medium text-base-content/70">文件名</span>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-sm">{{ parsedData.filename }}</span>
                  <button @click="copyToClipboard(parsedData.filename)" class="btn btn-xs btn-ghost">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                <span class="text-sm font-medium text-base-content/70">文件大小</span>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-sm">{{ formatFileSize(parsedData.size) }}</span>
                  <button @click="copyToClipboard(parsedData.size.toString())" class="btn btn-xs btn-ghost">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                <span class="text-sm font-medium text-base-content/70">文件类型</span>
                <div class="flex items-center gap-2">
                  <span class="badge badge-primary">{{ getFileExtension(parsedData.filename) }}</span>
                  <span class="text-sm">{{ getFileType(parsedData.filename) }}</span>
                </div>
              </div>

              <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                <span class="text-sm font-medium text-base-content/70">协议版本</span>
                <span class="badge badge-outline">115://</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 哈希信息 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h2 class="text-lg font-semibold text-base-content mb-4">哈希值信息</h2>

          <div class="space-y-4">
            <div class="p-4 bg-base-200 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-base-content/70">SHA1 哈希</span>
                <button @click="copyToClipboard(parsedData.sha1)" class="btn btn-xs btn-primary">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  复制
                </button>
              </div>
              <code class="text-xs font-mono break-all">{{ parsedData.sha1 }}</code>
            </div>

            <div class="p-4 bg-base-200 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-base-content/70">CRC32 校验</span>
                <button @click="copyToClipboard(parsedData.crc32)" class="btn btn-xs btn-primary">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 16H6a2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  复制
                </button>
              </div>
              <code class="text-xs font-mono break-all">{{ parsedData.crc32 }}</code>
            </div>
          </div>
        </div>

        <!-- 链接操作 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h2 class="text-lg font-semibold text-base-content mb-4">链接操作</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button @click="openInBrowser" class="btn btn-primary btn-lg">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              在浏览器中打开
            </button>

            <button @click="copyOriginalLink" class="btn btn-outline btn-lg">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              复制原始链接
            </button>
          </div>
        </div>

        <!-- 格式转换 -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h2 class="text-lg font-semibold text-base-content mb-4">格式转换</h2>

          <div class="space-y-4">
            <div class="p-4 bg-base-200 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-base-content/70">JSON 格式</span>
                <button @click="copyToClipboard(jsonFormat)" class="btn btn-xs btn-primary">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  复制
                </button>
              </div>
              <pre class="text-xs font-mono whitespace-pre-wrap">{{ jsonFormat }}</pre>
            </div>

            <div class="p-4 bg-base-200 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-base-content/70">URL 参数格式</span>
                <button @click="copyToClipboard(urlFormat)" class="btn btn-xs btn-primary">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  复制
                </button>
              </div>
              <code class="text-xs font-mono break-all">{{ urlFormat }}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToolNavigation } from '@/composables/useToolNavigation'

const { goBack } = useToolNavigation()

// 响应式数据
const linkInput = ref('')
const parseError = ref(false)
const errorMessage = ref('')

// 解析后的数据接口
interface ParsedLink115Data {
  filename: string
  size: number
  sha1: string
  crc32: string
  originalLink: string
}

const parsedData = ref<ParsedLink115Data | null>(null)

// 示例链接
const exampleLink = '115://390JAC-219.mp4|1078123477|E0C5FF29E8A084E97F3952E857FA261826D2C6FA|744A14A912F7B78F7446DDF552EEF7FF838973E0'

// 处理输入变化
const handleInputChange = () => {
  if (!linkInput.value.trim()) {
    parsedData.value = null
    parseError.value = false
    errorMessage.value = ''
    return
  }

  parseLink()
}

// 解析115链接
const parseLink = () => {
  const input = linkInput.value.trim()

  // 验证链接格式
  if (!input.startsWith('115://')) {
    parseError.value = true
    errorMessage.value = '链接必须以 115:// 开头'
    parsedData.value = null
    return
  }

  // 移除协议前缀
  const content = input.substring(6)

  // 按 | 分割
  const parts = content.split('|')

  if (parts.length !== 4) {
    parseError.value = true
    errorMessage.value = '链接格式错误，应包含4个部分：文件名|大小|SHA1|CRC32'
    parsedData.value = null
    return
  }

  const [filename, sizeStr, sha1, crc32] = parts

  // 验证各部分
  if (!filename) {
    parseError.value = true
    errorMessage.value = '文件名不能为空'
    parsedData.value = null
    return
  }

  const size = parseInt(sizeStr)
  if (isNaN(size) || size < 0) {
    parseError.value = true
    errorMessage.value = '文件大小格式错误'
    parsedData.value = null
    return
  }

  if (!sha1 || sha1.length !== 40 || !/^[A-Fa-f0-9]+$/.test(sha1)) {
    parseError.value = true
    errorMessage.value = 'SHA1哈希值格式错误（应为40位十六进制字符）'
    parsedData.value = null
    return
  }

  if (!crc32 || crc32.length !== 40 || !/^[A-Fa-f0-9]+$/.test(crc32)) {
    parseError.value = true
    errorMessage.value = 'CRC32校验值格式错误（应为40位十六进制字符）'
    parsedData.value = null
    return
  }

  // 解析成功
  parseError.value = false
  errorMessage.value = ''
  parsedData.value = {
    filename,
    size,
    sha1: sha1.toUpperCase(),
    crc32: crc32.toUpperCase(),
    originalLink: input
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 获取文件扩展名
const getFileExtension = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ext ? `.${ext}` : '无扩展名'
}

// 获取文件类型
const getFileType = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()

  const typeMap: Record<string, string> = {
    // 视频
    'mp4': '视频文件',
    'avi': '视频文件',
    'mkv': '视频文件',
    'mov': '视频文件',
    'wmv': '视频文件',
    'flv': '视频文件',
    'webm': '视频文件',
    // 音频
    'mp3': '音频文件',
    'wav': '音频文件',
    'flac': '音频文件',
    'aac': '音频文件',
    'ogg': '音频文件',
    // 图片
    'jpg': '图片文件',
    'jpeg': '图片文件',
    'png': '图片文件',
    'gif': '图片文件',
    'bmp': '图片文件',
    'webp': '图片文件',
    // 文档
    'pdf': '文档文件',
    'doc': '文档文件',
    'docx': '文档文件',
    'txt': '文本文件',
    'rtf': '文档文件',
    // 压缩包
    'zip': '压缩文件',
    'rar': '压缩文件',
    '7z': '压缩文件',
    'tar': '压缩文件',
    'gz': '压缩文件',
    // 程序
    'exe': '可执行文件',
    'msi': '安装程序',
    'dmg': '磁盘镜像',
    'iso': '光盘镜像'
  }

  return ext ? (typeMap[ext] || '未知类型') : '未知类型'
}

// JSON格式
const jsonFormat = computed(() => {
  if (!parsedData.value) return ''

  return JSON.stringify({
    filename: parsedData.value.filename,
    size: parsedData.value.size,
    sizeFormatted: formatFileSize(parsedData.value.size),
    sha1: parsedData.value.sha1,
    crc32: parsedData.value.crc32,
    fileType: getFileType(parsedData.value.filename),
    extension: getFileExtension(parsedData.value.filename)
  }, null, 2)
})

// URL参数格式
const urlFormat = computed(() => {
  if (!parsedData.value) return ''

  const params = new URLSearchParams({
    filename: parsedData.value.filename,
    size: parsedData.value.size.toString(),
    sha1: parsedData.value.sha1,
    crc32: parsedData.value.crc32
  })

  return `https://example.com/download?${params.toString()}`
})

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // 可以添加成功提示
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 复制全部信息
const copyAllInfo = async () => {
  if (!parsedData.value) return

  const allInfo = `文件名: ${parsedData.value.filename}
文件大小: ${formatFileSize(parsedData.value.size)} (${parsedData.value.size} bytes)
文件类型: ${getFileType(parsedData.value.filename)}
SHA1: ${parsedData.value.sha1}
CRC32: ${parsedData.value.crc32}
原始链接: ${parsedData.value.originalLink}`

  await copyToClipboard(allInfo)
}

// 复制原始链接
const copyOriginalLink = async () => {
  if (!parsedData.value) return
  await copyToClipboard(parsedData.value.originalLink)
}

// 在浏览器中打开
const openInBrowser = () => {
  if (!parsedData.value) return

  try {
    window.open(parsedData.value.originalLink, '_blank')
  } catch (error) {
    console.error('打开链接失败:', error)
    // 如果直接打开失败，复制到剪贴板
    copyOriginalLink()
  }
}

// 清空输入
const clearInput = () => {
  linkInput.value = ''
  parsedData.value = null
  parseError.value = false
  errorMessage.value = ''
}

// 加载示例
const loadExample = () => {
  linkInput.value = exampleLink
  handleInputChange()
}
</script>

<style lang="scss" scoped>
/* 响应式调整 */
@media (max-width: 768px) {
  .textarea {
    height: 8rem;
  }
}
</style>
