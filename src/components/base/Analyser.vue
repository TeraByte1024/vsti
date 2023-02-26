<script setup lang="ts">
import { onMounted } from 'vue';

const props = defineProps<{
    analyserNode: AnalyserNode
}>();

const analyserNode = props.analyserNode;
let bufferLength: number;
let dataArray: Uint8Array;
let canvas:HTMLCanvasElement;
let canvasContext: CanvasRenderingContext2D;

onMounted(()=> {
    initializeAnalyserNode();
});

function initializeAnalyserNode() {
    analyserNode.fftSize = Math.pow(2, 13);
    bufferLength = analyserNode.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    canvas = document.getElementById("oscilloscope") as HTMLCanvasElement;
    canvasContext = canvas.getContext("2d") as CanvasRenderingContext2D;
    draw();
}

function draw() {
    requestAnimationFrame(draw);

    analyserNode.getByteTimeDomainData(dataArray);

    canvasContext.fillStyle = "#EEEEEE";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = "#00092C";

    canvasContext.beginPath();

    const sliceWidth = (canvas.width * 1.0) / bufferLength;
    let x = 0;
    let y = canvas.height / 2;
    canvasContext.moveTo(x, y);
    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        canvasContext.lineTo(x, y);
        x += sliceWidth;
    }

    canvasContext.lineTo(canvas.width, canvas.height / 2);
    canvasContext.stroke();
}
</script>

<template>
    <canvas id="oscilloscope" width="200" height="100"></canvas>
</template>

<style scoped>
#oscilloscope {
    border-radius: 5px;
}
</style>