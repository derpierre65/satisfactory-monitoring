<template>
  <q-card class="shadow-0">
    <PowerWidgetSkeleton v-if="!powerData" />
    <q-card-section v-else-if="batteryTimeEmpty" :class="batteryTimeEmpty.color">
      <div class="text-h5">
        {{ batteryTimeEmpty.time }} (Circuit: {{ batteryTimeEmpty.circuitID }})
      </div>
      <div class="text-h6">
        First Battery Empty in
      </div>
    </q-card-section>
    <!-- class="bg-green-7" as setting in dashboard? -->
    <q-card-section v-else>
      <div class="text-h5">
        No discharging of the batteries
      </div>
      <div class="text-h6">
        First Battery Empty in
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFRMEndpoint } from 'src/composables/frmEndpoint.ts';
import type { GetPowerResponse } from '@derpierre65/ficsit-remote-monitoring';
import PowerWidgetSkeleton from 'components/skeleton/power/PowerWidgetSkeleton.vue';

//#region Composable & Prepare
const powerData = useFRMEndpoint<GetPowerResponse>('getPower');
//#endregion

//#region Data
//#endregion

//#region Computed
const batteryTimeEmpty = computed(() => {
  if (!powerData.value) {
    return null;
  }

  let maxTime = '';
  let circuitID = -1;
  for (const circuit of powerData.value) {
    if (circuit.BatteryCapacity === 0 || circuit.BatteryDifferential >= 0) {
      continue;
    }

    if (!maxTime || circuit.BatteryTimeEmpty < maxTime) {
      maxTime = circuit.BatteryTimeEmpty;
      circuitID = circuit.CircuitID;
    }
  }

  if (!maxTime || maxTime === '00:00:00') {
    return null;
  }

  let color = null;
  if (maxTime <= '00:05:00') {
    color = 'bg-red-7';
  }
  else if (maxTime <= '00:10:00') {
    color = 'bg-orange-7';
  }

  return {
    time: maxTime,
    color,
    circuitID,
  };
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
