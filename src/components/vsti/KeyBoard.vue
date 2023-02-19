<script setup lang="ts">
import { onMounted, watch, reactive, ref } from 'vue';
import type { Ref } from 'vue';
import store from '@components/stores/store';
import { KeyBind, EnvelopeProps } from '@interfaces/vsti';
import BaseSlider from '@components/vsti/BaseSlider.vue';
import BaseSelect from '@components/vsti/BaseSelect.vue';
import Envelope from '@components/vsti/Envelope.vue';
import Analyser from '@components/vsti/Analyser.vue';
import KeyNote from '@components/vsti/KeyNote.vue';

const props = defineProps<{
    keyBinds: KeyBind[]
}>();

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

const isPlaying:{[index:string]: boolean} = reactive({});

function bindkeyBoardEventListener() {
    const keyBoardListener = document.body;
    keyBoardListener.onkeydown = (event) => {
        if(event.repeat) return;
        pressedKey(event.key);
    };
    keyBoardListener.onkeyup = (event) => {
        releasedKey(event.key);
    };
}

function pressedKey(key: string) {
    isPlaying[key] = true;
}

function releasedKey(key: string) {
    isPlaying[key] = false;
}

const wavetable:{label:string, value:any}[] = [
    { label: "Sine", value: "sine" },
    { label: "Square", value: "square" },
    { label: "Saw", value: "sawtooth" },
    { label: "Triangle", value: "triangle" },
    { label: "Custom", value: "custom" },
]

const waveform:Ref<OscillatorType> = ref<OscillatorType>('sine');

const audioContext = store.state.audioContext;
const gainNode = audioContext.createGain();
const convolverNode = audioContext.createConvolver();
const analyserNode = audioContext.createAnalyser();

const nodes = ref<AudioNode[]>([
    gainNode,
    convolverNode,
    analyserNode,
]);

onMounted(()=> {
    store.state.audioContext.resume();
    bindkeyBoardEventListener();
    initializeGainNode();
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

function initializeGainNode() {
    gainNode.gain.value = 0.3;
}

const reverb:{duration:Ref<number>, decay:Ref<number>} = {
    duration: ref<number>(0.7),
    decay: ref<number>(3.5)
}

watch(()=>getImpulseResponse(reverb), newImpulseResponse=> {
    refreshImpulseResponse(newImpulseResponse);
});

function refreshImpulseResponse(impulseResponse: AudioBuffer) {
    convolverNode.buffer = impulseResponse;
}

function getImpulseResponse(reverb: {duration:Ref<number>, decay:Ref<number>}) {
    const length = audioContext.sampleRate * reverb.duration.value;
    const impulse = audioContext.createBuffer(1, length, audioContext.sampleRate);
    const IRArray = impulse.getChannelData(0);
    for(let i=0;i<length;i++) IRArray[i] = (2*Math.random()-1)*Math.pow(1-i/length, reverb.decay.value);
    return impulse;
}

const envelope: EnvelopeProps = {
    attack: {duration: ref<number>(0.1),},
    decay: {duration: ref<number>(1),},
    sustain: {velocity: ref<number>(0.4),},
    release: {duration: ref<number>(0.5)}
}

function connectGain(audioNode: AudioNode) {
    audioNode.connect(gainNode);
}

</script>

<template>
    <div id="control">
        <BaseSlider :target="gainNode.gain" :min=0 :max=1 :step=0.001 />
        <BaseSlider :target="reverb.duration" :min=0.001 :max=5 :step=0.001 />
        <BaseSlider :target="reverb.decay" :min=0 :max=10 :step=0.001 />
        <!-- <BaseSelect :target="waveform" :items="wavetable" /> -->
        <Envelope :envelope="envelope"  />
        <Analyser :analyser-node="analyserNode"/>
    </div>
    <div id="piano">
        <KeyNote v-for="keyBind in keyBinds"
            :keyBind="keyBind.key"
            :pitch="keyBind.pitch"
            :waveform="waveform"
            :frequency="frequency[keyBind.pitch]"
            :envelope="envelope"
            :isPlaying="isPlaying[keyBind.key]"
            @mousedown="pressedKey(keyBind.key)" @mouseup="releasedKey(keyBind.key)"
            @touchstart="pressedKey(keyBind.key)" @touchend="releasedKey(keyBind.key)"
            @update-node="connectGain"
        />
    </div>
</template>

<style scoped>
#control {
    display: inline-block;
    margin-bottom: 20px;
}

</style>