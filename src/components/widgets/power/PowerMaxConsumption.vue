<template>
  <q-card class="shadow-0">
    <PowerWidgetSkeleton v-if="!powerData" />
    <component :is="ignorePadding ? 'div' : QCardSection" v-else>
      <div class="text-h5">
        {{ totalValue }} MW
      </div>
      <div class="text-h6">
        Max Consumption
      </div>
    </component>
  </q-card>
</template>

<script setup lang="ts">
import { useFRMEndpoint } from 'src/composables/frmEndpoint.ts';
import type { GetPowerResponse, PowerObject } from '@derpierre65/ficsit-remote-monitoring';
import { getTotalInfo } from 'src/utils/math.ts';
import PowerWidgetSkeleton from 'components/skeleton/power/PowerWidgetSkeleton.vue';
import { QCardSection } from 'quasar';

//#region Composable & Prepare
defineProps<{
  ignorePadding?: boolean;
}>();

const powerData = useFRMEndpoint<GetPowerResponse>('getPower');
//#endregion

//#region Data
//#endregion

//#region Computed
const totalValue = getTotalInfo<PowerObject>(powerData, 'PowerMaxConsumed');
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
