<script setup lang="ts">
import ControlParam from "./ControlParam.vue";
import BaseSelect from "@components/base/BaseSelect.vue";
import BaseSlider from "@components/base/BaseSlider.vue";
import Envelope from "@components/base/Envelope.vue";
import Analyser from "@components/base/Analyser.vue";

import { useSynthStore } from "@store/synth";
import { wavetable } from "@model/vsti";
const synth = useSynthStore();
const vsti = synth.vsti;
</script>
<template>
  <Analyser :width="2200" :height="112" class="w-full h-28" />
  <Envelope :width="2200" :height="112" class="w-full h-28" />

  <div class="flex flex-col justify-between w-full p-3 text-accent">
    <ControlParam label="Waveform">
      <BaseSelect v-model="vsti.waveform" :items="wavetable" />
    </ControlParam>
    <ControlParam label="Volume">
      <BaseSlider
        v-model="vsti.masterVolume.gainNode.gain.value"
        :min="0"
        :max="1"
        :step="0.001"
      />
    </ControlParam>
    <ControlParam label="Reverb Duration">
      <BaseSlider
        v-model="vsti.reverb.duration"
        :min="0.001"
        :max="5"
        :step="0.001"
      />
    </ControlParam>
    <ControlParam label="Reverb Decay">
      <BaseSlider
        v-model="vsti.reverb.decay"
        :min="0"
        :max="10"
        :step="0.001"
      />
    </ControlParam>
  </div>
  <div class="flex flex-col justify-between w-full p-3 text-accent">
    <ControlParam label="Attack">
      <BaseSlider v-model="vsti.envelope.attack.duration" :min="0" :max="2" />
    </ControlParam>
    <ControlParam label="Decay">
      <BaseSlider v-model="vsti.envelope.decay.duration" :min="0" :max="5" />
    </ControlParam>
    <ControlParam label="Sustain">
      <BaseSlider v-model="vsti.envelope.sustain.velocity" :min="0" :max="1" />
    </ControlParam>
    <ControlParam label="Release">
      <BaseSlider v-model="vsti.envelope.release.duration" :min="0" :max="5" />
    </ControlParam>
  </div>
</template>
