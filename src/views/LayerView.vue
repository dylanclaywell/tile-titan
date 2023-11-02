<script setup lang="ts">
import type { Props as Item } from '@/components/ResourceList/ResourceItem.vue'
import ResourceList from '@/components/ResourceList/ResourceList.vue'
import ResourceItem from '@/components/ResourceList/ResourceItem.vue'
import ToolBar from '@/components/ToolBar/ToolBar.vue'
import ToolSection from '@/components/ToolBar/ToolSection.vue'
import Tool from '@/components/ToolBar/ToolButton.vue'

const items: Item[] = [
  {
    id: '1',
    name: 'Layer 1',
    icon: 'image'
  },
  {
    id: '2',
    name: 'Layer 2',
    icon: 'object-group'
  },
  {
    id: '3',
    name: 'Layer 3',
    icon: 'cubes'
  }
]
</script>

<template>
  <div class="basis-1/4 h-full">
    <ToolBar class="border-b">
      <ToolSection>
        <Tool :is-disabled="false" :is-selected="false" icon="image" name="New image layer" />
        <Tool
          :is-disabled="false"
          :is-selected="false"
          icon="object-group"
          name="New object layer"
        />
        <Tool :is-disabled="false" :is-selected="false" icon="cubes" name="New structure layer" />
      </ToolSection>
    </ToolBar>
    <div class="p-2">
      <ResourceList name="Layers">
        <ResourceItem
          v-for="item in items"
          :key="item.id"
          :name="item.name"
          :id="item.id"
          :icon="item.icon"
        />
      </ResourceList>
    </div>
  </div>
</template>

<style></style>
