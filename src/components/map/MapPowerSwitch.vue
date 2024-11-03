<template>
  <MapStaticMarker
    :entity="entity"
    :icon-url="serverStore.getItemUrl(entity.ClassName)"
    :icon-classes="getPowerSwitchMapIconClasses(entity)"
  >
    <div class="tw-w-[250px] q-gutter-y-sm">
      <q-toggle :model-value="entity.IsOn" label="Status" @click="toggleSwitchStatus(entity)" />
      <q-input
        :model-value="entity.Name"
        label="Switch Name"
        class="tw-w-full"
        dark
        dense
        autofocus
        @change="updateSwitchName(entity, $event)"
      />
      <q-input
        v-if="entity.ClassName === Building.PriorityPowerSwitch"
        :model-value="entity.Priority"
        :min="0"
        :max="8"
        label="Priority"
        type="number"
        @change="updateSwitchPriority(entity, $event)"
      />
    </div>
  </MapStaticMarker>
</template>

<script setup lang="ts">
import MapStaticMarker from 'components/map/MapStaticMarker.vue';
import useServerStore from 'stores/server.ts';
import { getPowerSwitchMapIconClasses, toggleSwitchStatus, updateSwitchName, updateSwitchPriority } from 'src/utils/api/switches.ts';
import { Building, SwitchObject } from '@derpierre65/ficsit-remote-monitoring';

//#region Composable & Prepare
defineProps<{
  entity: SwitchObject;
}>();

const serverStore = useServerStore();

//#endregion

//#region Data
//#endregion

//#region Computed
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
