<script setup lang="ts">
import { ref } from 'vue'

import ToolBar from '../components/ToolBar/ToolBar.vue'
import ToolSection from '../components/ToolBar/ToolSection.vue'
import Tool from '../components/ToolBar/ToolButton.vue'
import ConfirmationModal from '../components/ConfirmationModal.vue'
import { useEditorStore } from '@/stores/editor'

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
        <Tool name="Save Project" icon="save" :is-disabled="false" :is-selected="false" />
      </ToolSection>
      <ToolSection>
        <Tool name="Import Project" icon="upload" :is-disabled="false" :is-selected="false" />
        <Tool name="Export Project" icon="download" :is-disabled="false" :is-selected="false" />
      </ToolSection>
    </ToolBar>
  </div>
</template>

<style></style>
