<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<{
    min: number,
    max: number,
    step?: number,
    defaultValue: number
}>(), {
    min: 0,
    max: 1,
    step: 0.001,
    defaultValue: 1
});

const value = ref<number>(props.defaultValue);
</script>

<template>
    <div class="slider">
        <input type="range" v-model.number="value"
            v-bind="props"
            @input="$emit('updateValue', value)"/>
        <div>{{ value }}</div>
    </div>
</template>

<style scoped>


</style>