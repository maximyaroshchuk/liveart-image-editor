<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, inject, nextTick, ref, watch } from 'vue'
import { ImagePlus, Upload } from 'lucide-vue-next'
import { useCropper } from '@/composables/useCropper'
import { useImageUpload } from '@/composables/useImageUpload'
import { FILE_DIALOG_KEY } from '@/composables/fileDialogKey'
import { useEditorStore } from '@/stores/editor'
import { ACCEPTED_FORMATS_LABEL } from '@/lib/image/validateImageFile'

const store = useEditorStore()
const {
  objectUrl,
  meta,
  isCropEditing,
  isViewingOriginal,
  appliedCrop,
  cropDraft,
  effectivePreviewCssFilter,
} = storeToRefs(store)

const { isDragOver, onDragEnter, onDragOver, onDragLeave, onDrop } = useImageUpload()
const openFileDialog = inject(FILE_DIALOG_KEY)!

const imageRef = ref<HTMLImageElement | null>(null)

const filterStyle = computed(() => ({ filter: effectivePreviewCssFilter.value }))

const showCroppedPreview = computed(() => !isCropEditing.value && appliedCrop.value !== null)

const croppedPreviewSizerSrc = computed(() => {
  const crop = appliedCrop.value
  if (!crop) return undefined
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${crop.width} ${crop.height}"></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
})

const croppedPreviewStyle = computed(() => {
  const crop = appliedCrop.value
  const naturalWidth = meta.value?.width
  const naturalHeight = meta.value?.height
  if (!crop || !naturalWidth || !naturalHeight || !objectUrl.value) return undefined

  const sizeX = (naturalWidth / crop.width) * 100
  const sizeY = (naturalHeight / crop.height) * 100
  const posX = naturalWidth === crop.width ? 0 : (crop.x / (naturalWidth - crop.width)) * 100
  const posY = naturalHeight === crop.height ? 0 : (crop.y / (naturalHeight - crop.height)) * 100

  return {
    backgroundImage: `url(${objectUrl.value})`,
    backgroundSize: `${sizeX}% ${sizeY}%`,
    backgroundPosition: `${posX}% ${posY}%`,
    filter: effectivePreviewCssFilter.value,
  }
})

const dimensionsLabel = computed(() => {
  const rect = cropDraft.value ?? appliedCrop.value
  const width = rect?.width ?? meta.value?.width
  const height = rect?.height ?? meta.value?.height
  if (!width || !height) return null
  return `${Math.round(width)} × ${Math.round(height)} px`
})

const { init, destroy } = useCropper(imageRef, {
  getInitialCrop: () => appliedCrop.value ?? cropDraft.value,
  onCrop: (rect) => store.setCropDraft(rect),
})

function onImageLoad() {
  if (isCropEditing.value) init()
  else destroy()
}

watch(isCropEditing, async (editing) => {
  if (editing) {
    await nextTick()
    if (imageRef.value?.complete) init()
  }
  else {
    destroy()
  }
})
</script>

<template>
  <div
    ref="dropZone"
    class="preview-stage"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <template v-if="objectUrl">
      <div class="preview-stage__chips">
        <v-chip
          v-if="dimensionsLabel"
          class="preview-stage__chip"
          variant="flat"
        >
          {{ dimensionsLabel }}
        </v-chip>
        <v-chip
          v-if="isViewingOriginal"
          class="preview-stage__chip preview-stage__chip--accent"
          variant="flat"
        >
          Original
        </v-chip>
      </div>

      <div class="preview-stage__body">
        <div class="preview-stage__frame" :style="isCropEditing || showCroppedPreview ? undefined : filterStyle">
          <img
            v-if="showCroppedPreview"
            class="preview-stage__cropped"
            :src="croppedPreviewSizerSrc"
            :style="croppedPreviewStyle"
            alt=""
          >
          <img
            v-show="!showCroppedPreview"
            ref="imageRef"
            :src="objectUrl"
            :alt="meta?.name ?? 'image'"
            class="preview-stage__image"
            @load="onImageLoad"
          >
        </div>
      </div>
    </template>

    <div v-else class="preview-stage__empty" :class="{ 'preview-stage__empty--active': isDragOver }">
      <v-progress-linear
        v-if="store.isLoading"
        indeterminate
        color="primary"
        class="preview-stage__progress"
      />

      <v-avatar color="primary" variant="tonal" size="52" class="mb-3">
        <ImagePlus :size="26" :stroke-width="1.5" />
      </v-avatar>

      <h1 class="text-subtitle-1 font-weight-bold mb-1">
        Upload an image
      </h1>
      <p class="text-body-2 mb-4 preview-stage__hint">
        Drag and drop a file here, or choose one from your device
      </p>

      <v-btn
        color="primary"
        :loading="store.isLoading"
        :disabled="store.isLoading"
        @click="openFileDialog"
      >
        <template #prepend>
          <Upload :size="16" />
        </template>
        Choose file
      </v-btn>

      <v-alert
        v-if="store.error"
        type="error"
        closable
        class="mt-4 text-left"
        @click:close="store.clearError()"
      >
        {{ store.error }}
      </v-alert>

      <p class="text-caption mt-4 mb-0 preview-stage__hint">
        {{ ACCEPTED_FORMATS_LABEL }}
      </p>
    </div>
  </div>
</template>
