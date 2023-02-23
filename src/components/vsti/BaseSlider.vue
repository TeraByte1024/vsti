<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<{
    modelValue: number,
    min?: number,
    max?: number,
    step?: number,
}>(), {
    min: 0,
    max: 1,
    step: 0.001,
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
}>();

const amount = ref<number>(props.modelValue);

function update() {
    emit('update:modelValue', amount.value);
}

</script>

<template>
    <div class="slider">
        <input type="range" v-model.number="amount" v-bind="props" @input="update" />
        <div>{{ amount }}</div>
    </div>
</template>

<style scoped>


</style>