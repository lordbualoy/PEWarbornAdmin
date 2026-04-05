import { ref, readonly, inject } from 'vue'
import { moduleDataDataStoreSymbol } from './dataProxy'
import type { GetClassesResponseItem, GetItemsResponseItem } from './dataProxy'
import type { ItemNativeType, ItemPEType } from './typings'

export interface ItemsFilter {
    name?: string
    nativeType: ItemNativeType | null
    peType: ItemPEType | null
}

export function useItemsViewManager() {
    const dataStore = inject(moduleDataDataStoreSymbol)!

    const filter = ref<ItemsFilter>({
        nativeType: null,
        peType: null,
    })

    const filteredData = ref<GetItemsResponseItem[]>([])

    async function applyFilter() {
        filteredData.value = dataStore.items.value.filter(item => {
            if (filter.value.name && !item.name.includes(filter.value.name))
                return false
            if (filter.value.nativeType && item.nativeType !== filter.value.nativeType)
                return false
            if (filter.value.peType && item.peType !== filter.value.peType)
                return false
            return true
        })
        return Promise.resolve()
    }

    return {
        filter,
        data: readonly(filteredData),
        async initialize(){
            await dataStore.getModuleData()
            await applyFilter()
        },
        applyFilter,
    }
}

export interface ClassesFilter {
    name?: string
}

export function useClassesViewManager() {
    const dataStore = inject(moduleDataDataStoreSymbol)!

    const filter = ref<ClassesFilter>({})

    const filteredData = ref<GetClassesResponseItem[]>([])

    async function applyFilter() {
        filteredData.value = dataStore.classes.value.filter(item => {
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
            await dataStore.getModuleData()
            await applyFilter()
        },
        applyFilter,
    }
}
