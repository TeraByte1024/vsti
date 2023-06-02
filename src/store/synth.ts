import { ref } from "vue";
import { defineStore } from "pinia";

import { EnvelopeProps } from "@model/vsti";

export const useSynthStore = defineStore("synth", () => {
  const audioContext = ref(new AudioContext());

  const wavetable: { label: string; value: any }[] = [
    { label: "Sine", value: "sine" },
    { label: "Square", value: "square" },
    { label: "Saw", value: "sawtooth" },
    { label: "Triangle", value: "triangle" },
    { label: "Custom", value: "custom" },
  ];

  const waveform = ref<OscillatorType>("sine");

  const envelope: EnvelopeProps = {
    attack: { duration: 0.1 },
    decay: { duration: 1 },
    sustain: { velocity: 0.4 },
    release: { duration: 0.5 },
  };

  const gainNode = audioContext.value.createGain();
  gainNode.gain.value = 0.3;
  const convolverNode = audioContext.value.createConvolver();
  const analyserNode = audioContext.value.createAnalyser();

  const reverb = ref<{ duration: number; decay: number }>({
    duration: 2.5,
    decay: 5,
  });

  const nodes = ref<AudioNode[]>([gainNode, convolverNode, analyserNode]);

  function connectGain(audioNode: AudioNode) {
    audioNode.connect(gainNode);
  }

  function connectNodes() {
    nodes.value.forEach((node, index) => {
      const nextNode = nodes.value[index + 1] || audioContext.value.destination;
      node.connect(nextNode);
    });
  }

  function addNodeAt(index: number, node: AudioNode) {
    nodes.value.splice(index, 0, node);
    connectNodeAt(index);
  }

  function replaceNodeAt(index: number, node: AudioNode) {
    nodes.value[index] = node;
    connectNodeAt(index);
  }

  function connectNodeAt(index: number) {
    const prev = nodes.value[index - 1];
    const node = nodes.value[index];
    const next = nodes.value[index + 1] || audioContext.value.destination;
    prev?.connect(node);
    node.connect(next);
  }

  function refreshImpulseResponse(reverb: { duration: number; decay: number }) {
    convolverNode.buffer = getImpulseResponse(reverb);
  }

  function getImpulseResponse(reverb: { duration: number; decay: number }) {
    const length = audioContext.value.sampleRate * reverb.duration;
    const impulse = audioContext.value.createBuffer(
      1,
      length,
      audioContext.value.sampleRate
    );
    const IRArray = impulse.getChannelData(0);
    for (let i = 0; i < length; i++)
      IRArray[i] =
        (2 * Math.random() - 1) * Math.pow(1 - i / length, reverb.decay);
    return impulse;
  }

  function start() {
    audioContext.value.resume();
    connectNodes();
  }
  return {
    audioContext,
    wavetable,
    waveform,
    envelope,
    reverb,
    gainNode,
    convolverNode,
    analyserNode,
    nodes,

    start,
    refreshImpulseResponse,
    getImpulseResponse,
    connectGain,
  };
});
