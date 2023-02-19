<script setup lang="ts">
import { onMounted } from 'vue';
import type { Ref } from 'vue';
import { EnvelopeProps } from '@interfaces/vsti';
import BaseSlider from '@components/vsti/BaseSlider.vue';

const props = defineProps<{
    envelope: EnvelopeProps
}>();

const envelope = props.envelope;

let canvas: HTMLCanvasElement;
let canvasContext: CanvasRenderingContext2D;

let x:number;
let y:number;

onMounted(()=>{
    canvas = document.getElementById("envelope") as HTMLCanvasElement;
    canvasContext = canvas.getContext("2d") as CanvasRenderingContext2D;
    draw();
});

function draw() {
    requestAnimationFrame(draw);

    canvasContext.fillStyle = "#EEEEEE";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = "#00092C";

    canvasContext.beginPath();

    drawAttack();
    drawDecay();
    drawRelease();

    canvasContext.stroke();
}

function drawAttack() {
    x = 0;
    y = canvas.height;
    canvasContext.moveTo(x*200, y);

    x = envelope.attack.duration.value;
    y = 0;
    canvasContext.lineTo(x*200, y);
}

function drawDecay() {
    x = envelope.attack.duration.value;
    y = 0;
    canvasContext.moveTo(x*200, y);

    x += envelope.decay.duration.value;
    y = canvas.height - envelope.sustain.velocity.value * 100;
    canvasContext.lineTo(x*200, y);
}

function drawRelease() {
    x = envelope.attack.duration.value + envelope.decay.duration.value;
    y = canvas.height - envelope.sustain.velocity.value * 100;
    canvasContext.moveTo(x*200, y);

    x += envelope.release.duration.value;
    y = canvas.height;
    canvasContext.lineTo(x*200, y);
}


</script>

<template>
    <div id="graph">
        <canvas id="envelope" width="400" height="100"></canvas>
    </div>
    <div id="controller">
        <BaseSlider :target="envelope.attack.duration" :min=0 :max=2 />
        <BaseSlider :target="envelope.decay.duration" :min=0 :max=5 />
        <BaseSlider :target="envelope.sustain.velocity" :min=0 :max=1 />
        <BaseSlider :target="envelope.release.duration" :min=0 :max=5 />
    </div>
</template>

<style scoped>

</style>