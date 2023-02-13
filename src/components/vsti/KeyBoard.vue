<script setup lang="ts">
import KeyNote from '@components/vsti/KeyNote.vue';
import { KeyBind } from '@interfaces/vsti';
import BaseSlider from '@components/vsti/BaseSlider.vue';
import BaseSelect from '@components/vsti/BaseSelect.vue';
import { reactive, ref } from 'vue';

const props = defineProps<{
    keyBinds: KeyBind[]
}>();

const keyBoardListener = document.body;
keyBoardListener.onkeydown = (event) => {
    if(event.repeat) return;
    pressedKey(event.key);
};
keyBoardListener.onkeyup = (event) => {
    releasedKey(event.key);
};

function pressedKey(key: string) {
    isPlaying[key] = true;
}

function releasedKey(key: string) {
    isPlaying[key] = false;
}

const frequency:{[index:string]:number} = {
    "C4"  : 261.63,
    "C#4" : 277.18,
    "D4"  : 293.66,
    "D#4" : 311.13,
    "E4"  : 329.63,
    "F4"  : 349.23,
    "F#4" : 369.99,
    "G4"  : 392.00,
    "G#4" : 415.30,
    "A4"  : 440.00,
    "A#4" : 466.16,
    "B4"  : 493.88,
    "C5"  : 523.25,
}

const wavetable:{label:string, value:any}[] = [
    { label: "Sine", value: "sine" },
    { label: "Square", value: "square" },
    { label: "Saw", value: "sawtooth" },
    { label: "Triangle", value: "triangle" },
    { label: "Custom", value: "custom" },
]

const isPlaying:{[index:string]: boolean} = reactive({});
const masterVolume = ref<number>(0.5);
const waveform = ref<string>('sine');

props.keyBinds.forEach(keyBind => {
    releasedKey(keyBind.key);
});

</script>

<template>
    <div id="control">
        <BaseSlider :min=0 :max=1 :step=0.001 :defaultValue="masterVolume"
            @updateValue="newValue => {masterVolume = newValue;}" />
        <BaseSelect :items="wavetable"
            @updateValue="newValue => {waveform = newValue;}"/>
    </div>
    <div id="piano">
        <KeyNote v-for="keyBind in keyBinds"
            :keyBind="keyBind.key"
            :pitch="keyBind.pitch"
            :volume="masterVolume"
            :waveform="waveform"
            :frequency="frequency[keyBind.pitch]"
            :isPlaying="isPlaying[keyBind.key]"
            @mousedown="pressedKey(keyBind.key)" @mouseup="releasedKey(keyBind.key)"
        />
    </div>
</template>

<style scoped>
#control {
    margin-bottom: 20px;
}
.slider {
    display: inline-block;
}

.keyNote {
    display: inline-block;
}

</style>