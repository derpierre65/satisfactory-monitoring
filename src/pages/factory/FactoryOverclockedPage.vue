<template>
  <div class="tw-flex-auto tw-flex tw-flex-col tw-gap-4">
    <div class="tw-flex tw-gap-2 justify-end">
      <q-select
        v-model="filter"
        :options="filterOptions"
        class="tw-flex-auto tw-max-w-[400px]"
        label="Overclocking Type"
        multiple
        map-options
        emit-value
      />
    </div>

    <AppAlert v-if="filteredFactories.length" type="info" text>
      <div>Found {{ filteredFactories.length }} machines.</div>
      <div v-if="powerShards">
        Found {{ powerShards }} Power Shards.
      </div>
      <div v-if="somersloops">
        Found {{ somersloops }} Somersloops.
      </div>
    </AppAlert>
    <AppAlert v-else type="success" text>
      No factories found.
    </AppAlert>

    <div class="tw-flex-auto">
      <div class="tw-grid tw-grid-cols-8 tw-gap-2">
        <q-card v-for="factory in filteredFactories" :key="factory.ID" class="no-shadow tw-space-y-2 relative-position">
          <div class="absolute-top-right tw-top-2 tw-right-2 tw-space-x-1">
            <MapShowLocation :entities="[factory.locationEntity]" />
          </div>
          <div class="text-center">
            <img
              :src="serverStore.getItemUrl(factory.ClassName)"
              :alt="factory.Name"
              class="q-mx-auto"
              width="96px"
            >
          </div>
          <div class="tw-flex tw-gap-2 justify-center items-center q-pb-md">
            <ItemSlot
              v-if="factory.PowerShards"
              :item="{
                ClassName: 'Desc_CrystalShard_C',
                Amount: factory.PowerShards,
                MaxAmount: 3,
                Name: 'Power Shards',
              }"
              :size="48"
            />
            <ItemSlot
              v-if="factory.Somersloops"
              :item="{
                ClassName: 'Desc_WAT1_C',
                Amount: factory.Somersloops,
                MaxAmount: 0,
                Name: 'Somersloops',
              }"
              :size="48"
            />
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFRMEndpoint } from 'src/composables/frmEndpoint';
import { Endpoint, GetFactoryResponse, GetGeneratorsResponse } from '@derpierre65/ficsit-remote-monitoring';
import { computed, ref } from 'vue';
import useServerStore from 'stores/server';
import AppAlert from 'components/AppAlert.vue';
import MapShowLocation from 'components/map/MapShowLocation.vue';
import ItemSlot from 'components/ItemSlot.vue';
import { getEntityLocation } from 'src/utils/map';

//#region Composable & Prepare
const factories = useFRMEndpoint<GetFactoryResponse>(Endpoint.GetFactory, {
  fetchEvery: 5_000,
});
const generators = useFRMEndpoint<GetGeneratorsResponse>(Endpoint.GetGenerators, {
  fetchEvery: 5_000,
});
const serverStore = useServerStore();
//#endregion

//#region Data
const filter = ref([
  'PowerShards',
  'Somersloops',
]);
//#endregion

//#region Computed
const filterOptions = computed(() => {
  return [
    {
      label: 'Power Shards',
      value: 'PowerShards',
    },
    {
      label: 'Somersloops',
      value: 'Somersloops',
    },
  ];
});
const machines = computed(() => {
  return [
    ...factories.value || [],
    ...generators.value || [],
  ];
});
const powerShards = computed(() => {
  return filteredFactories.value.reduce((previous, factory) => previous + factory.PowerShards, 0);
});
const somersloops = computed(() => {
  return filteredFactories.value.reduce((previous, factory) => previous + factory.Somersloops, 0);
});
const filteredFactories = computed(() => {
  return machines.value
    .filter((factory) => {
      for (const key of filter.value) {
        if (factory[key] > 0) {
          return true;
        }
      }

      return false;
    })
    .map((factory) => {
      return {
        ...factory,
        locationEntity: {
          ID: factory.ID,
          mapLocation: getEntityLocation(factory),
          location: factory.location,
          image: serverStore.getItemUrl(factory.ClassName),
          name: factory.Name,
        },
      };
    });
});
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
//#endregion

//#region Created
//#endregion
</script>
