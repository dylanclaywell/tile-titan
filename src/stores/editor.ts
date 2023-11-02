import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as generateId } from 'uuid'

import type { FileType } from '@/types/file'

export const useEditorStore = defineStore('editor', () => {
  const selectedFileId = ref<string | null>(null)
  const files = ref<FileType[]>([])
  const tileWidth = ref(32)
  const tileHeight = ref(32)
  const width = ref(10)
  const height = ref(10)

  function setTileWidth(width: number) {
    tileWidth.value = width
  }

  function setTileHeight(height: number) {
    tileHeight.value = height
  }

  function setWidth(w: number) {
    width.value = w
  }

  function setHeight(h: number) {
    height.value = h
  }

  function updateFile(fileId: string) {
    const file = files.value.find((f) => f.id === fileId)
    if (file) {
      file.width = width.value
      file.height = height.value
      file.tileWidth = tileWidth.value
      file.tileHeight = tileHeight.value
    }
  }

  function newFile() {
    const file: FileType = {
      id: generateId(),
      name: 'New File',
      width: 10,
      height: 10,
      tileWidth: 32,
      tileHeight: 32,
      isStructure: false,
      layers: [],
      sortOrder: files.value.length + 1
    }
    files.value.push(file)
    return file
  }

  function deleteFile(fileId: string) {
    files.value = files.value.filter((f) => f.id !== fileId)
  }

  function selectFile(fileId: string) {
    selectedFileId.value = fileId
  }

  const tileWidthPx = computed(() => tileWidth.value)
  const tileHeightPx = computed(() => tileHeight.value)
  const widthPx = computed(() => width.value * tileWidth.value)
  const heightPx = computed(() => height.value * tileHeight.value)

  return {
    tileWidth,
    tileHeight,
    setTileWidth,
    setTileHeight,

    width,
    height,
    setWidth,
    setHeight,

    tileWidthPx,
    tileHeightPx,
    widthPx,
    heightPx,

    files,
    updateFile,
    newFile,
    deleteFile,
    selectFile,
    selectedFileId
  }
})
