<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="fas fa-bars"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          FicsIt Remote Monitoring
        </q-toolbar-title>

        <div class="flex items-center tw-space-x-2">
          <q-select
            v-model="updateInterval"
            :options="updateIntervals"
            label="Update Rate"
            class="tw-w-[120px]"
          />
          <q-select
            :model-value="serverStore.selected"
            :options="serverStore.selectableServer"
            label="Server"
            class="tw-w-[120px]"
            emit-value
            map-options
            @update:model-value="selectServer"
          />

          <q-btn
            :icon="$q.dark.isActive ? 'fas fa-moon' : 'fas fa-sun'"
            flat
            round
            @click="toggleDarkMode"
          >
            <q-tooltip>Toggle Dark Mode</q-tooltip>
          </q-btn>

          <q-btn
            icon="fas fa-power-off"
            flat
            round
            @click="logout"
          >
            <q-tooltip>Logout</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      model-value
      show-if-above
      bordered
      :width="leftDrawerOpen ? 250 : 50"
    >
      <q-list>
        <q-item clickable>
          <q-item-section side>
            <q-icon name="fas fa-dashboard" size="16px" />
          </q-item-section>
          <q-item-section v-if="leftDrawerOpen">
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import useServerStore from 'stores/server.ts';
import { useQuasar } from 'quasar';
import useSettingsStore from 'stores/settings.ts';

defineOptions({
  name: 'MainLayout',
});

//#region Composable & Prepare
const serverStore = useServerStore();
const settingsStore = useSettingsStore();
const q = useQuasar();
//#endregion

//#region Data
const leftDrawerOpen = ref(false);
const updateIntervals = [
  1,
  3,
  5,
  10,
  15,
  30,
  60,
];
//#endregion

//#region Computed
const updateInterval = computed({
  set: (newValue) => settingsStore.updateInterval = newValue * 1_000,
  get: () => settingsStore.updateInterval / 1_000,
});
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleDarkMode() {
  q.dark.toggle();
  window.localStorage.setItem('light_mode', (!q.dark.isActive).toString());
}

async function selectServer(serverIndex: number) {
  const server = serverStore.servers[serverIndex];
  if (await serverStore.tryConnect(server)) {
    await serverStore.select(serverIndex);
  }
}

function logout() {
  serverStore.select(-1);
}
//#endregion

//#region Created
//#endregion
</script>
