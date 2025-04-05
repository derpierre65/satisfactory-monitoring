<template>
  <div class="tw-mx-auto tw-container">
    <AppCard title="Servers" section-class="tw-flex tw-gap-4">
      <div v-if="serverStore.servers.length" class="tw-w-[200px]">
        <q-list separator dense bordered>
          <q-item
            v-for="server in serverStore.servers"
            :key="server.url"
            :active="activeServer === server"
            clickable
            @click="activeServer = server"
          >
            <q-item-section>
              {{ server.name }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="tw-flex-auto tw-flex tw-flex-col tw-gap-4">
        <q-input v-model="serverName" :label="t('login.name')" />
        <q-input
          :model-value="activeServer.url"
          :label="t('login.url')"
          @change="updateServerUrl"
        />
        <InputPassword v-model="activeServer.authToken" />
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import useServerStore from 'stores/server';
import AppCard from 'components/AppCard.vue';
import { computed, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import InputPassword from 'components/form/InputPassword.vue';

//#region Composable & Prepare
const serverStore = useServerStore();
const { t, } = useTranslation();
//#endregion

//#region Data
const activeServer = ref(serverStore.currentServer!);
//#endregion

//#region Computed
const serverName = computed({
  get: () => activeServer.value.name,
  set: (name: string) => {
    if (name) {
      activeServer.value.name = name;
    }
  },
});
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
function updateServerUrl() {
  serverStore.updateServerUrl(activeServer.value.url);
}
//#endregion

//#region Created
//#endregion
</script>
