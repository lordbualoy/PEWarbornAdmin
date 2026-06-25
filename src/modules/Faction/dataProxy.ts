import { dataMocking } from '@/constants'
import { setTimeoutAsync } from '@/utilities'
import { httpAgentContainer } from '@/modules/Http'
import { from } from 'ix/iterable';
import { orderBy, orderByDescending } from 'ix/iterable/operators';

export interface GetFactionParams {
    factionIndex: number
}

export interface GetFactionsResponseItem {
    factionIndex: number
    name: string
    banner: string
    playerList: GetFactionsResponseFactionMember[]
    relations: GetFactionsResponseFactionRelation[]
    peFactionBanner: any
    peChangeClass: {classId: string; factionIndex: number; castleIndex: number}[]
    peSpawnFrame: {index: number; factionIndex: number; castleIndex: number}[]
    castles: GetFactionsResponseCastle[]
}

export interface GetFactionsResponseFactionMember{
    playerId: string
    name: string
    isLord: boolean
    isOnline: boolean
}

export interface GetFactionsResponseFactionRelation{
    factionIndex: number
    name: string
    isAtWar: boolean
}

export interface GetFactionsResponseCastle{
    castleIndex: number
    name: string
}

export interface SetFactionLordParams {
    factionIndex: number
    playerId: string
}

export interface FactionDataProxy {
    getFaction(params: GetFactionParams): Promise<GetFactionsResponseItem>
    getFactions(): Promise<GetFactionsResponseItem[]>
    setFactionLord(params: SetFactionLordParams): Promise<void>
}

export function useFactionDataProxy() {
    return dataMocking ? useFactionDataProxyDataMocking() : useFactionDataProxyApi()
}

export function useFactionDataProxyDataMocking(): FactionDataProxy {
    const data: GetFactionsResponseItem[] = []
    for (let i = 0; i < 30; i++) {
        data.push({
            factionIndex: i,
            name: `Faction${i}`,
            banner: '19.35.19.1836.1836.768.788.1.0.-30.347.86.116.240.240.768.788.1.1.0.342.86.116.240.240.574.654.1.1.0.342.86.116.240.240.962.654.1.0.0.503.86.116.240.240.948.1097.1.0.0.503.86.116.240.240.844.1155.1.0.0',
            playerList: [
                { playerId: '1', name: 'aaa', isLord: true, isOnline: true },
            ],
            relations: [
                { factionIndex: 0, name: 'aaa', isAtWar: true },
            ],
            castles: [
                { castleIndex: 0, name: 'aaa' }
            ],
        })
    }

    return {
        async getFaction(params): Promise<GetFactionsResponseItem> {
            await setTimeoutAsync(1000)

            return data[0]!
        },
        async getFactions(): Promise<GetFactionsResponseItem[]> {
            await setTimeoutAsync(1000)

            return [...data]
        },
        async setFactionLord(params) {
            await setTimeoutAsync(1000)
        },
    }
}

export function useFactionDataProxyApi(): FactionDataProxy {
    return {
        async getFaction(params): Promise<GetFactionsResponseItem> {
            const faction = await httpAgentContainer.instance.get(`/faction?factionIndex=${params.factionIndex}`).json<GetFactionsResponseItem>()
            faction.playerList = [...from(faction.playerList).pipe(orderByDescending(x => x.isOnline))]
            faction.relations = [...from(faction.relations).pipe(orderBy(x => x.factionIndex))]
            faction.castles = [...from(faction.castles).pipe(orderBy(x => x.castleIndex))]
            return faction
        },
        async getFactions(): Promise<GetFactionsResponseItem[]> {
            const factions = await httpAgentContainer.instance.get('/factions').json<GetFactionsResponseItem[]>()
            return [...from(factions).pipe(orderBy(x => x.factionIndex))]
        },
        async setFactionLord(params) {
            return httpAgentContainer.instance.post({
                factionIndex: params.factionIndex,
                playerId: params.playerId,
            }, '/setfactionlord').res()
        },
    }
}
