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
    vsti.play(keyBinds[event.key]);
  };
  keyBoardListener.onkeyup = (event) => {
    vsti.stop(keyBinds[event.key]);
  };
}

onMounted(() => {
  bindKeyPressedEvent();
});
</script>

<template>
  <div class="flex flex-col w-full">
    <div class="flex justify-center">
      <KeyNote
        v-for="key in Object.keys(keyBinds)"
        :keyBind="key"
        :pitch="keyBinds[key]"
      />
    </div>
  </div>
</template>

<style scoped></style>
