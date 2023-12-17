<script setup lang="ts">
import { useEditorStore } from '@/stores/editor'
import ResourceList from '@/components/ResourceList/ResourceList.vue'
import ResourceItem from '@/components/ResourceList/ResourceItem.vue'
import ObjectPropertyView from './ObjectPropertyView.vue'
import { eventEmitter } from '@/events'

const store = useEditorStore()

function onDelete(id: string) {
  store.removeObject(id)

  if (!store.selectedLayerId) return

  eventEmitter.emit('redraw-layer', store.selectedLayerId)
}
</script>

<template>
  <div
    class="basis-1/2 flex-grow h-full overflow-hidden flex flex-col"
    v-if="store.selectedLayer?.type === 'object'"
  >
    <div class="overflow-y-auto p-2 basis-1/2 flex-grow border-b">
      <ResourceList name="Objects">
        <ResourceItem
          v-for="object in store.selectedLayer?.data"
          :key="object.id"
          :name="object.name"
          icon=""
          :id="object.id"
          :is-selected="store.selectedObjectId === object.id"
          @click="() => store.setSelectedObjectId(object.id)"
          @delete="onDelete(object.id)"
        >
          {{ object.name }}
        </ResourceItem>
      </ResourceList>
    </div>
    <div v-if="store.selectedObjectId" class="overflow-y-auto basis-1/2">
      <ObjectPropertyView />
    </div>
  </div>
</template>

<style></style>
