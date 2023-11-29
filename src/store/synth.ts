import { ref } from "vue";
import { defineStore } from "pinia";

import { Vsti, EnvelopeProps, ReverbProps } from "@model/vsti";

export const useSynthStore = defineStore("synth", () => {
  const audioContext = ref(new AudioContext());

  const vsti = new Vsti(audioContext.value);

  function start() {
    audioContext.value.resume();
  }

  return {
    audioContext,
    vsti,

    start,
  };
});
