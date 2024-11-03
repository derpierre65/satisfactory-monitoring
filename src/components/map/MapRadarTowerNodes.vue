<template>
  <MapStaticMarker
    v-for="node in entities"
    :key="node.ID"
    :entity="node"
    :icon-url="serverStore.getItemUrl(node.ClassName)"
    :icon-classes="getRadarTowerNodeClass(node)"
  >
    <template #icon>
      <q-icon v-if="node.Exploited" name="fas fa-check" class="absolute tw-bottom-1 tw-right-1" />
    </template>
  </MapStaticMarker>
</template>

<script setup lang="ts" generic="T extends Omit<ResourceNodeObject, 'features'>">
import { ResourceNodeObject, ResourceNodePurity } from '@derpierre65/ficsit-remote-monitoring';
import useServerStore from 'stores/server.ts';
import MapStaticMarker from 'components/map/MapStaticMarker.vue';

defineProps<{
  entities: T[];
}>();

const serverStore = useServerStore();

function getRadarTowerNodeClass(entity: T) {
  if (entity.EnumPurity === ResourceNodePurity.Impure) {
    return 'tw-bg-red-500 tw-rounded-full';
  }

  if (entity.EnumPurity === ResourceNodePurity.Normal) {
    return 'tw-bg-orange-500 tw-rounded-full';
  }

  return 'tw-bg-green-500 tw-rounded-full';
}
</script>
