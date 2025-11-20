<template>
  <div class="json-tree-root">
    <JsonTreeNode
      :data="data"
      :keyName="''"
      :depth="0"
      :path="'root'"
      :isLast="true"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import JsonTreeNode from './JsonTreeNode.vue'

interface Props {
  data: any
  rootKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  rootKey: 'root'
})
</script>

<style scoped>
.json-tree-root {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Consolas', 'Menlo', 'Courier', monospace;
  font-size: 13px;
  line-height: 1.45;
  color: #24292f;
  padding: 8px;
}

.dark .json-tree-root {
  color: #c9d1d9;
}
</style>
