<script setup lang="ts">
import { Card, Field, Value } from '@/modules/Layout'
import { Dropdown } from '@/modules/Input'
import { usePlayerViewManager } from './viewManager'
import { defineAsyncComponent, inject, ref, computed } from 'vue'
import { mainSubViewSymbol } from '@/modules/SubView'

const props = defineProps<{
    playerId: string,
}>()

const subView = inject(mainSubViewSymbol)!

const factionSubView = defineAsyncComponent(() => import('@/modules/Faction').then(x => x.Faction))

const playerViewManager = usePlayerViewManager(computed(() => props.playerId))

const {
    classData,
    playerData,
    keys,
    editingMoney,
    editingFactionIndex,
    factionData,
    initialize,
    kickPlayer,
    tempBanPlayer,
    permanentBanPlayer,
    unbanPlayer,
    setPlayerMoney,
    setPlayerFaction,
} = playerViewManager

const factionOptions = computed(() => {
    return factionData.value?.map(x => ({ key: x.factionIndex, label: x.name })) ?? []
})

const editingFaction = ref(false)

async function setFaction(){
    await setPlayerFaction()
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
                        <label>Player Id</label>
                        <Value>{{playerData.playerId}}</Value>
                    </Field>
                    <Field>
                        <label>Name</label>
                        <Value>{{playerData.name}}</Value>
                    </Field>
                    <Field>
                        <label>Previous Names</label>
                        <Value>
                            <ol v-if="playerData.previousNames && playerData.previousNames.length > 0">
                                <li v-for="(name, i) in playerData.previousNames" :key="i">{{name}}</li>
                            </ol>
                            <template v-else>None</template>
                        </Value>
                    </Field>
                    <Field>
                        <label>Is Online</label>
                        <Value class="vertical-value">
                            {{playerData.isOnline}}
                            <button :disabled="!playerData.isOnline" @click="kickPlayer">Kick</button>
                        </Value>
                    </Field>
                    <Field>
                        <label>Is Banned</label>
                        <Value class="vertical-value">
                            {{playerData.isBannedUntil ? `Until ${playerData.isBannedUntil}` : 'false'}}
                            <button :disabled="!!playerData.isBannedUntil" @click="tempBanPlayer">Temporary Ban</button>
                            <button :disabled="!!playerData.isBannedUntil" @click="permanentBanPlayer">Permanent Ban</button>
                            <button :disabled="!playerData.isBannedUntil" @click="unbanPlayer">Unban</button>
                        </Value>
                    </Field>
                    <Field>
                        <label>Money</label>
                        <Value class="vertical-value">
                            <input type="number" :value="editingMoney">
                            <button @click="setPlayerMoney">Set Money</button>
                        </Value>
                    </Field>
                    <Field>
                        <label>Bank Money</label>
                        <Value>{{playerData.bankMoney}}</Value>
                    </Field>
                </Card>
                <!-- <Card>
                    <Field>
                        <label>Inventory</label>
                        <Value>
                            <ol>
                                <li>Iron Ore x 10</li>
                                <li>Iron Ore x 10</li>
                                <li>Iron Ore x 10</li>
                                <li>Empty</li>
                                <li>Empty</li>
                            </ol>
                        </Value>
                    </Field>
                    <Field>
                        <label>Weapons</label>
                        <Value>
                            <ol>
                                <li>Sword</li>
                                <li>Shield</li>
                                <li>Empty</li>
                                <li>Empty</li>
                            </ol>
                        </Value>
                    </Field>
                    <Field>
                        <label>Armors</label>
                        <Value>
                            <ol>
                                <li>Empty (Head)</li>
                                <li>Empty (Shoulder)</li>
                                <li>Shirt (Body)</li>
                                <li>Empty (Hands)</li>
                                <li>Shoes (Feet)</li>
                            </ol>
                        </Value>
                    </Field>
                    <Field>
                        <label>Mount</label>
                        <Value>None/Saddle Horse</Value>
                    </Field>
                    <Field>
                        <label>Personal Chests</label>
                        <Value>
                        </Value>
                    </Field>
                </Card> -->
            </section>
            <section>
                <Card>
                    <Field>
                        <label>Faction</label>
                        <Value class="vertical-value">
                            <template v-if="editingFaction">
                                <Dropdown :options="factionOptions" v-model="editingFactionIndex" />
                                <button @click="setFaction">Set Faction</button>
                                <button @click="editingFaction=false">Cancel</button>
                            </template>
                            <template v-else>
                                <a href="#" @click.prevent="subView.pushActiveSubView(factionSubView, { factionIndex: playerData.factionIndex })">{{factionData?.find(x => x.factionIndex === playerData.factionIndex)?.name}}</a>
                                <button @click="editingFaction=true" :disabled="!playerData.isOnline">Edit</button>
                            </template>
                        </Value>
                        <Value class="vertical-value">
                        </Value>
                    </Field>
                    <Field>
                        <label>Class</label>
                        <Value>{{classData?.find(x => x.id === playerData.classId)?.name}}</Value>
                    </Field>
                    <Field>
                        <label>Rank</label>
                        <Value>{{
                            playerData.isLord
                            ? 'Lord'
                            : playerData.isMarshal
                            ? 'Marshal'
                            : 'Member'
                        }}</Value>
                    </Field>
                    <Field>
                        <label>Keys</label>
                        <Value>
                            <ol v-if="playerData.hasDoorKey || playerData.hasChestKey">
                                <li v-for="(key, i) in keys" :key="i">{{key}}</li>
                            </ol>
                            <template v-else>None</template>
                        </Value>
                    </Field>
                </Card>
                <!-- <Card>
                    <Field>
                        <label>HP</label>
                        <Value class="vertical-value">
                            200/200
                            <button>Heal</button>
                            <button>Kill</button>
                            <button>Fade</button>
                            <button>Freeze</button>
                            <button>Teleport to Spawnframe</button>
                        </Value>
                    </Field>
                    <Field>
                        <label>Mount HP</label>
                        <Value>100/100</Value>
                    </Field>
                    <Field>
                        <label>Shield HP</label>
                        <Value>100/100</Value>
                    </Field>
                    <Field>
                        <label>Food</label>
                        <Value>100/100</Value>
                    </Field>
                    <Field>
                        <label>Is Poisoned</label>
                        <Value>True</Value>
                    </Field>
                </Card> -->
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
</style>
