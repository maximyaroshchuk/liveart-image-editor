<script setup lang="ts">
import { storeToRefs } from 'pinia'
import PreviewStage from '@/components/editor/PreviewStage.vue'
import Sidebar from '@/components/editor/Sidebar.vue'
import { useEditorStore } from '@/stores/editor'

const store = useEditorStore()
const { error } = storeToRefs(store)
</script>

<template>
  <v-container fluid class="layout">
    <v-alert
      v-if="error"
      type="error"
      closable
      class="mb-4"
      @click:close="store.clearError()"
    >
      {{ error }}
    </v-alert>

    <v-row class="layout__body" no-gutters>
      <v-col cols="12" md="4" lg="3" class="layout__sidebar pr-md-4 mb-4 mb-md-0">
        <Sidebar />
      </v-col>

      <v-col cols="12" md="8" lg="9" class="layout__stage">
        <PreviewStage />
      </v-col>
    </v-row>
  </v-container>
</template>
