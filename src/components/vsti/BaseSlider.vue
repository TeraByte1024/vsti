<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<{
    target: {
        value: number
    },
    min?: number,
    max?: number,
    step?: number,
}>(), {
    min: 0,
    max: 1,
    step: 0.001,
});

const amount = ref<number>(props.target.value);

function update() {
    props.target.value = amount.value;
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