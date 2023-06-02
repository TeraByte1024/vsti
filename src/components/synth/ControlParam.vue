<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  label: string;
}>();
</script>

<template>
  <div class="flex justify-end w-full box-contents py-1">
    <div class="flex-none h-full mr-6 text-right" style="min-width: 200px">
      {{ label }}
    </div>
    <div class="flex-grow h-full">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped></style>
