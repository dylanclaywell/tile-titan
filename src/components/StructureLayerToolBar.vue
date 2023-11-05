<script lang="ts" setup>
import ToolBar from '@/components/ToolBar/ToolBar.vue'
import ToolButton from '@/components/ToolBar/ToolButton.vue'
import ToolSection from '@/components/ToolBar/ToolSection.vue'
</script>

<template>
  <ToolBar class="bg-white border-b relative z-10">
    <ToolSection>
      <ToolButton name="Select" icon="arrow-pointer" :is-disabled="false" :is-selected="false" />
      <ToolButton name="Add" icon="cubes" :is-disabled="false" :is-selected="false" />
      <ToolButton name="Erase" icon="eraser" :is-disabled="false" :is-selected="false" />
    </ToolSection>
  </ToolBar>
</template>
