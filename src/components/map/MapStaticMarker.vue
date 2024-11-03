<template>
  <LMarker :lat-lng="getEntityLocation(entity)">
    <LIcon
      :icon-size="[32, 32]"
      :icon-url
    />
    <LTooltip v-if="!hideTooltip">
      <div class="text-center">
        <span>{{ entity.Name || 'Unknown' }}</span>
      </div>
      <slot name="tooltip" />
    </LTooltip>
    <LPopup v-if="$slots.default" >
      <slot />
    </LPopup>
  </LMarker>
</template>

<script setup lang="ts">
import { getEntityLocation } from 'src/utils/map.ts';
import { LIcon, LMarker, LPopup, LTooltip } from '@vue-leaflet/vue-leaflet';
import { HasLocation, IDClassObject } from '@derpierre65/ficsit-remote-monitoring';

defineProps<{
  entity: IDClassObject & HasLocation;
  iconUrl: string;
  hideTooltip?: boolean;
}>();

defineSlots<{
  default(): never;
  tooltip(): never;
}>();
</script>
