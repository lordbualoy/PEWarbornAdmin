import type { Ref } from 'vue'
import { ref, watch, readonly, computed } from 'vue'
import { useFactionDataProxy, type GetFactionsResponseItem } from '@/modules/Faction'

export interface FactionsFilter {
    name?: string
}

export function useFactionsViewManager() {
    const dataProxy = useFactionDataProxy()

    const filter = ref<FactionsFilter>({})
    
    const data = ref<GetFactionsResponseItem[]>([])
    const filteredData = ref<GetFactionsResponseItem[]>([])

    async function applyFilter() {
        filteredData.value = data.value.filter(item => {
            if (filter.value.name && !item.name.includes(filter.value.name))
                return false
            return true
        })
        return Promise.resolve()
    }

    return {
        filter,
        data: readonly(filteredData),
        async initialize(){
            data.value = await dataProxy.getFactions()
            await applyFilter()
        },
        applyFilter,
    }
}

export function useFactionViewManager(factionIndex: Ref<number>) {    
    const factionDataProxy = useFactionDataProxy()

    const factionData = ref<GetFactionsResponseItem>({
        playerList: [],
        relations: [],
        castles: [],
    })
    const lordPlayer = computed(() => {
        return factionData.value.playerList.find(x => x.isLord)
    })
    const editingLordPlayerId = ref<string>()

    async function loadData(){
        factionData.value = await factionDataProxy.getFaction({factionIndex: factionIndex.value})
        editingLordPlayerId.value = lordPlayer.value?.playerId
    }
    watch(factionIndex, () => {
        loadData()
    })

    return {
        factionData: readonly(factionData),
        lordPlayer,
        editingLordPlayerId,
        async initialize(){
            await loadData()
        },
        async setFactionLord(){
            await factionDataProxy.setFactionLord({ factionIndex: factionIndex.value, playerId: editingLordPlayerId.value })
            await loadData()
        },
    }
}
