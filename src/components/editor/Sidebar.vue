<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Download } from 'lucide-vue-next'
import ActionsPanel from '@/components/editor/panels/ActionsPanel.vue'
import AdjustPanel from '@/components/editor/panels/AdjustPanel.vue'
import CropPanel from '@/components/editor/panels/CropPanel.vue'
import FilterPanel from '@/components/editor/panels/FilterPanel.vue'
import { useEditorStore } from '@/stores/editor'

const store = useEditorStore()
const { hasImage, canExport, isExporting } = storeToRefs(store)
</script>

<template>
  <v-sheet color="transparent" class="sidebar" :class="{ 'sidebar--disabled': !hasImage }">
    <v-card variant="flat" border class="sidebar__card">
      <v-card-text>
        <CropPanel />
      </v-card-text>
    </v-card>

    <v-card variant="flat" border class="sidebar__card">
      <v-card-text>
        <AdjustPanel />
      </v-card-text>
    </v-card>

    <v-card variant="flat" border class="sidebar__card">
      <v-card-text>
        <FilterPanel />
      </v-card-text>
    </v-card>

    <v-card variant="flat" border class="sidebar__card">
      <v-card-text>
        <ActionsPanel />
      </v-card-text>
    </v-card>

    <v-btn
      block
      size="large"
      color="primary"
      :disabled="!canExport"
      :loading="isExporting"
      @click="store.exportImage()"
    >
      <template #prepend>
        <Download :size="16" />
      </template>
      Download image
    </v-btn>
  </v-sheet>
</template>
