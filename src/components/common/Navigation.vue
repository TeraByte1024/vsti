<script setup lang="ts">
const items: { label: string; link: string }[] = [
  {
    label: "Project",
    link: "",
  },
  {
    label: "Sequencer",
    link: "",
  },
  {
    label: "Playlist",
    link: "",
  },
  {
    label: "Piano Roll",
    link: "",
  },
];
</script>

<template>
  <nav class="px-2 py-2 bg-secondary h-full">
    <div
      v-for="item in items"
      :key="item.link"
      class="box-content px-6 py-1.5 mx-auto min-w-min rounded transition-all text-2xl text-primary hover:text-accent hover:bg-focus active:bg-primar active:text-accent"
    >
      {{ item.label }}
    </div>
  </nav>
</template>

<style scoped></style>
