<script setup lang="ts">
import ToolBar from '../components/ToolBar/ToolBar.vue'
import ToolSection from '../components/ToolBar/ToolSection.vue'
import Tool from '../components/ToolBar/Tool.vue'
</script>

<template>
  <div class="w-full border-b border-b-gray-200">
    <ToolBar>
      <ToolSection>
        <Tool name="Import Project" icon="upload" :is-disabled="false" :is-selected="false" />
        <Tool name="Export Project" icon="download" :is-disabled="false" :is-selected="false" />
      </ToolSection>
      <ToolSection>
        <Tool name="New file" icon="file-circle-plus" :is-disabled="false" :is-selected="false" />
      </ToolSection>
    </ToolBar>
  </div>
</template>

<style></style>
