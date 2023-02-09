<script setup>
import { reactive, ref } from 'vue';

const props = defineProps({
    min: Number,
    max: Number,
    value: Number,
});

</script>

<template>
    <input type="range" :min="min" :max="max" :value="value" @input="$emit('input', value)" />
    <div>{{ value }}</div>
</template>

<style scoped>


</style>