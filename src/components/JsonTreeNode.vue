<template>
  <div class="json-node-wrapper">
    <!-- 节点开始行 -->
    <div class="json-line">
      <!-- 行号列 -->
      <div class="line-number-col">{{ node.line }}</div>
      
      <!-- 内容列 -->
      <div class="code-content" :style="{ paddingLeft: indentPadding }">
        <!-- 折叠图标/占位 -->
        <div class="expand-control">
          <span 
            v-if="hasChildren" 
            class="expand-icon" 
            :class="{ expanded: isExpanded }"
            @click="toggle"
          >
            <svg viewBox="0 0 24 24" class="arrow-icon">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </span>
        </div>

        <!-- 键名 -->
        <template v-if="node.key">
          <span class="json-key">{{ node.key }}</span>
          <span class="json-colon">: </span>
        </template>

        <!-- 容器开始 -->
        <template v-if="isContainer">
          <span class="json-bracket">{{ node.type === 'array' ? '[' : '{' }}</span>
          
          <!-- 折叠状态预览 -->
          <span v-if="!isExpanded" class="collapsed-preview" @click="toggle">
            <span class="preview-dots">...</span>
            <span class="preview-count">{{ node.itemCount }} {{ node.type === 'array' ? 'items' : 'keys' }}</span>
          </span>
          
          <!-- 折叠状态结束括号 -->
          <span v-if="!isExpanded" class="json-bracket">{{ node.type === 'array' ? ']' : '}' }}</span>
          <span v-if="!isExpanded && !node.isLast" class="json-comma">,</span>
        </template>

        <!-- 基本值 -->
        <template v-else>
          <span :class="valueClass">{{ formattedValue }}</span>
          <span v-if="!node.isLast" class="json-comma">,</span>
        </template>
      </div>
    </div>

    <!-- 子节点区域 -->
    <div v-if="isContainer && isExpanded" class="children-container">
      <JsonTreeNode 
        v-for="child in node.children" 
        :key="child.id" 
        :node="child" 
      />
    </div>

    <!-- 容器结束行 (仅展开且有子节点时显示) -->
    <div v-if="isContainer && isExpanded && hasChildren" class="json-line">
      <div class="line-number-col">{{ node.closeLine }}</div>
      <div class="code-content" :style="{ paddingLeft: indentPadding }">
        <div class="expand-control"></div> <!-- 占位 -->
        <span class="json-bracket">{{ node.type === 'array' ? ']' : '}' }}</span>
        <span v-if="!node.isLast" class="json-comma">,</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps } from 'vue'
import type { VisualNode } from './jsonTreeTypes'

const props = defineProps<{
  node: VisualNode
}>()

const isExpanded = ref(true)

// 超过500项默认折叠，或者深度超过2级默认折叠
if (props.node.depth >= 2 || props.node.itemCount > 500) {
  isExpanded.value = false
}

const isContainer = computed(() => props.node.type === 'object' || props.node.type === 'array')
const hasChildren = computed(() => props.node.children && props.node.children.length > 0)

// 标准 JSON 缩进：每层缩进 2 个字符（约 1.2em）
// 2 个字符 ≈ 1.2em（等宽字体）
const INDENT_PER_LEVEL = 1.2 // em
const indentPadding = computed(() => `${(props.node.depth ?? 0) * INDENT_PER_LEVEL}em`)

const valueClass = computed(() => {
  switch (props.node.type) {
    case 'string': return 'json-string'
    case 'number': return 'json-number'
    case 'boolean': return 'json-boolean'
    case 'null': return 'json-null'
    default: return ''
  }
})

const formattedValue = computed(() => {
  if (props.node.value === null) return 'null'
  if (typeof props.node.value === 'string') return `"${props.node.value}"`
  return String(props.node.value)
})

const toggle = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style lang="scss" scoped>
.json-node-wrapper {
  display: flex;
  flex-direction: column;
}

.json-line {
  display: flex;
  align-items: center;
  line-height: 1.5;
  font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 13px; /* 优化字体大小 */
}

.json-line:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.dark .json-line:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

/* 独立的行号列 */
.line-number-col {
  width: 40px;
  min-width: 40px;
  text-align: right;
  padding-right: 12px;
  color: #9e9e9e;
  user-select: none;
  border-right: 1px solid transparent;
  font-size: 12px;
  opacity: 0.6;
}

.code-content {
  display: flex;
  align-items: center;
  flex: 1;
  padding-left: 4px;
}

/* 折叠控制 */
.expand-control {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  cursor: pointer;
}

.expand-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  color: #666;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.arrow-icon {
  width: 10px;
  height: 10px;
  fill: currentColor;
}

/* 颜色定义 */
.json-key { color: #0066cc; } /* 蓝色键名 */
.json-string { color: #22863a; } /* 绿色字符串 */
.json-number { color: #e36209; } /* 橙色数字 */
.json-boolean { color: #d73a49; } /* 红色布尔值 */
.json-null { color: #6a737d; font-style: italic; }
.json-colon { margin-right: 6px; color: #444; }
.json-bracket { font-weight: bold; color: #444; }
.json-comma { color: #444; }

/* 键名占位符 - 不可见但占据空间，用于对齐括号 */
.key-placeholder {
  visibility: hidden;
  font-weight: 500;
  margin-right: 2px;
}

/* Dark Mode */
.dark .json-key { color: #79b8ff; }
.dark .json-string { color: #85e89d; }
.dark .json-number { color: #ffab70; }
.dark .json-boolean { color: #f97583; }
.dark .json-null { color: #959da5; }
.dark .json-colon,
.dark .json-bracket,
.dark .json-comma { color: #d1d5da; }
.dark .expand-icon { color: #959da5; }

/* 折叠预览 */
.collapsed-preview {
  display: inline-flex;
  align-items: center;
  margin: 0 6px;
  cursor: pointer;
  background: rgba(128, 128, 128, 0.1);
  padding: 0 6px;
  border-radius: 4px;
  font-size: 12px;
}

.preview-dots { margin-right: 4px; color: #888; }
.preview-count { color: #666; }

.dark .preview-dots { color: #aaa; }
.dark .preview-count { color: #bbb; }
</style>
