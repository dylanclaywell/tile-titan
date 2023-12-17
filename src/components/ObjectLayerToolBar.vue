<script lang="ts" setup>
import ToolBar from '@/components/ToolBar/ToolBar.vue'
import ToolButton from '@/components/ToolBar/ToolButton.vue'
import ToolSection from '@/components/ToolBar/ToolSection.vue'
import { useEditorStore } from '@/stores/editor'

const store = useEditorStore()

function selectAddObject() {
  store.selectTool('addObject')
}

function selectRemoveObject() {
  store.selectTool('removeObject')
}
</script>

<template>
  <ToolBar class="bg-white border-b relative z-10">
    <ToolSection>
      <ToolButton name="Select" icon="arrow-pointer" :is-disabled="false" :is-selected="false" />
      <ToolButton
        name="Add"
        icon="object-group"
        :is-disabled="false"
        :is-selected="store.selectedTool === 'addObject'"
        :on-click="selectAddObject"
      />
      <ToolButton
        name="Erase"
        icon="eraser"
        :is-disabled="false"
        :is-selected="store.selectedTool === 'removeObject'"
        :on-click="selectRemoveObject"
      />
    </ToolSection>
  </ToolBar>
</template>
