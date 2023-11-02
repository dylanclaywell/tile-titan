<script setup lang="ts">
import ResourceItem from '@/components/ResourceList/ResourceItem.vue'
import ResourceList from '@/components/ResourceList/ResourceList.vue'
import ToolBar from '@/components/ToolBar/ToolBar.vue'
import ToolSection from '@/components/ToolBar/ToolSection.vue'
import Tool from '@/components/ToolBar/ToolButton.vue'
import FilePropertyView from '@/views/FilePropertyView.vue'
import { useEditorStore } from '@/stores/editor'

const store = useEditorStore()
</script>

<template>
  <div class="basis-1/4">
    <ToolBar class="border-b">
      <ToolSection>
        <Tool
          name="New file"
          icon="file-circle-plus"
          :is-disabled="false"
          :is-selected="false"
          :onClick="() => store.newFile()"
        />
      </ToolSection>
    </ToolBar>
    <div class="p-2">
      <ResourceList name="Files">
        <ResourceItem
          v-for="file in store.files"
          :key="file.id"
          :name="file.name"
          :is-selected="store.selectedFileId === file.id"
          :id="file.id"
          @click="() => store.selectFile(file.id)"
          :on-delete="() => store.deleteFile(file.id)"
        />
      </ResourceList>
    </div>
    <FilePropertyView v-if="store.selectedFileId" />
  </div>
</template>

<style></style>
