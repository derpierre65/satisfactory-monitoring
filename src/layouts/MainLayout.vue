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
          <q-icon
            :name="$q.dark.isActive ? 'fas fa-moon' : 'fas fa-sun'"
            class="cursor-pointer"
            size="sm"
            @click="toggleDarkMode"
          >
            <q-tooltip>Toggle Dark Mode</q-tooltip>
          </q-icon>

          <q-select
            :model-value="serverStore.selected"
            :options="serverStore.selectableServer"
            emit-value
            map-options
            @update:model-value="selectServer"
          />
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
import { ref } from 'vue';
import useServerStore from 'stores/server.ts';
import { useQuasar } from 'quasar';

defineOptions({
  name: 'MainLayout',
});

const serverStore = useServerStore();
const q = useQuasar();
const leftDrawerOpen = ref(false);

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
    serverStore.select(serverIndex);
  }
}
</script>
