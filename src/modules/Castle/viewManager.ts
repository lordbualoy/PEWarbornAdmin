import { ref, watch, readonly, computed, inject, type Ref } from 'vue'
import { useFactionDataProxy, type GetFactionsResponseItem } from '@/modules/Faction'
import { useCastleDataProxy, type GetCastlesResponseItem } from './dataProxy'
import { moduleDataDataStoreSymbol } from '@/modules/ModuleData'

export interface CastlesFilter {
    name?: string
}

export function useCastlesViewManager() {
    const castleDataProxy = useCastleDataProxy()
    const factionDataProxy = useFactionDataProxy()

    const filter = ref<CastlesFilter>({})
    
    const castleData = ref<GetCastlesResponseItem[]>([])
    const factionData = ref<GetFactionsResponseItem[]>([])
    const filteredData = ref<GetCastlesResponseItem[]>([])

    async function applyFilter() {
        filteredData.value = castleData.value.filter(item => {
            if (filter.value.name && !item.name.includes(filter.value.name))
                return false
            return true
        })
        return Promise.resolve()
    }

    return {
        filter,
        castleData: readonly(filteredData),
        factionData: readonly(factionData),
        async initialize(){
            const [
                castles,
                factions,
            ] = await Promise.all([
                castleDataProxy.getCastles(),
                factionDataProxy.getFactions(),
            ])
            castleData.value = castles
            factionData.value = factions
            await applyFilter()
        },
        applyFilter,
    }
}

export function useCastleViewManager(castleIndex: Ref<number>) {
    const dataStore = inject(moduleDataDataStoreSymbol)!
    
    const castleDataProxy = useCastleDataProxy()
    const factionDataProxy = useFactionDataProxy()

    const castleData = ref<GetCastlesResponseItem>({})
    const factionData = ref<GetFactionsResponseItem[]>([])
    const captureItem = computed(() => {
        castleData.value.captureItem
        return dataStore.items.value?.find(x => x.id === castleData.value.captureItem)?.name
    })
    const editingFactionIndex = ref<number>()

    async function loadData(){
        const [
            _,
            castles,
            factions,
        ] = await Promise.all([
            dataStore.getModuleData(),
            castleDataProxy.getCastle({castleIndex: castleIndex.value}),
            factionDataProxy.getFactions(),
        ])
        castleData.value = castles
        factionData.value = factions
        editingFactionIndex.value = castleData.value?.factionIndex
    }

    watch(castleIndex, () => {
        loadData()
    })

    return {
        castleData: readonly(castleData),
        factionData,
        captureItem,
        editingFactionIndex,
        async initialize(){
            await loadData()
        },
        async transferCastle(){
            await castleDataProxy.transferCastle({ castleIndex: castleIndex.value, factionIndex: editingFactionIndex.value! })
            await loadData()
        },
    }
}
