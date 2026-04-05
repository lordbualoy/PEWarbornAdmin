<script setup lang="ts">
import { Card, Field, Value } from '@/modules/Layout'
import { Dropdown } from '@/modules/Input'
import { computed, defineAsyncComponent, inject, ref } from 'vue'
import { mainSubViewSymbol } from '@/modules/SubView'
import { useCastleViewManager } from './viewManager'
import { from } from 'ix/iterable';
import { map, filter } from 'ix/iterable/operators';

const props = defineProps<{
    castleIndex: number,
}>()

const subView = inject(mainSubViewSymbol)!

const factionSubView = defineAsyncComponent(() => import('@/modules/Player').then(x => x.Player))

const castleViewManager = useCastleViewManager(computed(() => props.castleIndex))

const { castleData, factionData, captureItem, editingFactionIndex, initialize, transferCastle } = castleViewManager

const factionOptions = computed(() => {
    castleData.value
    return [
        ...from(factionData.value ?? [])
            .pipe(
                // filter(x => x.factionIndex !== castleData.value.factionIndex),
                map(x => ({ key: x.factionIndex, label: x.name })),
            )
    ]
})

const editingFaction = ref(false)

async function setFaction(){
    await transferCastle()
    editingFaction.value = false
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
                        <label>Castle Index</label>
                        <Value>{{ castleData.castleIndex }}</Value>
                    </Field>
                    <Field>
                        <label>Name</label>
                        <Value>{{ castleData.name }}</Value>
                    </Field>
                    <!-- <Field>
                        <label>Initially controlled by Faction</label>
                        <Value>
                            <a href="#" @click.prevent="subView.pushActiveSubView(factionSubView, { factionIndex: 0 })">-00</a>
                        </Value>
                    </Field> -->
                    <Field>
                        <label>Controlled by Faction</label>
                        <Value class="vertical-value">
                            <template v-if="editingFaction">
                                <Dropdown :options="factionOptions" v-model="editingFactionIndex" />
                                <button @click="setFaction">Transfer to Faction</button>
                                <button @click="editingFaction=false">Cancel</button>
                            </template>
                            <template v-else>
                                <a href="#" @click.prevent="subView.pushActiveSubView(factionSubView, { factionIndex: castleData.factionIndex })">{{ factionOptions.find(x => x.key === castleData?.factionIndex)?.label }}</a>
                                <button @click="editingFaction=true">Edit</button>
                            </template>
                        </Value>
                    </Field>
                    <Field>
                        <label>Is Shown on Map</label>
                        <Value>{{ castleData.isShownOnMap }}</Value>
                    </Field>
                    <Field>
                        <label>Is Capturable</label>
                        <Value>{{ castleData.isCapturable }}</Value>
                    </Field>
                    <Field>
                        <label>Capture Duration</label>
                        <Value>{{ castleData.captureDuration }}</Value>
                    </Field>
                    <Field>
                        <label>Capture Item</label>
                        <Value>{{ captureItem }}</Value>
                    </Field>
                    <Field>
                        <label>Money Chest Amount</label>
                        <Value>{{ castleData.moneyChestAmount }}</Value>
                    </Field>
                    <Field>
                        <label>Money Chest Lockpickable</label>
                        <Value>{{ castleData.moneyChestLockpickable }}</Value>
                    </Field>
                </Card>
            </section>
            <section>
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
