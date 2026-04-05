<script setup lang="ts">
import { Card, Field, Value } from '@/modules/Layout'
import { useClassesViewManager } from '@/modules/ModuleData'
import { Table, type HeaderColumn } from '@/modules/Table'
import { inject } from 'vue'
import { mainSubViewSymbol } from '@/modules/SubView'

const subView = inject(mainSubViewSymbol)!

const classesViewManager = useClassesViewManager()

const headerColumns: HeaderColumn[] = [
    { key: 'id', label: 'Id' },
    { key: 'name', label: 'Name' },
]
const { filter, data, initialize, applyFilter } = classesViewManager

function updateName(event: Event){
    filter.value.name = (event.target as HTMLInputElement).value
}

initialize()
</script>

<template>
    <section>
        <button @click="subView.popActiveSubView">Close</button>
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
                <!-- <template #cell(id)="{ item }">
                    <a href="#" @click.prevent="moduleDataViewManager.openItemsSubView()">{{ item.id }}</a>
                </template> -->
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
