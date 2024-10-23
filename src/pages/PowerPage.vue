<template>
  <AppAlert v-if="powerData && powerData.length === 0" type="info">
    It's sad, but you have no power circuits, go build something amazing.
  </AppAlert>
  <div v-else class="tw-mx-auto tw-max-w-screen-xl">
    <h6 class="text-h5 q-mb-xs">
      <span>Overview</span>
    </h6>
    <q-separator class="q-mb-md" />
    <div class="tw-grid tw-gap-4 md:tw-grid-cols-2 lg:tw-grid-cols-3">
      <PowerTotalProduction />
      <PowerCurrentConsumption />
      <PowerMaxConsumption />
      <PowerBatteryCapacity />
      <PowerBatteryTimeFull />
      <PowerBatteryFirstEmpty />
    </div>
    <h6 class="text-h5 q-mt-md q-mb-xs">
      <span>All Power Circuits</span>
    </h6>
    <q-separator class="q-mb-md" />

    <div class="flex q-mb-md">
      <q-space />
      <div class="q-gutter-x-sm">
        <q-toggle
          v-model="settings.ignoreLowLoad"
          label="Ignore power circuits with low load"
        />
        <q-toggle
          v-model="settings.onlyFuseBlown"
          label="Only Fuse Blown"
        />
        <q-toggle
          v-model="settings.hideEmpty"
          label="Hide Empty Circuits"
        />
      </div>
    </div>

    <div class="tw-space-y-4">
      <template v-if="!powerData">
        <PowerCircuitInfo v-for="circuit in 3" :key="circuit" />
      </template>
      <PowerCircuitInfo
        v-for="circuit of circuits"
        v-else
        :key="circuit.CircuitID"
        :circuit
      />

      <AppAlert v-if="powerData && hiddenCircuits" type="info" text>
        {{ hiddenCircuits }} Circuits hidden.
      </AppAlert>
    </div>
  </div>
</template>

<script setup lang="ts">

//#region Composable & Prepare
import { useFRMEndpoint } from 'src/composables/frmEndpoint.ts';
import type { GetPowerResponse } from '@derpierre65/ficsit-remote-monitoring';
import AppAlert from 'components/AppAlert.vue';
import PowerTotalProduction from 'components/widgets/power/PowerTotalProduction.vue';
import PowerCurrentConsumption from 'components/widgets/power/PowerCurrentConsumption.vue';
import PowerMaxConsumption from 'components/widgets/power/PowerMaxConsumption.vue';
import PowerBatteryCapacity from 'components/widgets/power/PowerBatteryCapacity.vue';
import PowerBatteryTimeFull from 'components/widgets/power/PowerBatteryTimeFull.vue';
import PowerBatteryFirstEmpty from 'components/widgets/power/PowerBatteryFirstEmpty.vue';
import PowerCircuitInfo from 'components/widgets/power/PowerCircuitInfo.vue';
import { computed, ref } from 'vue';

const powerData = useFRMEndpoint<GetPowerResponse>('getPower');
//#endregion

//#region Data
const settings = ref({
  onlyFuseBlown: false,
  hideEmpty: false,
  ignoreLowLoad: false,
});
//#endregion

//#region Computed
const circuits = computed(() => {
  let circuits = powerData.value!;
  if (settings.value.onlyFuseBlown) {
    circuits = circuits.filter((circuit) => circuit.FuseTriggered);
  }

  if (settings.value.hideEmpty) {
    circuits = circuits.filter((circuit) => {
      return circuit.PowerMaxConsumed > 0 || circuit.BatteryCapacity > 0;
    });
  }

  if (settings.value.ignoreLowLoad) {
    circuits = circuits.filter((circuit) => {
      if (circuit.PowerCapacity === 0) {
        return false;
      }

      return (circuit.PowerConsumed / circuit.PowerCapacity) * 100 > 70;
    });
  }

  return circuits;
});
const hiddenCircuits = computed(() => {
  return powerData.value!.length - circuits.value.length;
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
