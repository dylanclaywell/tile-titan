import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as generateId } from 'uuid'

import type { FileType } from '@/types/file'
import type { TypeOfLayer as TypeOfLayer, LayerType } from '@/types/layer'
import type { TilesetType } from '@/types/tileset'
import { generateMap } from '@/utils/generateMap'

export type ToolType =
  | 'addTile'
  | 'removeTile'
  | 'addStructure'
  | 'removeStructure'
  | 'selectStructure'
  | 'addObject'
  | 'removeObject'
  | 'selectObject'

export type SelectedTile = {
  width: number
  height: number
  tilesetX: number
  tilesetY: number
  blob: string
}

export const useEditorStore = defineStore('editor', () => {
  const tilesets = ref<TilesetType[]>([])

  const selectedTilesetId = ref<string | null>(null)

  const selectedTool = ref<ToolType | null>(null)

  const selectedLayerId = ref<string | null>(null)

  const selectedFileId = ref<string | null>(null)
  const files = ref<FileType[]>([])

  const selectedTile = ref<SelectedTile | null>(null)

  const selectedTileset = computed(() => {
    return tilesets.value.find((t) => t.id === selectedTilesetId.value)
  })
  const selectedTilesetWidth = computed(() => {
    if (!selectedTileset.value) return

    const image = new Image()
    image.src = selectedTileset.value.blob

    return new Promise<number>((resolve) => {
      image.onload = () => {
        return resolve(image.width)
      }
    })
  })
  const selectedTilesetHeight = computed(() => {
    if (!selectedTileset.value) return

    const image = new Image()
    image.src = selectedTileset.value.blob

    return new Promise<number>((resolve) => {
      image.onload = () => {
        return resolve(image.height)
      }
    })
  })
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
      const layer: LayerType = (() => {
        switch (type) {
          case 'tile':
            return {
              id: generateId(),
              name: 'New Layer',
              type,
              isVisible: true,
              sortOrder: file.layers.length + 1,
              data: generateMap(file.width, file.height),
            }
          default:
            return {
              id: generateId(),
              name: 'New Layer',
              type,
              isVisible: true,
              sortOrder: file.layers.length + 1,
              data: [],
            }
        }
      })()

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

  function newTileset({ name, blob }: { name: string; blob: string }) {
    const tileset: TilesetType = {
      id: generateId(),
      name,
      blob,
    }
    tilesets.value.push(tileset)
    return tileset
  }

  function setTilesets(newTilesets: TilesetType[]) {
    tilesets.value = newTilesets
  }

  function deleteTileset(id: string) {
    tilesets.value = tilesets.value.filter((t) => t.id !== id)
  }

  function setTile(tile: SelectedTile | null) {
    selectedTile.value = tile
  }

  function reset() {
    tilesets.value = []
    selectedTilesetId.value = null
    selectedTool.value = null
    selectedLayerId.value = null
    selectedFileId.value = null
    files.value = []
    selectedTile.value = null
  }

  return {
    /// Tilesets
    tilesets,
    selectedTilesetId,
    selectedTileset,
    selectTileset,
    newTileset,
    selectedTilesetWidth,
    selectedTilesetHeight,
    setTilesets,
    deleteTileset,
    selectedTile,
    setTile,

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

    // Reset
    reset,
  }
})
