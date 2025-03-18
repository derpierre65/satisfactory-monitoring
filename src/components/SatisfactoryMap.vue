<template>
  <LMap
    :min-zoom="-10"
    :max-zoom="-3"
    :zoom="zoom"
    :options="mapOptions"
    :center
  >
    <LImageOverlay
      url="assets/map/map.png"
      :bounds="mapBounds"
      :z-index="-1"
    />

    <slot />
  </LMap>
</template>

<script setup lang="ts">
import { LMap, LImageOverlay } from '@vue-leaflet/vue-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

withDefaults(defineProps<{
  center?: [number, number];
  zoom?: number;
}>(), {
  zoom: -10,
  center: () => [
    0,
    0,
  ],
});

const mapBounds: [[number, number], [number, number]] = [
  [
    -375e3,
    -324698.832031,
  ],
  [
    375e3,
    425301.832031,
  ],
];
const mapOptions = {
  attributionControl: false,
  preferCanvas: true,
  crs: L.CRS.Simple,
};
</script>
