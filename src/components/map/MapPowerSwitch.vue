<template>
  <MapMarker
    :location="entity.location"
    :image="serverStore.getItemUrl(entity.ClassName)"
    :bg-color="entity.IsOn ? '#22c55e' : '#ef4444'"
    :tooltip="entity.Name"
    color="white"
  >
    <template #popup>
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
    </template>
  </MapMarker>
</template>

<script setup lang="ts">
import useServerStore from 'stores/server';
import { toggleSwitchStatus, updateSwitchName, updateSwitchPriority } from 'src/utils/api/switches';
import { Building, SwitchObject } from '@derpierre65/ficsit-remote-monitoring';
import MapMarker from 'components/map/MapMarker.vue';

defineProps<{
  entity: SwitchObject;
}>();

const serverStore = useServerStore();
</script>
