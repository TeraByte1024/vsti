<script setup lang="ts">
import { computed } from "vue";
import { useSynthStore } from "@store/synth";
import { EnvelopeProps } from "@model/vsti";

const props = defineProps<{
  pitch: string;
}>();

const synth = useSynthStore();
const vsti = synth.vsti;
const isPlaying = computed(() => vsti.isPlaying[props.pitch]);

function mouseenterCheck(e: MouseEvent, pitch: string) {
  if (e.buttons == 1) {
    vsti.play(pitch);
  }
}

function mouseleaveCheck(e: MouseEvent, pitch: string) {
  if (e.buttons == 1) {
    vsti.stop(pitch);
  }
}
</script>

<template>
  <div
    class="key w-full bg-secondary text-center text-primary"
    :class="{ playing: isPlaying }"
    @mousedown="vsti.play(pitch)"
    @mouseup="vsti.stop(pitch)"
    @touchstart="vsti.play(pitch)"
    @touchend="vsti.stop(pitch)"
    @mouseenter="(e) => mouseenterCheck(e, pitch)"
    @mouseleave="(e) => mouseleaveCheck(e, pitch)"
  >
    {{ pitch }}
  </div>
</template>

<style scoped>
.key.playing {
  background-color: #354649 !important;
  color: #e5edee;
}

.key {
  font-size: 0.5rem;
}
</style>
