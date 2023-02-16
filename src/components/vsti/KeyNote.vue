<script setup lang="ts">
import { watch } from 'vue';
import store from '@components/stores/store';

const props = withDefaults(defineProps<{
    keyBind: string,
    pitch: string,
    frequency: number,
    waveform?: string,
    isPlaying: boolean,
}>(), {
    waveform: 'sine',
    volume: 0.5,
    isPlaying: false
});

const emit = defineEmits<{
    (event: 'updateOscillatorNode', oscNode: OscillatorNode): void
}>();

const audioContext: AudioContext = store.state.audioContext;
let oscNode: OscillatorNode;
refreshOscNode();

function refreshOscNode() {
    oscNode = getOscNode();
    emit('updateOscillatorNode', oscNode);
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
    if(isPlaying) {
        store.state.audioContext.resume();
        oscNode.start();
    } else {
        oscNode.stop();
        refreshOscNode();
    }
});

watch(()=>props.waveform, (waveform:string) => {
    oscNode.type = getWaveform(waveform) as OscillatorType;
});

</script>

<template>
    <div class="keyNote" :class="{'playing':props.isPlaying}">
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
    color: #06113C;
    background-color: #EEEEEE;
}

#pitch {
    display: inline-block;
    padding-bottom: 0px;
    padding-top: 75%;
}

.playing {
    background-color: #06113C;
    color: white;
}

</style>