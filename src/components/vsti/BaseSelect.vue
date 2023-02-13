<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    items: {
        label: string,
        value: any
    }[]
}>();

const selectedValue = ref<any>();

</script>

<template>
    <div class="select">
        <select name="items" v-model="selectedValue"
            @change="$emit('updateValue', selectedValue)">
            <option v-for="item in props.items" :key="item.label" v-bind="item"></option>
        </select>
    </div>
    
</template>

<style scoped>


</style>