<script setup lang="ts">
import { NavLink } from '@/modules/Navigation';
import HistoryPanel from '@/modules/History/HistoryPanel.vue';
import { routeNames } from '@/modules/Routing';
import { mainSubViewSymbol, useSubView } from '@/modules/SubView';
import { provide, watch } from 'vue';
import { useRoute } from 'vue-router';
import { moduleDataDataStoreSymbol, useModuleDataDataStore } from '@/modules/ModuleData';

const subView = useSubView()
provide(mainSubViewSymbol, subView)
const { activeSubView, activeProps } = subView

provide(moduleDataDataStoreSymbol, useModuleDataDataStore())

const route = useRoute()
watch(route, () => {
  while (subView.stackDepth > 0)
    subView.popActiveSubView()
})
</script>

<template>
  <nav>
    <NavLink :to="{ name: 'ConnectionSettings' }">{{ routeNames.get('ConnectionSettings') }}</NavLink>
    <NavLink :to="{ name: 'Overview' }">{{ routeNames.get('Overview') }}</NavLink>
    <NavLink :to="{ name: 'ModuleData' }">{{ routeNames.get('ModuleData') }}</NavLink>
    <NavLink :to="{ name: 'Players' }">{{ routeNames.get('Players') }}</NavLink>
    <NavLink :to="{ name: 'Factions' }">{{ routeNames.get('Factions') }}</NavLink>
    <NavLink :to="{ name: 'Castles' }">{{ routeNames.get('Castles') }}</NavLink>
    <!-- <NavLink :to="{ name: 'Markets' }">{{ routeNames.get('Markets') }}</NavLink>
    <NavLink :to="{ name: 'HorseMarkets' }">{{ routeNames.get('HorseMarkets') }}</NavLink>
    <NavLink :to="{ name: 'ActionLogs' }">{{ routeNames.get('ActionLogs') }}</NavLink> -->
  </nav>
  <HistoryPanel class="history" />
  <main>
    <component v-if="activeSubView" :is="activeSubView" ref="subViewRef" :="activeProps" />
    <RouterView v-show="!activeSubView" />
  </main>
</template>

<style scoped>
</style>
