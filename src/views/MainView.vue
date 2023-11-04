<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

import FileCanvas from '@/components/FileCanvas.vue'
import { useEditorStore } from '@/stores/editor'
import { useMouse } from '@/hooks/useMouse'

const store = useEditorStore()
const mainView = ref<HTMLDivElement | null>(null)

const mainViewMouse = useMouse({
  ref: mainView
})

onMounted(() => {
  mainViewMouse.register()
})

onUnmounted(() => {
  mainViewMouse.unregister()
})
</script>

<template>
  <div ref="mainView" class="flex-grow relative bg-gray-100 overflow-hidden">
    <FileCanvas :main-view-mouse="mainViewMouse" v-if="store.selectedFileId" />
  </div>
</template>

<style></style>
