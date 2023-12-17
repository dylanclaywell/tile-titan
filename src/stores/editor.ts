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

  const selectedStructureId = ref<string | null>(null)

  const selectedLayerId = ref<string | null>(null)

  const selectedFileId = ref<string | null>(null)
  const files = ref<FileType[]>([])

  const selectedTile = ref<SelectedTile | null>(null)

  const selectedObjectId = ref<string | null>(null)

  const showGrid = ref(true)

  const zoom = ref(2)

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
      file.isStructure = newFile.isStructure
      file.layers.forEach((l) => {
        if (l.type === 'tile') {
          l.data = generateMap(file.width, file.height)
        }
      })
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

    selectedLayerId.value = null
    selectedStructureId.value = null
    selectedObjectId.value = null
    selectedTile.value = null
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
  // `selectTool` is used to toggle the tool on and off
  function selectTool(tool: ToolType) {
    if (selectedTool.value === tool) {
      selectedTool.value = null
      return
    }

    selectedTool.value = tool
  }

  // `setTool` is used to set the tool without toggling it
  function setTool(tool: ToolType) {
    selectedTool.value = tool
  }

  //////////////////// Structure Actions ////////////////////
  function selectStructure(id: string | null) {
    selectedStructureId.value = id
    selectedTool.value = 'addStructure'
  }

  function addStructure({ id, x, y }: { id: string; x: number; y: number }) {
    const file = selectedFile.value

    if (file) {
      const layer = file.layers.find((l) => l.id === selectedLayerId.value)

      if (layer && layer.type === 'structure') {
        layer.data.push({
          id: generateId(),
          fileId: id,
          x,
          y,
        })
      }
    }
  }

  function removeStructure(id: string) {
    const file = selectedFile.value

    if (file) {
      const layer = file.layers.find((l) => l.id === selectedLayerId.value)

      if (layer && layer.type === 'structure') {
        layer.data = layer.data.filter((s) => s.id !== id)
      }

      selectedStructureId.value = null
    }
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

  //////////////////// Object Actions ////////////////////
  function addObject({
    x,
    y,
    width,
    height,
  }: {
    x: number
    y: number
    width: number
    height: number
  }) {
    const file = selectedFile.value

    if (file) {
      const layer = file.layers.find((l) => l.id === selectedLayerId.value)

      if (layer && layer.type === 'object') {
        const object = {
          x,
          y,
          x2: x + width,
          y2: y + height,
          width,
          height,
          color: '#000000',
          isVisible: true,
          name: 'New Object',
          sortOrder: 0,
          id: generateId(),
        }
        layer.data.push(object)
        return object
      }
    }
  }

  function removeObject(id: string) {
    const file = selectedFile.value

    if (file) {
      const layer = file.layers.find((l) => l.id === selectedLayerId.value)

      if (layer && layer.type === 'object') {
        layer.data = layer.data.filter((o) => o.id !== id)
      }

      selectedObjectId.value = null
    }
  }

  function setSelectedObjectId(id: string | null) {
    selectedObjectId.value = id
  }

  function updateObject(
    id: string,
    {
      x,
      y,
      width,
      height,
      color,
      name,
    }: { x: number; y: number; width: number; height: number; color?: string; name?: string },
  ) {
    const file = selectedFile.value

    if (file) {
      const layer = file.layers.find((l) => l.id === selectedLayerId.value)

      if (layer && layer.type === 'object') {
        const object = layer.data.find((o) => o.id === id)

        if (object) {
          object.x = x
          object.y = y
          object.x2 = x + width
          object.y2 = y + height
          object.width = width
          object.height = height
          if (color) {
            object.color = color
          }
          if (name) {
            object.name = name
          }
        }
      }
    }
  }

  //////////////////// Miscellaneous Actions ////////////////////
  function toggleGrid() {
    showGrid.value = !showGrid.value
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

  function zoomIn() {
    zoom.value += 0.1 * zoom.value
  }

  function zoomOut() {
    zoom.value -= 0.1 * zoom.value
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
    setTool,

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

    /// Structures
    selectedStructureId,
    selectStructure,
    addStructure,
    removeStructure,

    /// Objects
    addObject,
    removeObject,
    setSelectedObjectId,
    selectedObjectId,
    updateObject,

    /// Miscellaneous
    toggleGrid,
    showGrid,
    reset,
    zoomIn,
    zoomOut,
    zoom,
  }
})
