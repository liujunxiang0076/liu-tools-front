<template>
  <div class="json-tree-root">
    <div class="json-tree-content">
      <JsonTreeNode v-if="rootNode" :node="rootNode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import JsonTreeNode from './JsonTreeNode.vue'
import { buildVisualTree, LineCounter } from './jsonTreeTypes'
import type { VisualNode } from './jsonTreeTypes'

interface Props {
  data: any
  rootKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  rootKey: 'root'
})

const rootNode = computed<VisualNode | null>(() => {
  if (props.data === undefined) return null
  const counter = new LineCounter()
  // 使用空字符串作为keyName，避免显示root
  return buildVisualTree(props.data, '', 0, 'root', true, counter)
})
</script>

<style scoped>
.json-tree-root {
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.6;
  color: #24292f;
  position: relative;
  height: 100%;
  overflow: auto;
}

.json-tree-content {
  display: flex;
  flex-direction: column;
  min-width: fit-content;
}

.dark .json-tree-root {
  color: #c9d1d9;
}
</style>
