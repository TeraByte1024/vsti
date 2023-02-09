<script setup>
import KeyNote from '@components/vsti/KeyNote.vue';
import BaseSlider from '@components/vsti/BaseSlider.vue';
import { reactive, ref } from 'vue';

const props = defineProps({
    keyNotes: Array
});

const keyBoardListener = document.body;
keyBoardListener.onkeydown = (event) => {
    if(event.repeat) return;
    pressedKey(event.key);
};
keyBoardListener.onkeyup = (event) => {
    releasedKey(event.key);
};

function pressedKey(key) {
    isPlaying[key] = true;
}

function releasedKey(key) {
    isPlaying[key] = false;
}

const frequency = {
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

const isPlaying = reactive({});
const masterVolume = ref(0.5);

props.keyNotes.forEach(keyNote => {
    releasedKey(keyNote.keyBind);
});

</script>

<template>
    <div id="control">
        <div class="slider">
            <input type="range" v-model.number="masterVolume"
                min=0 max=1 step=0.001 />
            <div>{{ masterVolume }}</div>
        </div>
    </div>
    <div id="piano">
        <KeyNote v-for="keyNote in keyNotes"
            :keyBind="keyNote.keyBind"
            :pitch="keyNote.pitch"
            :volume="masterVolume"
            :frequency="frequency[keyNote.pitch]"
            :isPlaying="isPlaying[keyNote.keyBind]"
            @mousedown="pressedKey(keyNote.keyBind)" @mouseup="releasedKey(keyNote.keyBind)"
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