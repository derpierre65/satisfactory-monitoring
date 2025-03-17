<template>
  <div class="tw-w-full tw-max-w-screen-xl tw-mx-auto">
    <div class="flex tw-justify-end tw-gap-4 q-mb-md">
      <q-toggle v-model="hideEmptyInventories" label="Hide empty inventories" />
      <q-select
        v-model="inventoryTypes"
        :options="selectableInventoryTypes"
        label="Inventory Types"
        class="tw-min-w-[300px]"
        emit-value
        map-options
        multiple
      />
    </div>
    <div class="tw-grid md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4 tw-gap-4">
      <StorageInventory v-if="cloudInventory" v-bind="cloudInventory.props" />

      <StorageInventory
        v-for="inventory in playerInventories"
        :key="inventory.ID"
        v-bind="inventory.props"
      />
      <StorageInventory
        v-for="inventory in filteredStorageInventories"
        :key="inventory.ID"
        v-bind="inventory.props"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { usePausableFRMEndpoint } from 'src/composables/frmEndpoint';
import {
  GetCloudInvResponse,
  GetPlayerResponse,
  GetStorageInvResponse,
  PlayerObject,
  StorageInvObject,
} from '@derpierre65/ficsit-remote-monitoring';
import StorageInventory from 'components/inventory/StorageInventory.vue';
import { getEntityLocation } from 'src/utils/map';
import useServerStore from 'stores/server';

//#region Composable & Prepare
const serverStore = useServerStore();
const inventoryEndpoints = {
  storages: reactive(usePausableFRMEndpoint<GetStorageInvResponse>('getStorageInv')),
  players: reactive(usePausableFRMEndpoint<GetPlayerResponse>('getPlayer')),
  cloud: reactive(usePausableFRMEndpoint<GetCloudInvResponse>('getCloudInv')),
};
//#endregion

//#region Data
const hideEmptyInventories = ref(false);
const inventoryTypes = ref([
  'storages',
  'players',
  'cloud',
]);
const selectableInventoryTypes = [
  {
    label: 'Storages',
    value: 'storages',
  },
  {
    label: 'Players',
    value: 'players',
  },
  {
    label: 'Cloud Inventory',
    value: 'cloud',
  },
];
//#endregion

//#region Computed
const storageInventories = computed(() => {
  return inventoryEndpoints.storages.data.map((storage: StorageInvObject) => {
    return {
      ID: storage.ID,
      props: {
        name: storage.Name,
        image: serverStore.getItemUrl(storage.ClassName),
        location: getEntityLocation(storage),
        inventory: storage.Inventory,
      },
    };
  });
});

const playerInventories = computed(() => {
  return inventoryEndpoints.players.data.map((player: PlayerObject) => {
    return {
      ID: player.ID,
      props: {
        name: player.Name,
        image: serverStore.getItemUrl('Desc_Helmet_Default_C'),
        location: getEntityLocation(player),
        inventory: player.Inventory,
      },
    };
  });
});

const cloudInventory = computed(() => {
  const cloudInventoryItems = inventoryEndpoints.cloud.data.filter((item) => item.Amount);
  if (cloudInventoryItems.length === 0) {
    return null;
  }

  return {
    ID: 0,
    props: {
      name: 'Cloud Inventory',
      image: serverStore.getItemUrl('Desc_CentralStorage_C'),
      inventory: cloudInventoryItems,
    },
  };
});

const filteredStorageInventories = computed(() => {
  return hideEmptyInventories.value ? storageInventories.value.filter((inventory) => {
    return inventory.props.inventory.length > 0;
  }) : storageInventories.value;
});
//#endregion

//#region Watch
watch(inventoryTypes, () => {
  const keys = Object.keys(inventoryEndpoints) as Array<keyof typeof inventoryEndpoints>;
  for (const key of keys) {
    if (!inventoryEndpoints[key]) {
      continue;
    }

    inventoryEndpoints[key][inventoryTypes.value.includes(key) ? 'resume' : 'pause']();
  }
});
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
//#endregion

//#region Created
//#endregion
</script>
