import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
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
    heightPx
  }
})
