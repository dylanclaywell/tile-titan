<script lang="ts" setup>
import ToolBar from '@/components/ToolBar/ToolBar.vue'
import ToolButton from '@/components/ToolBar/ToolButton.vue'
import ToolSection from '@/components/ToolBar/ToolSection.vue'
import { useEditorStore } from '@/stores/editor'

const store = useEditorStore()
</script>

<template>
  <ToolBar class="bg-white border-b relative z-10">
    <ToolSection>
      <ToolButton
        name="Add"
        icon="image"
        :is-disabled="false"
        :is-selected="store.selectedTool === 'addTile'"
        :on-click="() => store.selectTool('addTile')"
      />
      <ToolButton name="Erase" icon="eraser" :is-disabled="false" :is-selected="false" />
    </ToolSection>
  </ToolBar>
</template>
