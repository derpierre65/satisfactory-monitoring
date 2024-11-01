<template>
  <LMarker :lat-lng="getEntityLocation(entity)">
    <LIcon
      :icon-size="[32, 32]"
      :icon-url
    />
    <LTooltip v-if="!hideTooltip" :content="entity.Name || 'Unknown'" />
  </LMarker>
</template>

<script setup lang="ts">
import { getEntityLocation } from 'src/utils/map.ts';
import { LIcon, LMarker, LTooltip } from '@vue-leaflet/vue-leaflet';
import { HasLocation, IDClassObject } from '@derpierre65/ficsit-remote-monitoring';

defineProps<{
  entity: IDClassObject & HasLocation;
  iconUrl: string;
  hideTooltip?: boolean;
}>();
</script>
