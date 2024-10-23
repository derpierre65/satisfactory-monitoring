<template>
  <q-layout view="lHh Lpr lff">
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
          FicsIt Remote Monitoring Dashboard
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
        <q-item
          v-for="menuItem in menuItems"
          :to="menuItem.route"
          :active="menuItem.route.name === $route.name"
          clickable
        >
          <q-item-section side>
            <q-icon
              v-bind="menuItem.route.name === $route.name ? {color: 'primary'} : {}"
              :name="menuItem.icon"
              size="16px"
            />
          </q-item-section>
          <q-item-section v-if="leftDrawerOpen">
            <q-item-label>{{ menuItem.title }}</q-item-label>
          </q-item-section>
          <q-tooltip v-else anchor="center end" self="center left">
            {{ menuItem.title }}
          </q-tooltip>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page class="q-pa-md tw-flex tw-flex-col">
        <AppAlert v-if="!serverStore.isConnected" type="warning" class="q-mb-md">
          Could not connect to the Satisfactory Ficsit Remote Monitoring Api.
        </AppAlert>
        <router-view />
      </q-page>
    </q-page-container>

    <q-footer class="bg-transparent tw-max-w-screen-xl tw-mx-auto">
      <q-separator />

      <div class="q-py-sm tw-text-neutral-400 flex">
        <div>
          <span>Required Mod: </span>
          <a href="https://ficsit.app/mod/FicsitRemoteMonitoring" class="text-primary">Ficsit Remote Monitoring</a>
          <br>
          <span>Open Source: </span>
          <a href="https://github.com/derpierre65/satisfactory-monitoring" class="text-primary">GitHub Repository</a>
        </div>

        <q-space />

        <div>
          <div>
            <span>Proudly made by <a href="https://www.derpierre65.dev/" class="text-primary">derpierre65</a> with </span>
            <q-icon name="fa fa-heart" color="red" />
            <span> in Ireland</span>
          </div>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import useServerStore from 'stores/server.ts';
import { useQuasar } from 'quasar';
import useSettingsStore from 'stores/settings.ts';
import AppAlert from 'components/AppAlert.vue';

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
  0.1,
  0.25,
  0.5,
  1,
  3,
  5,
  10,
  15,
  30,
  60,
];
const menuItems = [
  {
    title: 'Dashboard',
    icon: 'fas fa-dashboard',
    route: {
      name: 'dashboard',
    },
  },
  {
    title: 'Map',
    icon: 'fas fa-map',
    route: {
      name: 'map',
    },
  },
  {
    title: 'Power',
    icon: 'fas fa-bolt-lightning',
    route: {
      name: 'power',
    },
  },
  {
    title: 'AWESOME Sink',
    icon: 'fas fa-ticket',
    route: {
      name: 'sink',
    },
  },
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
