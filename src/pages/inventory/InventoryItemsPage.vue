<template>
  <div class="tw-space-y-4">
    <q-input v-model="search" type="text" :label="t('global.search')">
      <template #prepend>
        <i class="fas fa-search tw-text-sm" />
      </template>
    </q-input>

    <div class="tw-grid md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-10 tw-gap-4">
      <q-card v-for="item in filteredItems" :key="item.ClassName" class="no-shadow">
        <q-card-section class="flex tw-flex-col flex-center tw-gap-2 text-center">
          <div>
            <q-img :src="serverStore.getItemUrl(item.ClassName)" width="64px" no-spinner />
          </div>
          <div>{{ item.Name }}</div>
          <div class="tw-text-lg">
            {{ formatNumber(item.Amount) }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { usePausableFRMEndpoint } from 'src/composables/frmEndpoint';
import {
  GetCloudInvResponse,
  GetPlayerResponse,
  GetStorageInvResponse,
  GetTrainStationResponse,
  InventoryItemObject,
} from '@derpierre65/ficsit-remote-monitoring';
import useServerStore from 'stores/server';
import { useTranslation } from 'i18next-vue';
import { formatNumber } from 'src/utils/helpers/number';

//#region Composable & Prepare
const serverStore = useServerStore();
const { t, } = useTranslation();
const inventoryEndpoints = {
  storages: reactive(usePausableFRMEndpoint<GetStorageInvResponse>('getStorageInv')),
  players: reactive(usePausableFRMEndpoint<GetPlayerResponse>('getPlayer')),
  cloud: reactive(usePausableFRMEndpoint<GetCloudInvResponse>('getCloudInv')),
  trainStations: reactive(usePausableFRMEndpoint<GetTrainStationResponse>('getTrainStation')),
};
//#endregion

//#region Data
const search = ref('');
//#endregion

//#region Computed
const items = computed(() => {
  const finalItems = Object.create(null);

  for (const storage of inventoryEndpoints.storages.data) {
    addItems(finalItems, storage.Inventory);
  }
  for (const storage of inventoryEndpoints.players.data) {
    addItems(finalItems, storage.Inventory);
  }
  for (const station of inventoryEndpoints.trainStations.data) {
    for (const cargoInventory of station.CargoInventory) {
      addItems(finalItems, cargoInventory.Inventory);
    }
  }

  addItems(finalItems, inventoryEndpoints.cloud.data);

  return Object.keys(finalItems)
    .sort((a, b) => finalItems[b].Amount - finalItems[a].Amount)
    .map((key) => finalItems[key]);
});
const filteredItems = computed(() => {
  const searchString = search.value.toLowerCase();

  return items.value.filter((item) => item.Name.toLowerCase().includes(searchString));
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
