import { ref, readonly, computed } from 'vue'
import { useOverviewDataProxy, type GetOverviewResponse } from './dataProxy'

export function useOverviewViewManager() {    
    const dataProxy = useOverviewDataProxy()

    const data = ref<GetOverviewResponse>({
        modules: [],
        admins: [],
        generalConfig: {},
    })

    const generalConfig = computed(() => {
        return [...(function* () {
            if (!data.value)
                return
            for (const key in data.value.generalConfig){
                yield {key, value: data.value.generalConfig[key]}
            }
        })()]
    })

    async function loadData(){
        data.value = await dataProxy.getOverview()
    }

    return {
        data: readonly(data),
        generalConfig,
        async initialize(){
            await loadData()
        },
    }
}
