<template>
  <MapMarker
    v-for="entity of entities"
    :key="entity.ID"
    :lat-lng="getEntityLocation(entity)"
    :tooltip="entity.Name"
    image="/assets/map/space_elevator.png"
  >
    <template #popup>
      <div v-for="item in entity.CurrentPhase" :key="item.ClassName" class="tw-flex tw-items-center tw-gap-2">
        <q-img
          :src="serverStore.getItemUrl(item.ClassName)"
          :alt="item.Name"
          width="32px"
          height="32px"
        >
          <q-tooltip>
            {{ item.Name }}
          </q-tooltip>
        </q-img>

        <span :class="item.RemainingCost > 0 ? '' : 'tw-text-green-600'">{{ item.Amount }}/{{ item.TotalCost }}</span>
      </div>
    </template>
  </MapMarker>
</template>

<script setup lang="ts">
import { SpaceElevatorObject } from '@derpierre65/ficsit-remote-monitoring';
import { getEntityLocation } from 'src/utils/map.ts';
import useServerStore from 'stores/server.ts';
import MapMarker from 'components/map/MapMarker.vue';

defineProps<{
  entities: SpaceElevatorObject[];
}>();

const serverStore = useServerStore();
</script>
