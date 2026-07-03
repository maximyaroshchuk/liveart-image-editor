import { defineStore } from 'pinia'
import { computed, readonly, ref, shallowRef } from 'vue'
import { mergeAdjustments } from '@/lib/image/adjustments'
import { buildEditDocument, downloadEditDocument } from '@/lib/image/document'
import { downloadBlob } from '@/lib/image/downloadFile'
import { exportImageBlob, getExportImageFilename } from '@/lib/image/exportImage'
import {
  adjustmentsFromOperations,
  buildPreviewCssFilter,
  filterFromOperations,
  findCropOperation,
  removeCropOperation,
  upsertAdjustOperation,
  upsertCropOperation,
  upsertFilterOperation,
} from '@/lib/image/operations'
import { loadImageFile } from '@/lib/image/readImageMeta'
import { READ_IMAGE_ERROR, validateImageFile } from '@/lib/image/validateImageFile'
import type {
  Adjustments,
  CropRect,
  EditOperation,
  FilterValue,
  ImageSourceMeta,
} from '@/types/editor'
import { DEFAULT_ADJUSTMENTS } from '@/types/editor'

function cropRectFromOperations(operations: EditOperation[]): CropRect | null {
  const op = findCropOperation(operations)
  return op ? { x: op.x, y: op.y, width: op.width, height: op.height } : null
}

export const useEditorStore = defineStore('editor', () => {
  const originalImage = shallowRef<HTMLImageElement | null>(null)
  const objectUrl = ref<string | null>(null)
  const meta = ref<ImageSourceMeta | null>(null)
  const operations = ref<EditOperation[]>([])

  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isExporting = ref(false)

  const isCropEditing = ref(false)
  const cropDraft = ref<CropRect | null>(null)
  const isViewingOriginal = ref(false)

  const hasImage = computed(() => originalImage.value !== null)
  const adjustments = computed<Adjustments>(() => adjustmentsFromOperations(operations.value))
  const filterValue = computed<FilterValue>(() => filterFromOperations(operations.value))
  const appliedCrop = computed<CropRect | null>(() => cropRectFromOperations(operations.value))
  const isCropApplied = computed(() => !isCropEditing.value && appliedCrop.value !== null)

  const previewCssFilter = computed(() => buildPreviewCssFilter(operations.value))
  const effectivePreviewCssFilter = computed(() => (isViewingOriginal.value ? 'none' : previewCssFilter.value))

  const canViewOriginal = computed(() => hasImage.value && !isCropEditing.value)
  const canExport = computed(() => hasImage.value && !isCropEditing.value && !isExporting.value)

  const editDocument = computed(() => (meta.value ? buildEditDocument(meta.value, operations.value) : null))

  function clearError() {
    error.value = null
  }

  async function loadImage(file: File) {
    clearError()
    isLoading.value = true

    try {
      const validation = validateImageFile(file)
      if (!validation.ok) {
        error.value = validation.message ?? READ_IMAGE_ERROR
        return
      }

      const loaded = await loadImageFile(file)

      if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)

      originalImage.value = loaded.image
      objectUrl.value = loaded.objectUrl
      meta.value = loaded.meta
      operations.value = []
      isCropEditing.value = false
      cropDraft.value = null
      isViewingOriginal.value = false
    }
    catch (err) {
      console.error(err)
      error.value = READ_IMAGE_ERROR
    }
    finally {
      isLoading.value = false
    }
  }

  function startCropEditing() {
    if (!hasImage.value) return
    isCropEditing.value = true
    isViewingOriginal.value = false
    cropDraft.value = appliedCrop.value ? { ...appliedCrop.value } : null
  }

  function setCropDraft(rect: CropRect) {
    cropDraft.value = rect
  }

  function applyCrop() {
    if (!cropDraft.value) return
    operations.value = upsertCropOperation(operations.value, cropDraft.value)
    isCropEditing.value = false
  }

  function cancelCropEditing() {
    isCropEditing.value = false
    cropDraft.value = appliedCrop.value ? { ...appliedCrop.value } : null
  }

  function clearCrop() {
    operations.value = removeCropOperation(operations.value)
    cropDraft.value = null
    isCropEditing.value = false
  }

  function setAdjust(partial: Partial<Adjustments>) {
    operations.value = upsertAdjustOperation(operations.value, mergeAdjustments(adjustments.value, partial))
  }

  function resetAdjustments() {
    operations.value = upsertAdjustOperation(operations.value, { ...DEFAULT_ADJUSTMENTS })
  }

  function setFilter(value: FilterValue) {
    operations.value = upsertFilterOperation(operations.value, value)
  }

  function toggleViewOriginal() {
    if (!canViewOriginal.value) return
    isViewingOriginal.value = !isViewingOriginal.value
  }

  async function exportImage() {
    if (!canExport.value || !originalImage.value || !meta.value) return

    clearError()
    isExporting.value = true

    try {
      const blob = await exportImageBlob(originalImage.value, operations.value)
      downloadBlob(blob, getExportImageFilename(meta.value.name))
    }
    catch (err) {
      console.error(err)
      error.value = 'Failed to export the image'
    }
    finally {
      isExporting.value = false
    }
  }

  function exportDocumentJson() {
    if (!editDocument.value || !meta.value) return
    downloadEditDocument(editDocument.value, meta.value.name)
  }

  function reset() {
    operations.value = []
    isCropEditing.value = false
    cropDraft.value = null
    isViewingOriginal.value = false
    clearError()
  }

  return {
    objectUrl,
    meta,
    operations: readonly(operations),
    isLoading,
    error,
    isExporting,
    isCropEditing,
    cropDraft,
    isViewingOriginal,
    hasImage,
    adjustments,
    filterValue,
    appliedCrop,
    isCropApplied,
    effectivePreviewCssFilter,
    canViewOriginal,
    canExport,
    editDocument,
    clearError,
    loadImage,
    startCropEditing,
    setCropDraft,
    applyCrop,
    cancelCropEditing,
    clearCrop,
    setAdjust,
    resetAdjustments,
    setFilter,
    toggleViewOriginal,
    exportImage,
    exportDocumentJson,
    reset,
  }
})
