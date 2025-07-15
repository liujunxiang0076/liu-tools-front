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
                  <div class="flex items-center justify-between mb-2">
                    <label class="label p-0">
                      <span class="label-text font-medium">文本内容</span>
                    </label>
                    <!-- 清空按钮移动到这里 -->
                    <button 
                      v-if="textTags.length > 0"
                      @click="clearAllTags"
                      class="btn btn-ghost btn-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 h-auto min-h-0"
                      title="清空所有标签"
                    >
                      🗑️ 清空所有标签
                    </button>
                  </div>
                  
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
                          <span class="truncate flex-1 text-xs" style="font-family: 'Microsoft YaHei', sans-serif;">{{ tag.content }}</span>
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
                            class="bg-transparent border-none outline-none text-xs flex-1 min-w-0 placeholder-current"
                            :class="getTagTextColorClass(tag)"
                            ref="tagEditInput"
                            :style="{ width: Math.max(60, editingContent.length * 8) + 'px', fontFamily: 'Microsoft YaHei, sans-serif' }"
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
                        class="input input-bordered input-sm w-full text-sm"
                        style="font-family: 'Microsoft YaHei', sans-serif;"
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
                    💡 自动生成最新标签二维码，单击切换选择，拖拽排序，双击编辑内容（回车确认，ESC取消），悬停显示删除按钮
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
                
                <!-- 移除原来的文本类型操作按钮区域 -->
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
                  <canvas 
                    ref="qrCanvas"
                    :width="qrSettings.size" 
                    :height="qrSettings.size"
                    class="border border-gray-200 rounded-lg"
                  ></canvas>
                </div>
                <div v-else class="text-center text-base-content/50">
                  <div class="text-6xl mb-4">📱</div>
                  <p class="text-lg" v-if="currentType === 'text'">添加文本标签生成二维码</p>
                  <p class="text-lg" v-else>请输入内容生成二维码</p>
                  <p class="text-sm mt-2" v-if="currentType === 'text'">添加的第一个标签将自动生成二维码</p>
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
import * as QRCode from 'qrcode'

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

