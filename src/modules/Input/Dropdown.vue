<script setup lang="ts" generic="T">
import { computed } from 'vue'
import type { DropdownOption } from '.'

const props = defineProps<{
    modelValue?: T | null,
    options: DropdownOption<T>[],
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: T | null | undefined): void
}>()

const wrappedModelValue = computed({
    get(){
        return props.modelValue
    },
    set(value){
        emit('update:modelValue', value)
    },
})
</script>

<template>
    <select v-model="wrappedModelValue">
        <option v-for="(option, i) in options" :key="i" :value="option.key">
            {{ option.label }}
        </option>
    </select>
</template>

<style scoped>
</style>
