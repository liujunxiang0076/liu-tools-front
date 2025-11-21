<template>
  <div class="min-h-screen bg-base-200 py-4 md:py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- 页面标题 -->
      <div class="mb-6 md:mb-8">
        <div class="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <button 
            @click="goBack"
            class="btn btn-ghost btn-circle touch-manipulation"
          >
            <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span class="text-2xl md:text-3xl">🔐</span>
          <h1 class="text-xl md:text-2xl font-bold text-base-content">JWT 解析器</h1>
        </div>
        <p class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
          JWT Token 解析和验证工具，查看 Header、Payload 和签名信息
        </p>
      </div>

      <!-- 输入区域 -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-lg mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-base-content">JWT Token</h2>
          <div class="flex gap-2">
            <button 
              @click="clearToken"
              class="btn btn-sm btn-ghost"
              :disabled="!token"
            >
              清空
            </button>
            <button 
              @click="loadExample"
              class="btn btn-sm btn-outline"
            >
              示例
            </button>
          </div>
        </div>
        
        <textarea
          v-model="token"
          @input="decodeToken"
          placeholder="请输入 JWT Token..."
          class="textarea textarea-bordered w-full h-32 font-mono text-sm resize-none"
        ></textarea>

        <div v-if="error" class="mt-3 p-3 bg-error/10 border border-error/20 rounded-lg">
          <div class="flex items-start gap-2">
            <svg class="w-4 h-4 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <div>
              <div class="text-sm font-medium text-error">解析失败</div>
              <div class="text-xs text-error/80 mt-1">{{ error }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 解析结果 -->
      <div v-if="decoded" class="space-y-6">
        <!-- Header -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-base-content">Header</h3>
            <button 
              @click="copyJson(decoded.header)"
              class="btn btn-xs btn-ghost"
            >
              复制
            </button>
          </div>
          <pre class="p-4 bg-base-200 rounded-lg overflow-x-auto"><code class="text-sm">{{ JSON.stringify(decoded.header, null, 2) }}</code></pre>
        </div>

        <!-- Payload -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-base-content">Payload</h3>
            <button 
              @click="copyJson(decoded.payload)"
              class="btn btn-xs btn-ghost"
            >
              复制
            </button>
          </div>
          <pre class="p-4 bg-base-200 rounded-lg overflow-x-auto"><code class="text-sm">{{ JSON.stringify(decoded.payload, null, 2) }}</code></pre>

          <!-- 时间信息 -->
          <div v-if="timeInfo" class="mt-4 space-y-2">
            <div v-if="timeInfo.iat" class="flex items-center justify-between p-3 bg-info/10 rounded-lg">
              <span class="text-sm text-base-content/70">签发时间 (iat)</span>
              <span class="text-sm font-medium text-base-content">{{ timeInfo.iat }}</span>
            </div>
            <div v-if="timeInfo.exp" class="flex items-center justify-between p-3 rounded-lg"
              :class="timeInfo.expired ? 'bg-error/10' : 'bg-success/10'"
            >
              <span class="text-sm text-base-content/70">过期时间 (exp)</span>
              <div class="text-right">
                <div class="text-sm font-medium text-base-content">{{ timeInfo.exp }}</div>
                <div class="text-xs" :class="timeInfo.expired ? 'text-error' : 'text-success'">
                  {{ timeInfo.expired ? '已过期' : '有效' }}
                </div>
              </div>
            </div>
            <div v-if="timeInfo.nbf" class="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
              <span class="text-sm text-base-content/70">生效时间 (nbf)</span>
              <span class="text-sm font-medium text-base-content">{{ timeInfo.nbf }}</span>
            </div>
          </div>
        </div>

        <!-- Signature -->
        <div class="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-base-content">Signature</h3>
            <button 
              @click="copyText(decoded.signature)"
              class="btn btn-xs btn-ghost"
            >
              复制
            </button>
          </div>
          <div class="p-4 bg-base-200 rounded-lg break-all">
            <code class="text-sm font-mono">{{ decoded.signature }}</code>
          </div>
          <div class="mt-3 p-3 bg-warning/10 rounded-lg">
            <p class="text-sm text-base-content/70">
              ⚠️ 注意：此工具仅解析 Token，不验证签名。请勿在此输入敏感信息。
            </p>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!error" class="bg-base-100 rounded-2xl p-12 shadow-lg text-center">
        <div class="text-6xl mb-4">🔐</div>
        <p class="text-base-content/60">输入 JWT Token 开始解析</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const token = ref('')
const error = ref('')
const decoded = ref<any>(null)

const goBack = () => {
  router.push('/')
}

const base64UrlDecode = (str: string): string => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = base64.length % 4
  if (pad) {
    base64 += '='.repeat(4 - pad)
  }
  try {
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
  } catch {
    return atob(base64)
  }
}

const decodeToken = () => {
  error.value = ''
  decoded.value = null

  if (!token.value.trim()) return

  try {
    const parts = token.value.trim().split('.')
    
    if (parts.length !== 3) {
      throw new Error('无效的 JWT 格式，应包含 3 个部分')
    }

    const header = JSON.parse(base64UrlDecode(parts[0]))
    const payload = JSON.parse(base64UrlDecode(parts[1]))
    const signature = parts[2]

    decoded.value = {
      header,
      payload,
      signature
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '解析失败'
  }
}

const timeInfo = computed(() => {
  if (!decoded.value?.payload) return null

  const payload = decoded.value.payload
  const info: any = {}

  if (payload.iat) {
    info.iat = new Date(payload.iat * 1000).toLocaleString('zh-CN')
  }

  if (payload.exp) {
    const expDate = new Date(payload.exp * 1000)
    info.exp = expDate.toLocaleString('zh-CN')
    info.expired = expDate < new Date()
  }

  if (payload.nbf) {
    info.nbf = new Date(payload.nbf * 1000).toLocaleString('zh-CN')
  }

  return Object.keys(info).length > 0 ? info : null
})

const clearToken = () => {
  token.value = ''
  decoded.value = null
  error.value = ''
}

const loadExample = () => {
  token.value = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  decodeToken()
}

const copyJson = async (obj: any) => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(obj, null, 2))
  } catch (error) {
    console.error('复制失败:', error)
  }
}

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (error) {
    console.error('复制失败:', error)
  }
}
</script>

<style scoped>
/* 移动端优化 */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
