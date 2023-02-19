<script setup lang="ts">
import { onMounted, watch } from 'vue';
import store from '@components/stores/store';
import { EnvelopeProps } from '@interfaces/vsti';

const props = withDefaults(defineProps<{
    keyBind: string,
    pitch: string,
    frequency: number,
    waveform?: string,
    isPlaying: boolean,
    readonly envelope: EnvelopeProps
}>(), {
    waveform: 'sine',
    volume: 0.5,
    isPlaying: false
});

const emit = defineEmits<{
    (event: 'updateNode', tail: AudioNode): void
}>();

const audioContext: AudioContext = store.state.audioContext;
let oscNode: OscillatorNode;
const envelopeGainNode: GainNode = audioContext.createGain();

onMounted(()=>{
    refreshOscNode();
    connectEnvelopeGainNode();
    emit('updateNode', envelopeGainNode);
});

function refreshOscNode() {
    oscNode = getOscNode();
    connectEnvelopeGainNode();
}

function getOscNode(): OscillatorNode {
    const oscNode = audioContext.createOscillator();
    oscNode.frequency.value = props.frequency;
    oscNode.type = getWaveform(props.waveform);
    return oscNode;
}

watch(()=>props.waveform, (waveform:string) => {
    oscNode.type = getWaveform(waveform);
});

function getWaveform(form: string): OscillatorType {
    if(form == 'custom') return 'sine';
    return props.waveform as OscillatorType;
}

function connectEnvelopeGainNode() {
    oscNode.connect(envelopeGainNode);
}

watch(()=>props.isPlaying, (isPlaying:boolean) => {
    if(isPlaying) {
        startEnvelope();
    } else {
        endEnvelope();
        refreshOscNode();
    }
});

function startEnvelope() {
    const { attack, decay, sustain } = props.envelope;
    const gain = envelopeGainNode.gain;
    let t = audioContext.currentTime;
    gain.setValueAtTime(0, t);
    t += attack.duration.value;
    gain.linearRampToValueAtTime(1, t);
    t += decay.duration.value;
    gain.linearRampToValueAtTime(sustain.velocity.value, t);
    oscNode.start();
}

function endEnvelope() {
    const { release } = props.envelope;
    let t = audioContext.currentTime;
    const gain = envelopeGainNode.gain;
    t += release.duration.value;
    gain.linearRampToValueAtTime(0, t);
    oscNode.stop(t);
}

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