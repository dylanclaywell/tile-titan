import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as generateId } from 'uuid'

import type { FileType } from '@/types/file'
import type { TypeOfLayer as TypeOfLayer, LayerType } from '@/types/layer'

export type ToolType =
  | 'addTile'
  | 'removeTile'
  | 'addStructure'
  | 'removeStructure'
  | 'selectStructure'
  | 'addObject'
  | 'removeObject'
  | 'selectObject'

export const useEditorStore = defineStore('editor', () => {
  const selectedTilesetId = ref<string | null>(null)

  const selectedTool = ref<ToolType | null>(null)

  const selectedLayerId = ref<string | null>(null)

  const selectedFileId = ref<string | null>(null)
  const files = ref<FileType[]>([])

  const selectedFile = computed(() => {
    return files.value.find((f) => f.id === selectedFileId.value)
  })
  const selectedLayer = computed(() => {
    return selectedFile.value?.layers.find((l) => l.id === selectedLayerId.value)
  })
  const tileWidthPx = computed(() => selectedFile.value?.tileWidth ?? 0)
  const tileHeightPx = computed(() => selectedFile.value?.tileHeight ?? 0)
  const widthPx = computed(
    () => (selectedFile.value?.width ?? 0) * (selectedFile.value?.tileWidth ?? 0),
  )
  const heightPx = computed(
    () => (selectedFile.value?.height ?? 0) * (selectedFile.value?.tileHeight ?? 0),
  )

  //////////////////// File Actions ////////////////////

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
      sortOrder: files.value.length + 1,
    }
    files.value.push(file)
    return file
  }

  function deleteFile(fileId: string) {
    selectedFileId.value = null
    files.value = files.value.filter((f) => f.id !== fileId)
  }

  function selectFile(fileId: string) {
    selectedFileId.value = fileId
  }

  function setFiles(newFiles: FileType[]) {
    files.value = newFiles
  }

  //////////////////// Layer Actions ////////////////////

  function newLayer(type: TypeOfLayer) {
    const file = selectedFile.value

    if (file) {
      const layer: LayerType = {
        id: generateId(),
        name: 'New Layer',
        type,
        isVisible: true,
        sortOrder: file.layers.length + 1,
        data: [],
      }

      file.layers.push(layer)
      return layer
    }
  }

  function deleteLayer(layerId: string) {
    const file = selectedFile.value

    if (file) {
      file.layers = file.layers.filter((l) => l.id !== layerId)
    }
  }

  function selectLayer(layerId: string) {
    const file = selectedFile.value

    if (file) {
      const layer = file.layers.find((l) => l.id === layerId)

      if (layer) {
        selectedLayerId.value = layer.id
      }
    }
  }

  function toggleLayerVisibility(layerId: string) {
    const file = selectedFile.value

    if (file) {
      const layer = file.layers.find((l) => l.id === layerId)

      if (layer) {
        layer.isVisible = !layer.isVisible
      }
    }
  }

  //////////////////// Tool Actions ////////////////////
  function selectTool(tool: ToolType) {
    if (selectedTool.value === tool) {
      selectedTool.value = null
      return
    }

    selectedTool.value = tool
  }

  //////////////////// Tileset Actions ////////////////////
  function selectTileset(id: string | null) {
    selectedTilesetId.value = id
  }

  return {
    /// Tilesets
    selectedTilesetId,
    selectTileset,

    /// Tools
    selectedTool,
    selectTool,

    /// Files
    files,
    updateFile,
    newFile,
    deleteFile,
    selectFile,
    setFiles,
    selectedFileId,
    selectedFile,
    tileWidthPx,
    tileHeightPx,
    widthPx,
    heightPx,

    /// Layers
    selectedLayerId,
    selectedLayer,
    newLayer,
    selectLayer,
    deleteLayer,
    toggleLayerVisibility,
  }
})
