<script>

export default {
    props: {
        keyNodes: Array
    },
    data() {
        return {
            playing: [
            ]
        }
    },
    components: {

    },
    methods: {
        pressedKey(key) {
            const keyNode = this.getKeyNodeOf(key);
            const frequency = keyNode.frequency;
            this.playing[key] = this.playNote(frequency);
        },
        releasedKey(key) {
            let playingNode = this.playing[key];
            this.stopNote(playingNode);
            delete this.playing[key];
        },
        getKeyNodeOf(key) {
            return this.keyNodes.find((keyNode) => keyNode.key==key);
        },
        playNote(frequency) {
            const audioContext = new AudioContext();

            const oscNode = audioContext.createOscillator();
            oscNode.frequency.value = frequency;
            oscNode.type = "sine";

            // const gainNode = audioContext.createGain();
            // gainNode.gain.value = 0.5;
            // oscNode.connect(gainNode);

            oscNode.connect(audioContext.destination);
            audioContext.resume();
            oscNode.start();
            return oscNode;
        },
        stopNote(playingNode) {
            playingNode.stop();
        }
    },
    mounted() {
        const keyBoardListener = document.body;
        keyBoardListener.onkeydown = (event) => {
            console.log("down", event.key, !event.repeat?event.repeat:"");
            if(event.repeat) return;
            this.pressedKey(event.key);
        };
        keyBoardListener.onkeyup = (event) => {
            console.log("up", event.key, !event.repeat?event.repeat:"");
            this.releasedKey(event.key);
        };
    }
}



</script>

<template>
    <div v-for="keyNode in keyNodes" :key="keyNode.key"
        class="keyNode" :id="keyNode.key" v-bind="keyNode" @pressedKey="pressedKey" @releasedKey="releasedKey"
    >
        {{ keyNode.pitch }}
    </div>
</template>

<style scoped>

div {
    display: inline-block;
}
.keyNode {
    display: inline-block;
    height: 60px;
    width: 40px;
    text-align: center;
    margin: 1px;
    border-radius: 5px;
    background-color: lightgray;
}

</style>