<script setup lang="ts">
import SelectField from '@/components/SelectField.vue'
import { ref } from 'vue'

const currentTileset = ref('')

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
</script>

<template>
  <div class="basis-1/2 h-full flex-grow">
    <div>
      <SelectField :options="options" :on-change="() => {}" value="1" />
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
