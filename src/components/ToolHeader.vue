<template>
  <div class="mb-6 md:mb-8">
    <div class="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
      <button 
        @click="handleBack"
        class="btn btn-ghost btn-circle touch-manipulation"
      >
        <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <span class="text-2xl md:text-3xl">{{ icon }}</span>
      <h1 class="text-xl md:text-2xl font-bold text-base-content">{{ title }}</h1>
    </div>
    <p v-if="description" class="text-sm md:text-base text-base-content/70 px-4 md:px-0">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useToolNavigation } from '@/composables/useToolNavigation'

interface Props {
  icon: string
  title: string
  description?: string
}

defineProps<Props>()

const { goBack } = useToolNavigation()

const handleBack = () => {
  goBack()
}
</script>
