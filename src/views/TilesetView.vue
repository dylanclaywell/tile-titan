<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import SelectField from '@/components/SelectField.vue'
import FileUploader from '@/components/FileUploader.vue'
import TilesetCanvas from '@/components/TilesetCanvas.vue'
import ToolBar from '@/components/ToolBar/ToolBar.vue'
import ToolSection from '@/components/ToolBar/ToolSection.vue'
import { readFile } from '@/lib/readFile'
import { useEditorStore } from '@/stores/editor'
import { useMouse } from '@/hooks/useMouse'
import ToolButton from '@/components/ToolBar/ToolButton.vue'

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
  <div class="basis-1/2 flex-grow h-full overflow-hidden flex flex-col">
    <div>
      <ToolBar class="border-b">
        <ToolSection>
          <FileUploader name="New tileset" :on-change="onChange">
            <div
              className="w-10 h-10 cursor-default hover:bg-gray-200 hover:border hover:border-gray-300 rounded-md flex justify-center items-center"
            >
              <i className="fa-solid fa-file-circle-plus"></i></div
          ></FileUploader>
        </ToolSection>
        <ToolSection>
          <ToolButton
            name="Delete tileset"
            :is-disabled="!store.selectedTileset"
            :is-selected="false"
            icon="trash-can"
            :on-click="() => store.deleteTileset(store.selectedTilesetId ?? '')"
          />
        </ToolSection>
      </ToolBar>
      <div class="p-2 border-b">
        <SelectField
          :options="options"
          :on-change="(value) => store.selectTileset(value)"
          :value="store.selectedTileset?.id ?? ''"
          label="Tileset"
          placeholder="Select a tileset"
          no-results-message="No tilesets uploaded"
        />
      </div>
    </div>
    <TilesetCanvas v-if="store.selectedTileset" />
  </div>
</template>

<style></style>
