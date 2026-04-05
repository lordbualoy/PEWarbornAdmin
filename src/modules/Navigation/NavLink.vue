<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, type RouteLocationAsRelativeGeneric } from 'vue-router'
import { isRouteEqual } from '@/modules/Routing'

const props = defineProps<{
    to: RouteLocationAsRelativeGeneric
}>()

const route = useRoute()

const isCurrentRoute = computed(() => isRouteEqual(route as unknown as RouteLocationAsRelativeGeneric, props.to))
</script>

<template>
    <RouterLink :class="{current: isCurrentRoute}" :to="props.to">
        <slot />
    </RouterLink>
</template>

<style scoped>
</style>
