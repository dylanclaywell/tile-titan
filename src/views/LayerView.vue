<script setup lang="ts">
import type { Props as Item } from '@/components/ResourceList/ResourceItem.vue'
import ResourceList from '@/components/ResourceList/ResourceList.vue'
import ResourceItem from '@/components/ResourceList/ResourceItem.vue'
import ToolBar from '@/components/ToolBar/ToolBar.vue'
import ToolSection from '@/components/ToolBar/ToolSection.vue'
import Tool from '@/components/ToolBar/ToolButton.vue'
import { useEditorStore } from '@/stores/editor'
import type { TypeOfLayer } from '@/types/layer'
import TilesetView from './TilesetView.vue'

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
  <div class="basis-1/4 h-full">
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
    <div class="divide-y flex flex-col h-full">
      <div class="p-2 basis-1/2 flex-grow overflow-y-auto">
        <ResourceList name="Layers" v-if="store.selectedFile">
          <ResourceItem
            v-for="layer in store.selectedFile.layers"
            :key="layer.id"
            :name="layer.name"
            :id="layer.id"
            :icon="getIcon(layer.type)"
            :is-selected="store.selectedLayerId === layer.id"
            :is-visible="layer.isVisible"
            @click="() => store.selectLayer(layer.id)"
            :on-delete="() => store.deleteLayer(layer.id)"
            :on-show="() => store.toggleLayerVisibility(layer.id)"
          />
        </ResourceList>
      </div>
      <TilesetView v-if="store.selectedLayer" />
    </div>
  </div>
</template>

<style></style>
