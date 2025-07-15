<template>
  <div class="qrcode-generator-container min-h-screen bg-base-100">
    <!-- 页面标题 -->
    <div class="bg-gradient-to-r from-primary/5 to-secondary/5 py-8">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <!-- 返回按钮 -->
          <div class="flex items-center justify-center mb-6">
            <button 
              @click="goBackToMain"
              class="btn btn-ghost btn-circle mr-4"
              title="返回主页"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 class="text-4xl font-bold text-base-content">
              📱 二维码生成器
            </h1>
          </div>
          <p class="text-lg text-base-content/70 max-w-2xl mx-auto">
            快速生成各种类型的二维码，支持自定义样式和智能标签管理
          </p>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 左侧：内容输入区域 -->
        <div class="space-y-6">
          <!-- 内容类型选择 -->
          <div class="card bg-base-200 shadow-sm">
            <div class="card-body p-6">
              <h3 class="card-title text-lg mb-4">📝 选择内容类型</h3>
              
              <!-- 选项卡导航 -->
              <div class="tabs tabs-boxed mb-6">
                <a 
                  v-for="type in contentTypes" 
                  :key="type.id"
                  class="tab"
                  :class="{ 'tab-active': currentType === type.id }"
                  @click="switchContentType(type.id)"
                >
                  {{ type.icon }} {{ type.name }}
                </a>
              </div>

              <!-- 内容输入表单 -->
              <div class="space-y-4">
                <!-- 文本类型 - 新的标签式设计 -->
                <div v-show="currentType === 'text'">
                  <label class="label">
                    <span class="label-text font-medium">文本内容</span>
                  </label>
                  
                  <!-- 标签容器 -->
                  <div class="min-h-32 p-4 bg-base-100 rounded-lg border-2 border-base-300 focus-within:border-primary transition-colors">
                    <!-- 现有标签 -->
                    <div class="flex flex-wrap gap-2 mb-3" v-if="textTags.length > 0">
                      <div 
                        v-for="(tag, index) in textTags" 
                        :key="tag.id"
                        class="tag-item group"
                        :class="{ 
                          'tag-editing': editingTagId === tag.id,
                          'tag-selected': selectedTagId === tag.id,
                          'tag-dragging': dragState.draggedId === tag.id,
                          'tag-drop-target': dragState.dropTargetIndex === index
                        }"
                        :draggable="editingTagId !== tag.id"
                        @dragstart="handleDragStart($event, tag, index)"
                        @dragover="handleDragOver($event, index)"
                        @dragenter="handleDragEnter($event, index)"
                        @dragleave="handleDragLeave($event, index)"
                        @drop="handleDrop($event, index)"
                        @dragend="handleDragEnd"
                      >
                        <!-- 正常显示模式 -->
                        <div 
                          v-if="editingTagId !== tag.id"
                          class="tag-badge cursor-pointer transition-all"
                          :class="getTagColorClass(tag, selectedTagId === tag.id)"
                          @dblclick="startEditingTag(tag)"
                          @click="selectTag(tag)"
                          :title="`拖拽排序 • 双击编辑 • 单击选择生成二维码`"
                        >
                          <span class="truncate flex-1 font-mono text-xs">{{ tag.content }}</span>
                          <button 
                            @click.stop="deleteTag(tag.id)"
                            class="delete-btn opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                            title="删除"
                          >
                            ✕
                          </button>
                        </div>
                        
                        <!-- 编辑模式 -->
                        <div 
                          v-else
                          class="tag-badge transition-all border-dashed"
                          :class="getTagColorClass(tag, selectedTagId === tag.id, true)"
                        >
                          <input 
                            v-model="editingContent"
                            @keyup.enter="saveTagEdit(tag)"
                            @keyup.escape="cancelTagEdit"
                            @blur="saveTagEdit(tag)"
                            class="bg-transparent border-none outline-none font-mono text-xs flex-1 min-w-0 placeholder-current"
                            :class="getTagTextColorClass(tag)"
                            ref="tagEditInput"
                            :style="{ width: Math.max(60, editingContent.length * 7) + 'px' }"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <!-- 添加新标签 -->
                    <div v-if="isAddingTag" class="mb-2">
                      <input 
                        v-model="newTagContent"
                        @keyup.enter="addNewTag"
                        @keyup.escape="cancelAddTag"
                        @blur="handleAddTagBlur"
                        class="input input-bordered input-sm w-full font-mono text-sm"
                        placeholder="输入文本内容，回车确认，ESC取消..."
                        ref="newTagInput"
                      />
                    </div>
                    
                    <!-- 添加按钮 -->
                    <button 
                      v-if="!isAddingTag"
                      @click="startAddingTag"
                      class="btn btn-sm btn-outline btn-primary"
                    >
                      ➕ 添加内容
                    </button>
                    
                    <!-- 空状态提示 -->
                    <div v-if="textTags.length === 0 && !isAddingTag" class="text-center py-4 text-base-content/50">
                      <div class="text-3xl mb-2">📝</div>
                      <p class="text-sm">点击"添加内容"开始创建文本标签</p>
                    </div>
                  </div>
                  
                  <!-- 操作提示 -->
                  <div class="text-xs text-base-content/60 mt-2">
                    💡 拖拽标签排序，单击选择生成二维码，双击编辑内容（回车确认，ESC取消），悬停显示删除按钮
                  </div>
                </div>

                <!-- URL类型 -->
                <div v-show="currentType === 'url'">
                  <label class="label">
                    <span class="label-text font-medium">网址链接</span>
                  </label>
                  <label class="input input-bordered flex items-center gap-2">
                    🌐
                    <input 
                      v-model="contentData.url"
                      type="url" 
                      class="grow" 
                      placeholder="https://example.com"
                      @input="updateQRCode"
                    />
                  </label>
                </div>

                <!-- WiFi类型 -->
                <div v-show="currentType === 'wifi'" class="space-y-4">
                  <div>
                    <label class="label">
                      <span class="label-text font-medium">网络名称 (SSID)</span>
                    </label>
                    <input 
                      v-model="contentData.wifi.ssid"
                      type="text" 
                      class="input input-bordered w-full"
                      placeholder="WiFi网络名称"
                      @input="updateQRCode"
                    />
                  </div>
                  <div>
                    <label class="label">
                      <span class="label-text font-medium">密码</span>
                    </label>
                    <input 
                      v-model="contentData.wifi.password"
                      type="password" 
                      class="input input-bordered w-full"
                      placeholder="WiFi密码"
                      @input="updateQRCode"
                    />
                  </div>
                  <div>
                    <label class="label">
                      <span class="label-text font-medium">加密类型</span>
                    </label>
                    <select 
                      v-model="contentData.wifi.encryption"
                      class="select select-bordered w-full"
                      @change="updateQRCode"
                    >
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">无密码</option>
                    </select>
                  </div>
                </div>

                <!-- 联系人类型 -->
                <div v-show="currentType === 'contact'" class="space-y-4">
                  <div>
                    <label class="label">
                      <span class="label-text font-medium">姓名</span>
                    </label>
                    <input 
                      v-model="contentData.contact.name"
                      type="text" 
                      class="input input-bordered w-full"
                      placeholder="联系人姓名"
                      @input="updateQRCode"
                    />
                  </div>
                  <div>
                    <label class="label">
                      <span class="label-text font-medium">电话</span>
                    </label>
                    <input 
                      v-model="contentData.contact.phone"
                      type="tel" 
                      class="input input-bordered w-full"
                      placeholder="手机号码"
                      @input="updateQRCode"
                    />
                  </div>
                  <div>
                    <label class="label">
                      <span class="label-text font-medium">邮箱</span>
                    </label>
                    <input 
                      v-model="contentData.contact.email"
                      type="email" 
                      class="input input-bordered w-full"
                      placeholder="邮箱地址"
                      @input="updateQRCode"
                    />
                  </div>
                </div>

                <!-- 电话类型 -->
                <div v-show="currentType === 'phone'">
                  <label class="label">
                    <span class="label-text font-medium">电话号码</span>
                  </label>
                  <label class="input input-bordered flex items-center gap-2">
                    📞
                    <input 
                      v-model="contentData.phone"
                      type="tel" 
                      class="grow" 
                      placeholder="手机号码或固定电话"
                      @input="updateQRCode"
                    />
                  </label>
                </div>

                <!-- 短信类型 -->
                <div v-show="currentType === 'sms'" class="space-y-4">
                  <div>
                    <label class="label">
                      <span class="label-text font-medium">收件人号码</span>
                    </label>
                    <input 
                      v-model="contentData.sms.number"
                      type="tel" 
                      class="input input-bordered w-full"
                      placeholder="收件人手机号"
                      @input="updateQRCode"
                    />
                  </div>
                  <div>
                    <label class="label">
                      <span class="label-text font-medium">短信内容</span>
                    </label>
                    <textarea 
                      v-model="contentData.sms.message"
                      class="textarea textarea-bordered w-full h-24"
                      placeholder="预设短信内容（可选）"
                      @input="updateQRCode"
                    ></textarea>
                  </div>
                </div>

                <!-- 全局操作按钮 -->
                <div class="flex gap-2 pt-4" v-if="currentType !== 'text'">
                  <button 
                    class="btn btn-outline flex-1"
                    @click="clearCurrentContent"
                  >
                    🗑️ 清空
                  </button>
                </div>
                
                <!-- 文本类型的操作按钮 -->
                <div class="flex gap-2 pt-4" v-if="currentType === 'text'">
                  <button 
                    class="btn btn-outline flex-1"
                    @click="clearAllTags"
                    :disabled="textTags.length === 0"
                  >
                    🗑️ 清空所有标签
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 外观设置 -->
          <div class="card bg-base-200 shadow-sm">
            <div class="card-body p-6">
              <h3 class="card-title text-lg mb-4">🎨 外观设置</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- 尺寸设置 -->
                <div>
                  <label class="label">
                    <span class="label-text font-medium">尺寸大小</span>
                  </label>
                  <select 
                    v-model="qrSettings.size"
                    class="select select-bordered w-full"
                    @change="updateQRCode"
                  >
                    <option :value="200">小尺寸 (200×200)</option>
                    <option :value="300">中等尺寸 (300×300)</option>
                    <option :value="500">大尺寸 (500×500)</option>
                    <option :value="800">超大尺寸 (800×800)</option>
                  </select>
                </div>

                <!-- 纠错级别 -->
                <div>
                  <label class="label">
                    <span class="label-text font-medium">纠错级别</span>
                  </label>
                  <select 
                    v-model="qrSettings.level"
                    class="select select-bordered w-full"
                    @change="updateQRCode"
                  >
                    <option value="L">L - 低 (7%)</option>
                    <option value="M">M - 中 (15%)</option>
                    <option value="Q">Q - 高 (25%)</option>
                    <option value="H">H - 最高 (30%)</option>
                  </select>
                </div>

                <!-- 前景色 -->
                <div>
                  <label class="label">
                    <span class="label-text font-medium">前景色</span>
                  </label>
                  <input 
                    v-model="qrSettings.foreground"
                    type="color" 
                    class="input input-bordered w-full h-12"
                    @input="updateQRCode"
                  />
                </div>

                <!-- 背景色 -->
                <div>
                  <label class="label">
                    <span class="label-text font-medium">背景色</span>
                  </label>
                  <input 
                    v-model="qrSettings.background"
                    type="color" 
                    class="input input-bordered w-full h-12"
                    @input="updateQRCode"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：二维码预览区域 -->
        <div class="space-y-6">
          <div class="card bg-base-200 shadow-sm">
            <div class="card-body p-6">
              <h3 class="card-title text-lg mb-4">👁️ 二维码预览</h3>
              
              <!-- 二维码显示区域 -->
              <div class="bg-white rounded-lg p-8 flex items-center justify-center min-h-80">
                <div v-if="currentQRValue" class="qr-preview">
                  <!-- 临时占位符，等待依赖安装完成后替换为真实的二维码组件 -->
                  <div class="w-72 h-72 bg-base-300 rounded-lg flex flex-col items-center justify-center text-base-content/60">
                    <div class="text-6xl mb-4">📱</div>
                    <div class="text-center">
                      <p class="font-bold mb-2">二维码预览</p>
                      <p class="text-sm">{{ currentQRValue.substring(0, 50) }}{{ currentQRValue.length > 50 ? '...' : '' }}</p>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center text-base-content/50">
                  <div class="text-6xl mb-4">📱</div>
                  <p class="text-lg">请选择内容生成二维码</p>
                  <p class="text-sm mt-2" v-if="currentType === 'text' && textTags.length > 0">单击文本标签即可生成二维码</p>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex gap-2 mt-6" v-if="currentQRValue">
                <button 
                  class="btn btn-primary flex-1"
                  @click="downloadQRCode"
                >
                  💾 下载PNG
                </button>
                <button 
                  class="btn btn-outline"
                  @click="copyQRCodeToClipboard"
                >
                  📋 复制
                </button>
              </div>

              <!-- 当前内容信息 -->
              <div v-if="currentQRValue" class="mt-4 p-4 bg-base-100 rounded-lg">
                <div class="text-sm text-base-content/70 mb-2">当前内容</div>
                <div class="font-mono text-sm break-all">{{ currentQRValue }}</div>
                <div class="mt-2 flex gap-4 text-xs text-base-content/60">
                  <span>类型: {{ getCurrentTypeName }}</span>
                  <span>尺寸: {{ qrSettings.size }}×{{ qrSettings.size }}</span>
                  <span>纠错: {{ qrSettings.level }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick, watch, getCurrentInstance } from 'vue'
