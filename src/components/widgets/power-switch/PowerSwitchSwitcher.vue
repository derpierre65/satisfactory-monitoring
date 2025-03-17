<template>
  <div class="tw-flex tw-gap-2">
    <div class="tw-flex-auto tw-space-x-2">
      <q-icon name="fas fa-pencil" class="cursor-pointer">
        <q-tooltip>Rename</q-tooltip>
      </q-icon>
      <MapShowLocation
        :location="getEntityLocation(item)"
        :image="serverStore.getItemUrl('Desc_PriorityPowerSwitch_C')"
        :name
      />
      <span>{{ name }}</span>
    </div>
    <q-toggle :model-value="item.IsOn" @click="toggleSwitchStatus(item)" />
    <q-popup-edit v-slot="scope" :model-value="item.Name" auto-save @save="updateSwitchName(item, $event)">
      <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
    </q-popup-edit>
  </div>
</template>

<script setup lang="ts">
import { SwitchObject } from '@derpierre65/ficsit-remote-monitoring';
import { toggleSwitchStatus, updateSwitchName } from 'src/utils/api/switches.ts';
import MapShowLocation from 'components/map/MapShowLocation.vue';
import { getEntityLocation } from 'src/utils/map';
import { computed } from 'vue';
import useServerStore from 'stores/server';

const { item, } = defineProps<{
  item: SwitchObject;
}>();

const serverStore = useServerStore();

const name = computed(() => {
  return item.Name || 'Unnamed Switch';
});
</script>
