<template>
  <div class="tw-max-w-screen-xl tw-mx-auto tw-w-full">
    <q-input v-model="search" label="Search" class="q-mb-md" />

    <div class="tw-flex tw-gap-2 tw-w-full">
      <div class="tw-flex-auto tw-grid tw-grid-cols-4 tw-gap-2">
        <PowerSwitchGroup
          v-for="groupId in 8"
          :key="groupId"
          :group-id="groupId"
          :title="`Priority Group ${groupId}`"
          :switches="cachedPowerSwitches[groupId] || []"
        />
      </div>

      <div class="tw-w-1/5 tw-flex tw-flex-col tw-gap-2">
        <PowerSwitchGroup
          title="Priority Power Switches (Undefined)"
          :group-id="0"
          :switches="cachedPowerSwitches[0] || []"
        />
        <PowerSwitchGroup
          title="Power Switches"
          :switches="cachedPowerSwitches[-1] || []"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PowerSwitchGroup from 'components/widgets/power-switch/PowerSwitchGroup.vue';
import { useFRMEndpoint } from 'src/composables/frmEndpoint.ts';
import { useCacheComputed } from 'src/composables/computeds.ts';
import { GetSwitchesResponse, SwitchObject } from '@derpierre65/ficsit-remote-monitoring';

//#region Composable & Prepare
const powerSwitches = useFRMEndpoint<GetSwitchesResponse>('getSwitches');
//#endregion

//#region Data
const search = ref('');
//#endregion

//#region Computed
const cachedPowerSwitches = useCacheComputed({
  obj: powerSwitches,
  buildCache: (powerSwitch) => {
    return powerSwitch.ID + powerSwitch.Name + powerSwitch.IsOn + powerSwitch.Priority;
  },
  formatValues(data) {
    const searchValue = search.value.toLowerCase();

    return Object.groupBy(data.filter((powerSwitch) => {
      return (powerSwitch.Name || 'Unnamed Switch').toLowerCase().includes(searchValue);
    }), (s) => s.Priority) as Record<number, SwitchObject[]>;
  },
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
