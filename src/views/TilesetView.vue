<script setup lang="ts">
import { computed } from 'vue'

import SelectField from '@/components/SelectField.vue'
import FileUploader from '@/components/FileUploader.vue'
import ToolBar from '@/components/ToolBar/ToolBar.vue'
import ToolSection from '@/components/ToolBar/ToolSection.vue'
import { readFile } from '@/lib/readFile'
import { useEditorStore } from '@/stores/editor'

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
  <div class="basis-1/2 h-full flex-grow">
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
      </ToolBar>
      <div class="p-2 border-b">
        <SelectField
          :options="options"
          :on-change="(value) => store.selectTileset(value)"
          :value="store.selectedTileset?.id ?? ''"
          label="Tileset"
          placeholder="Select a tileset"
        />
      </div>
    </div>
    <div class="h-full">
      <div key="{currentTileset.id}" class="relative h-full">
        <img
          class="max-w-none"
          src="{currentTileset.blob}"
          alt="tileset"
          id="tileset"
          useMap="#tileset-map"
        />
        <div class="absolute bg-blue-600 z-40 pointer-events-none opacity-50">
          <map name="tileset-map">
            <area
              onMouseDown="{handleAreaClick}"
              shape="rect"
              href="#"
              alt="tile"
              data-tileset-name="{currentTileset.name}"
              data-tileset-id="{currentTileset.id}"
            />
          </map>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
