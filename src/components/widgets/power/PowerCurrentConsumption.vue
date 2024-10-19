<template>
  <q-card class="shadow-0">
    <PowerWidgetSkeleton v-if="!powerData" />
    <q-card-section v-else>
      <div class="text-h5">
        {{ totalValue }} MW
      </div>
      <div class="text-h6">
        Current Consumption
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useFRMEndpoint } from 'src/composables/frmEndpoint.ts';
import type { GetPowerResponse, PowerCircuitInformation } from '@derpierre65/ficsit-remote-monitoring';
import { getTotalInfo } from 'src/utils/math.ts';
import PowerWidgetSkeleton from 'components/skeleton/power/PowerWidgetSkeleton.vue';

//#region Composable & Prepare
const powerData = useFRMEndpoint<GetPowerResponse>('getPower');
//#endregion

//#region Data
//#endregion

//#region Computed
const totalValue = getTotalInfo<PowerCircuitInformation>(powerData, 'PowerConsumed');
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
