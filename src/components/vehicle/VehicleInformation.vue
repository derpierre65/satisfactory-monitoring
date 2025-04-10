<template>
  <q-card class="no-shadow">
    <q-card-section>
      <div class="q-mx-auto tw-w-24 tw-h-24">
        <img
          :src="serverStore.getItemUrl(vehicle.ClassName)"
          :alt="vehicle.Name"
        >
        <q-tooltip>{{ vehicle.Name }}</q-tooltip>
      </div>

      <div class="tw-space-x-1">
        <q-badge class="!tw-bg-blue-500 tw-text-blue-500 !tw-bg-opacity-10" rounded>
          {{ vehicle.Autopilot ? t('vehicles.autopilot') : t('vehicles.manual') }}
        </q-badge>
        <q-badge
          v-if="!vehicle.HasFuel"
          class="!tw-bg-red-500 tw-text-red-500 !tw-bg-opacity-10"
          :label="t('vehicles.cars.no_fuel')"
          rounded
        />
        <q-badge
          v-if="vehicle.TotalFuelEnergy > 100 && !vehicle.HasFuelForRoundtrip"
          class="!tw-bg-orange-500 tw-text-orange-500 !tw-bg-opacity-10"
          :label="t('vehicles.cars.almost_empty')"
          rounded
        />
      </div>

      <ul class="q-mt-sm">
        <li>
          <span>
            <i class="fas fa-tachometer-alt" /> {{ formatNumber(Math.abs(vehicle.ForwardSpeed)) }} km/h
            <q-tooltip>{{ t('vehicles.speed') }}</q-tooltip>
          </span>
        </li>
        <li>
          <span>
            <i class="fas fa-gear" /> {{ vehicle.CurrentGear }}
            <q-tooltip>{{ t('vehicles.gear') }}</q-tooltip>
          </span>
        </li>
        <li>
          <span>
            <i class="fas fa-rotate-right" /> {{ formatNumber(vehicle.EngineRPM, 0) }} RPM
            <q-tooltip>{{ t('vehicles.engine_rpm') }}</q-tooltip>
          </span>
        </li>
        <li v-if="supportFuel && vehicle.HasFuel">
          <span>
            <i class="fas fa-bolt" /> {{ formatNumber(vehicle.TotalFuelEnergy, 0) }} MJ
            <q-tooltip>{{ t('vehicles.energy') }}</q-tooltip>
          </span>
        </li>
        <li v-if="supportFuel" :class="{'tw-text-orange-500': !vehicle.HasFuelForRoundtrip && vehicle.HasFuel, 'tw-text-red-500': !vehicle.HasFuel}">
          <span>
            <i class="fas fa-gas-pump" /> {{ fuel }}
            <q-tooltip>{{ t('vehicles.fuel') }}</q-tooltip>
          </span>
        </li>
      </ul>
    </q-card-section>
    <div class="absolute-top-right tw-top-2 tw-right-2 tw-space-x-1">
      <MapShowLocation :entities="[location]" />
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { VehiclesObject } from '@derpierre65/ficsit-remote-monitoring';
import useServerStore from 'stores/server';
import { formatNumber } from 'src/utils/helpers/number';
import MapShowLocation from 'components/map/MapShowLocation.vue';
import { computed } from 'vue';
import { getEntityLocation } from 'src/utils/map';
import { useTranslation } from 'i18next-vue';

//#region Composable & Prepare
const { vehicle, } = defineProps<{
  vehicle: VehiclesObject;
}>();

const { t, } = useTranslation();
const serverStore = useServerStore();
//#endregion

//#region Data
//#endregion

//#region Computed
const location = computed(() => ({
  ID: vehicle.ID,
  location: vehicle.location,
  mapLocation: getEntityLocation(vehicle),
  image: serverStore.getItemUrl(vehicle.ClassName),
  name: `${vehicle.Name}`,
}));

const supportFuel = computed(() => vehicle.ClassName !== 'BP_Golfcart_C');

const fuel = computed(() => {
  const fuel = vehicle.FuelInventory[0];
  if (vehicle.HasFuel && !vehicle.HasFuelForRoundtrip) {
    return t('vehicles.cars.not_enough_for_roundtrip');
  }
  if (!fuel) {
    return t('vehicles.cars.no_fuel');
  }

  return `${fuel.Name} (${fuel.Amount})`;
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
