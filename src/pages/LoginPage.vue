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
                v-if="serverStore.selectableServer.length"
                :model-value="null"
                :options="serverStore.selectableServer"
                label="Server"
                @update:model-value="selectServer"
              />
              <q-input
                v-model="server.name"
                :label="t('login.name')"
              />
              <q-input
                v-model="server.url"
                :label="t('login.url')"
              />
              <q-input
                v-model="server.authToken"
                :label="t('login.token')"
                type="password"
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
import { ref } from 'vue';
import useServerStore, { type ServerInfo } from 'stores/server';
import { useRouter } from 'vue-router';
import { useTranslation } from 'i18next-vue';

//#region Composable & Prepare
const serverStore = useServerStore();
const router = useRouter();
const { t, } = useTranslation();
//#endregion

//#region Data
const server = ref<ServerInfo>({
  name: 'Local',
  url: 'http://127.0.0.1:8080',
  authToken: '',
});
//#endregion

//#region Computed
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
async function login() {
  const serverFound = await serverStore.tryConnect(server.value);
  if (!serverFound) {
    return;
  }

  const serverIndex = serverStore.add(server.value);
  await serverStore.select(serverIndex);

  await router.push({
    name: 'dashboard',
  });
}

function selectServer(option: { value: number; }) {
  if (serverStore.servers[option.value]) {
    server.value = serverStore.servers[option.value]!;
  }
}
//#endregion

//#region Created
//#endregion
</script>
