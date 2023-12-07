<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useSynthStore } from "@store/synth";

const props = defineProps<{
  width: number;
  height: number;
}>();

const synth = useSynthStore();
const vsti = synth.vsti;
const analyser = synth.analyserModule;
const canvasElement = ref<HTMLCanvasElement>();
let canvasContext: CanvasRenderingContext2D;

onMounted(() => {
  canvasContext = canvasElement.value?.getContext(
    "2d"
  ) as CanvasRenderingContext2D;

  draw();
});

function draw() {
  requestAnimationFrame(draw);

  analyser.analyserNode.getByteTimeDomainData(analyser.dataArray);
  if (!canvasElement.value) return;

  const width = props.width;
  const height = props.height;
  canvasContext.fillStyle = "#E5EDEE";
  canvasContext.fillRect(0, 0, width, height);

  canvasContext.lineWidth = 2;
  canvasContext.strokeStyle = "#758295";

  canvasContext.beginPath();

  const sliceWidth = (width * 1.0) / analyser.bufferLength;
  let x = 0;
  let y = height / 2;
  canvasContext.moveTo(x, y);
  for (let i = 0; i < analyser.bufferLength; i++) {
    const v = analyser.dataArray[i] / 128.0;
    const y = (v * height) / 2;
    canvasContext.lineTo(x, y);
    x += sliceWidth;
  }

  canvasContext.lineTo(width, height / 2);
  canvasContext.stroke();
}
</script>

<template>
  <canvas
    ref="canvasElement"
    :width="width"
    :height="height"
    class="block w-full"
  ></canvas>
</template>

<style scoped></style>
