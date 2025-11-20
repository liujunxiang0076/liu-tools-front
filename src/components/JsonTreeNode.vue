<template>
  <div class="json-tree-node" :style="{ paddingLeft: `${depth * 16}px` }">
    <!-- 对象或数组 -->
    <div v-if="isExpandable" class="json-expandable-line" :data-line="lineNumber">
      <!-- 行号 -->
      <span class="line-number">{{ lineNumber }}</span>
      
      <!-- 折叠按钮 -->
      <button 
        @click="toggleExpand"
        class="expand-btn"
        :class="{ 'expanded': isExpanded }"
      >
        <svg class="w-3 h-3 transition-transform" :class="{ 'rotate-90': isExpanded }" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
      
      <!-- 键名 -->
      <span v-if="keyName" class="json-key">{{ keyName }}</span>
      <span v-if="keyName" class="json-colon">: </span>
      
      <!-- 开始括号 -->
      <span class="json-bracket">{{ isArray ? '[' : '{' }}</span>
      
      <!-- 折叠时的预览 -->
      <span v-if="!isExpanded" class="json-preview">
        <span class="json-ellipsis">...</span>
        <span class="json-count">{{ itemCount }} {{ isArray ? 'items' : 'keys' }}</span>
      </span>
      
      <!-- 展开时不显示结束括号 -->
      <span v-if="!isExpanded" class="json-bracket">{{ isArray ? ']' : '}' }}</span>
      <span v-if="!isExpanded" class="json-comma">,</span>
    </div>

    <!-- 展开的内容 -->
    <div v-if="isExpandable && isExpanded" class="json-expanded-content">
      <JsonTreeNode
        v-for="(value, key, idx) in data"
        :key="String(key)"
        :data="value"
        :keyName="String(key)"
        :depth="depth + 1"
        :path="`${path}.${key}`"
        :isLast="idx === itemCount - 1"
      />
      
      <!-- 结束括号 -->
      <div class="json-closing-bracket" :style="{ paddingLeft: `${depth * 16}px` }">
        <span class="json-bracket">{{ isArray ? ']' : '}' }}</span>
        <span v-if="!isLast" class="json-comma">,</span>
      </div>
    </div>

    <!-- 基本类型值 -->
    <div v-if="!isExpandable" class="json-value-line" :data-line="lineNumber">
      <!-- 行号 -->
      <span class="line-number">{{ lineNumber }}</span>
      
      <span v-if="keyName" class="json-key">{{ keyName }}</span>
      <span v-if="keyName" class="json-colon">: </span>
      <span :class="valueClass">{{ formattedValue }}</span>
      <span v-if="!isLast" class="json-comma">,</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, provide } from 'vue'

interface Props {
  data: any
  keyName?: string
  depth: number
  path: string
  isLast?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  keyName: '',
  isLast: false
})

// 行号计数器 - 使用 provide/inject 在整个树中共享
interface LineCounter {
  current: number
  next: () => number
}

let lineCounterInstance: LineCounter

if (props.depth === 0) {
  // 根节点创建计数器
  lineCounterInstance = {
    current: 0,
    next() {
      return ++this.current
    }
  }
  provide('lineCounter', lineCounterInstance)
} else {
  // 子节点获取计数器
  lineCounterInstance = inject<LineCounter>('lineCounter', {
    current: 0,
    next() {
      return ++this.current
    }
  })
}

const lineNumber = lineCounterInstance.next()
const isExpanded = ref(props.depth < 2) // 默认展开前2层

const isExpandable = computed(() => {
  return typeof props.data === 'object' && props.data !== null
})

const isArray = computed(() => {
  return Array.isArray(props.data)
})

const itemCount = computed(() => {
  if (!isExpandable.value) return 0
  return isArray.value ? props.data.length : Object.keys(props.data).length
})

const valueClass = computed(() => {
  if (props.data === null) return 'json-null'
  if (typeof props.data === 'string') return 'json-string'
  if (typeof props.data === 'number') return 'json-number'
  if (typeof props.data === 'boolean') return 'json-boolean'
  return ''
})

