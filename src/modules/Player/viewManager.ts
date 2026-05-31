import type { Ref } from 'vue'
import { ref, watch, readonly, computed, inject } from 'vue'
import { usePlayerDataProxy } from './dataProxy'
import type { GetPlayersResponseItem } from './dataProxy'
import { useFactionDataProxy, type GetFactionsResponseItem } from '@/modules/Faction'
import { moduleDataDataStoreSymbol } from '@/modules/ModuleData'

export interface PlayersFilter {
    name?: string
    isOnline: boolean | null
}

export function usePlayersViewManager() {
    const dataProxy = usePlayerDataProxy()

    const filter = ref<PlayersFilter>({
        isOnline: null,
    })
    
    const data = ref<GetPlayersResponseItem[]>([])
    const filteredData = ref<GetPlayersResponseItem[]>([])

    async function applyFilter() {
        filteredData.value = data.value.filter(item => {
            if (filter.value.name && !item.name.includes(filter.value.name))
                return false
            if (filter.value.isOnline !== null && item.isOnline !== filter.value.isOnline)
                return false
            return true
        })
        return Promise.resolve()
    }

    return {
        filter,
        data: readonly(filteredData),
        async initialize(){
            const players = await dataProxy.getPlayers()
            data.value = players.map(x => ({
                ...x,
                lastOnline: x.isOnline ? 'Online' : x.lastOnline,
            }))
            await applyFilter()
        },
        applyFilter,
    }
}

export function usePlayerViewManager(playerId: Ref<string>) {
    const dataStore = inject(moduleDataDataStoreSymbol)!
    
    const playerDataProxy = usePlayerDataProxy()
    const factionDataProxy = useFactionDataProxy()

    const playerData = ref<GetPlayersResponseItem>({})
    const factionData = ref<GetFactionsResponseItem[]>()
    const editingMoney = ref<number>(0)
    const editingHonor = ref<number>(0)
    const editingFactionIndex = ref<number>()

    async function loadData(){
        const [
            _,
            player,
            faction,
        ] = await Promise.all([
            dataStore.getModuleData(),
            playerDataProxy.getPlayer({ playerId: playerId.value }),
            factionDataProxy.getFactions(),
        ])
        playerData.value = player
        factionData.value = faction
        editingMoney.value = player.money
        editingHonor.value = player.honor
        editingFactionIndex.value = player.factionIndex
    }
    watch(playerId, () => {
        loadData()
    })

    return {
        classData: dataStore.classes,
        playerData: readonly(playerData),
        keys: computed(() => {
            const keys: string[] = []
            if (playerData.value.hasDoorKey)
                keys.push('Door')
            if (playerData.value.hasChestKey)
                keys.push('Chest')
        }),
        editingMoney,
        editingHonor,
        editingFactionIndex,
        factionData: readonly(factionData),
        async initialize(){
            await loadData()
        },
        async kickPlayer(){
            await playerDataProxy.kickPlayer({ playerId: playerId.value })
        },
        async tempBanPlayer(){
            await playerDataProxy.tempBanPlayer({ playerId: playerId.value })
            await loadData()
        },
        async permanentBanPlayer(){
            await playerDataProxy.permanentBanPlayer({ playerId: playerId.value })
            await loadData()
        },
        async unbanPlayer(){
            await playerDataProxy.unbanPlayer({ playerId: playerId.value })
            await loadData()
        },
        async setPlayerMoney(){
            await playerDataProxy.setPlayerMoney({ playerId: playerId.value, originalMoney: playerData.value.money, money: editingMoney.value })
            await loadData()
        },
        async setPlayerHonor(){
            await playerDataProxy.setPlayerHonor({ playerId: playerId.value, honor: editingHonor.value })
            await loadData()
        },
        async setPlayerFaction(){
            await playerDataProxy.setPlayerFaction({ playerId: playerId.value, factionIndex: editingFactionIndex.value! })
            await loadData()
        },
    }
}
