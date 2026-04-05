<script setup lang="ts">
import { Card, Field, Value } from '@/modules/Layout'
import { httpAgentContainer, updateConnection } from '@/modules/Http'
import { ref, watch } from 'vue';
import { setTimeoutAsync } from '@/utilities';

const host = ref(localStorage.getItem('host'))
const port = ref(localStorage.getItem('port'))
const token = ref(localStorage.getItem('token'))
const connectionTestingResult = ref('')

watch(host, () => {
  localStorage.setItem('host', host.value!)
  updateConnection()
})
watch(port, () => {
  localStorage.setItem('port', port.value!)
  updateConnection()
})
watch(token, () => {
  localStorage.setItem('token', token.value!)
  updateConnection()
})

async function testConnection(){
  connectionTestingResult.value = 'Connecting'
  const testResult = await httpAgentContainer.instance.get().res().then(x => true).catch(x => false)
  if (testResult){
    connectionTestingResult.value = 'Connection Successful'
    localStorage.setItem('last_test_connection_success', '1')
  }
  else{
    connectionTestingResult.value = 'Connection Failed'
    localStorage.setItem('last_test_connection_success', '0')
  }
  await setTimeoutAsync(5000)
  connectionTestingResult.value = ''
}
</script>

<template>
  <section>
    <Card>
      <Field>
        <label>Server IP</label>
        <Value>
          <input type="text" :value="host" @change="host = ($event.target as HTMLInputElement).value">
        </Value>
      </Field>
      <Field>
        <label>Server Port</label>
        <Value>
          <input type="number" :value="port" @change="port = ($event.target as HTMLInputElement).value">
        </Value>
      </Field>
      <Field>
        <label>Token</label>
        <Value>
          <input type="text" :value="token" @change="token = ($event.target as HTMLInputElement).value">
        </Value>
      </Field>
      <button @click="testConnection">Test Connection</button>
      <p>{{connectionTestingResult}}</p>
    </Card>
  </section>
</template>

<style scoped>
</style>
