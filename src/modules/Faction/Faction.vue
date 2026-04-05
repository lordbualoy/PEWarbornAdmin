<script setup lang="ts">
import { Card, Field, Value } from '@/modules/Layout'
import { Dropdown } from '@/modules/Input'
import { useFactionViewManager } from '@/modules/Faction'
import { Table, type HeaderColumn } from '@/modules/Table'
import { computed, defineAsyncComponent, inject, ref } from 'vue'
import { mainSubViewSymbol } from '@/modules/SubView'
import { from } from 'ix/iterable';
import { map, filter } from 'ix/iterable/operators';

const props = defineProps<{
    factionIndex: number,
}>()

const subView = inject(mainSubViewSymbol)!

const playerSubView = defineAsyncComponent(() => import('@/modules/Player').then(x => x.Player))
const factionSubView = defineAsyncComponent(() => import('@/modules/Faction').then(x => x.Faction))
const castleSubView = defineAsyncComponent(() => import('@/modules/Castle').then(x => x.Castle))

const factionViewManager = useFactionViewManager(computed(() => props.factionIndex))

const memberHeaderColumns: HeaderColumn[] = [
    { key: 'playerId', label: 'Player Id' },
    { key: 'name', label: 'Name' },
    { key: 'isOnline', label: 'Is Online' },
]
const relationHeaderColumns: HeaderColumn[] = [
    { key: 'factionIndex', label: 'Faction Index' },
    { key: 'name', label: 'Name' },
    { key: 'isAtWar', label: 'Is At War' },
]
const castleHeaderColumns: HeaderColumn[] = [
    { key: 'castleIndex', label: 'Castle Index' },
    { key: 'name', label: 'Name' },
]
const { factionData, lordPlayer, editingLordPlayerId, initialize, setFactionLord } = factionViewManager

const playerOptions = computed(() => {
    return [
        ...from(factionData.value?.playerList ?? [])
            .pipe(
                filter(x => x.isOnline),
                map(x => ({ key: x.playerId, label: x.name })),
            )
    ]
})

const editingLord = ref(false)

async function setLord(){
    await setFactionLord()
    editingLord.value = false
}

initialize()
</script>

<template>
    <div class="layout">
        <button @click="subView.popActiveSubView">Close</button>
        <div class="content">
            <section>
                <Card>
                    <Field>
                        <label>Faction Index</label>
                        <Value>{{ factionIndex }}</Value>
                    </Field>
                    <Field>
                        <label>Name</label>
                        <Value>{{ factionData.name }}</Value>
                    </Field>
                    <Field>
                        <label>Banner</label>
                        <Value>
                            <a :href="`https://www.bannerlord.party/banner/#${factionData.banner}`" target="_blank">Click to view</a>
                        </Value>
                    </Field>
                    <Field>
                        <label>Lord</label>
                        <Value class="vertical-value">
                            <template v-if="editingLord">
                                <Dropdown :options="playerOptions" v-model="editingLordPlayerId" />
                                <button @click="setLord">Set Lord</button>
                                <button @click="editingLord=false">Cancel</button>
                            </template>
                            <template v-else>
                                <a v-if="lordPlayer" href="#" @click.prevent="subView.pushActiveSubView(playerSubView, { playerId: lordPlayer?.playerId })">{{factionData.playerList.find(x => x.playerId === lordPlayer?.playerId)?.name}}</a>
                                <template v-else>None</template>
                                <button @click="editingLord=true">Edit</button>
                            </template>
                        </Value>
                    </Field>
                </Card>
                <Card class="table-card">
                    <p>Faction Members</p>
                    <Table
                        :header-columns="memberHeaderColumns"
                        :data="factionData.playerList"
                    >
                        <template #cell(playerId)="{ item }">
                            <a href="#" @click.prevent="subView.pushActiveSubView(playerSubView, { playerId: item.playerId })">{{ item.playerId }}</a>
                        </template>
                    </Table>
                </Card>
            </section>
            <section>
                <Card class="table-card">
                    <p>Relation with other Factions</p>
                    <Table
                        :header-columns="relationHeaderColumns"
                        :data="factionData.relations"
                    >
                        <template #cell(factionIndex)="{ item }">
                            <a href="#" @click.prevent="subView.pushActiveSubView(factionSubView, { factionIndex: item.factionIndex })">{{ item.factionIndex }}</a>
                        </template>
                    </Table>
                </Card>
                <Card class="table-card">
                    <p>Castles under control</p>
                    <Table
                        :header-columns="castleHeaderColumns"
                        :data="factionData.castles"
                    >
                        <template #cell(castleIndex)="{ item }">
                            <a href="#" @click.prevent="subView.pushActiveSubView(castleSubView, { castleIndex: item.castleIndex })">{{ item.castleIndex }}</a>
                        </template>
                    </Table>
                </Card>
            </section>
        </div>
    </div>
</template>

<style scoped>
.layout {
    display: grid;
    row-gap: 1em;

    >button{
        height: 1.75em;
    }
}

.content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1em;
}

.vertical-value{
    display: flex;
    flex-direction: column;

    button{
        align-self: flex-start;
    }
}
</style>
