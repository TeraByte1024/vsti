<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import BaseSlider from '@components/vsti/BaseSlider.vue';
import BaseSelect from '@components/vsti/BaseSelect.vue';
import Analyser from '@components/vsti/Analyser.vue';
import KeyNote from '@components/vsti/KeyNote.vue';
import { KeyBind } from '@interfaces/vsti';
import store from '@components/stores/store';

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
    "C3":   130.81,
    "C#3":  138.59,
    "D3":   146.83,
    "D#3":  155.56,
    "E3":   164.81,
    "F3":   174.61,
    "F#3":  185.00,
    "G3":   196.00,
    "G#3":  207.65,
    "A3":   220.00,
    "A#3":  233.08,
    "B3":   246.94,
    "C4":   261.63,
    "C#4":  277.18,
    "D4":   293.66,
    "D#4":  311.13,
    "E4":   329.63,
    "F4":   349.23,
    "F#4":  369.99,
    "G4":   392.00,
    "G#4":  415.30,
    "A4":   440.00,
    "A#4":  466.16,
    "B4":   493.88,
    "C5":   523.25,
    "C#5":  554.37,
    "D5":   587.33,
    "D#5":  622.25,
    "E5":   659.25,
    "F5":   698.46,
    "F#5":  739.99,
    "G5":   783.99,
    "G#5":  830.61,
    "A5":   880.00,
    "A#5":  932.33,
    "B5":   987.77,
    "C6":  1046.50,
}

const wavetable:{label:string, value:any}[] = [
    { label: "Sine", value: "sine" },
    { label: "Square", value: "square" },
    { label: "Saw", value: "sawtooth" },
    { label: "Triangle", value: "triangle" },
    { label: "Custom", value: "custom" },
]

const isPlaying:{[index:string]: boolean} = reactive({});
const waveform = ref<OscillatorType>('sine');

const audioContext = store.state.audioContext;
const gainNode = audioContext.createGain();
const convolverNode = audioContext.createConvolver();
const analyserNode = audioContext.createAnalyser();

const reverb:{duration:number, decay:number} = {
    duration: 0.7,
    decay: 3.5
}

const nodes = ref<AudioNode[]>([
    gainNode,
    convolverNode,
    analyserNode,
]);

onMounted(()=> {
    initializeGainNode();
    initializeConvolverNode();
    connectNodes();
    gainNode.connect(analyserNode);
    props.keyBinds.forEach(keyBind => {
        releasedKey(keyBind.key);
    });
});

function connectNodes() {
    nodes.value.forEach((node, index) => {
        const nextNode = nodes.value[index+1] || audioContext.destination;
        node.connect(nextNode);
    });
}

function initializeGainNode() {
    gainNode.gain.value = 0.3;
}

function initializeConvolverNode() {
    convolverNode.buffer = getImpulseResponse(reverb);
}

function getImpulseResponse(reverb: {duration:number, decay:number}) {
    const length = audioContext.sampleRate * reverb.duration;
    const impulse = audioContext.createBuffer(1, length, audioContext.sampleRate);
    const IRArray = impulse.getChannelData(0);
    for(let i=0;i<length;i++) IRArray[i] = (2*Math.random()-1)*Math.pow(1-i/length, reverb.decay);
    return impulse;
}

function addNodeAt(index:number, node:AudioNode) {
    nodes.value.splice(index, 0, node);
    connectNodeAt(index);
}

function replaceNodeAt(index:number, node:AudioNode) {
    nodes.value[index] = node;
    connectNodeAt(index);
}

function connectNodeAt(index:number) {
    const prev = nodes.value[index-1];
    const node = nodes.value[index];
    const next = nodes.value[index+1] || audioContext.destination;
    prev?.connect(node);
    node.connect(next);
}

function connectGain(oscNode: OscillatorNode) {
    oscNode.connect(gainNode);
}
</script>

<template>
    <div id="control">
        <BaseSlider :min=0 :max=1 :step=0.001 :defaultValue="0.3"
            @updateValue="newValue => {gainNode.gain.value = newValue;}" />
        <BaseSlider :min=0.001 :max=3 :step=0.001 :defaultValue="0.7"
            @updateValue="newValue => {reverb.duration = newValue;
                convolverNode.buffer = getImpulseResponse(reverb);}" />
        <BaseSlider :min=0 :max=5 :step=0.001 :defaultValue="3.5"
            @updateValue="newValue => {reverb.decay = newValue;
                convolverNode.buffer = getImpulseResponse(reverb);}" />
        <BaseSelect :items="wavetable"
            @updateValue="newValue => {waveform = newValue;}"/>
        <Analyser :analyser-node="analyserNode"/>
    </div>
    <div id="piano">
        <KeyNote v-for="keyBind in keyBinds"
            :keyBind="keyBind.key"
            :pitch="keyBind.pitch"
            :waveform="waveform"
            :frequency="frequency[keyBind.pitch]"
            :isPlaying="isPlaying[keyBind.key]"
            @mousedown="pressedKey(keyBind.key)" @mouseup="releasedKey(keyBind.key)"
            @update-oscillator-node="connectGain"
        />
    </div>
</template>

<style scoped>
#control {
    display: inline-block;
    margin-bottom: 20px;
}

</style>