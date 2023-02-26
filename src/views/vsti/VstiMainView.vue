<script setup lang="ts">
import KeyBoard from '@components/synth/KeyBoard.vue';
import { KeyBind } from '@interfaces/vsti';

const keyNotes: KeyBind[] = [
    { key: 'z', pitch: "C3" },
    { key: 's', pitch: "C#3" },
    { key: 'x', pitch: "D3" },
    { key: 'd', pitch: "D#3" },
    { key: 'c', pitch: "E3" },
    { key: 'v', pitch: "F3" },
    { key: 'g', pitch: "F#3" },
    { key: 'b', pitch: "G3" },
    { key: 'h', pitch: "G#3" },
    { key: 'n', pitch: "A3" },
    { key: 'j', pitch: "A#3" },
    { key: 'm', pitch: "B3" },
    { key: ',', pitch: "C4" },
    { key: 'l', pitch: "C#4" },
    { key: '.', pitch: "D4" },
    { key: ';', pitch: "D#4" },
    { key: '/', pitch: "E4" },

    { key: 'q', pitch: "C4" },
    { key: '2', pitch: "C#4" },
    { key: 'w', pitch: "D4" },
    { key: '3', pitch: "D#4" },
    { key: 'e', pitch: "E4" },
    { key: 'r', pitch: "F4" },
    { key: '5', pitch: "F#4" },
    { key: 't', pitch: "G4" },
    { key: '6', pitch: "G#4" },
    { key: 'y', pitch: "A4" },
    { key: '7', pitch: "A#4" },
    { key: 'u', pitch: "B4" },
    { key: 'i', pitch: "C5" },
    { key: '9', pitch: "C#5" },
    { key: 'o', pitch: "D5" },
    { key: '0', pitch: "D#5" },
    { key: 'p', pitch: "E5" },
    { key: '[', pitch: "F5" },
    { key: '=', pitch: "F#5" },
    { key: ']', pitch: "G5" },
]

</script>

<template>
    <KeyBoard :keyBinds="keyNotes" />
</template>

<style scoped>

</style>