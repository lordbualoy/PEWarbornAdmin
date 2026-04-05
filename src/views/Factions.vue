<script setup lang="ts">
import { Card, Field, Value } from '@/modules/Layout'
import { Dropdown } from '@/modules/Input'
import { mainSubViewSymbol } from '@/modules/SubView'
import { useFactionsViewManager } from '@/modules/Faction'
import { Table, type HeaderColumn } from '@/modules/Table'
import { ItemNativeType, ItemPEType } from '@/modules/ModuleData/typings'
import { defineAsyncComponent, inject } from 'vue'

const factionsViewManager = useFactionsViewManager()
const subView = inject(mainSubViewSymbol)!

const factionSubView = defineAsyncComponent(() => import('@/modules/Faction').then(x => x.Faction))

const headerColumns: HeaderColumn[] = [
    { key: 'factionIndex', label: 'Faction Index' },
    { key: 'name', label: 'Name' },
]
const { filter, data, initialize, applyFilter } = factionsViewManager

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
                :data="data"
            >
                <template #cell(factionIndex)="{ item }">
                    <a href="#" @click.prevent="subView.pushActiveSubView(factionSubView, { factionIndex: item.factionIndex })">{{ item.factionIndex }}</a>
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
