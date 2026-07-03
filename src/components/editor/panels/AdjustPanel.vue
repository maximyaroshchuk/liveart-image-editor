<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { Contrast, Palette, RotateCcw, SunMedium } from 'lucide-vue-next'
import { isDefaultAdjustments } from '@/lib/image/adjustments'
import { useEditorStore } from '@/stores/editor'

const store = useEditorStore()
const { adjustments } = storeToRefs(store)

const isDefault = computed(() => isDefaultAdjustments(adjustments.value))

const rows = computed(() => [
  { key: 'brightness' as const, label: 'Brightness', icon: SunMedium, value: adjustments.value.brightness },
  { key: 'contrast' as const, label: 'Contrast', icon: Contrast, value: adjustments.value.contrast },
  { key: 'saturation' as const, label: 'Saturation', icon: Palette, value: adjustments.value.saturation },
])

function toDisplay(value: number) {
  return Math.round(value - 100)
}

function onSlide(key: 'brightness' | 'contrast' | 'saturation', value: number) {
  store.setAdjust({ [key]: value })
}
</script>

<template>
  <section class="panel">
    <h2 class="panel__title">
      Adjustments
    </h2>

    <div v-for="row in rows" :key="row.key" class="adjust-row">
      <div class="adjust-row__head">
        <component :is="row.icon" :size="16" class="adjust-row__icon" />
        <span class="adjust-row__label">{{ row.label }}</span>
        <span class="adjust-row__value">{{ toDisplay(row.value) }}</span>
      </div>
      <v-slider
        :model-value="row.value"
        min="0"
        max="200"
        step="1"
        @update:model-value="(v: number) => onSlide(row.key, v)"
      />
    </div>

    <v-btn
      block
      variant="outlined"
      :disabled="isDefault"
      @click="store.resetAdjustments()"
    >
      <template #prepend>
        <RotateCcw :size="15" />
      </template>
      Reset adjustments
    </v-btn>
  </section>
</template>
