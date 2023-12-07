import { ref, reactive } from "vue";
import { defineStore } from "pinia";

import { AnalyserModule, EnvelopeProps, Vsti } from "@model/vsti";

export const useSynthStore = defineStore("synth", () => {
  const audioContext = new AudioContext();
  const vsti = new Vsti(audioContext);
  const analyserModule = new AnalyserModule(audioContext);

  vsti.output.connect(analyserModule);
  analyserModule.connectDestination();

  return {
    vsti,
    analyserModule
  };
});
