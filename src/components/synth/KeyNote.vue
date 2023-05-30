<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useSynthStore } from "@components/stores/synth";
import { EnvelopeProps } from "@interfaces/vsti";

const props = withDefaults(
  defineProps<{
    keyBind: string;
    pitch: string;
    frequency: number;
    waveform?: OscillatorType;
    isPlaying: boolean;
    readonly envelope: EnvelopeProps;
  }>(),
  {
    waveform: "sine",
    isPlaying: false,
  }
);

const emit = defineEmits<{
  (event: "updateNode", tail: AudioNode): void;
}>();

const store = useSynthStore();
const audioContext: AudioContext = store.audioContext;
let oscNode: OscillatorNode;
let envelopeGainNode: GainNode;

onMounted(() => {
  refreshNode();
});

function refreshNode() {
  oscNode = getOscNode();
  envelopeGainNode = getGainNode();
  oscNode.connect(envelopeGainNode);
  emit("updateNode", envelopeGainNode);
}

function getOscNode(): OscillatorNode {
  const oscNode = audioContext.createOscillator();
  oscNode.frequency.value = props.frequency;
  oscNode.type = props.waveform;
  return oscNode;
}

function getGainNode(): GainNode {
  const gainNode = audioContext.createGain();
  return gainNode;
}

watch(
  () => props.waveform,
  (waveform: OscillatorType) => {
    oscNode.type = waveform;
  }
);

watch(
  () => props.isPlaying,
  (isPlaying: boolean) => {
    if (isPlaying) {
      startEnvelope();
    } else {
      endEnvelope();
      refreshNode();
    }
  }
);

function startEnvelope() {
  const { attack, decay, sustain } = props.envelope;
  const gain = envelopeGainNode.gain;
  let t = audioContext.currentTime;
  gain.setValueAtTime(0, t);
  t += attack.duration;
  gain.linearRampToValueAtTime(1, t);
  t += decay.duration;
  gain.linearRampToValueAtTime(sustain.velocity, t);
  oscNode.start();
}

function endEnvelope() {
  const { sustain, release } = props.envelope;
  const gain = envelopeGainNode.gain;
  let t = audioContext.currentTime;
  gain.cancelScheduledValues(t);
  gain.setValueAtTime(Math.min(gain.value, sustain.velocity), t);
  t += release.duration;
  gain.linearRampToValueAtTime(0, t);
  oscNode.stop(t);
}
</script>

<template>
  <div class="keyNote" :class="{ playing: props.isPlaying }">
    <span id="pitch">{{ pitch }}</span>
  </div>
</template>

<style scoped>
.keyNote {
  display: inline-block;
  height: 60px;
  width: 40px;
  text-align: center;
  margin: 1px;
  border-radius: 5px;
  color: #06113c;
  background-color: #eeeeee;
}

#pitch {
  display: inline-block;
  padding-bottom: 0px;
  padding-top: 75%;
}

.playing {
  background-color: #06113c;
  color: white;
}
</style>
