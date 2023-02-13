<script setup lang="ts">
import KeyBoard from '@components/vsti/KeyBoard.vue';
import { KeyBind } from '@interfaces/vsti';

const keyNotes: KeyBind[] = [
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
]

</script>

<template>
    <KeyBoard :keyBinds="keyNotes" />    
</template>

<style scoped>

</style>