<script setup lang="ts">
import { RouterView } from 'vue-router'
import localforage from 'localforage'
import { onMounted } from 'vue'

import { useEditorStore } from './stores/editor'
import { RenderedStructureSchema, usePerformanceStore } from './stores/performance'
import { File } from './types/file'
import { Tileset } from './types/tileset'
import NotificationBar from './components/NotificationBar.vue'

const editorStore = useEditorStore()
const performanceStore = usePerformanceStore()

editorStore.$subscribe((mutation, state) => {
  // Need to clone the state because localforage doesn't like the Proxy objects
  const clonedFiles = JSON.parse(JSON.stringify(state.files))
  const clonedTilesets = JSON.parse(JSON.stringify(state.tilesets))

  localforage.setItem('files', clonedFiles)
  localforage.setItem('tilesets', clonedTilesets)
})

performanceStore.$subscribe((mutation, state) => {
  // Need to clone the state because localforage doesn't like the Proxy objects
  const clonedRenderedStructureData = JSON.parse(JSON.stringify(state.renderedStructureData))

  localforage.setItem('renderedStructureData', clonedRenderedStructureData)
})

onMounted(async () => {
  const files = await localforage.getItem('files')
  const tilesets = await localforage.getItem('tilesets')
  const renderedStructureData = await localforage.getItem('renderedStructureData')

  editorStore.setTilesets(Tileset.array().parse(tilesets))
  editorStore.setFiles(File.array().parse(files))
  performanceStore.setRenderedStructureData(
    RenderedStructureSchema.array().parse(renderedStructureData),
  )
})
</script>

<template>
  <notification-bar />
  <router-view name="Toolbar" />
  <div class="flex justify-between divide-x flex-grow overflow-hidden">
    <router-view name="File" />
    <router-view name="Main" />
    <router-view name="Layer" />
  </div>
</template>

<style></style>
