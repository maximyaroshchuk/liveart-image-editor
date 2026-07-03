<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Ban, Contrast, Sun } from 'lucide-vue-next'
import { useEditorStore } from '@/stores/editor'
import type { FilterValue } from '@/types/editor'

const store = useEditorStore()
const { filterValue } = storeToRefs(store)

const options: Array<{ label: string; value: FilterValue; icon: typeof Ban }> = [
  { label: 'None', value: null, icon: Ban },
  { label: 'Grayscale', value: 'grayscale', icon: Contrast },
  { label: 'Sepia', value: 'sepia', icon: Sun },
]
</script>

<template>
  <section class="panel">
    <h2 class="panel__title">
      Filter
    </h2>

    <v-row no-gutters class="flex-wrap ga-2">
      <v-col v-for="option in options" :key="option.label" cols="auto">
        <v-btn
          stacked
          size="small"
          :variant="filterValue === option.value ? 'flat' : 'outlined'"
          :color="filterValue === option.value ? 'primary' : undefined"
          class="stacked-grid__btn"
          @click="store.setFilter(option.value)"
        >
          <component :is="option.icon" :size="16" />
          {{ option.label }}
        </v-btn>
      </v-col>
    </v-row>
  </section>
</template>
