<script setup lang="ts">
import ControlParam from "./ControlParam.vue";
import BaseSelect from "@components/base/BaseSelect.vue";
import BaseSlider from "@components/base/BaseSlider.vue";
import Envelope from "@components/base/Envelope.vue";
import Analyser from "@components/base/Analyser.vue";

import { useSynthStore } from "@store/synth";

const synth = useSynthStore();
</script>
<template>
  <Analyser :width="2200" :height="112" class="w-full h-28" />
  <Envelope :width="2200" :height="112" class="w-full h-28" />

  <div class="flex flex-col justify-between w-full p-3 text-accent">
    <ControlParam label="Waveform">
      <BaseSelect v-model="synth.waveform" :items="synth.wavetable" />
    </ControlParam>
    <ControlParam label="Volume">
      <BaseSlider
        v-model="synth.gainNode.gain.value"
        :min="0"
        :max="1"
        :step="0.001"
      />
    </ControlParam>
    <ControlParam label="Reverb Duration">
      <BaseSlider
        v-model="synth.reverb.duration"
        :min="0.001"
        :max="5"
        :step="0.001"
      />
    </ControlParam>
    <ControlParam label="Reverb Decay">
      <BaseSlider
        v-model="synth.reverb.decay"
        :min="0"
        :max="10"
        :step="0.001"
      />
    </ControlParam>
  </div>
  <div class="flex flex-col justify-between w-full p-3 text-accent">
    <ControlParam label="Attack">
      <BaseSlider v-model="synth.envelope.attack.duration" :min="0" :max="2" />
    </ControlParam>
    <ControlParam label="Decay">
      <BaseSlider v-model="synth.envelope.decay.duration" :min="0" :max="5" />
    </ControlParam>
    <ControlParam label="Sustain">
      <BaseSlider v-model="synth.envelope.sustain.velocity" :min="0" :max="1" />
    </ControlParam>
    <ControlParam label="Release">
      <BaseSlider v-model="synth.envelope.release.duration" :min="0" :max="5" />
    </ControlParam>
  </div>
</template>
