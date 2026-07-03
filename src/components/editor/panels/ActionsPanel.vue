<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { inject } from 'vue'
import { Eye, FileJson, RotateCcw, Upload } from 'lucide-vue-next'
import { FILE_DIALOG_KEY } from '@/composables/fileDialogKey'
import { useEditorStore } from '@/stores/editor'

const store = useEditorStore()
const { isViewingOriginal, canViewOriginal, operations } = storeToRefs(store)

const openFileDialog = inject(FILE_DIALOG_KEY)!
</script>

<template>
  <section class="panel">
    <h2 class="panel__title">
      Actions
    </h2>

    <v-row no-gutters class="flex-wrap ga-2">
      <v-col cols="auto">
        <v-btn stacked size="small" variant="outlined" class="stacked-grid__btn" @click="openFileDialog">
          <Upload :size="15" />
          New photo
        </v-btn>
      </v-col>

      <v-col cols="auto">
        <v-btn
          stacked
          size="small"
          :variant="isViewingOriginal ? 'flat' : 'outlined'"
          :color="isViewingOriginal ? 'success' : undefined"
          class="stacked-grid__btn"
          :disabled="!canViewOriginal"
          @click="store.toggleViewOriginal()"
        >
          <Eye :size="15" />
          Original
        </v-btn>
      </v-col>

      <v-col cols="auto">
        <v-btn
          stacked
          size="small"
          variant="outlined"
          class="stacked-grid__btn"
          :disabled="!operations.length"
          @click="store.reset()"
        >
          <RotateCcw :size="15" />
          Reset all
        </v-btn>
      </v-col>

      <v-col cols="auto">
        <v-btn
          stacked
          size="small"
          variant="outlined"
          class="stacked-grid__btn"
          :disabled="!store.editDocument"
          @click="store.exportDocumentJson()"
        >
          <FileJson :size="15" />
          JSON
        </v-btn>
      </v-col>
    </v-row>
  </section>
</template>
