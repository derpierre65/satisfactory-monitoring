<template>
  <div class="tw-grid md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-10 tw-gap-4">
    <q-card v-for="item in items" :key="item.ClassName" class="no-shadow">
      <q-card-section class="flex tw-flex-col flex-center tw-gap-2 text-center">
        <div>
          <q-img :src="serverStore.getItemUrl(item.ClassName)" width="64px" />
        </div>
        <div>{{ item.Name }}</div>
        <div class="tw-text-lg">
          {{ item.Amount }}
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { usePausableFRMEndpoint } from 'src/composables/frmEndpoint';
import {
  GetCloudInvResponse,
  GetPlayerResponse,
  GetStorageInvResponse,
  GetTrainStationResponse,
  InventoryItemObject,
} from '@derpierre65/ficsit-remote-monitoring';
import useServerStore from 'stores/server';

//#region Composable & Prepare
const serverStore = useServerStore();
const inventoryEndpoints = {
  storages: reactive(usePausableFRMEndpoint<GetStorageInvResponse>('getStorageInv')),
  players: reactive(usePausableFRMEndpoint<GetPlayerResponse>('getPlayer')),
  cloud: reactive(usePausableFRMEndpoint<GetCloudInvResponse>('getCloudInv')),
  trainStations: reactive(usePausableFRMEndpoint<GetTrainStationResponse>('getTrainStation')),
};
//#endregion

//#region Data
//#endregion

//#region Computed
const items = computed(() => {
  const items = Object.create(null);

  for (const storage of inventoryEndpoints.storages.data) {
    addItems(items, storage.Inventory);
  }
  for (const storage of inventoryEndpoints.players.data) {
    addItems(items, storage.Inventory);
  }
  for (const station of inventoryEndpoints.trainStations.data) {
    for (const cargoInventory of station.CargoInventory) {
      addItems(items, cargoInventory.Inventory);
    }
  }

  addItems(items, inventoryEndpoints.cloud.data);

  return items;
});
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
function addItems(items: Record<string, InventoryItemObject>, inventory: InventoryItemObject[]) {
  for (const item of inventory) {
    if (!items[item.ClassName]) {
      items[item.ClassName] = item;
    }
    else {
      items[item.ClassName].Amount += item.Amount;
    }
  }
}
//#endregion

//#region Created
//#endregion
</script>
