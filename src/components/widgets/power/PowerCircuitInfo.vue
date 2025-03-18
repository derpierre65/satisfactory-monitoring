<template>
  <q-card class="shadow-0">
    <q-card-section>
      <div class="flex q-mb-sm">
        <q-skeleton v-if="!circuit" height="24px" width="200px" class="q-my-xs" />
        <div v-else class="text-h6 flex items-center tw-gap-1">
          <MapShowLocation
            v-if="circuitFactories.length"
            :entities="circuitFactories"
            :title="`Power Circuit #${circuit.CircuitGroupID}`"
          />
          <span>Power Circuit #{{ circuit.CircuitGroupID }}</span>
        </div>
        <q-space />
        <div>
          <q-skeleton v-if="!circuit" type="QChip" width="120px" height="28px" />
          <q-badge
            v-else-if="!circuit.FuseTriggered"
            class="!tw-bg-green-500 tw-text-green-500 !tw-bg-opacity-10 tw-px-3 tw-text-base"
            rounded
          >
            <q-icon name="fa fa-check" />
            <span class="q-pl-xs">All Good</span>
          </q-badge>
          <q-badge
            v-else
            class="!tw-bg-red-500 tw-text-red-500 !tw-bg-opacity-10 tw-px-3 tw-text-base"
            rounded
          >
            <q-icon name="fa fa-bolt" />
            <span class="q-pl-xs">Fuse Blown</span>
          </q-badge>
        </div>
      </div>

      <div class="tw-grid md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4">
        <q-card class="shadow-0 tw-bg-neutral-950">
          <q-card-section>
            <q-skeleton v-if="!circuit" height="24px" class="q-my-xs" />
            <div v-else class="text-h6">
              <span>{{ formatNumber(circuit.PowerCapacity) }} MW</span>
            </div>
            <span class="text-caption">Power Capacity</span>
          </q-card-section>
        </q-card>
        <q-card class="shadow-0 tw-bg-neutral-950">
          <q-card-section>
            <q-skeleton v-if="!circuit" height="24px" class="q-my-xs" />
            <div v-else class="text-h6">
              <span>{{ formatNumber(circuit.PowerProduction) }} MW</span>
            </div>
            <span class="text-caption">Power Production</span>
          </q-card-section>
        </q-card>
        <q-card class="shadow-0" :class="circuitLoadColor">
          <q-card-section>
            <q-skeleton v-if="!circuit" height="24px" class="q-my-xs" />
            <div v-else class="text-h6">
              <span>{{ formatNumber(circuit.PowerConsumed) }} MW ({{ formatNumber(circuitLoad) }}%)</span>
            </div>
            <span class="text-caption">Current consumption</span>
          </q-card-section>
        </q-card>
        <q-card class="shadow-0 tw-bg-neutral-950">
          <q-card-section>
            <q-skeleton v-if="!circuit" height="24px" class="q-my-xs" />
            <div v-else class="text-h6">
              <span>{{ formatNumber(circuit.PowerMaxConsumed) }} MW</span>
            </div>
            <span class="text-caption">Max consumption</span>
          </q-card-section>
        </q-card>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="flex q-mb-sm">
        <div class="text-h6">
          <span>Battery</span>
        </div>
        <q-space />
        <div v-if="!circuit || circuit.BatteryCapacity">
          <q-skeleton v-if="!circuit" type="QChip" width="120px" height="28px" />
          <q-badge
            v-else-if="circuit.BatteryPercent === 100"
            class="!tw-bg-green-500 tw-text-green-500 !tw-bg-opacity-10 tw-text-base tw-px-3"
            rounded
          >
            <q-icon name="fa fa-battery-full" />
            <span class="q-pl-xs">Battery full</span>
          </q-badge>
          <q-badge
            v-else
            class="!tw-bg-green-500 tw-text-green-500 !tw-bg-opacity-10 tw-text-base tw-px-3"
            rounded
          >
            <q-icon v-if="circuit.BatteryPercent < 25" name="fa fa-battery-empty" />
            <q-icon v-else-if="circuit.BatteryPercent < 50" name="fa fa-battery-quarter" />
            <q-icon v-else-if="circuit.BatteryPercent < 75" name="fa fa-battery-half" />
            <q-icon v-else-if="circuit.BatteryPercent < 100" name="fa fa-battery-three-quarters" />
            <span class="q-pl-xs">Battery charging</span>
          </q-badge>
        </div>
      </div>
      <div v-if="!circuit || circuit.BatteryCapacity" class="tw-grid md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4">
        <q-card class="shadow-0 tw-bg-neutral-950">
          <q-card-section>
            <q-skeleton v-if="!circuit" height="24px" class="q-my-xs" />
            <div v-else class="text-h6">
              <span>{{ formatNumber(circuit.BatteryCapacity) }} MWh</span>
            </div>
            <span class="text-caption">Battery Capacity</span>
          </q-card-section>
        </q-card>
        <q-card class="shadow-0 tw-bg-neutral-950">
          <q-card-section>
            <q-skeleton v-if="!circuit" height="24px" class="q-my-xs" />
            <div v-else class="text-h6">
              <span>{{ formatNumber(circuit.BatteryPercent) }}%</span>
            </div>
            <span class="text-caption">Battery Percent</span>
          </q-card-section>
        </q-card>
        <q-card class="shadow-0 tw-bg-neutral-950">
          <q-card-section>
            <q-skeleton v-if="!circuit" height="24px" class="q-my-xs" />
            <div v-else class="text-h6">
              <span>{{ formatNumber(circuit.BatteryDifferential) }} MW</span>
            </div>
            <span class="text-caption">Battery Differential</span>
          </q-card-section>
        </q-card>
        <q-card v-if="!circuit || batteryTime" class="shadow-0 tw-bg-neutral-950">
          <q-card-section>
            <q-skeleton v-if="!circuit" height="24px" class="q-my-xs" />
            <div v-else class="text-h6">
              <span>{{ batteryTime }}</span>
            </div>
            <span v-if="!circuit || circuit.BatteryDifferential > 0" class="text-caption">Battery Full in</span>
            <span v-else-if="circuit.BatteryDifferential < 0" class="text-caption">Battery Empty in</span>
          </q-card-section>
        </q-card>
      </div>
      <AppAlert v-else type="warning" dense text>
        <template #icon>
          <span class="fa-stack">
            <i class="fa fa-battery-empty fa-stack-1x" />
            <i class="fa fa-slash fa-stack-1x" />
          </span>
        </template>
        No Battery connected.
      </AppAlert>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type {
  GetPowerUsageResponse,
  PowerObject,
} from '@derpierre65/ficsit-remote-monitoring';
import AppAlert from 'components/AppAlert.vue';
import { formatNumber } from 'src/utils/helpers/number';
import MapShowLocation from 'components/map/MapShowLocation.vue';
import { useFRMEndpoint } from 'src/composables/frmEndpoint';
import { getEntityLocation } from 'src/utils/map';
import useServerStore from 'stores/server';

