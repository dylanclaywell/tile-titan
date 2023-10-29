<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <router-view name="Toolbar" />
  <div class="flex justify-between divide-x h-full">
    <router-view name="File" />
    <router-view name="Main" />
    <router-view name="Layer" />
  </div>
</template>

<style></style>
