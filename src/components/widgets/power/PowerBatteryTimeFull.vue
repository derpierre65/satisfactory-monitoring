<template>
  <q-card class="shadow-0">
    <PowerWidgetSkeleton v-if="!powerData" />
    <q-card-section v-else>
      <div class="text-h5">
        <span v-if="batteryTimeFull === null">No batteries available</span>
        <span v-else-if="batteryTimeFull">{{ batteryTimeFull }}</span>
        <span v-else>Batteries full</span>
      </div>
      <div class="text-h6">
        All Batteries full in
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
const batteryTimeFull = computed(() => {
  if (!powerData.value) {
    return null;
  }

  let maxTime = null;
  for (const circuit of powerData.value) {
    if (circuit.BatteryCapacity === 0 || circuit.BatteryDifferential < 0) {
      continue;
    }

    if (circuit.BatteryPercent === 100) {
      maxTime = '';
      continue;
    }

    if (!maxTime || circuit.BatteryTimeFull > maxTime) {
      maxTime = circuit.BatteryTimeFull;
    }
  }

  if (maxTime === null) {
    return null;
  }

  if (!maxTime || maxTime === '00:00:00') {
    return '';
  }

  return maxTime;
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
