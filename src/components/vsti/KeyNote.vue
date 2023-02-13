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

let oscNode = getOscNodeWithFrequency(props.frequency);

const nodes = ref([]);

watch(()=>props.isPlaying, (isPlaying) => {
    if(isPlaying) {
        store.state.audioContext.resume();
        oscNode.start();
    } else {
        oscNode.stop();
        oscNode = getOscNodeWithFrequency(props.frequency);
    }
});

function getOscNodeWithFrequency(frequency: number) {
    const audioContext = store.state.audioContext;
    const oscNode = audioContext.createOscillator();
    oscNode.frequency.value = frequency;
    oscNode.type = getWaveform(props.waveform) as OscillatorType;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = props.volume;

    oscNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    return oscNode;
}

function getWaveform(form: string) {
    if(form == 'custom') return 'sine';
    return props.waveform;
}
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