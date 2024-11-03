<template>
  <LMap
    :min-zoom="-10"
    :max-zoom="10"
    :zoom="-10"
    :center="[0, 0]"
    :options="mapOptions"
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

//#region Composable & Prepare
//#endregion

//#region Data
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
//#endregion

//#region Computed
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
//#endregion

//#region Created
//#endregion
</script>
