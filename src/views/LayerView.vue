<script setup lang="ts">
import ResourceList from '@/components/ResourceList/ResourceList.vue'
import ResourceItem from '@/components/ResourceList/ResourceItem.vue'
import ToolBar from '@/components/ToolBar/ToolBar.vue'
import ToolSection from '@/components/ToolBar/ToolSection.vue'
import Tool from '@/components/ToolBar/ToolButton.vue'
import { useEditorStore } from '@/stores/editor'
import type { TypeOfLayer } from '@/types/layer'
import TilesetView from './TilesetView.vue'
import StructureView from './StructureView.vue'
import ObjectView from './ObjectView.vue'

const store = useEditorStore()

function getIcon(type: TypeOfLayer) {
  switch (type) {
    case 'tile':
      return 'image'
    case 'object':
      return 'object-group'
    case 'structure':
      return 'cubes'
    default:
      return 'question'
  }
}
</script>

<template>
  <div class="basis-1/4 w-1/4 flex flex-col">
    <ToolBar class="border-b">
      <ToolSection>
        <Tool
          :is-disabled="!store.selectedFile"
          :is-selected="false"
          :icon="getIcon('tile')"
          name="New tile layer"
          :on-click="() => store.newLayer('tile')"
        />
        <Tool
          :is-disabled="!store.selectedFile"
          :is-selected="false"
          :icon="getIcon('object')"
          name="New object layer"
          :on-click="() => store.newLayer('object')"
        />
        <Tool
          :is-disabled="!store.selectedFile"
          :is-selected="false"
          :icon="getIcon('structure')"
          name="New structure layer"
          :on-click="() => store.newLayer('structure')"
        />
      </ToolSection>
    </ToolBar>
    <div class="divide-y flex flex-col overflow-hidden h-full">
      <div class="p-2 basis-1/2 flex-grow overflow-y-auto flex-shrink-0">
        <ResourceList name="Layers" v-if="store.selectedFile">
          <ResourceItem
            v-for="layer in store.selectedFile.layers
              .slice(0)
              .sort((a, b) => a.sortOrder - b.sortOrder)"
            :key="layer.id"
            :name="layer.name"
            :id="layer.id"
            :icon="getIcon(layer.type)"
            :is-selected="store.selectedLayerId === layer.id"
            :is-visible="layer.isVisible"
            @click="() => store.selectLayer(layer.id)"
            :on-delete="() => store.deleteLayer(layer.id)"
            :on-show="() => store.toggleLayerVisibility(layer.id)"
            :on-up="() => store.decreaseSortOrder(layer.id)"
            :on-down="() => store.increaseSortOrder(layer.id)"
            :on-name-change="(name) => store.renameLayer(layer.id, name)"
          />
        </ResourceList>
      </div>
      <TilesetView v-if="store.selectedLayer?.type === 'tile'" />
      <StructureView v-if="store.selectedLayer?.type === 'structure'" />
      <ObjectView v-if="store.selectedLayer?.type === 'object'" />
    </div>
  </div>
</template>

<style></style>
