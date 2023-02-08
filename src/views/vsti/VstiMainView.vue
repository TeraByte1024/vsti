<script setup>
import KeyBoard from '@components/vsti/KeyBoard.vue';

const keyNotes = [
    { keyBind: 'q', pitch: "C4" },
    { keyBind: '2', pitch: "C#4" },
    { keyBind: 'w', pitch: "D4" },
    { keyBind: '3', pitch: "D#4" },
    { keyBind: 'e', pitch: "E4" },
    { keyBind: 'r', pitch: "F4" },
    { keyBind: '5', pitch: "F#4" },
    { keyBind: 't', pitch: "G4" },
    { keyBind: '6', pitch: "G#4" },
    { keyBind: 'y', pitch: "A4" },
    { keyBind: '7', pitch: "A#4" },
    { keyBind: 'u', pitch: "B4" },
    { keyBind: 'i', pitch: "C5" },
]

</script>

<template>
    <KeyBoard :keyNotes="keyNotes" />    
</template>

<style scoped>

</style>