//#region Composable & Prepare
const props = withDefaults(defineProps<{
  circuit?: PowerObject | null;
}>(), {
  circuit: null,
});

const serverStore = useServerStore();
const getPowerUsage = useFRMEndpoint<GetPowerUsageResponse>('getPowerUsage', {
  fetchEvery: 15_000,
});
//#endregion

//#region Data
//#endregion

//#region Computed
const batteryTime = computed(() => {
  if (!props.circuit) {
    return null;
  }

  if (props.circuit.BatteryDifferential > 0) {
    return props.circuit.BatteryTimeFull;
  }
  else if (props.circuit.BatteryDifferential < 0) {
    return props.circuit.BatteryTimeEmpty;
  }

  return null;
});
const circuitLoad = computed(() => {
  if (!props.circuit) {
    return 0;
  }

  const capacity = props.circuit.PowerCapacity;
  if (capacity === 0) {
    return 0;
  }

  return (props.circuit.PowerConsumed / capacity) * 100;
});
const circuitLoadColor = computed(() => {
  if (circuitLoad.value < 70) {
    return 'tw-bg-neutral-950';
  }
  if (circuitLoad.value < 80) {
    return 'bg-yellow-10';
  }
  if (circuitLoad.value < 90) {
    return 'bg-orange-10';
  }

  return 'bg-red-10';
});
const circuitFactories = computed(() => {
  if (!getPowerUsage.value || !props.circuit) {
    return [];
  }

  return getPowerUsage.value.filter((factory) => {
    return factory.PowerInfo.CircuitGroupID === props.circuit?.CircuitGroupID;
  }).map((factory) => {
    return {
      ID: factory.ID,
      name: factory.Name,
      location: getEntityLocation(factory),
      image: serverStore.getItemUrl(factory.ClassName),
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
