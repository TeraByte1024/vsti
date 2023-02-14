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
    analyserNode.getByteTimeDomainData(dataArray);
    canvas = document.getElementById("oscilloscope") as HTMLCanvasElement;
    canvasContext = canvas.getContext("2d") as CanvasRenderingContext2D;
    draw();
}

function draw() {
  requestAnimationFrame(draw);

  analyserNode.getByteTimeDomainData(dataArray);

  canvasContext.fillStyle = "rgb(200, 200, 200)";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  canvasContext.lineWidth = 2;
  canvasContext.strokeStyle = "rgb(0, 0, 0)";

  canvasContext.beginPath();

  const sliceWidth = (canvas.width * 1.0) / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * canvas.height) / 2;

    if (i === 0) {
        canvasContext.moveTo(x, y);
    } else {
        canvasContext.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasContext.lineTo(canvas.width, canvas.height / 2);
  canvasContext.stroke();
}
</script>

<template>
    <canvas id="oscilloscope"></canvas>
</template>

<style scoped>

</style>