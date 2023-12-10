<script setup lang="ts">
const items: { label: string; link: string }[] = [
  {
    label: "New Project",
    link: "",
  },
  {
    label: "Open Project from Local",
    link: "",
  },
];
</script>

<template>
  <nav class="flex justify-start bg-secondary px-10 py-2">
    <div
      v-for="item in items"
      :key="item.link"
      class="block bg-transparent px-5 mr-3 transition-all border-b-2 border-b-transparent border-e-0 hover:border-b-primary text-xl text-primary active:border-b-accent active:text-accent"
    >
      {{ item.label }}
    </div>
  </nav>
</template>

<style scoped></style>
