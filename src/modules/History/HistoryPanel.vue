<script setup lang="ts">
import { ref } from 'vue'
import { NavLink } from '@/modules/Navigation';
import { useRouter, type RouteLocationAsRelativeGeneric } from 'vue-router'
import { routeNames } from '@/modules/Routing'

const router = useRouter()
const history = ref<RouteLocationAsRelativeGeneric[]>([])
router.afterEach((to, from, failure) => {
  if (failure)
    return
  if (history.value.length === 20)
    history.value.shift()
  history.value.push(to as unknown as RouteLocationAsRelativeGeneric)
})

function resolveRouteName(route: RouteLocationAsRelativeGeneric) {
  if (route.name !== 'Asset')
    return routeNames.get(route.name as string)

  return `${routeNames.get(route.name as string)} (${route.params!.assetName})`
}
</script>

<template>
  <div>
    <label class="history-label">History</label>
    <ol>
      <li class="number" v-for="(historyItem, i) in history" :key="i">
        <NavLink :to="historyItem">
          {{ resolveRouteName(historyItem) }}
        </NavLink>
      </li>
    </ol>
  </div>
</template>

<style scoped>
div {
  grid-row: 2;
  grid-column: 1;
  display: none;
  flex-direction: column;
  padding: 1em;
  background-color: var(--base-history-background-color);
}

@media (min-width: 768px) {
  div {
    display: none;
  }
}

label {
  display: block;
  color: hsl(220, 100%, 85%);
  text-align: center;
  font-weight: bold;
}

ol>li::marker {
  color: var(--base-font-color);
}
</style>
