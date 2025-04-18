<template>
  <LMarker :icon="icon" :lat-lng @click="test">
    <LTooltip v-if="$slots.tooltip || tooltip">
      <slot name="tooltip">
        {{ tooltip }}
      </slot>
    </LTooltip>
    <LPopup v-if="$slots.popup">
      <slot name="popup" />
    </LPopup>
  </LMarker>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { LMarker, LPopup, LTooltip } from '@vue-leaflet/vue-leaflet';
import * as L from 'leaflet';
import useServerStore from 'stores/server';
import type { Coordinates, CoordinatesWithRotation } from '@derpierre65/ficsit-remote-monitoring';
import { getEntityLocation } from 'src/utils/map';

const {
  image,
  location,
  color = '#fff',
  bgColor = '#b3b3b3',
  tooltip = '',
  iconClass = '',
} = defineProps<{
  image: string;
  location: Coordinates | CoordinatesWithRotation;
  color?: string;
  bgColor?: string;
  tooltip?: string;
  iconClass?: string;
}>();

const attrs = useAttrs();
const serverStore = useServerStore();

const latLng = computed(() => {
  return getEntityLocation({
    location,
  });
});

const icon = computed(() => L.divIcon({
  html: `<div class="custom-marker ${iconClass}" style="background-color: ${bgColor}; border: 2px solid ${color};">
    <img src="${image}" class="icon-image" />
    <div class="line" style="background-color: ${color};"></div>
    <div class="dot" style="background-color: ${color};"></div>
  </div>`,
  iconSize: [
    40,
    40,
  ],
  iconAnchor: [
    20,
    72,
  ],
  popupAnchor: [
    0,
    -72,
  ],
  tooltipAnchor: [
    20,
    -50,
  ],
  className: 'position-relative',
}));

function test(event: MouseEvent) {
  if (!event.originalEvent.ctrlKey) {
    return;
  }

  serverStore.post('createPing', location);
}
</script>

<style lang="scss">
.custom-marker {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);

  .icon-image {
    width: 20px;
    height: 20px;
  }

  .line {
    content: "";
    position: absolute;
    width: 2px;
    height: 30px; /* Length of the line */
    bottom: -30px; /* Positioning below the marker */
    left: 50%;
    transform: translateX(-50%);
  }

  .dot {
    content: "";
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    bottom: -36px; /* Positioning at the end of the line */
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
