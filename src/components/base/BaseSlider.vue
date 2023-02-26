<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<{
    label: string,
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
    <div id="wrapper">
        <div id="label">{{ label }}</div>
        <input type="range" id="slider"
            v-model.number="amount" v-bind="props" @input="update"
        />
        <div id="value">{{ amount }}</div>
    </div>
</template>

<style scoped>
* {
    display: inline-block;
    box-sizing: border-box;
}

#wrapper {
    display: flex;
    justify-content: center;
}

#label {
    width: 30%;
    padding-right: 20px;
    text-align: right;
}

#slider {
    width: 40%;
    min-width: 100px;
    margin: auto 0;
}

#value {
    width: 30%;
    padding-left: 20px;
    text-align: left;
}
</style>