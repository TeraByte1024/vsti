<script setup lang="ts">
import { onMounted, watch, reactive, ref } from "vue";
import { useSynthStore } from "@store/synth";
import { frequencyMap, keyBinds } from "@model/vsti";
import KeyNote from "@components/synth/KeyNote.vue";

const synth = useSynthStore();

const isPlaying: { [index: string]: boolean } = reactive({});

function bindkeyBoardEventListener() {
  const keyBoardListener = document.body;
  keyBoardListener.onkeydown = (event) => {
    if (event.repeat) return;
    pressedKey(event.key);
  };
  keyBoardListener.onkeyup = (event) => {
    releasedKey(event.key);
  };
}

function pressedKey(key: string) {
  isPlaying[key] = true;
}

function releasedKey(key: string) {
  isPlaying[key] = false;
}

onMounted(() => {
  synth.start();
  bindkeyBoardEventListener();
  synth.gainNode.connect(synth.analyserNode);
  keyBinds.forEach((keyBind) => {
    releasedKey(keyBind.key);
  });
  synth.refreshImpulseResponse(synth.reverb);
});

watch(
  () => synth.reverb,
  (newReverb) => {
    synth.refreshImpulseResponse(newReverb);
  },
  { deep: true }
);
</script>

<template>
  <KeyNote
    v-for="keyBind in keyBinds"
    :keyBind="keyBind.key"
    :pitch="keyBind.pitch"
    :waveform="synth.waveform"
    :frequency="frequencyMap[keyBind.pitch]"
    :envelope="synth.envelope"
    :isPlaying="isPlaying[keyBind.key]"
    @mousedown="pressedKey(keyBind.key)"
    @mouseup="releasedKey(keyBind.key)"
    @touchstart="pressedKey(keyBind.key)"
    @touchend="releasedKey(keyBind.key)"
    @update-node="synth.connectGain"
  />
</template>

<style scoped></style>
