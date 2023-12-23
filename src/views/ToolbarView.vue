<script setup lang="ts">
import { ref } from 'vue'

import ToolBar from '../components/ToolBar/ToolBar.vue'
import ToolSection from '../components/ToolBar/ToolSection.vue'
import Tool from '../components/ToolBar/ToolButton.vue'
import ConfirmationModal from '../components/ConfirmationModal.vue'
import { useEditorStore } from '@/stores/editor'
import { importProject } from '@/lib/importProject'
import FileUploader from '@/components/FileUploader.vue'
import { exportProject } from '@/lib/exportProject'
import { eventEmitter } from '@/events'
import ToolButton from '../components/ToolBar/ToolButton.vue'
import localforage from 'localforage'

const editorStore = useEditorStore()

const confirmationModalIsOpen = ref(false)

function openConfirmationModal() {
  confirmationModalIsOpen.value = true
}

function closeConfirmationModal() {
  confirmationModalIsOpen.value = false
}

function onConfirm() {
  editorStore.reset()
  closeConfirmationModal()
}

async function readZipFile(file: File) {
  return new Promise<string | ArrayBuffer | null | undefined>((resolve) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      resolve(event.target?.result)
    }
    reader.readAsBinaryString(file)
  })
}

async function onUpload(event: Event) {
  if (!(event.target instanceof HTMLInputElement)) return

  const file = event.target.files?.[0]

  if (!file) return

  const blob = await readZipFile(file)

  if (!blob) return

  const { files, tilesets } = await importProject(blob)

  editorStore.setFiles(files)
  editorStore.setTilesets(tilesets)

  event.target.value = ''
}

async function onDownload() {
  exportProject(editorStore.files, editorStore.tilesets)
}

function resetView() {
  eventEmitter.emit('reset-view')
}

function onSave() {
  // Need to clone the state because localforage doesn't like the Proxy objects
  const clonedFiles = JSON.parse(JSON.stringify(editorStore.files))
  const clonedTilesets = JSON.parse(JSON.stringify(editorStore.tilesets))

  localforage.setItem('files', clonedFiles)
  localforage.setItem('tilesets', clonedTilesets)

  console.log('Project saved')
  eventEmitter.emit('notification', 'Project saved')
}
</script>

<template>
  <div class="w-full border-b border-b-gray-200">
    <ConfirmationModal
      v-if="confirmationModalIsOpen"
      title="Create new project"
      message="Are you sure you want to create a new project? Make sure to export this project so you don't lose it."
      @confirm="onConfirm"
      @cancel="closeConfirmationModal"
      confirm-text="Create"
    />
    <ToolBar>
      <ToolSection>
        <Tool
          name="New Project"
          icon="folder-plus"
          :is-disabled="false"
          :is-selected="false"
          :on-click="openConfirmationModal"
        />
        <Tool
          name="Save Project"
          icon="save"
          :is-disabled="false"
          :is-selected="false"
          @click="onSave"
        />
      </ToolSection>
      <ToolSection>
        <FileUploader name="Import Project" @change="onUpload">
          <div
            className="w-10 h-10 cursor-default hover:bg-gray-200 hover:border hover:border-gray-300 rounded-md flex justify-center items-center"
          >
            <i className="fa-solid fa-upload"></i>
          </div>
        </FileUploader>
        <Tool
          name="Export Project"
          icon="download"
          :is-disabled="false"
          :is-selected="false"
          @click="onDownload"
        />
      </ToolSection>
      <ToolSection>
        <ToolButton
          name="Show Grid"
          icon="border-all"
          :is-disabled="false"
          :is-selected="editorStore.showGrid"
          :on-click="editorStore.toggleGrid"
        />
        <ToolButton
          name="Reset View"
          icon="camera-rotate"
          :is-disabled="false"
          :is-selected="false"
          :on-click="resetView"
        />
      </ToolSection>
    </ToolBar>
  </div>
</template>

<style></style>
