<script setup lang="ts">
import { RouterView } from 'vue-router'
import localforage from 'localforage'

import { useEditorStore } from './stores/editor'
import { onMounted } from 'vue'
import { File } from './types/file'

const store = useEditorStore()

store.$subscribe((mutation, state) => {
  // Need to clone the state because localforage doesn't like the Proxy objects
  const clonedFiles = JSON.parse(JSON.stringify(state.files))
  const clonedTilesets = JSON.parse(JSON.stringify(state.tilesets))

  localforage.setItem('files', clonedFiles)
  localforage.setItem('tilesets', clonedTilesets)
})

onMounted(() => {
  localforage.getItem('files').then((files) => {
    store.setFiles(File.array().parse(files))
  })
})
</script>

<template>
  <router-view name="Toolbar" />
  <div class="flex justify-between divide-x h-full">
    <router-view name="File" />
    <router-view name="Main" />
    <router-view name="Layer" />
  </div>
</template>

<style></style>
