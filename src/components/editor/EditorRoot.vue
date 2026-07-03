<script setup lang="ts">
import { provide, ref, useTemplateRef, watch } from 'vue'
import Layout from '@/components/editor/Layout.vue'
import { FILE_DIALOG_KEY } from '@/composables/fileDialogKey'
import { useEditorStore } from '@/stores/editor'
import { ACCEPTED_FILE_ACCEPT } from '@/lib/image/validateImageFile'

interface FileInputHandle {
  click: () => void
}

const store = useEditorStore()
const fileInputRef = useTemplateRef<FileInputHandle>('fileInput')
const pendingFile = ref<File | null>(null)

function openFileDialog() {
  fileInputRef.value?.click()
}

watch(pendingFile, async (file) => {
  if (!file || store.isLoading) return
  await store.loadImage(file)
  pendingFile.value = null
})

provide(FILE_DIALOG_KEY, openFileDialog)
</script>

<template>
  <v-file-input
    ref="fileInput"
    v-model="pendingFile"
    class="d-none"
    :accept="ACCEPTED_FILE_ACCEPT"
  />
  <Layout />
</template>