// 临时注释掉，待依赖安装完成后启用
// import QrcodeVue from 'qrcode.vue'

// 内容类型定义
interface ContentType {
  id: string
  name: string
  icon: string
}

interface QRSettings {
  size: number
  level: 'L' | 'M' | 'Q' | 'H'
  background: string
  foreground: string
  margin: number
}

interface TextTag {
  id: string
  content: string
  timestamp: number
}

// 响应式数据
const currentType = ref<string>('text')
const selectedTagId = ref<string>('')
const editingTagId = ref<string>('')
const editingContent = ref<string>('')
const isAddingTag = ref<boolean>(false)
const newTagContent = ref<string>('')

// 文本标签数据
const textTags = ref<TextTag[]>([])

// 内容类型配置
const contentTypes: ContentType[] = [
  { id: 'text', name: '文本', icon: '📝' },
  { id: 'url', name: '网址', icon: '🌐' },
  { id: 'wifi', name: 'WiFi', icon: '📶' },
  { id: 'contact', name: '联系人', icon: '👤' },
  { id: 'phone', name: '电话', icon: '📞' },
  { id: 'sms', name: '短信', icon: '💬' }
]

// 标签颜色配置
const tagColors = [
  {
    light: { bg: 'bg-blue-100', border: 'border-blue-200', text: 'text-blue-800' },
    dark: { bg: 'bg-blue-200', border: 'border-blue-400', text: 'text-blue-900' }
  },
  {
    light: { bg: 'bg-green-100', border: 'border-green-200', text: 'text-green-800' },
    dark: { bg: 'bg-green-200', border: 'border-green-400', text: 'text-green-900' }
  },
  {
    light: { bg: 'bg-purple-100', border: 'border-purple-200', text: 'text-purple-800' },
    dark: { bg: 'bg-purple-200', border: 'border-purple-400', text: 'text-purple-900' }
  },
  {
    light: { bg: 'bg-pink-100', border: 'border-pink-200', text: 'text-pink-800' },
    dark: { bg: 'bg-pink-200', border: 'border-pink-400', text: 'text-pink-900' }
  },
  {
    light: { bg: 'bg-indigo-100', border: 'border-indigo-200', text: 'text-indigo-800' },
    dark: { bg: 'bg-indigo-200', border: 'border-indigo-400', text: 'text-indigo-900' }
  },
  {
    light: { bg: 'bg-teal-100', border: 'border-teal-200', text: 'text-teal-800' },
    dark: { bg: 'bg-teal-200', border: 'border-teal-400', text: 'text-teal-900' }
  },
  {
    light: { bg: 'bg-orange-100', border: 'border-orange-200', text: 'text-orange-800' },
    dark: { bg: 'bg-orange-200', border: 'border-orange-400', text: 'text-orange-900' }
  },
  {
    light: { bg: 'bg-red-100', border: 'border-red-200', text: 'text-red-800' },
    dark: { bg: 'bg-red-200', border: 'border-red-400', text: 'text-red-900' }
  },
  {
    light: { bg: 'bg-cyan-100', border: 'border-cyan-200', text: 'text-cyan-800' },
    dark: { bg: 'bg-cyan-200', border: 'border-cyan-400', text: 'text-cyan-900' }
  },
  {
    light: { bg: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-800' },
    dark: { bg: 'bg-emerald-200', border: 'border-emerald-400', text: 'text-emerald-900' }
  }
]

// 内容数据
const contentData = reactive({
  url: '',
  wifi: {
    ssid: '',
    password: '',
    encryption: 'WPA'
  },
  contact: {
    name: '',
    phone: '',
    email: ''
  },
  phone: '',
  sms: {
    number: '',
    message: ''
  }
})

// 二维码设置
const qrSettings = reactive<QRSettings>({
  size: 300,
  level: 'M',
  background: '#ffffff',
  foreground: '#000000',
  margin: 0
})

// 拖拽状态
const dragState = reactive({
  draggedId: '',
  dropTargetIndex: -1
})

// 计算属性
const currentQRValue = computed(() => {
  switch (currentType.value) {
    case 'text':
      // 对于文本类型，返回选中标签的内容
      const selectedTag = textTags.value.find(tag => tag.id === selectedTagId.value)
      return selectedTag ? selectedTag.content : ''
    case 'url':
      return contentData.url
    case 'wifi':
      if (contentData.wifi.ssid) {
        return `WIFI:T:${contentData.wifi.encryption};S:${contentData.wifi.ssid};P:${contentData.wifi.password};;`
      }
      return ''
    case 'contact':
      if (contentData.contact.name) {
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${contentData.contact.name}\nTEL:${contentData.contact.phone}\nEMAIL:${contentData.contact.email}\nEND:VCARD`
      }
      return ''
    case 'phone':
      return contentData.phone ? `tel:${contentData.phone}` : ''
    case 'sms':
      if (contentData.sms.number) {
        return `sms:${contentData.sms.number}${contentData.sms.message ? '?body=' + encodeURIComponent(contentData.sms.message) : ''}`
      }
      return ''
    default:
      return ''
  }
})

const getCurrentTypeName = computed(() => {
  const type = contentTypes.find(t => t.id === currentType.value)
  return type ? type.name : ''
})

// 方法
const switchContentType = (typeId: string) => {
  currentType.value = typeId
  selectedTagId.value = '' // 切换类型时清空选中状态
  updateQRCode()
}

const updateQRCode = () => {
  // 防抖处理，避免频繁更新
  // 这里可以添加防抖逻辑
}

// 文本标签管理方法
const startAddingTag = () => {
  isAddingTag.value = true
  newTagContent.value = ''
  nextTick(() => {
    const input = document.querySelector('input[ref="newTagInput"]') as HTMLInputElement
    if (input) {
      input.focus()
    }
  })
}

const addNewTag = () => {
  if (newTagContent.value.trim()) {
    const newTag: TextTag = {
      id: Date.now().toString(),
      content: newTagContent.value.trim(),
      timestamp: Date.now()
    }
    
    // 避免重复添加相同内容
    const existingIndex = textTags.value.findIndex(tag => tag.content === newTag.content)
    if (existingIndex === -1) {
      textTags.value.unshift(newTag)
      
      // 限制标签数量
      if (textTags.value.length > 20) {
        textTags.value = textTags.value.slice(0, 20)
      }
      
      saveTagsToLocal()
    }
    
    // 自动选中新添加的标签
    selectedTagId.value = newTag.id
  }
  
  cancelAddTag()
}

const handleAddTagBlur = () => {
  addNewTag()
}

const cancelAddTag = () => {
  isAddingTag.value = false
  newTagContent.value = ''
}

const selectTag = (tag: TextTag) => {
  selectedTagId.value = tag.id
  updateQRCode()
}

// 获取标签颜色类名
const getTagColorClass = (tag: TextTag, isSelected: boolean, isEditing: boolean = false) => {
  // 根据标签ID的哈希值确定颜色索引，确保同一标签始终使用同一颜色
  const colorIndex = Math.abs(tag.id.split('').reduce((a, b) => {
    return ((a << 5) - a + b.charCodeAt(0)) | 0
  }, 0)) % tagColors.length
  
  const colorScheme = tagColors[colorIndex]
  const colors = isSelected ? colorScheme.dark : colorScheme.light
  
  if (isEditing) {
    return `${colors.bg} border-dashed ${colors.text}`
  }
  return `${colors.bg} ${colors.border} ${colors.text}`
}

const getTagTextColorClass = (tag: TextTag) => {
  // 根据标签ID的哈希值确定颜色索引，确保同一标签始终使用同一颜色
  const colorIndex = Math.abs(tag.id.split('').reduce((a, b) => {
    return ((a << 5) - a + b.charCodeAt(0)) | 0
  }, 0)) % tagColors.length
  
  const colorScheme = tagColors[colorIndex]
  return colorScheme.light.text
}

const startEditingTag = (tag: TextTag) => {
  editingTagId.value = tag.id
  editingContent.value = tag.content
  nextTick(() => {
    const input = document.querySelector('input[ref="tagEditInput"]') as HTMLInputElement
    if (input) {
      input.focus()
      input.select()
    }
  })
}

const saveTagEdit = (tag: TextTag) => {
  if (editingContent.value.trim()) {
    tag.content = editingContent.value.trim()
    saveTagsToLocal()
  }
  cancelTagEdit()
}

const cancelTagEdit = () => {
  editingTagId.value = ''
  editingContent.value = ''
}

const deleteTag = (tagId: string) => {
  const index = textTags.value.findIndex(tag => tag.id === tagId)
  if (index !== -1) {
    textTags.value.splice(index, 1)
    saveTagsToLocal()
  }
  if (selectedTagId.value === tagId) {
    selectedTagId.value = ''
  }
}

const clearAllTags = () => {
  textTags.value = []
  selectedTagId.value = ''
  saveTagsToLocal()
}

const clearCurrentContent = () => {
  switch (currentType.value) {
    case 'url':
      contentData.url = ''
      break
    case 'wifi':
      contentData.wifi = { ssid: '', password: '', encryption: 'WPA' }
      break
    case 'contact':
      contentData.contact = { name: '', phone: '', email: '' }
      break
    case 'phone':
      contentData.phone = ''
      break
    case 'sms':
      contentData.sms = { number: '', message: '' }
      break
  }
}

const downloadQRCode = () => {
  // 下载功能实现
  console.log('下载二维码')
}

const copyQRCodeToClipboard = () => {
  // 复制到剪贴板功能
  console.log('复制到剪贴板')
}

const saveTagsToLocal = () => {
  localStorage.setItem('qrcode-text-tags', JSON.stringify(textTags.value))
}

const loadTagsFromLocal = () => {
  const saved = localStorage.getItem('qrcode-text-tags')
  if (saved) {
    try {
      textTags.value = JSON.parse(saved)
    } catch (e) {
      console.error('加载文本标签失败:', e)
    }
  }
}

// 拖拽事件处理
const handleDragStart = (event: DragEvent, tag: TextTag, index: number) => {
  // 如果当前标签正在编辑，阻止拖拽
  if (editingTagId.value === tag.id) {
    event.preventDefault()
    return
  }
  
  dragState.draggedId = tag.id
  dragState.dropTargetIndex = -1
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', tag.id)
    event.dataTransfer.effectAllowed = 'move'
  }
}

const handleDragOver = (event: DragEvent, index: number) => {
  event.preventDefault() // 允许放置
  dragState.dropTargetIndex = index
}

const handleDragEnter = (event: DragEvent, index: number) => {
  event.preventDefault()
  if (dragState.draggedId) {
    dragState.dropTargetIndex = index
  }
}

const handleDragLeave = (event: DragEvent, index: number) => {
  // 只有当鼠标真正离开元素时才清除高亮
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY
  
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    if (dragState.dropTargetIndex === index) {
      dragState.dropTargetIndex = -1
    }
  }
}

const handleDrop = (event: DragEvent, index: number) => {
  event.preventDefault()
  const draggedId = dragState.draggedId
  
  if (draggedId) {
    const draggedIndex = textTags.value.findIndex(tag => tag.id === draggedId)
    const targetIndex = index
    
    if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
      // 移动标签到新位置
      const [movedTag] = textTags.value.splice(draggedIndex, 1)
      textTags.value.splice(targetIndex, 0, movedTag)
      saveTagsToLocal()
    }
  }
  
  // 重置拖拽状态
  dragState.draggedId = ''
  dragState.dropTargetIndex = -1
}

const handleDragEnd = () => {
  // 清理所有拖拽状态
  dragState.draggedId = ''
  dragState.dropTargetIndex = -1
  
  // 移除可能残留的样式
  document.querySelectorAll('.tag-item').forEach(el => {
    el.classList.remove('bg-base-300')
  })
}

// 生命周期
onMounted(() => {
  loadTagsFromLocal()
})

// 返回主页方法
const goBackToMain = () => {
  // 尝试调用父组件的方法
  try {
    const parent = getCurrentInstance()?.parent
    if (parent && parent.exposed && parent.exposed.goBackToMain) {
      parent.exposed.goBackToMain()
    } else {
      // 兜底方案：刷新页面回到主页
      window.location.reload()
    }
  } catch (error) {
    console.error('返回主页失败:', error)
    window.location.reload()
  }
}
</script>

<script lang="ts">
export default {
  name: 'QRCodeGenerator'
}
</script>

<style scoped>
.qrcode-generator-container {
  min-height: 100vh;
}

.tag-item {
  transition: all 0.3s ease;
}

/* 新的标签样式 */
.tag-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  border-width: 1px;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
  max-width: 200px;
  line-height: 1.2;
}

.tag-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 选中状态的额外样式 */
.tag-selected .tag-badge {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  transform: scale(1.02);
}

/* 删除按钮样式 */
.delete-btn {
  border-radius: 50%;
  width: 0.875rem;
  height: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  line-height: 1;
  transition: all 0.2s ease;
  background: transparent;
  border: none;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: rgba(239, 68, 68, 0.2);
  color: rgb(239, 68, 68);
}

.qr-preview {
  transition: all 0.3s ease;
}

/* 标签编辑输入框样式 */
.tag-editing input {
  background: transparent;
  border: none;
  outline: none;
  color: inherit;
}

/* 自适应输入框宽度 */
.tag-editing input {
  min-width: 100px;
  max-width: 300px;
}

/* 标签动画效果 */
@keyframes tagAppear {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.tag-item {
  animation: tagAppear 0.3s ease-out;
}

/* 焦点状态样式 */
.focus-within\:border-primary:focus-within {
  border-color: hsl(var(--p));
}

/* 拖拽相关样式 */
.tag-item[draggable="true"] {
  cursor: grab;
}

.tag-item[draggable="true"]:active {
  cursor: grabbing;
}

.tag-item[draggable="false"] {
  cursor: default;
}

.tag-editing {
  cursor: default !important;
}

.tag-dragging {
  opacity: 0.5;
  transform: rotate(2deg);
  z-index: 100;
}

.tag-drop-target {
  background-color: rgba(59, 130, 246, 0.1);
  border: 2px dashed rgba(59, 130, 246, 0.3);
  border-radius: 0.5rem;
  transform: scale(1.05);
}

/* 拖拽时的标签样式 */
.tag-dragging .tag-badge {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  transform: rotate(-1deg);
}
</style> 
