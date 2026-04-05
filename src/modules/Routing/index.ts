import { createRouter, createWebHashHistory } from 'vue-router'
import type {
  NavigationGuardReturn,
  RouteLocationAsRelativeGeneric,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  RouteRecordRaw,
} from 'vue-router'

interface RouteAdditionalInformation {
  displayName: string
}

export interface PreRouteEnter{
    once: boolean
    handler: (to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded) => Promise<NavigationGuardReturn>
}

export const specialRoutes = new Set(['Root', 'ConnectionSettings'])

const routes: (RouteRecordRaw & RouteAdditionalInformation)[] = [
  {
    name: 'Root',
    displayName: null!,
    path: '/',
    beforeEnter: (to, from) => {
      return { name: 'ConnectionSettings' }
    },
    component: () => null,
  },
  { name: 'ConnectionSettings', displayName: 'Connection Settings', path: '/connection-settings', component: () => import('@/views/ConnectionSettings.vue') },
  { name: 'Overview', displayName: 'Overview', path: '/overview', component: () => import('@/views/Overview.vue') },
  { name: 'ModuleData', displayName: 'Module Data', path: '/module-data', component: () => import('@/views/ModuleData.vue') },
  // { name: 'ModuleDataClasses', displayName: 'Classes', path: '/module-data/classes', component: () => import('@/views/ModuleData.vue') },
  // { name: 'ModuleDataCraftingRecipes', displayName: 'Crafting Recipes', path: '/module-data/crafting-recipes', component: () => import('@/views/ModuleData.vue') },
  // { name: 'ModuleDataStockpileMarkets', displayName: 'Stockpile Markets', path: '/module-data/stockpile-markets', component: () => import('@/views/ModuleData.vue') },
  // { name: 'ModuleDataImportExports', displayName: 'Import/Export', path: '/module-data/import-exports', component: () => import('@/views/ModuleData.vue') },
  // { name: 'ModuleDataPrefabSpawners', displayName: 'Prefab Spawners', path: '/module-data/prefab-spawners', component: () => import('@/views/ModuleData.vue') },
  // { name: 'ModuleDataMonsters', displayName: 'Monsters', path: '/module-data/monsters', component: () => import('@/views/ModuleData.vue') },
  // { name: 'ModuleDataCultures', displayName: 'Cultures', path: '/module-data/cultures', component: () => import('@/views/ModuleData.vue') },
  // { name: 'ModuleDataBuffs', displayName: 'Buffs', path: '/module-data/buffs', component: () => import('@/views/ModuleData.vue') },
  { name: 'Players', displayName: 'Players', path: '/players', component: () => import('@/views/Players.vue') },
  { name: 'Factions', displayName: 'Factions', path: '/factions', component: () => import('@/views/Factions.vue') },
  { name: 'Castles', displayName: 'Castles', path: '/castles', component: () => import('@/views/Castles.vue') },
  // { name: 'Markets', displayName: 'Markets', path: '/markets', component: () => import('@/views/ModuleData.vue') },
  // { name: 'HorseMarkets', displayName: 'Horse Markets', path: '/horse-markets', component: () => import('@/views/ModuleData.vue') },
  // { name: 'ActionLogs', displayName: 'Action Logs', path: '/action-logs', component: () => import('@/views/ModuleData.vue') },
]

export function isRouteEqual(route1: RouteLocationAsRelativeGeneric, route2: RouteLocationAsRelativeGeneric) {
  if (route1.name !== route2.name)
    return false

  if (route1.name === 'Asset')
    return route1.params!.assetName === route2.params!.assetName

  return true
}

export const routeNames = new Map(routes.map(route => [route.name as string, route.displayName]))

export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})
