<script>
import KeyBoard from '@components/vsti/KeyBoard.vue';

export default {
    data() {
        return {
            keyNodes: [
                { pitch: "C4",  frequency: 261.63, key: 'q' },
                { pitch: "C#4", frequency: 277.18, key: '2' },
                { pitch: "D4",  frequency: 293.66, key: 'w' },
                { pitch: "D#4", frequency: 311.13, key: '3' },
                { pitch: "E4",  frequency: 329.63, key: 'e' },
                { pitch: "F4",  frequency: 349.23, key: 'r' },
                { pitch: "F#4", frequency: 369.99, key: '5' },
                { pitch: "G4",  frequency: 392.00, key: 't' },
                { pitch: "G#4", frequency: 415.30, key: '6' },
                { pitch: "A4",  frequency: 440.00, key: 'y' },
                { pitch: "A#4", frequency: 466.16, key: '7' },
                { pitch: "B4",  frequency: 493.88, key: 'u' },
                { pitch: "C5",  frequency: 523.25, key: 'i' },
            ]
        }
    },
    components: {
        KeyBoard
    },
}

</script>

<template>
    <KeyBoard :keyNodes="keyNodes" />
    
</template>

<style scoped>

</style>