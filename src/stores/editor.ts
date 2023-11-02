import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as generateId } from 'uuid'

import type { FileType } from '@/types/file'

export const useEditorStore = defineStore('editor', () => {
  const selectedFileId = ref<string | null>(null)
  const files = ref<FileType[]>([])

  const selectedFile = computed(() => {
    return files.value.find((f) => f.id === selectedFileId.value)
  })
  const tileWidthPx = computed(() => selectedFile.value?.tileWidth ?? 0)
  const tileHeightPx = computed(() => selectedFile.value?.tileHeight ?? 0)
  const widthPx = computed(
    () => (selectedFile.value?.width ?? 0) * (selectedFile.value?.tileWidth ?? 0)
  )
  const heightPx = computed(
    () => (selectedFile.value?.height ?? 0) * (selectedFile.value?.tileHeight ?? 0)
  )

  function updateFile(fileId: string, newFile: FileType) {
    const file = files.value.find((f) => f.id === fileId)

    if (file) {
      file.name = newFile.name
      file.width = newFile.width
      file.height = newFile.height
      file.tileWidth = newFile.tileWidth
      file.tileHeight = newFile.tileHeight
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

  return {
    tileWidthPx,
    tileHeightPx,
    widthPx,
    heightPx,

    files,
    updateFile,
    newFile,
    deleteFile,
    selectFile,
    selectedFileId,
    selectedFile
  }
})
