<script setup lang="ts">
import { ref } from 'vue'

const currentTileset = ref('')
</script>

<template>
  <div class="basis-1/4 h-full">
    <div></div>
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
