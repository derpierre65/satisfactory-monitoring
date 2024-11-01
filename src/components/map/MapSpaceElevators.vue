<template>
  <LMarker v-for="entity of entities" :key="entity.ID" :lat-lng="getEntityLocation(entity)">
    <LIcon :icon-size="[32, 32]" icon-url="/assets/map/space_elevator.png" />
    <LTooltip :content="entity.Name" />
    <LPopup class="tw-min-w-[150px]">
      <div v-for="item in entity.CurrentPhase" :key="item.ClassName" class="tw-flex tw-items-center tw-gap-2">
        <q-img
          :src="serverStore.getItemUrl(item.ClassName)"
          width="32px"
          height="32px"
          :alt="item.Name"
        >
          <q-tooltip>
            {{ item.Name }}
          </q-tooltip>
        </q-img>

        <span :class="item.RemainingCost > 0 ? '' : 'tw-text-green-600'">{{ item.Amount }}/{{ item.TotalCost }}</span>
      </div>
    </LPopup>
  </LMarker>
</template>

<script setup lang="ts">
import { LIcon, LMarker, LPopup, LTooltip } from '@vue-leaflet/vue-leaflet';
import { SpaceElevatorObject } from '@derpierre65/ficsit-remote-monitoring';
import { getEntityLocation } from 'src/utils/map.ts';
import useServerStore from 'stores/server.ts';

defineProps<{
  entities: SpaceElevatorObject[];
}>();

const serverStore = useServerStore();
</script>
