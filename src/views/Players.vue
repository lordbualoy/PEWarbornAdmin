<script setup lang="ts">
import { Card, Field, Value } from '@/modules/Layout'
import { Dropdown } from '@/modules/Input'
import { mainSubViewSymbol } from '@/modules/SubView'
import { usePlayersViewManager } from '@/modules/Player'
import { Table, type HeaderColumn } from '@/modules/Table'
import { ItemNativeType, ItemPEType } from '@/modules/ModuleData/typings'
import { defineAsyncComponent, inject } from 'vue'

const playersViewManager = usePlayersViewManager()
const subView = inject(mainSubViewSymbol)!

const playerSubView = defineAsyncComponent(() => import('@/modules/Player').then(x => x.Player))

const headerColumns: HeaderColumn[] = [
    { key: 'playerId', label: 'Player Id' },
    { key: 'name', label: 'Name' },
    { key: 'lastOnline', label: 'Last Online' },
]
const { filter, data, initialize, applyFilter } = playersViewManager

const isOnlineOptions = [
    { key: null, label: 'Any' },
    { key: true, label: 'Online' },
    { key: false, label: 'Offline' },
]

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
            <Field>
                <label>Online Status</label>
                <Value>
                    <Dropdown :options="isOnlineOptions" v-model="filter.isOnline"/>
                </Value>
            </Field>
            <button @click="applyFilter">Apply</button>
        </Card>
        <Card class="table-card">
            <Table
                :header-columns="headerColumns"
                :data="data"
            >
                <template #cell(playerId)="{ item }">
                    <a href="#" @click.prevent="subView.pushActiveSubView(playerSubView, { playerId: item.playerId })">{{ item.playerId }}</a>
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
