<script setup lang="ts">
import { onMounted, watch, reactive, ref } from 'vue';
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

const frequency = store.state.frequencyTable;

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

const audioContext = store.state.audioContext;
const gainNode = audioContext.createGain();
gainNode.gain.value = 0.3;
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

const reverb:{duration:number, decay:number} = {
    duration: 2.5,
    decay: 5
}

watch(()=>getImpulseResponse(reverb), newImpulseResponse=> {
    refreshImpulseResponse(newImpulseResponse);
});

function refreshImpulseResponse(impulseResponse: AudioBuffer) {
    convolverNode.buffer = impulseResponse;
}

function getImpulseResponse(reverb: {duration:number, decay:number}) {
    const length = audioContext.sampleRate * reverb.duration;
    const impulse = audioContext.createBuffer(1, length, audioContext.sampleRate);
    const IRArray = impulse.getChannelData(0);
    for(let i=0;i<length;i++) IRArray[i] = (2*Math.random()-1)*Math.pow(1-i/length, reverb.decay);
    return impulse;
}

const envelope: EnvelopeProps = {
    attack: {duration: 0.1},
    decay: {duration: 1},
    sustain: {velocity: 0.4},
    release: {duration: 0.5}
}

const wavetable:{label:string, value:any}[] = [
    { label: "Sine", value: "sine" },
    { label: "Square", value: "square" },
    { label: "Saw", value: "sawtooth" },
    { label: "Triangle", value: "triangle" },
    { label: "Custom", value: "custom" },
]

const waveform = ref<OscillatorType>('sine');

function connectGain(audioNode: AudioNode) {
    audioNode.connect(gainNode);
}

</script>

<template>
    <div id="control">
        <BaseSelect :label="'Waveform'" v-model="waveform" :items="wavetable" />
        <BaseSlider :label="'Volume'" v-model="gainNode.gain.value" :min=0 :max=1 :step=0.001 />
        <BaseSlider :label="'Reverb Duration'" v-model="reverb.duration" :min=0.001 :max=5 :step=0.001 />
        <BaseSlider :label="'Reverb Decay'" v-model="reverb.decay" :min=0 :max=10 :step=0.001 />
        <Envelope :envelope="envelope" />
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
    display: block;
}

#control * {
    margin-bottom: 10px;
}
</style>