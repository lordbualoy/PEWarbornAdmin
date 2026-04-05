<script setup lang="ts">
import { Card } from '@/modules/Layout'
import { mainSubViewSymbol } from '@/modules/SubView'
import { defineAsyncComponent, inject } from 'vue'

const subView = inject(mainSubViewSymbol)!

const itemsSubView = defineAsyncComponent(() => import('@/modules/ModuleData').then(x => x.Items))
const classesSubView = defineAsyncComponent(() => import('@/modules/ModuleData').then(x => x.Classes))

const subViews: { name: string; handler: () => void }[] = [
  { name: 'Items', handler: () => subView.pushActiveSubView(itemsSubView) },
  { name: 'Classes', handler: () => subView.pushActiveSubView(classesSubView) },
  // { name: 'CraftingRecipes', handler: () => subView.pushActiveSubView(itemsSubView) },
  // { name: 'StockpileMarkets', handler: () => subView.pushActiveSubView(itemsSubView) },
  // { name: 'ImportExports', handler: () => subView.pushActiveSubView(itemsSubView) },
  // { name: 'PrefabSpawners', handler: () => subView.pushActiveSubView(itemsSubView) },
  // { name: 'Monsters', handler: () => subView.pushActiveSubView(itemsSubView) },
  // { name: 'Cultures', handler: () => subView.pushActiveSubView(itemsSubView) },
  // { name: 'Buffs', handler: () => subView.pushActiveSubView(itemsSubView) },
]
</script>

<template>
  <section>
    <Card>
      <a v-for="(subView, i) in subViews" :key="i" href="#" @click.prevent="subView.handler">{{ subView.name }}</a>
    </Card>
  </section>
</template>

<style scoped></style>
