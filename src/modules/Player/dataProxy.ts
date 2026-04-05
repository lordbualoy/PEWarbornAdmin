import { dataMocking } from '@/constants'
import { setTimeoutAsync } from '@/utilities'
import { httpAgentContainer } from '@/modules/Http';
import { DateTime } from 'luxon';

export interface GetPlayerParams {
    playerId: string
}

export interface GetPlayersResponseItem {
    playerId: string
    isOnline: boolean
    name: string
    previousNames: string[]
    classId: string
    factionIndex: number
    hasDoorKey: boolean
    hasChestKey: boolean
    isMarshal: boolean
    isLord: boolean
    inventory: any[]
    weapons: any[]
    armors: any[]
    mount: string | null
    money: number
    bankMoney: number
    personalChests: any[]
    hp: number
    maxHp: number
    mountHp: number
    mountMaxHp: number
    shieldHp: number
    shieldMaxHp: number
    foodBar: number
    isPoisoned: boolean
    isBannedUntil: string | null
}

export interface SetPlayerMoneyParams {
    playerId: string
    originalMoney: number
    money: number
}

export interface SetPlayerFactionParams {
    playerId: string
    factionIndex: number
}

export interface PlayerDataProxy {
    getPlayer(params: GetPlayerParams): Promise<GetPlayersResponseItem>
    getPlayers(): Promise<GetPlayersResponseItem[]>
    kickPlayer(params: GetPlayerParams): Promise<void>
    tempBanPlayer(params: GetPlayerParams): Promise<void>
    permanentBanPlayer(params: GetPlayerParams): Promise<void>
    unbanPlayer(params: GetPlayerParams): Promise<void>
    setPlayerMoney(params: SetPlayerMoneyParams): Promise<void>
    setPlayerFaction(params: SetPlayerFactionParams): Promise<void>
}

export function usePlayerDataProxy() {
    return dataMocking ? usePlayerDataProxyDataMocking() : usePlayerDataProxyApi()
}

export function usePlayerDataProxyDataMocking(): PlayerDataProxy {
    const data: GetPlayersResponseItem[] = []
    for (let i = 0; i < 30; i++) {
        data.push({
            playerId: `item${i}`,
            name: `Player${i}`,
            isOnline: true,
            previousNames: [],
            classId: 'class1',
            factionIndex: 0,
            hasDoorKey: false,
            hasChestKey: false,
            isMarshal: false,
            isLord: false,
            inventory: [],
            weapons: [],
            armors: [],
            mount: null,
            money: 100,
            bankMoney: 50,
            personalChests: [],
            hp: 10,
            maxHp: 100,
            mountHp: 0,
            mountMaxHp: 0,
            shieldHp: 0,
            shieldMaxHp: 0,
            foodBar: 100,
            isPoisoned: false,
            isBannedUntil: null,
        })
    }

    return {
        async getPlayer(params): Promise<GetPlayersResponseItem> {
            await setTimeoutAsync(1000)

            return data[0]!
        },
        async getPlayers(): Promise<GetPlayersResponseItem[]> {
            await setTimeoutAsync(1000)

            return [...data]
        },
        async kickPlayer(params): Promise<void> {
            await setTimeoutAsync(1000)
        },
        async tempBanPlayer(params): Promise<void> {
            await setTimeoutAsync(1000)
        },
        async permanentBanPlayer(params): Promise<void> {
            await setTimeoutAsync(1000)
        },
        async unbanPlayer(params): Promise<void> {
            await setTimeoutAsync(1000)
        },
        async setPlayerMoney(params): Promise<void> {
            await setTimeoutAsync(1000)
        },
        async setPlayerFaction(params): Promise<void> {
            await setTimeoutAsync(1000)
        },
    }
}

export function usePlayerDataProxyApi(): PlayerDataProxy {
    return {
        async getPlayer(params): Promise<GetPlayersResponseItem> {
            return httpAgentContainer.instance.get(`/player?playerId=${params.playerId}`).json()
        },
        async getPlayers(): Promise<GetPlayersResponseItem[]> {
            return httpAgentContainer.instance.get('/players').json()
        },
        async kickPlayer(params): Promise<void> {
            return httpAgentContainer.instance.post({
                playerId: params.playerId,
            }, '/kickplayer').res()
        },
        async tempBanPlayer(params): Promise<void> {
            const until = Math.trunc(DateTime.now()
                .plus({ hours: 1 })
                .toSeconds())
            return httpAgentContainer.instance.post({
                playerId: params.playerId,
                banEndsAt: until,
                banReason: "Banned with Admin Tool",
            }, '/banplayer').res()
        },
        async permanentBanPlayer(params): Promise<void> {
            const until = Math.trunc(DateTime.now()
                .plus({ days: 10000 })
                .toSeconds())
            return httpAgentContainer.instance.post({
                playerId: params.playerId,
                banEndsAt: until,
                banReason: "Banned with Admin Tool",
            }, '/banplayer').res()
        },
        async unbanPlayer(params): Promise<void> {
            return httpAgentContainer.instance.post({
                playerId: params.playerId,
                unbanReason: "Unbanned with Admin Tool",
            }, '/unbanplayer').res()
        },
        async setPlayerMoney(params): Promise<void> {
            const diff = params.money - params.originalMoney
            return httpAgentContainer.instance.post({
                playerId: params.playerId,
                gold: diff,
            }, '/compensateplayer').res()
        },
        async setPlayerFaction(params): Promise<void> {
            return httpAgentContainer.instance.post({
                playerId: params.playerId,
                factionIndex: params.factionIndex,
            }, '/setplayerfaction').res()
        },
    }
}
