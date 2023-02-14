<script setup lang="ts">
import { watch, ref } from 'vue';
import store from '@components/stores/store';

const props = withDefaults(defineProps<{
    keyBind: string,
    pitch: string,
    frequency: number,
    waveform?: string,
    volume?: number,
    isPlaying: boolean
}>(), {
    waveform: 'sine',
    volume: 0.5,
    isPlaying: false
});
const audioContext = store.state.audioContext;    
const nodes = ref<AudioNode[]>([
    getOscNode(),
    getGainNode(),
]);
connectNodes();

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

function getGainNode(): GainNode {
    const gainNode = audioContext.createGain();
    gainNode.gain.value = props.volume;
    return gainNode;
}

function getOscNode(): OscillatorNode {
    const oscNode = audioContext.createOscillator();
    oscNode.frequency.value = props.frequency;
    oscNode.type = getWaveform(props.waveform) as OscillatorType;
    return oscNode;
}

function getWaveform(form: string) {
    if(form == 'custom') return 'sine';
    return props.waveform;
}

watch(()=>props.isPlaying, (isPlaying:boolean) => {
    const oscNode = nodes.value[0] as OscillatorNode;
    if(isPlaying) {
        store.state.audioContext.resume();
        oscNode.start();
    } else {
        oscNode.stop();
        replaceNodeAt(0, getOscNode());
    }
});

watch(()=>props.volume, (volume:number) => {
    const gainNode = nodes.value[1] as GainNode;
    gainNode.gain.value = volume;
});

watch(()=>props.waveform, (waveform:string) => {
    const oscNode = nodes.value[0] as OscillatorNode;
    oscNode.type = getWaveform(waveform) as OscillatorType;
});

</script>

<template>
    <div class="keyNote" :class="{'playing':props.isPlaying}">{{ pitch }}</div>
</template>

<style scoped>
.keyNote {
    display: inline-block;
    height: 60px;
    width: 40px;
    text-align: center;
    margin: 1px;
    border-radius: 5px;
    background-color: lightgray;
}

.playing {
    background-color: darkgray;
    color: white;
}

</style>