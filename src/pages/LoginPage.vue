<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="shadow-0">
          <form @submit.prevent="login">
            <q-toolbar class="bg-primary text-h6">
              FicsIt Remote Monitoring
            </q-toolbar>
            <q-card-section class="q-gutter-y-md">
              <q-select
                v-if="servers.length"
                :model-value="null"
                :options="servers"
                label="Server"
                @update:model-value="selectServer"
              />
              <q-input
                v-model="server.host"
                label="Host"
              />
              <q-input
                v-model="server.port"
                min="1"
                max="65535"
                label="Port"
              />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn type="submit" label="Login" color="primary" />
            </q-card-actions>
          </form>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Dialog, Loading } from 'quasar';
import useServerStore from 'stores/server.ts';
import { useRouter } from 'vue-router';

//#region Composable & Prepare
const serverStore = useServerStore();
const router = useRouter();
//#endregion

//#region Data
const server = ref({
  host: '127.0.0.1',
  port: 8081,
});
//#endregion

//#region Computed
const servers = computed(() => {
  return serverStore.servers.map((server, index) => ({
    value: index,
    label: `${server.host}:${server.port}`,
  }));
});
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
async function login() {
  Loading.show({
    group: 'login',
    message: 'Loading...',
  });

  const serverFound = await serverStore.tryConnect(server.value);
  Loading.hide('login');

  if (!serverFound) {
    return Dialog.create({
      message: `Can't connect to ${server.value.host}:${server.value.port}`,
      class: 'shadow-0',
    });
  }

  const serverIndex = serverStore.add(server.value);
  serverStore.select(serverIndex);

  await router.push({
    name: 'dashboard',
  });
}

function selectServer(option) {
  server.value = serverStore.servers[option.value];
}
//#endregion

//#region Created
//#endregion
</script>
