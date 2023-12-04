<script lang="ts" setup>
import ToolBar from '@/components/ToolBar/ToolBar.vue'
import ToolButton from '@/components/ToolBar/ToolButton.vue'
import ToolSection from '@/components/ToolBar/ToolSection.vue'
import { useEditorStore } from '@/stores/editor'
import { eventEmitter } from '@/events'
import EventEmitter from 'events'

const store = useEditorStore()

function selectAddTile() {
  store.selectTool('addTile')
}

function selectRemoveTile() {
  store.selectTool('removeTile')
  store.setTile(null)
}

function resetView() {
  eventEmitter.emit('reset-view')
}
</script>

<template>
  <ToolBar class="bg-white border-b relative z-10">
    <ToolSection>
      <ToolButton
        name="Add"
        icon="image"
        :is-disabled="false"
        :is-selected="store.selectedTool === 'addTile'"
        :on-click="selectAddTile"
      />
      <ToolButton
        name="Erase"
        icon="eraser"
        :is-disabled="false"
        :on-click="selectRemoveTile"
        :is-selected="store.selectedTool === 'removeTile'"
      />
    </ToolSection>
    <ToolSection>
      <ToolButton
        name="Show Grid"
        icon="border-all"
        :is-disabled="false"
        :is-selected="store.showGrid"
        :on-click="store.toggleGrid"
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
</template>
