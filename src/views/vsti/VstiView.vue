<script setup lang="ts">
import KeyBoard from "@components/synth/KeyBoard.vue";
import ControlPanel from "@components/synth/ControlPanel.vue";
</script>

<template>
  <div class="flex flex-col">
    <ControlPanel />
  </div>
  <div class="flex">
    <KeyBoard />
  </div>
</template>

<style scoped></style>
