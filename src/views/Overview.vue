<script setup lang="ts">
import { Card, Field, Value } from '@/modules/Layout'
import { mainSubViewSymbol } from '@/modules/SubView';
import { useOverviewViewManager } from '@/modules/Overview';
import { defineAsyncComponent, inject } from 'vue';

const subView = inject(mainSubViewSymbol)!

const overviewViewManager = useOverviewViewManager()
const { data, generalConfig, initialize } = overviewViewManager

const playerSubView = defineAsyncComponent(() => import('@/modules/Player').then(x => x.Player))

initialize()
</script>

<template>
  <div>
    <section>
      <Card>
        <Field>
          <label>Server Name</label>
          <Value>{{data.serverName}}</Value>
        </Field>
        <Field>
          <label>Map</label>
          <Value>{{data.mapName}}</Value>
        </Field>
        <Field>
          <label>Module</label>
          <Value>
            <ol>
              <li v-for="(module, i) in data.modules" :key="i">{{module}}</li>
            </ol>
          </Value>
        </Field>
        <Field>
          <label>Database Host</label>
          <Value>{{data.databaseHost}}</Value>
        </Field>
        <Field>
          <label>Database Schema</label>
          <Value>{{data.databaseSchema}}</Value>
        </Field>
      </Card>
      <Card>
        <Field>
          <label>Player Count</label>
          <Value>{{data.playerCount}}/{{data.maxPlayer}}</Value>
        </Field>
        <Field>
          <label>Faction Count</label>
          <Value>{{ data.factionCount }}</Value>
        </Field>
        <Field>
          <label>Castle Count</label>
          <Value>{{data.castleCount}}</Value>
        </Field>
        <Field>
          <label>Market Count</label>
          <Value>{{data.marketCount}}</Value>
        </Field>
        <Field>
          <label>Horse Market Count</label>
          <Value>{{data.horseMarketCount}}</Value>
        </Field>
      </Card>
      <Card>
        <Field>
          <label>Uptime</label>
          <Value>{{data.serverUptime?.toISOTime()}}</Value>
        </Field>
        <Field>
          <label>Restarts In</label>
          <Value>{{data.serverRestartIn?.toISOTime()}}</Value>
        </Field>
        <Field>
          <label>Autosave Players In</label>
          <Value>{{data.autoSavePlayersIn?.toISOTime()}}</Value>
        </Field>
        <Field>
          <label>Autosave Stockpile Markets In</label>
          <Value>{{data.autoSaveMarketsIn?.toISOTime()}}</Value>
        </Field>
      </Card>
      <Card>
        <Field>
          <label>Admins</label>
          <Value>
            <ol v-if="data.admins && data.admins.length > 0">
                <li v-for="(admin, i) in data.admins" :key="i">
                  <a href="#" @click.prevent="subView.pushActiveSubView(playerSubView, { playerId: admin.playerId })">{{admin.name}}</a> <template v-if="admin.isOnline">(Online)</template>
                </li>
            </ol>
            <template v-else>None</template>
          </Value>
        </Field>
      </Card>
    </section>
    <section>
      <Card>
        <Field>
          <label>Native Server Options</label>
          <Value>
            <pre>{{data.nativeServerOptions}}</pre>
          </Value>
        </Field>
      </Card>
      <Card>
        <Field>
          <label>General Config</label>
          <Value>
            <table>
              <tbody>
                <tr v-for="(config, i) in generalConfig" :key="i"><td>{{config.key}}</td><td>{{config.value}}</td></tr>
              </tbody>
            </table>
          </Value>
        </Field>
      </Card>
    </section>
  </div>
</template>

<style scoped>
div{
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1em;
}
</style>
