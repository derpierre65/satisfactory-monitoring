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
            :label="t('menu.update_rate')"
            class="tw-w-[120px]"
          />
          <q-select
            :model-value="serverStore.selected"
            :options="serverStore.selectableServer"
            :label="t('menu.server')"
            class="tw-w-[120px]"
            emit-value
            map-options
            @update:model-value="selectServer"
          />

          <q-btn
            :to="{name: 'settings'}"
            icon="fas fa-cog"
            flat
            round
          >
            <q-tooltip>{{ t('menu.settings') }}</q-tooltip>
          </q-btn>

          <q-btn
            icon="fas fa-power-off"
            flat
            round
            @click="logout"
          >
            <q-tooltip>{{ t('menu.logout') }}</q-tooltip>
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
        <template v-for="menuItem in menuItems">
          <q-separator v-if="menuItem.separator" />
          <q-item
            v-else
            :key="menuItem.title"
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
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page class="tw-flex tw-flex-col" :class="{'q-pa-md': !route.meta.noPadding}">
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

    <q-dialog v-model="updateAvailable" position="bottom" no-focus seamless>
      <q-card class="tw-w-96">
        <q-card-section class="row items-center no-wrap">
          <div>A new version is available.</div>
          <q-space />
          <q-btn label="Refresh" color="primary" @click="refreshApplication" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import useServerStore from 'stores/server';
import useSettingsStore from 'stores/settings';
import AppAlert from 'components/AppAlert.vue';
import axios from 'axios';
import { noop } from '@derpierre65/frontend-utils';
import { useRoute } from 'vue-router';
import { useTranslation } from 'i18next-vue';

type MenuItem = {
  separator: boolean;
} | {
  title: string;
  icon: string;
  route: {
    name: string;
  };
};

defineOptions({
  name: 'MainLayout',
});

//#region Composable & Prepare
const serverStore = useServerStore();
const settingsStore = useSettingsStore();
const route = useRoute();
const { t, } = useTranslation();
//#endregion

//#region Data
const leftDrawerOpen = ref(false);
const updateAvailable = ref(false);
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
//#endregion

//#region Computed
const menuItems = computed<MenuItem[]>(() => [
  {
    title: 'Dashboard',
    icon: 'fas fa-dashboard',
    route: {
      name: 'dashboard',
    },
  },
  {
    title: 'Notifications',
    icon: 'fas fa-bell',
    route: {
      name: 'notifications',
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
    separator: true,
  },
  {
    title: 'Power',
    icon: 'fas fa-bolt-lightning',
    route: {
      name: 'power',
    },
  },
  {
    title: 'Power Switches',
    icon: 'fas fa-toggle-on',
    route: {
      name: 'power-switches',
    },
  },
  {
    separator: true,
  },
  {
    title: 'Factory Efficiency',
    icon: 'fas fa-industry',
    route: {
      name: 'factory-efficiency',
    },
  },
  {
    separator: true,
  },
  {
    title: t('vehicles.cars.title'),
    icon: 'fas fa-car',
    route: {
      name: 'vehicle-cars',
    },
  },
  {
    title: t('vehicles.trains.title'),
    icon: 'fas fa-train',
    route: {
      name: 'vehicle-trains',
    },
  },
  {
    title: t('vehicles.drones.title'),
    icon: 'fas fa-plane',
    route: {
      name: 'vehicle-drones',
    },
  },
  {
    separator: true,
  },
  {
    title: 'Elevators',
    icon: 'fas fa-elevator',
    route: {
      name: 'elevators',
    },
  },
  {
    title: 'AWESOME Sink',
    icon: 'fas fa-ticket',
    route: {
      name: 'sink',
    },
  },
  {
    title: 'Inventories',
    icon: 'fa-solid fa-boxes-stacked',
    route: {
      name: 'inventory',
    },
  },
]);
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
function refreshApplication() {
  window.location.reload();
}

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
if (!import.meta.env.DEV) {
  window.setInterval(() => {
    if (updateAvailable.value) {
      return;
    }

    axios
      .get('/assets/version.json', {
        baseURL: '',
        params: {
          t: Date.now(),
        },
      })
      .then(({ data, }) => {
        if (data.date.toString() !== import.meta.env.VITE_BUILD_TIMESTAMP) {
          updateAvailable.value = true;
        }
      })
      .catch(noop);
  }, 20_000);
}
//#endregion
</script>
