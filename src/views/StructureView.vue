<script setup lang="ts">
import { useEditorStore } from '@/stores/editor'
import ResourceList from '@/components/ResourceList/ResourceList.vue'
import ResourceItem from '@/components/ResourceList/ResourceItem.vue'

const store = useEditorStore()
</script>

<template>
  <div class="basis-1/2 flex-grow h-full overflow-y-auto flex flex-col p-2">
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