// 标签颜色配置 - 重新设计更美观的颜色方案
const tagColors = [
  {
    name: 'blue',
    bg: 'bg-blue-500',
    text: 'text-blue-500',
    border: 'border-blue-500'
  },
  {
    name: 'emerald', 
    bg: 'bg-emerald-500',
    text: 'text-emerald-500',
    border: 'border-emerald-500'
  },
  {
    name: 'purple',
    bg: 'bg-purple-500', 
    text: 'text-purple-500',
    border: 'border-purple-500'
  },
  {
    name: 'pink',
    bg: 'bg-pink-500',
    text: 'text-pink-500', 
    border: 'border-pink-500'
  },
  {
    name: 'amber',
    bg: 'bg-amber-500',
    text: 'text-amber-500',
    border: 'border-amber-500'
  },
  {
    name: 'cyan',
    bg: 'bg-cyan-500',
    text: 'text-cyan-500',
    border: 'border-cyan-500'
  },
  {
    name: 'rose',
    bg: 'bg-rose-500',
    text: 'text-rose-500',
    border: 'border-rose-500'
  },
  {
    name: 'violet',
    bg: 'bg-violet-500',
    text: 'text-violet-500',
    border: 'border-violet-500'
  },
  {
    name: 'lime',
    bg: 'bg-lime-500',
    text: 'text-lime-500',
    border: 'border-lime-500'
  },
  {
    name: 'orange',
    bg: 'bg-orange-500',
    text: 'text-orange-500',
    border: 'border-orange-500'
  },
  {
    name: 'teal',
    bg: 'bg-teal-500',
    text: 'text-teal-500',
    border: 'border-teal-500'
  },
  {
    name: 'indigo',
    bg: 'bg-indigo-500',
    text: 'text-indigo-500',
    border: 'border-indigo-500'
  },
  {
    name: 'fuchsia',
    bg: 'bg-fuchsia-500',
    text: 'text-fuchsia-500',
    border: 'border-fuchsia-500'
  },
  {
    name: 'green',
    bg: 'bg-green-500',
    text: 'text-green-500',
    border: 'border-green-500'
  },
  {
    name: 'red',
    bg: 'bg-red-500',
    text: 'text-red-500',
    border: 'border-red-500'
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
      // 对于文本类型，优先返回选中标签的内容，如果没有选中则使用最后一个标签
      let targetTag = textTags.value.find(tag => tag.id === selectedTagId.value)
      if (!targetTag && textTags.value.length > 0) {
        // 如果没有选中标签，使用最后一个（最新添加的）标签
        targetTag = textTags.value[textTags.value.length - 1] // 数组最后一个是最新添加的
      }
      return targetTag ? targetTag.content : ''
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
    setTimeout(() => {
      if (newTagInput.value) {
        newTagInput.value.focus()
      }
    }, 10)
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
      textTags.value.push(newTag) // 添加到末尾
      
      // 限制标签数量，如果超出则删除最老的标签
      if (textTags.value.length > 20) {
        textTags.value = textTags.value.slice(-20) // 保留最后20个
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
  // newTagInputRef.value = null // This ref is removed
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
  
  if (isEditing) {
    // 编辑状态：使用彩色背景和白色文字
    return `${colorScheme.bg} ${colorScheme.border} text-white`
  }
  
  // 选中状态：深色背景 + 白色文字
  // 未选中状态：透明背景 + 彩色文字
  if (isSelected) {
    return `${colorScheme.bg} ${colorScheme.border} text-white shadow-sm`
  } else {
    return `bg-transparent ${colorScheme.border} ${colorScheme.text}`
  }
}

const getTagTextColorClass = (tag: TextTag) => {
  // 编辑时使用白色文字以确保在彩色背景上清晰可见
  return 'text-white'
}

const startEditingTag = (tag: TextTag) => {
  editingTagId.value = tag.id
  editingContent.value = tag.content
  
  // 使用nextTick确保DOM更新完成后再聚焦
  nextTick(() => {
    // 使用setTimeout确保ref已经正确设置
    setTimeout(() => {
      if (tagEditInput.value) {
        tagEditInput.value.focus()
        // 将光标定位到文本末尾
        const length = tagEditInput.value.value.length
        tagEditInput.value.setSelectionRange(length, length)
      }
    }, 10)
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
  // tagEditInputRef.value = null // This ref is removed
}

const deleteTag = (tagId: string) => {
  const index = textTags.value.findIndex(tag => tag.id === tagId)
  if (index !== -1) {
    textTags.value.splice(index, 1)
    saveTagsToLocal()
    
    // 如果删除的是当前选中的标签，自动选中下一个可用标签
    if (selectedTagId.value === tagId) {
      if (textTags.value.length > 0) {
        // 优先选择同位置的标签，如果超出则选择最后一个
        const nextIndex = Math.min(index, textTags.value.length - 1)
        selectedTagId.value = textTags.value[nextIndex].id
      } else {
        selectedTagId.value = ''
      }
    }
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

// 实现下载功能
const downloadQRCode = async () => {
  if (!currentQRValue.value) return
  
  try {
    // 生成二维码数据URL
    const dataUrl = await QRCode.toDataURL(currentQRValue.value, {
      width: qrSettings.size,
      margin: qrSettings.margin,
      color: {
        dark: qrSettings.foreground,
        light: qrSettings.background
      },
      errorCorrectionLevel: qrSettings.level
    })
    
    // 创建下载链接
    const link = document.createElement('a')
    link.download = `qrcode-${Date.now()}.png`
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error('下载失败:', error)
  }
}

// 实现复制功能
const copyQRCodeToClipboard = async () => {
  if (!currentQRValue.value) return
  
  try {
    await navigator.clipboard.writeText(currentQRValue.value)
    // 这里可以添加一个提示消息
    console.log('内容已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
  }
}

const saveTagsToLocal = () => {
  localStorage.setItem('qrcode-text-tags', JSON.stringify(textTags.value))
}

const loadTagsFromLocal = () => {
  const saved = localStorage.getItem('qrcode-text-tags')
  if (saved) {
    try {
      const parsedTags = JSON.parse(saved)
      // 为没有时间戳的旧标签补充时间戳
      textTags.value = parsedTags.map((tag: any, index: number) => ({
        ...tag,
        timestamp: tag.timestamp || (Date.now() - (parsedTags.length - index) * 1000)
      }))
      // 按时间戳排序，确保标签按创建时间顺序排列
      textTags.value.sort((a, b) => a.timestamp - b.timestamp)
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
      // 重新计算时间戳来实现真正的顺序调整
      const now = Date.now()
      const draggedTag = textTags.value[draggedIndex]
      
      if (targetIndex > draggedIndex) {
        // 向后拖拽：设置时间戳比目标位置的标签稍晚
        const targetTag = textTags.value[targetIndex]
        const nextTag = textTags.value[targetIndex + 1]
        if (nextTag) {
          draggedTag.timestamp = (targetTag.timestamp + nextTag.timestamp) / 2
        } else {
          draggedTag.timestamp = targetTag.timestamp + 1000
        }
      } else {
        // 向前拖拽：设置时间戳比目标位置的标签稍早
        const targetTag = textTags.value[targetIndex]
        const prevTag = textTags.value[targetIndex - 1]
        if (prevTag) {
          draggedTag.timestamp = (prevTag.timestamp + targetTag.timestamp) / 2
        } else {
          draggedTag.timestamp = targetTag.timestamp - 1000
        }
      }
      
      // 重新排序标签数组（按时间戳排序）
      textTags.value.sort((a, b) => a.timestamp - b.timestamp)
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

// 二维码Canvas引用
const qrCanvas = ref<HTMLCanvasElement | null>(null)

// 输入框引用
const tagEditInput = ref<HTMLInputElement | null>(null)
const newTagInput = ref<HTMLInputElement | null>(null)

// 生成二维码
const generateQRCode = async () => {
  if (!currentQRValue.value || !qrCanvas.value) return
  
  try {
    await QRCode.toCanvas(qrCanvas.value, currentQRValue.value, {
      width: qrSettings.size,
      margin: qrSettings.margin,
      color: {
        dark: qrSettings.foreground,
        light: qrSettings.background
      },
      errorCorrectionLevel: qrSettings.level
    })
  } catch (error) {
    console.error('二维码生成失败:', error)
  }
}

// 监听二维码内容变化
watch(currentQRValue, () => {
  nextTick(() => {
    generateQRCode()
  })
})

// 监听设置变化
watch(qrSettings, () => {
  nextTick(() => {
    generateQRCode()
  })
}, { deep: true })

// 生命周期
onMounted(() => {
  loadTagsFromLocal()
  
  // 如果没有选中标签但有标签存在，自动选中最新的标签
  nextTick(() => {
    if (!selectedTagId.value && textTags.value.length > 0) {
      selectedTagId.value = textTags.value[textTags.value.length - 1].id // 选中最新添加的标签
    }
    // 初始生成二维码
    generateQRCode()
  })
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
  transform: scale(1.02);
  transition: all 0.2s ease;
}

/* 未选中状态的标签 */
.tag-item:not(.tag-selected) .tag-badge {
  transition: all 0.2s ease;
  background-color: transparent !important;
}

.tag-item:not(.tag-selected):hover .tag-badge {
  background-color: rgba(0, 0, 0, 0.05) !important;
  border-color: rgba(0, 0, 0, 0.3) !important;
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
