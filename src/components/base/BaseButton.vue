<script setup lang="ts">
const props = defineProps<{
  label?: string;
}>();
</script>

<template>
  <button
    class="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
  >
    {{ label }}
  </button>
</template>

<style scoped></style>
