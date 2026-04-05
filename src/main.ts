import { createApp } from 'vue'
import App from './App.vue'
import { router, specialRoutes, type PreRouteEnter } from '@/modules/Routing'
import '@picocss/pico'
import './main.css'
import type { NavigationGuardReturn } from 'vue-router'

let preRouteEnter: PreRouteEnter[] = [
    {
        once: false,
        handler(to, from) {
            if (specialRoutes.has(to.name as string))
                return Promise.resolve(true)

            const lastTestConnectionSuccess = localStorage.getItem('last_test_connection_success')
            return Promise.resolve(lastTestConnectionSuccess === '1' ? true : { name: 'ConnectionSettings' })
        },
    }
]

const executedPreRouteEnter = new Set<PreRouteEnter>()

router.beforeEach(async (to, from) => {
    let handledResult: NavigationGuardReturn | null = true
    for (const current of preRouteEnter){
        handledResult = await current.handler(to, from)
        executedPreRouteEnter.add(current)
        if (handledResult !== true)
            break
    }
    preRouteEnter = preRouteEnter.filter(x => !x.once || !executedPreRouteEnter.has(x))
    return handledResult
})

const app = createApp(App)

app.use(router)

app.mount('#app')
