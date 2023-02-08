<script setup>
import { watch } from 'vue';
import store from '@components/stores/store.js'

const props = defineProps({
    keyBind: String,
    pitch: String,
    frequency: Number,
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
    let oscNode = audioContext.createOscillator();
    oscNode.frequency.value = frequency;
    oscNode.type = "sine";

    let gainNode = audioContext.createGain();
    gainNode.gain.value = 0.1;
    oscNode.connect(gainNode);

    oscNode.connect(audioContext.destination);
    
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