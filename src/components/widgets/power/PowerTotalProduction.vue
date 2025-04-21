<template>
  <q-card class="shadow-0">
    <PowerWidgetSkeleton v-if="!powerData" />
    <component :is="ignorePadding ? 'div' : QCardSection" v-else>
      <div class="text-h5">
        <span>{{ totalPowerProduction }}<q-tooltip>Production</q-tooltip></span>
        <span>/</span>
        <span>{{ totalPowerCapacity }}<q-tooltip>Capacity</q-tooltip></span>
        MW
      </div>
      <div class="text-h6">
        Total Production
      </div>
    </component>

    <q-tooltip>
      <div v-for="group in groupedPower" :key="group.className" class="tw-flex tw-items-center">
        <div class="tw-w-16 tw-h-16">
          <img
            :src="serverStore.getItemUrl(group.className)"
          >
        </div>

        <span class="tw-text-base">{{ formatNumber(group.total, 2) }}<span v-if="group.totalPotential !== group.total">/{{ formatNumber(group.totalPotential) }}</span> MW</span>
      </div>
    </q-tooltip>
  </q-card>
</template>

<script setup lang="ts">
import { useFRMEndpoint } from 'src/composables/frmEndpoint';
import type { GetPowerResponse, PowerObject } from '@derpierre65/ficsit-remote-monitoring';
import { getTotalInfo } from 'src/utils/math';
import PowerWidgetSkeleton from 'components/skeleton/power/PowerWidgetSkeleton.vue';
import { QCardSection } from 'quasar';
import { usePowerInformation } from 'src/composables/game/power';
import useServerStore from 'stores/server';
import { formatNumber } from 'src/utils/helpers/number';

//#region Composable & Prepare
defineProps<{
  ignorePadding?: boolean;
}>();

const serverStore = useServerStore();
const powerData = useFRMEndpoint<GetPowerResponse>('getPower');
const groupedPower = usePowerInformation();
//#endregion

//#region Data
//#endregion

//#region Computed
const totalPowerProduction = getTotalInfo<PowerObject>(powerData, 'PowerProduction');
const totalPowerCapacity = getTotalInfo<PowerObject>(powerData, 'PowerCapacity');
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
