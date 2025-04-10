<template>
  <div class="tw-w-full tw-max-w-screen-xl tw-mx-auto tw-space-y-4">
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
      <StorageInventory
        v-if="inventoryTypes.includes('cloud') && cloudInventory"
        v-bind="cloudInventory.props"
      />

      <StorageInventory
        v-for="inventory in filteredStorageInventories"
        :key="inventory.ID"
        v-bind="inventory.props"
      />
    </div>

    <AppAlert v-if="hiddenInventories" type="info" text>
      {{ hiddenInventories }} Inventories hidden.
    </AppAlert>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { usePausableFRMEndpoint } from 'src/composables/frmEndpoint';
import {
  GetCloudInvResponse,
  GetPlayerResponse,
  GetStorageInvResponse,
  GetTrainStationResponse,
  PlayerObject,
  InventoryItemObject,
} from '@derpierre65/ficsit-remote-monitoring';
import StorageInventory from 'components/inventory/StorageInventory.vue';
import useServerStore from 'stores/server';
import AppAlert from 'components/AppAlert.vue';

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
  {
    label: 'Train Stations',
    value: 'trainStations',
  },
];
const hideEmptyInventories = ref(false);
const inventoryTypes = ref(selectableInventoryTypes.map((type) => type.value));
//#endregion

//#region Computed
const storageInventories = computed(() => {
  if (!inventoryTypes.value.includes('storages')) {
    return [];
  }

  return inventoryEndpoints.storages.data.map((storage) => {
    return {
      ID: storage.ID,
      props: {
        name: storage.Name,
        image: serverStore.getItemUrl(storage.ClassName),
        location: storage.location,
        inventory: storage.Inventory,
      },
    };
  });
});

const trainStationInventories = computed(() => {
  if (!inventoryTypes.value.includes('trainStations')) {
    return [];
  }

  return inventoryEndpoints.trainStations.data
    .map((trainStation) => {
      return {
        ID: trainStation.ID,
        props: {
          name: trainStation.Name,
          image: serverStore.getItemUrl(trainStation.ClassName),
          location: trainStation.location,
          inventory: Object.values(trainStation.CargoInventory.reduce((items, cargoInventory) => {
            for (const item of cargoInventory.Inventory) {
              if (typeof items[item.ClassName] === 'undefined') {
                items[item.ClassName] = {
                  ...item,
                };
              }
              else {
                items[item.ClassName]!.Amount += item.Amount;
              }
            }

            return items;
          }, {} as Record<string, InventoryItemObject>)),
        },
      };
    })
    .filter(Boolean);
});

const playerInventories = computed(() => {
  if (!inventoryTypes.value.includes('players')) {
    return [];
  }

  return inventoryEndpoints.players.data.map((player: PlayerObject) => {
    return {
      ID: player.ID,
      props: {
        name: player.Name,
        image: serverStore.getItemUrl('Desc_Helmet_Default_C'),
        location: player.location,
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

const inventories = computed(() => {
  return [
    ...playerInventories.value,
    ...storageInventories.value,
    ...trainStationInventories.value,
  ];
});

const filteredStorageInventories = computed(() => {
  return hideEmptyInventories.value ? inventories.value.filter((inventory) => {
    return inventory.props.inventory.length > 0;
  }) : inventories.value;
});

const hiddenInventories = computed(() => {
  return inventories.value.length - filteredStorageInventories.value.length;
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
