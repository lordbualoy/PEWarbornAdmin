import { dataMocking } from '@/constants'
import { setTimeoutAsync } from '@/utilities'
import { ItemNativeType, ItemPEType } from './typings'
import { computed, readonly, ref, type InjectionKey } from 'vue';
import { httpAgentContainer } from '../Http';

export const moduleDataDataStoreSymbol = Symbol('ModuleDataDataStore') as InjectionKey<ReturnType<typeof useModuleDataDataStore>>

export function useModuleDataDataStore(){
    let moduleDataPromiseResolver: PromiseWithResolvers<void>
    const data = ref<{items: GetItemsResponseItem[]; classes: GetClassesResponseItem[]}>({
        items: [],
        classes: [],
    })

    const dataProxy = useModuleDataDataProxy()

    return {
        items: computed(() => data.value.items),
        classes: computed(() => data.value.classes),
        async getModuleData(){
            if (moduleDataPromiseResolver)
                return moduleDataPromiseResolver.promise

            moduleDataPromiseResolver = Promise.withResolvers<void>()
            const [items, classes] = await Promise.all([
                dataProxy.getItems(),
                dataProxy.getClasses(),
            ])

            data.value.items = items
            data.value.classes = classes

            moduleDataPromiseResolver.resolve()

            return moduleDataPromiseResolver.promise
        },
    }
}

export interface GetItemsResponseItem {
    id: string
    name: string
    nativeType: ItemNativeType
    peType: ItemPEType
}

export interface GetClassesResponseItem {
    id: string
    name: string
}

export interface ModuleDataDataProxy {
    getItems(): Promise<GetItemsResponseItem[]>
    getClasses(): Promise<GetClassesResponseItem[]>
}

export function useModuleDataDataProxy() {
    return dataMocking ? useModuleDataDataProxyDataMocking() : useModuleDataDataProxyApi()
}

export function useModuleDataDataProxyDataMocking(): ModuleDataDataProxy {
    const itemData: GetItemsResponseItem[] = []
    const classData: GetClassesResponseItem[] = []
    for (let i = 0; i < 30; i++) {
        itemData.push({
            id: `item${i}`,
            name: `Sword${i}`,
            nativeType: ItemNativeType.OneHandedWeapon,
            peType: ItemPEType.Normal,
        })
        classData.push({
            id: `class${i}`,
            name: `Swordsman${i}`,
        })
    }

    return {
        async getItems(): Promise<GetItemsResponseItem[]> {
            await setTimeoutAsync(1000)

            return [...itemData]
        },
        async getClasses(): Promise<GetClassesResponseItem[]> {
            await setTimeoutAsync(1000)

            return [...classData]
        },
    }
}

export function useModuleDataDataProxyApi(): ModuleDataDataProxy {
    return {
        async getItems(): Promise<GetItemsResponseItem[]> {
            return httpAgentContainer.instance.get(`/itemlist`).json()
        },
        async getClasses(): Promise<GetClassesResponseItem[]> {
            return httpAgentContainer.instance.get(`/classlist`).json()
        },
    }
}
