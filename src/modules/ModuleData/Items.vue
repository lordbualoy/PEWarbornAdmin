<script setup lang="ts">
import { Card, Field, Value } from '@/modules/Layout'
import { NavLink } from '@/modules/Navigation'
import { Dropdown } from '@/modules/Input'
import { useItemsViewManager } from '@/modules/ModuleData'
import { Table, type HeaderColumn } from '@/modules/Table'
import { ItemNativeType, ItemPEType } from '@/modules/ModuleData/typings'
import { inject } from 'vue'
import { mainSubViewSymbol } from '@/modules/SubView'

const subView = inject(mainSubViewSymbol)!

const itemsViewManager = useItemsViewManager()

const headerColumns: HeaderColumn[] = [
    { key: 'id', label: 'Id' },
    { key: 'name', label: 'Name' },
    { key: 'nativeType', label: 'Native Type' },
    { key: 'peType', label: 'PE Type' },
]
const { filter, data, initialize, applyFilter } = itemsViewManager

const nativeTypeOptions = [
    { key: null, label: 'Any' },
    { key: ItemNativeType.Horse, label: 'Horse' },
    { key: ItemNativeType.OneHandedWeapon, label: 'One Handed Weapon' },
    { key: ItemNativeType.TwoHandedWeapon, label: 'Two Handed Weapon' },
    { key: ItemNativeType.Polearm, label: 'Polearm' },
    { key: ItemNativeType.Arrows, label: 'Arrows' },
    { key: ItemNativeType.Bolts, label: 'Bolts' },
    { key: ItemNativeType.SlingStones, label: 'Sling Stones' },
    { key: ItemNativeType.Shield, label: 'Shield' },
    { key: ItemNativeType.Bow, label: 'Bow' },
    { key: ItemNativeType.Crossbow, label: 'Crossbow' },
    { key: ItemNativeType.Sling, label: 'Sling' },
    { key: ItemNativeType.Thrown, label: 'Thrown' },
    { key: ItemNativeType.Goods, label: 'Goods' },
    { key: ItemNativeType.HeadArmor, label: 'Head Armor' },
    { key: ItemNativeType.BodyArmor, label: 'Body Armor' },
    { key: ItemNativeType.LegArmor, label: 'Leg Armor' },
    { key: ItemNativeType.HandArmor, label: 'Hand Armor' },
    { key: ItemNativeType.Pistol, label: 'Pistol' },
    { key: ItemNativeType.Musket, label: 'Musket' },
    { key: ItemNativeType.Bullets, label: 'Bullets' },
    { key: ItemNativeType.Animal, label: 'Animal' },
    { key: ItemNativeType.Book, label: 'Book' },
    { key: ItemNativeType.ChestArmor, label: 'Chest Armor' },
    { key: ItemNativeType.Cape, label: 'Cape' },
    { key: ItemNativeType.HorseHarness, label: 'Horse Harness' },
    { key: ItemNativeType.Banner, label: 'Banner' },
]
const peTypeOptions = [
    { key: null, label: 'Any' },
    { key: ItemPEType.Normal, label: 'Normal' },
    { key: ItemPEType.Food, label: 'Food' },
    { key: ItemPEType.Instrument, label: 'Instrument' },
]

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
            <Field>
                <label>Native Type</label>
                <Value>
                    <Dropdown :options="nativeTypeOptions" v-model="filter.nativeType"/>
                </Value>
            </Field>
            <Field>
                <label>PE Type</label>
                <Value>
                    <Dropdown :options="peTypeOptions" v-model="filter.peType"/>
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
                <template #cell(nativeType)="{ item }">
                    {{ ItemNativeType[item.nativeType] }}
                </template>
                <template #cell(peType)="{ item }">
                    {{ ItemPEType[item.peType] }}
                </template>
            </Table>
        </Card>
    </section>
</template>

<style scoped>
.filter {
    display: grid;
}
@media (min-width: 768px) {
    .filter {
        grid-template-columns: 1fr 1fr 1fr;
    }
}
</style>
