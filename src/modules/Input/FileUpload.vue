<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
    allowedExtensions: string[],
}>()

const emit = defineEmits<{
    (e: 'fileUploaded', value: File): void
}>()

const input = ref<HTMLInputElement>()
const accept = computed(() => props.allowedExtensions.join(','))
const file = ref<File>()
const buttonText = computed(() => file.value ? file.value.name : 'Click to Upload')

watch(file, () => {
    emit('fileUploaded', file.value!)
})

function handleDrop(event: DragEvent) {
    const files = event.dataTransfer?.files
    if (files && files.length > 0) {
        file.value = files[0]
    }
}

function handleClick() {
    input.value!.click()
}

function handleFileSelect() {
    const files = input.value!.files
    if (files && files.length > 0) {
        file.value = files[0]
    }
}
</script>

<template>
    <div
        @dragover.prevent
        @drop.prevent="handleDrop"
    >
        <input ref="input" type="file" :accept="accept" @change="handleFileSelect">
        <button @click="handleClick">{{buttonText}}</button>
    </div>
</template>

<style scoped>
input{
    display: none;
}
</style>
