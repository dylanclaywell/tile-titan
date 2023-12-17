<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

import FileCanvas from '@/components/FileCanvas.vue'
import TileLayerToolBar from '@/components/TileLayerToolBar.vue'
import StructureLayerToolBar from '@/components/StructureLayerToolBar.vue'
import ObjectLayerToolBar from '@/components/ObjectLayerToolBar.vue'
import { useEditorStore } from '@/stores/editor'
import { useMouse } from '@/hooks/useMouse'

const store = useEditorStore()
const canvasContainer = ref<HTMLDivElement | null>(null)

const canvasContainerMouse = useMouse({
  ref: canvasContainer,
})

function onMouseWheel(event: Event) {
  if (!(event instanceof WheelEvent)) return

  if (
    !(event.target instanceof HTMLElement) ||
    !(event.target.contains(canvasContainer.value) || canvasContainer.value?.contains(event.target))
  ) {
    return
  }

  const { deltaY } = event

  if (deltaY > 0) {
    store.zoomOut()
  } else {
    store.zoomIn()
  }
}

onMounted(() => {
  canvasContainerMouse.register()

  addEventListener('wheel', onMouseWheel)
})

onUnmounted(() => {
  canvasContainerMouse.unregister()

  removeEventListener('wheel', onMouseWheel)
})
</script>

<template>
  <div class="basis-1/2 shrink-0 bg-gray-100 overflow-hidden">
    <TileLayerToolBar v-if="store.selectedLayer?.type === 'tile'" />
    <StructureLayerToolBar v-if="store.selectedLayer?.type === 'structure'" />
    <ObjectLayerToolBar v-if="store.selectedLayer?.type === 'object'" />
    <div ref="canvasContainer" class="relative h-full">
      <FileCanvas
        :container-ref="canvasContainer"
        :container-view-mouse="canvasContainerMouse"
        v-if="store.selectedFileId"
      />
    </div>
  </div>
</template>

<style></style>
