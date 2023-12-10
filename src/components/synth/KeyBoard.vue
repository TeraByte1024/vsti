<script setup lang="ts">
import { onMounted, watch, reactive } from "vue";
import { useSynthStore } from "@store/synth";
import { OscillatorModule, Vsti, frequencyMap, keyBinds } from "@model/vsti";
import KeyNote from "@components/synth/KeyNote.vue";

const synth = useSynthStore();
const vsti = synth.vsti;

function bindKeyPressedEvent() {
  const keyBoardListener = document.body;
  keyBoardListener.onkeydown = (event) => {
    if (event.repeat) return;
    const pitch = keyBinds[event.key];
    if (pitch == undefined) return;
    vsti.play(pitch);
  };
  keyBoardListener.onkeyup = (event) => {
    const pitch = keyBinds[event.key];
    if (pitch == undefined) return;
    vsti.stop(pitch);
  };
}

onMounted(() => {
  bindKeyPressedEvent();
});
</script>

<template>
  <div class="container-key flex flex-row justify-between w-full h-20">
    <KeyNote v-for="pitch in Object.keys(frequencyMap)" :pitch="pitch" />
  </div>
</template>

<style scoped>
.container-key .key:nth-child(12n + 1) {
  background-color: #d4dcdd;
}
</style>
