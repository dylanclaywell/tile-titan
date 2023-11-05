<script setup lang="ts">
import { ref } from 'vue'

import SelectField from '@/components/SelectField.vue'
import FileUploader from '@/components/FileUploader.vue'
import ToolBar from '@/components/ToolBar/ToolBar.vue'
import ToolSection from '@/components/ToolBar/ToolSection.vue'
import { readFile } from '@/lib/readFile'
import { useEditorStore } from '@/stores/editor'

const options = [
  {
    value: '1',
    label: 'Tileset 1',
  },
  {
    value: '2',
    label: 'Tileset 2',
  },
]

const store = useEditorStore()

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
  <div class="basis-1/2 h-full flex-grow p-2">
    <div>
      <ToolBar>
        <SelectField :options="options" :on-change="() => {}" value="1" />
        <ToolSection>
          <FileUploader label="{label}" name="New tileset" :on-change="onChange" />
        </ToolSection>
      </ToolBar>
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
