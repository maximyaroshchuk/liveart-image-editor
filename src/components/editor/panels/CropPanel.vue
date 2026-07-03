<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Check, Crop, X } from 'lucide-vue-next'
import { useEditorStore } from '@/stores/editor'

const store = useEditorStore()
const { isCropEditing, isCropApplied, cropDraft } = storeToRefs(store)
</script>

<template>
  <section class="panel">
    <h2 class="panel__title">
      Crop
    </h2>

    <div v-if="!isCropEditing" class="panel__row">
      <v-btn
        variant="outlined"
        block
        :color="isCropApplied ? 'primary' : undefined"
        @click="store.startCropEditing()"
      >
        <template #prepend>
          <Crop :size="16" />
        </template>
        {{ isCropApplied ? 'Edit crop' : 'Crop image' }}
      </v-btn>

      <v-btn
        v-if="isCropApplied"
        variant="text"
        block
        @click="store.clearCrop()"
      >
        Clear crop
      </v-btn>
    </div>

    <v-row v-else no-gutters class="flex-wrap ga-2">
      <v-col>
        <v-btn variant="outlined" block @click="store.cancelCropEditing()">
          <template #prepend>
            <X :size="16" />
          </template>
          Cancel
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          color="primary"
          block
          :disabled="!cropDraft"
          @click="store.applyCrop()"
        >
          <template #prepend>
            <Check :size="16" />
          </template>
          Apply
        </v-btn>
      </v-col>
    </v-row>
  </section>
</template>
