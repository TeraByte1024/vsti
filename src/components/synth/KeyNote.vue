<script setup lang="ts">
import { computed } from "vue";
import { useSynthStore } from "@store/synth";
import { EnvelopeProps } from "@model/vsti";

const props = defineProps<{
  keyBind: string;
  pitch: string;
}>();

const synth = useSynthStore();
const vsti = synth.vsti;
const isPlaying = computed(() => vsti.isPlaying[props.pitch]);

</script>

<template>
  <div
    class="h-20 w-10 m-0.5 rounded bg-secondary text-center text-primary"
    :class="{ playing: isPlaying }"
    @mousedown="vsti.play(pitch)"
    @mouseup="vsti.stop(pitch)"
    @touchstart="vsti.play(pitch)"
    @touchend="vsti.stop(pitch)"
  >
    {{ pitch }}
  </div>
</template>

<style scoped>
.playing {
  background-color: #354649;
  color: #e5edee;
}
</style>
