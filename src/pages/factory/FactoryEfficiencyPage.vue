<template>
  <div class="q-gutter-y-md">
    <q-select
      v-model="factoryFilter"
      :options="factoryTypes"
      label="Factory Type"
      hint="Empty for all types"
      multiple
      map-options
      emit-value
    />

    <AppAlert type="warning" text>
      Found {{ filteredFactories.length }} factories with productivity lower than 100%.
    </AppAlert>

    <div class="tw-grid tw-grid-cols-8 tw-gap-2">
      <q-card v-for="factory in pagedFactories" :key="factory.ID" class="no-shadow">
        <q-card-section class="tw-flex">
          <q-img
            :src="serverStore.getItemUrl(factory.ClassName)"
            width="32px"
            no-spinner
          />
          <span>{{ factory.Productivity.toFixed(2) }}%</span>
          <q-space />
          <MapShowLocation :entities="[factory.locationEntity]" />
        </q-card-section>
        <div class="tw-flex tw-gap-2 justify-center items-center q-pb-md">
          <div class="tw-flex">
            <div v-for="ingredient in factory.ingredients" :key="ingredient.ClassName" class="tw-w-8 tw-h-8">
              <img
                :src="serverStore.getItemUrl(ingredient.ClassName)"
                :alt="ingredient.Name"
                class="full-width full-height"
              >
              <q-tooltip>
                <span>{{ ingredient.ConsPercent.toFixed(2) }}%</span>
              </q-tooltip>
            </div>
          </div>
          <i class="fas fa-arrow-right" />
          <div class="tw-flex">
            <div v-for="ingredient in factory.production" :key="ingredient.ClassName" class="tw-w-8 tw-h-8">
              <img
                :src="serverStore.getItemUrl(ingredient.ClassName)"
                :alt="ingredient.Name"
                class="full-width full-height"
              >
              <q-tooltip>
                <span>{{ ingredient.ProdPercent.toFixed(2) }}%</span>
              </q-tooltip>
            </div>
          </div>
        </div>
      </q-card>
    </div>

    <div v-if="pages" class="flex justify-center">
      <q-pagination
        v-model="page"
        :max="pages"
        :max-pages="10"
        direction-links
        boundary-links
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFRMEndpoint } from 'src/composables/frmEndpoint';
import { Building, Endpoint, GetFactoryResponse } from '@derpierre65/ficsit-remote-monitoring';
import { computed, ref, watchEffect } from 'vue';
import { getEntityLocation } from 'src/utils/map';
import useServerStore from 'stores/server';
import AppAlert from 'components/AppAlert.vue';
import MapShowLocation from 'components/map/MapShowLocation.vue';
import { formatNumber } from 'src/utils/helpers/number';

//#region Composable & Prepare
const factories = useFRMEndpoint<GetFactoryResponse>(Endpoint.GetFactory, {
  fetchEvery: 5_000,
});
const serverStore = useServerStore();
//#endregion

//#region Data
const factoryFilter = ref([]);
const page = ref(1);
const itemsPerPage = ref(50);
//#endregion

//#region Computed
const factoryTypes = computed(() => {
  return [
    {
      label: 'Biomass Burner',
      value: Building.BiomassBurner,
    },
    {
      label: 'Coal Generator',
      value: Building.CoalGenerator,
    },
    {
      label: 'Fuel Generator',
      value: Building.FuelGenerator,
    },
    {
      label: 'Geothermal Generator',
      value: Building.GeothermalGenerator,
    },
    {
      label: 'Smelter',
      value: Building.Smelter,
    },
    {
      label: 'Constructor',
      value: Building.Constructor,
    },
    {
      label: 'Foundry',
      value: Building.Foundry,
    },
    {
      label: 'Manufacturer',
      value: Building.Manufacturer,
    },
    {
      label: 'Refinery',
      value: Building.Refinery,
    },
    {
      label: 'Packager',
      value: Building.Packager,
    },
    {
      label: 'Blender',
      value: Building.Blender,
    },
    {
      label: 'Particle Accelerator',
      value: Building.ParticleAccelerator,
    },
  ];
});

const pages = computed(() => {
  return Math.ceil(filteredFactories.value.length / itemsPerPage.value);
});
const pagedFactories = computed(() => {
  return filteredFactories.value.slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value);
});
const filteredFactories = computed(() => {
  const filtered = (factories.value || []).filter((factory) => {
    if (factoryFilter.value.length && !factoryFilter.value.some((value) => value === factory.ClassName)) {
      return false;
    }

    return factory.Productivity < 100 && factory.PowerInfo.PowerConsumed > 0;
  }).map((factory) => {
    return {
      ...factory,
      locationEntity: {
        ID: factory.ID,
        location: getEntityLocation(factory),
        image: serverStore.getItemUrl(factory.ClassName),
        name: factory.Name + ` (${formatNumber(factory.Productivity)}%)`,
      },
    };
  });

  filtered.sort((a, b) => a.Productivity - b.Productivity);
  return filtered;
});
//#endregion

//#region Watch
watchEffect(() => {
  if (page.value > pages.value) {
    page.value = Math.max(1, pages.value - 1);
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
