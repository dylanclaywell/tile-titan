<script setup lang="ts">
import ToolBar from '../components/ToolBar/ToolBar.vue'
import ToolSection from '../components/ToolBar/ToolSection.vue'
import Tool from '../components/ToolBar/ToolButton.vue'
import { useEditorStore } from '@/stores/editor'
</script>

<template>
  <div class="w-full border-b border-b-gray-200">
    <ToolBar>
      <ToolSection>
        <Tool
          name="New Project"
          icon="folder-plus"
          :is-disabled="false"
          :is-selected="false"
          :on-click="() => useEditorStore().reset()"
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
