<script setup lang="ts" generic="T">
import type { HeaderColumn } from '.'

const props = defineProps<{
    headerColumns: HeaderColumn[],
    data: Readonly<T[]>,
}>()
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
            </tbody>
        </table>
    </table-container>
</template>

<style scoped>
</style>
