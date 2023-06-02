<script setup lang="ts">
import { onMounted, watch, reactive } from "vue";
import { useSynthStore } from "@store/synth";
import { frequencyMap, keyBindMap } from "@model/vsti";
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

const lowerKeyBinds = keyBindMap[0];
const upperKeyBinds = keyBindMap[1];

onMounted(() => {
  synth.start();
  bindkeyBoardEventListener();
  synth.gainNode.connect(synth.analyserNode);
  const keyBinds = [...lowerKeyBinds, ...upperKeyBinds];
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
  <div class="flex flex-col w-full">
    <div class="flex justify-center">
      <KeyNote
        v-for="keyBind in upperKeyBinds"
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
    </div>
    <div class="flex justify-center">
      <KeyNote
        v-for="keyBind in lowerKeyBinds"
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
    </div>
  </div>
</template>

<style scoped></style>
