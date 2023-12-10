<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    min?: number;
    max?: number;
    step?: number;
  }>(),
  {
    min: 0,
    max: 1,
    step: 0.001,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
  (e: "update", value: number): void;
}>();

// const thumbElement = ref<HTMLInputElement>();
const displayElement = ref<HTMLSpanElement>();

const amount = ref<number>(props.modelValue ?? 0.5);
const isFocused = ref(false);

function input(event: MouseEvent) {
  //   const event = payload as ;
  // isFocused.value = true;
  // if (!displayElement.value) return;
  // console.log(event.clientX);
  // displayElement.value.style.top = event.clientX + "px";
  // displayElement.value.style.left = event.clientY + "px";
  // (thumbElement.value?.offsetLeft ?? 0)?.toString() + "px";
  //   displayElement.value.style.left =
  //     (thumbElement.value?.offsetLeft ?? 0)?.toString() + "px";
  emit("update:modelValue", amount.value);
  emit("update", amount.value);
}

const change = () => {
  isFocused.value = false;
};
onMounted(async () => {
  //   thumbElement.value = (await document.querySelector(
  //     "::-webkit-slider-thumb"
  //   )) as HTMLInputElement;
});
</script>

<template>
  <input
    type="range"
    v-model.number="amount"
    v-bind="props"
    @input="(event:Event) => input(event as MouseEvent)"
    @change="change"
    class="flex-grow w-full bg-secondary text-center"
  />
  <!-- <span
    ref="displayElement"
    :class="{ hidden: !isFocused }"
    class="absolute px-2 py-1 border rounded-full bg-secondary text-xs"
    >{{ amount }}</span
  > -->
</template>

<style scoped></style>
