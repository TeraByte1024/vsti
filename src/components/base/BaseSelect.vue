<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    label: string,
    modelValue: any,
    items: {
        label: string,
        value: any
    }[]
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void
}>();

const selected = ref<any>(props.items[0].value);

function update() {
    emit('update:modelValue', selected.value);
}

</script>

<template>
    <div id="wrapper">
        <div id="label">{{ label }}</div>
        <select name="items" id="select" v-model="selected" @change="update">
            <option v-for="item in props.items" :key="item.label" v-bind="item"></option>
        </select>
        <div id="blank"></div>
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

#select {
    width: 40%;
    min-width: 100px;
    text-align: center;
}

#blank {
    width: 30%;
}
</style>