import { dataMocking } from '@/constants'
import { setTimeoutAsync } from '@/utilities'
import { httpAgentContainer } from '@/modules/Http';
import { from } from 'ix/iterable';
import { orderBy } from 'ix/iterable/operators';

export interface GetCastleParams {
    castleIndex: number
}

export interface GetCastlesResponseItem {
    castleIndex: number
    name: string
    factionIndex: number
    isShownOnMap: boolean
    isCapturable: boolean
    captureDuration: number
    captureItem: string
    moneyChestAmount: number
    moneyChestLockpickable: boolean
    itemChests: {id: string; name: string; isPersonal: boolean}[]
    peChangeClass: {classId: string; factionIndex: number; castleIndex: number}[]
    peSpawnFrame: {index: number; factionIndex: number; castleIndex: number}[]
}

export interface TransferCastleParams {
    castleIndex: number
    factionIndex: number
}

export interface CastleDataProxy {
    getCastle(params: GetCastleParams): Promise<GetCastlesResponseItem>
    getCastles(): Promise<GetCastlesResponseItem[]>
    transferCastle(params: TransferCastleParams): Promise<void>
}

export function useCastleDataProxy() {
    return dataMocking ? useCastleDataProxyDataMocking() : useCastleDataProxyApi()
}

export function useCastleDataProxyDataMocking(): CastleDataProxy {
    const data: GetCastlesResponseItem[] = []
    for (let i = 0; i < 10; i++) {
        data.push({
            castleIndex: i,
            name: 'ABC Corp',
            factionIndex: i,
        })
    }

    return {
        async getCastle(params): Promise<GetCastlesResponseItem> {
            await setTimeoutAsync(1000)

            return data[0]!
        },
        async getCastles(): Promise<GetCastlesResponseItem[]> {
            await setTimeoutAsync(1000)

            return [...data]
        },
        async transferCastle(params) {
            await setTimeoutAsync(1000)
        },
    }
}

export function useCastleDataProxyApi(): CastleDataProxy {
    return {
        async getCastle(params): Promise<GetCastlesResponseItem> {
            return httpAgentContainer.instance.get(`/castle?castleIndex=${params.castleIndex}`).json()
        },
        async getCastles(): Promise<GetCastlesResponseItem[]> {
            const castles = await httpAgentContainer.instance.get('/castles').json<GetCastlesResponseItem[]>()
            return [...from(castles).pipe(orderBy(x => x.castleIndex))]
        },
        async transferCastle(params) {
            return httpAgentContainer.instance.post({
                castleIndex: params.castleIndex,
                factionIndex: params.factionIndex,
            }, '/transfercastle').res()
        },
    }
}
