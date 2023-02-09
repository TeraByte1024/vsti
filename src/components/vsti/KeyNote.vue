<script setup>
import { watch } from 'vue';
import store from '@components/stores/store.js'

const props = defineProps({
    keyBind: String,
    pitch: String,
    frequency: Number,
    volume: Number,
    isPlaying: Boolean,
})

let oscNode = getOscNodeWithFrequency(props.frequency);;

watch(()=>props.isPlaying, (isPlaying) => {
    if(isPlaying) {
        store.state.audioContext.resume();
        oscNode.start();
    } else {
        oscNode.stop();
        oscNode = getOscNodeWithFrequency(props.frequency);
    }
});

function getOscNodeWithFrequency(frequency) {
    const audioContext = store.state.audioContext;
    const oscNode = audioContext.createOscillator();
    oscNode.frequency.value = frequency;
    oscNode.type = "sine";

    const gainNode = audioContext.createGain();
    gainNode.gain.value = props.volume;

    oscNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    return oscNode;
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