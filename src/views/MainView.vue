<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

import { useEditorStore } from '@/stores/editor'
import { useMouse } from '@/hooks/useMouse'
import colors from '@/colors'

const store = useEditorStore()
const canvas = ref<HTMLCanvasElement | null>(null)
const mainView = ref<HTMLDivElement | null>(null)

const mainViewMouse = useMouse({
  ref: mainView
})
const canvasMouse = useMouse({
  ref: canvas
})

const canvasTop = computed(() => {
  const oldTop = Number(canvas.value?.style?.top.split('px')[0]) || 0

  const newTop = oldTop + mainViewMouse.state.value.y - mainViewMouse.state.value.previousY

  console.log(oldTop, newTop, mainViewMouse.state.value.y, mainViewMouse.state.value.previousY)

  return mainViewMouse.state.value.buttons.middle ? newTop : oldTop
})
const canvasLeft = computed(() => {
  const oldLeft = Number(canvas.value?.style?.left.split('px')[0]) || 0
  const newLeft = oldLeft + mainViewMouse.state.value.x - mainViewMouse.state.value.previousX

  return mainViewMouse.state.value.buttons.middle ? newLeft : oldLeft
})

function drawCanvas() {
  const context = canvas.value?.getContext('2d')

  if (!context) return

  context.fillStyle = colors.gray[50]
  context.fillRect(0, 0, store.widthPx, store.heightPx)

  context.fillStyle = colors.gray[300]

  for (let i = 0; i < store.widthPx; i += store.tileWidthPx) {
    context.fillRect(i, 0, 1, store.heightPx)
  }

  for (let i = 0; i < store.heightPx; i += store.tileHeightPx) {
    context.fillRect(0, i, store.widthPx, 1)
  }
}

onMounted(() => {
  drawCanvas()

  mainViewMouse.register()
  canvasMouse.register()
})

onUnmounted(() => {
  mainViewMouse.unregister()
  canvasMouse.unregister()
})
</script>

<template>
  <div ref="mainView" class="flex-grow relative bg-gray-100">
    MainView Mouse State
    <div>
      {{ mainViewMouse.state.value.buttons.left }}
      {{ mainViewMouse.state.value.buttons.middle }}
      {{ mainViewMouse.state.value.buttons.right }}
      {{ mainViewMouse.state.value.x }}
      {{ mainViewMouse.state.value.y }}
      {{ mainViewMouse.state.value.previousX }}
      {{ mainViewMouse.state.value.previousY }}
    </div>
    <br />
    Canvas Mouse State
    <div>
      {{ canvasMouse.state.value.buttons.left }}
      {{ canvasMouse.state.value.buttons.middle }}
      {{ canvasMouse.state.value.buttons.right }}
      {{ canvasMouse.state.value.x }}
      {{ canvasMouse.state.value.y }}
    </div>
    <canvas
      @click="drawCanvas"
      ref="canvas"
      :width="store.widthPx"
      :height="store.heightPx"
      class="border-r border-b border-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="`top: ${canvasTop}px; left: ${canvasLeft}px;`"
    ></canvas>
  </div>
</template>

<style></style>
