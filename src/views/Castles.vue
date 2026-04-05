<script setup lang="ts">
import { Card, Field, Value } from '@/modules/Layout'
import { Dropdown } from '@/modules/Input'
import { mainSubViewSymbol } from '@/modules/SubView'
import { useCastlesViewManager } from '@/modules/Castle'
import { Table, type HeaderColumn } from '@/modules/Table'
import { defineAsyncComponent, inject } from 'vue'

const castlesViewManager = useCastlesViewManager()
const subView = inject(mainSubViewSymbol)!

const castleSubView = defineAsyncComponent(() => import('@/modules/Castle').then(x => x.Castle))

const headerColumns: HeaderColumn[] = [
    { key: 'castleIndex', label: 'Castle Index' },
    { key: 'name', label: 'Name' },
    { key: 'factionIndex', label: 'Controlled By' },
]
const { filter, castleData, factionData, initialize, applyFilter } = castlesViewManager

function updateName(event: Event){
    filter.value.name = (event.target as HTMLInputElement).value
}

initialize()
</script>

<template>
    <section>
        <Card class="filter">
            <Field>
                <label>Name</label>
                <Value>
                    <input type="text" :value="filter.name" @change="updateName">
                </Value>
            </Field>
            <button @click="applyFilter">Apply</button>
        </Card>
        <Card class="table-card">
            <Table
                :header-columns="headerColumns"
                :data="castleData"
            >
                <template #cell(castleIndex)="{ item }">
                    <a href="#" @click.prevent="subView.pushActiveSubView(castleSubView, { castleIndex: item.castleIndex })">{{ item.castleIndex }}</a>
                </template>
                <template #cell(factionIndex)="{ item }">
                    {{ factionData?.find(x => x.factionIndex === item.factionIndex)?.name }}
                </template>
            </Table>
        </Card>
    </section>
</template>

<style scoped>
.filter {
    display: grid;
    align-items: end;
}
@media (min-width: 768px) {
    .filter {
        grid-template-columns: 1fr 1fr 1fr;
    }
}
button{
    max-height: 1.75em;
}
</style>
