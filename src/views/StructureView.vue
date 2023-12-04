<script setup lang="ts">
import { computed } from 'vue'

import SelectField from '@/components/SelectField.vue'
import FileUploader from '@/components/FileUploader.vue'
import TilesetCanvas from '@/components/TilesetCanvas.vue'
import ToolBar from '@/components/ToolBar/ToolBar.vue'
import ToolSection from '@/components/ToolBar/ToolSection.vue'
import { readFile } from '@/lib/readFile'
import { useEditorStore } from '@/stores/editor'
import ToolButton from '@/components/ToolBar/ToolButton.vue'
import ResourceList from '@/components/ResourceList/ResourceList.vue'
import ResourceItem from '@/components/ResourceList/ResourceItem.vue'

const store = useEditorStore()

const options = computed(() =>
  store.tilesets.map((tileset) => ({
    label: tileset.name,
    value: tileset.id,
  })),
)

async function onChange(event: Event) {
  if (!(event.target instanceof HTMLInputElement)) return

  const file = event.target?.files?.[0]

  if (!file) return

  const blob = await readFile(file, 'dataURL')

  if (!blob) return

  store.newTileset({
    name: file.name,
    blob: blob?.toString(),
  })
}
</script>

<template>
  <div class="basis-1/2 flex-grow h-full overflow-hidden flex flex-col p-2">
    <ResourceList name="Structures">
      <ResourceItem
        v-for="structure in store.files.filter(
          (f) => f.id !== store.selectedLayerId && f.isStructure,
        )"
        :key="structure.id"
        :name="structure.name"
        icon=""
        :id="structure.id"
        :is-selected="store.selectedStructureId === structure.id"
        @click="() => store.selectStructure(structure.id)"
      >
        {{ structure.name }}
      </ResourceItem>
    </ResourceList>
  </div>
</template>

<style></style>
