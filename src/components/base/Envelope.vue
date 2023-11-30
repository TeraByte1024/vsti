<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useSynthStore } from "@store/synth";

const props = defineProps<{
  width: number;
  height: number;
}>();

const synth = useSynthStore();
const envelope = synth.vsti.envelope;

const canvasElement = ref<HTMLCanvasElement>();
let canvasContext: CanvasRenderingContext2D;

let x: number;
let y: number;

onMounted(() => {
  canvasContext = canvasElement.value?.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  draw();
});

function draw() {
  requestAnimationFrame(draw);

  canvasContext.fillStyle = "#E5EDEE";
  canvasContext.fillRect(0, 0, props.width, props.height);

  canvasContext.lineWidth = 2;
  canvasContext.strokeStyle = "#758295";

  canvasContext.beginPath();

  drawAttack();
  drawDecay();
  drawRelease();

  canvasContext.stroke();
}

function drawAttack() {
  x = 0;
  y = props.height;
  canvasContext.moveTo(x * 200, y);

  x = envelope.attack.duration;
  y = 0;
  canvasContext.lineTo(x * 200, y);
}

function drawDecay() {
  x = envelope.attack.duration;
  y = 0;
  canvasContext.moveTo(x * 200, y);

  x += envelope.decay.duration;
  y = props.height - envelope.sustain.velocity * 100;
  canvasContext.lineTo(x * 200, y);
}

function drawRelease() {
  x = envelope.attack.duration + envelope.decay.duration;
  y = props.height - envelope.sustain.velocity * 100;
  canvasContext.moveTo(x * 200, y);

  x += envelope.release.duration;
  y = props.height;
  canvasContext.lineTo(x * 200, y);
}
</script>

<template>
  <canvas
    ref="canvasElement"
    :width="width"
    :height="height"
    class="w-full h-28"
  ></canvas>
</template>

<style scoped></style>
