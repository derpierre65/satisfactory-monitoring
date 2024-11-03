<template>
  <div class="tw-flex tw-gap-2">
    <div class="tw-flex-auto tw-space-x-2">
      <q-icon name="fas fa-pencil" class="cursor-pointer">
        <q-tooltip>Rename</q-tooltip>
      </q-icon>
      <span>{{ item.Name || 'Unnamed Switch' }}</span>
    </div>
    <q-toggle :model-value="item.IsOn" @click="toggleStatus" />
    <q-popup-edit v-slot="scope" :model-value="item.Name" auto-save @save="updateName">
      <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
    </q-popup-edit>
  </div>
</template>

<script setup lang="ts">
import { SwitchObject } from '@derpierre65/ficsit-remote-monitoring';
import useServerStore from 'stores/server.ts';
import useDataStore from 'stores/data.ts';

//#region Composable & Prepare
const { item, } = defineProps<{
  item: SwitchObject;
}>();

const serverStore = useServerStore();
const dataStore = useDataStore();
//#endregion

//#region Data
//#endregion

//#region Computed
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
function updateName(newName: string) {
  serverStore.post('setSwitches', {
    ID: item.ID,
    name: newName,
  }).then(() => dataStore.fetch('getSwitches', true));
}
function toggleStatus() {
  serverStore.post('setSwitches', {
    ID: item.ID,
    status: !item.IsOn,
  }).then(() => dataStore.fetch('getSwitches', true));
}
//#endregion

//#region Created
//#endregion
</script>
