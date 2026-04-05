<script setup lang="ts" generic="T">
import { type ComponentPublicInstance } from 'vue'
import type { HeaderColumn } from '.'

const props = defineProps<{
    headerColumns: HeaderColumn[],
    data: Readonly<T[]>,
    scrollTrackingActive: boolean,
    isLoadingData: boolean,
    lastRowReached: boolean,
}>()

const emit = defineEmits<{
    (e: 'load-more'): void
}>()

let observer: IntersectionObserver
function setSentinel(ele: Element | ComponentPublicInstance | null) {
    if (observer)
        observer.disconnect()

    if (!ele)
        return

    observer = new IntersectionObserver(([entry]) => {
        if (props.scrollTrackingActive && entry!.isIntersecting && !props.isLoadingData && !props.lastRowReached) {
            emit('load-more')
        }
    }, { threshold: 0.1 })
    observer.observe(ele as Element)
}
</script>

<template>
    <table-container>
        <table>
            <thead>
                <tr>
                    <th v-for="(headerColumn, i) in headerColumns" :key="i">{{ headerColumn.label }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, i) in data" :key="i">
                    <td v-for="(headerColumn, j) in headerColumns" :key="j">
                        <slot :name="`cell(${headerColumn.key})`" :item="item" :index="i">
                            {{ (item as any)[headerColumn.key] }}
                        </slot>
                    </td>
                </tr>
                <tr :ref="setSentinel" v-if="scrollTrackingActive">
                    <td :colspan="headerColumns.length">
                        <span v-if="isLoadingData">Loading more records...</span>
                        <span v-if="lastRowReached">No more records to load.</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </table-container>
</template>

<style scoped>
table-container {
    overflow-x: auto;
}
</style>
