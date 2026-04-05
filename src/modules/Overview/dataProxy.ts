import { dataMocking } from '@/constants'
import { setTimeoutAsync } from '@/utilities'
import { httpAgentContainer } from '@/modules/Http'
import { Duration } from 'luxon'

export interface GetOverviewResponse {
    serverName: string
    mapName: string
    modules: string[]
    databaseHost: string
    databaseSchema: string
    playerCount: number
    maxPlayer: number
    factionCount: number
    castleCount: number
    marketCount: number
    horseMarketCount: number
    serverUptime: Duration
    serverRestartIn: Duration
    autoSavePlayersIn: Duration
    autoSaveMarketsIn: Duration
    admins: GetOverviewResponseAdmin[]
    nativeServerOptions: string
    generalConfig: Record<string, string>
}

export interface GetOverviewResponseAdmin{
    playerId: string
    name: string
    isOnline: boolean
}

export interface OverviewDataProxy {
    getOverview(): Promise<GetOverviewResponse>
}

export function useOverviewDataProxy() {
    return dataMocking ? useOverviewDataProxyDataMocking() : useOverviewDataProxyApi()
}

export function useOverviewDataProxyDataMocking(): OverviewDataProxy {
    return {
        async getOverview(): Promise<GetOverviewResponse> {
            await setTimeoutAsync(1000)

            return {
                serverName: 'Warborn PE Roleplay',
                mapName: 'Warborn Aegis Revision 1234',
                modules: [
                    'PE Core v1.0.0.0',
                    'PE Extended v1.0.0.0',
                ],
                databaseHost: 'localhost',
                databaseSchema: 'warbornpe',
                playerCount: 10,
                maxPlayer: 100,
                factionCount: 10,
                castleCount: 10,
                marketCount: 10,
                horseMarketCount: 10,
                serverUptime: Duration.fromObject({ hour: 1 }),
                serverRestartIn: Duration.fromObject({ hour: 5 }),
                autoSavePlayersIn: Duration.fromObject({ minute: 10 }),
                autoSaveMarketsIn: Duration.fromObject({ minute: 10 }),
                admins: [
                    { playerId: '111', name: 'AAA', isOnline: true },
                    { playerId: '222', name: 'BBB', isOnline: false },
                    { playerId: '333', name: 'CCC', isOnline: false },
                ],
                nativeServerOptions: `ServerName [EU] Persistent Empires Alpha Test
  GameType PersistentEmpires
  GamePassword eray31
  Map pe_test
  CultureTeam1 khuzait
  CultureTeam2 vlandia
  AllowPollsToKickPlayers False
  AllowPollsToBanPlayers False
  AllowPollsToChangeMaps False
  MapTimeLimit 60000
  RespawnPeriodTeam1 5
  RespawnPeriodTeam1 5
  MinNumberOfPlayersForMatchStart 0
  MaxNumberOfPlayers 500
  end_game_after_mission_is_over
  start_game_and_mission`,
                generalConfig: {
                    AutorestartActive: 'true',
                    AutorestartIntervalHours: '12',
                    AutosaveDuration: '600',
                    CanUseSuicide: 'true',
                    VoiceChatEnabled: 'true',
                    DontOverrideMangonelHit: 'false',
                    AnimationsEnabled: 'true',
                    WhitelistEnabled: 'true',
                    AgentLabelEnabled: 'true',
                    CombatlogDuration: '0',
                    DecapitationChance: '0',
                    RepairTimeoutAfterHit: '60',
                    ItemDestroyChanceOnDeath: '0',
                },
            }
        },
    }
}

export function useOverviewDataProxyApi(): OverviewDataProxy {
    return {
        async getOverview() {
            const response = await httpAgentContainer.instance.get('/overview').json() as Record<string, any>
            return {
                ...response,
                serverUptime: Duration.fromISOTime(response.serverUptime),
                serverRestartIn: Duration.fromISOTime(response.serverRestartIn),
                autoSavePlayersIn: Duration.fromISOTime(response.autoSavePlayersIn),
                autoSaveMarketsIn: Duration.fromISOTime(response.autoSaveMarketsIn),
            } as GetOverviewResponse
        },
    }
}
