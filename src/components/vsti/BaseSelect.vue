<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
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
    <select name="items" v-model="selected" @change="update">
        <option v-for="item in props.items" :key="item.label" v-bind="item"></option>
    </select>
</template>

<style scoped>


</style>