const formattedValue = computed(() => {
  if (props.data === null) return 'null'
  if (typeof props.data === 'string') return `"${props.data}"`
  return String(props.data)
})

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
.json-tree-node {
  position: relative;
}

.json-expandable-line,
.json-value-line {
  display: flex;
  align-items: center;
  padding: 0 8px 0 0;
  min-height: 20px;
  border-radius: 3px;
  transition: background-color 0.1s ease;
}

.json-expandable-line:hover,
.json-value-line:hover {
  background-color: #f6f8fa;
}

.dark .json-expandable-line:hover,
.dark .json-value-line:hover {
  background-color: #161b22;
}

.expand-btn {
  width: 18px;
  height: 18px;
  padding: 0;
  margin-right: 4px;
  margin-left: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #57606a;
  cursor: pointer;
  border-radius: 3px;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.expand-btn:hover {
  background-color: #d0d7de;
  color: #24292f;
}

.dark .expand-btn {
  color: #8B949E;
}

.dark .expand-btn:hover {
  background-color: #30363d;
  color: #c9d1d9;
}

.expand-btn svg {
  transition: transform 0.2s ease;
}

.expand-btn svg.rotate-90 {
  transform: rotate(90deg);
}

/* 行号样式 */
.line-number {
  display: inline-block;
  min-width: 35px;
  padding-right: 8px;
  text-align: right;
  color: #858585;
  font-size: 12px;
  user-select: none;
  font-weight: 400;
  opacity: 0.6;
  flex-shrink: 0;
}

.dark .line-number {
  color: #858585;
}

/* JSON语法高亮 - 专业配色 */
.json-key {
  color: #0066CC;
  font-weight: 500;
  margin-right: 2px;
}

.dark .json-key {
  color: #4FC1FF;
}

.json-colon {
  color: #24292f;
  margin-right: 8px;
  font-weight: 500;
}

.dark .json-colon {
  color: #c9d1d9;
}

.json-bracket {
  color: #24292f;
  font-weight: 600;
}

.dark .json-bracket {
  color: #c9d1d9;
}

.json-comma {
  color: #24292f;
  margin-left: 0;
}

.dark .json-comma {
  color: #c9d1d9;
}

.json-string {
  color: #22863A;
  padding: 0;
  border-radius: 0;
  background: transparent;
}

.dark .json-string {
  color: #85E89D;
}

.json-number {
  color: #E36209;
  font-weight: 500;
  padding: 0;
  border-radius: 0;
  background: transparent;
}

.dark .json-number {
  color: #F0883E;
}

.json-boolean {
  color: #CF222E;
  font-weight: 600;
  padding: 0;
  border-radius: 0;
  background: transparent;
}

.dark .json-boolean {
  color: #FF7B72;
}

.json-null {
  color: #57606a;
  font-style: italic;
  opacity: 1;
  padding: 0;
  border-radius: 0;
  background: transparent;
}

.dark .json-null {
  color: #8B949E;
}

.json-preview {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0 6px;
}

.json-ellipsis {
  color: #57606a;
  font-style: normal;
}

.dark .json-ellipsis {
  color: #8B949E;
}

.json-count {
  color: #57606a;
  font-size: 0.85em;
  background: #f6f8fa;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  border: 1px solid #d0d7de;
}

.dark .json-count {
  color: #8B949E;
  background: #161b22;
  border-color: #30363d;
}

.json-expanded-content {
  position: relative;
}

.json-closing-bracket {
  padding: 2px 0;
  min-height: 24px;
  display: flex;
  align-items: center;
}

/* 移除连接线，采用更简洁的设计 */

/* 响应式优化 */
@media (max-width: 768px) {
  .json-expandable-line,
  .json-value-line {
    font-size: 13px;
  }
  
  .expand-btn {
    width: 18px;
    height: 18px;
  }
}
</style>
