<template>
  <div class="tw-flex-auto tw-flex tw-flex-col tw-gap-4">
    <template v-if="autopilotVehicles.length">
      <h3 class="text-h6 tw-flex tw-gap-1 items-center">
        <q-badge>{{ autopilotVehicles.length }}</q-badge>
        <span>{{ t('vehicles.cars.title_autopilot') }}</span>
      </h3>
      <div class="tw-grid tw-grid-cols-5 tw-gap-4">
        <VehicleInformation v-for="vehicle in autopilotVehicles" :key="vehicle.ID" :vehicle />
      </div>
    </template>

    <template v-if="manualVehicles.length">
      <h3 class="text-h6 tw-flex tw-gap-1 items-center">
        <q-badge>{{ manualVehicles.length }}</q-badge>
        <span>{{ t('vehicles.cars.title_manual') }}</span>
      </h3>
      <div class="tw-grid tw-grid-cols-5 tw-gap-4">
        <VehicleInformation v-for="vehicle in manualVehicles" :key="vehicle.ID" :vehicle />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">

import { useFRMEndpoint } from 'src/composables/frmEndpoint';
import { Endpoint, GetVehiclesResponse } from '@derpierre65/ficsit-remote-monitoring';
import { computed } from 'vue';
import VehicleInformation from 'components/vehicle/VehicleInformation.vue';
import { useTranslation } from 'i18next-vue';

const vehicles = useFRMEndpoint<GetVehiclesResponse>(Endpoint.GetVehicles);
const { t, } = useTranslation();

const autopilotVehicles = computed(() => vehicles.value.filter((vehicle) => vehicle.Autopilot));
const manualVehicles = computed(() => vehicles.value.filter((vehicle) => !vehicle.Autopilot));
</script>
