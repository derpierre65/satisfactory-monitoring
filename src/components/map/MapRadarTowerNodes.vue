<template>
  <LMarker
    v-for="node in entities"
    :key="node.ID"
    :lat-lng="getEntityLocation(node)"
  >
    <LIcon
      :icon-size="[32, 32]"
      :icon-url="serverStore.getItemUrl(node.ClassName)"
      :class-name="getRadarTowerNodeClass(node)"
    />
    <q-icon name="fas fa-check" class="absolute tw-inset-0" />

    <LTooltip :content="`${node.Name || 'Unknown'} (${node.Purity})`" />
  </LMarker>
</template>

<script setup lang="ts">
import { LIcon, LMarker, LTooltip } from '@vue-leaflet/vue-leaflet';
import { ResourceNodeObject, ResourceNodePurity } from '@derpierre65/ficsit-remote-monitoring';
import useServerStore from 'stores/server.ts';
import { getEntityLocation } from 'src/utils/map.ts';

defineProps<{
  entities: Array<Omit<ResourceNodeObject, 'features'>>;
}>();

const serverStore = useServerStore();

function getRadarTowerNodeClass(entity: ResourceNodeObject) {
  if (entity.EnumPurity === ResourceNodePurity.Impure) {
    return 'tw-bg-red-500 tw-rounded-full';
  }

  if (entity.EnumPurity === ResourceNodePurity.Normal) {
    return 'tw-bg-orange-500 tw-rounded-full';
  }

  return 'tw-bg-green-500 tw-rounded-full';
}
</script>
