<template>
  <LMap
    :min-zoom="-10"
    :max-zoom="10"
    :zoom="-10"
    :center="[0, 0]"
    :crs="L.CRS.Simple"
  >
    <LImageOverlay
      :url="serverStore.currentServer?.url + '/img/Map/map.png'"
      :bounds="mapBounds"
      :z-index="-1"
    />

    <!-- trains -->
    <template v-if="settings.trains && filteredTrains">
      <LMarker v-for="entity of filteredTrains" :lat-lng="[entity.location.y * -1, entity.location.x]">
        <LIcon :icon-size="[32, 32]" icon-url="/assets/map/train.png" />
        <LTooltip :content="entity.Name" />
      </LMarker>
    </template>

    <!-- power slugs -->
    <template v-if="settings.spaceElevator">
      <LMarker v-for="entity of spaceElevators" :lat-lng="[entity.location.y * -1, entity.location.x]">
        <LIcon :icon-size="[32, 32]" icon-url="/assets/map/space_elevator.png" />
      </LMarker>
    </template>

    <!-- train stations -->
    <template v-if="settings.trainStations">
      <LMarker v-for="entity of trainStations" :lat-lng="[entity.location.y * -1, entity.location.x]">
        <LIcon :icon-size="[32, 32]" icon-url="/assets/map/train_station.png" />
        <LTooltip :content="entity.Name" />
      </LMarker>
    </template>

    <!-- space elevator -->
    <template v-if="settings.spaceElevator">
      <LMarker v-for="entity of spaceElevators" :lat-lng="[entity.location.y * -1, entity.location.x]">
        <LIcon :icon-size="[32, 32]" icon-url="/assets/map/space_elevator.png" />
      </LMarker>
    </template>

    <!-- power slug -->
    <template v-if="settings.powerSlugs">
      <LMarker v-for="entity of filteredPowerSlugs" :lat-lng="[entity.location.y * -1, entity.location.x]">
        <LIcon :icon-size="[32, 32]" :icon-url="`/assets/map/power_slug_${entity.slugColor}.png`" />
      </LMarker>
    </template>

    <!-- players -->
    <template v-if="settings.players">
      <LMarker v-for="entity of players" :lat-lng="[entity.location.y * -1, entity.location.x]">
        <LIcon
          :icon-size="[32, 32]"
          icon-url="/assets/map/player.png"
          :class-name="!entity.Online ? 'tw-opacity-50' : ''"
        />
        <LTooltip :content="entity.Name || 'Unknown Player'" />
      </LMarker>
    </template>
  </LMap>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { LIcon, LMap, LMarker, LImageOverlay, LTooltip } from '@vue-leaflet/vue-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useServerStore from 'stores/server.ts';
import { useFRMEndpoint } from 'src/composables/frmEndpoint.ts';
import type {
  GetPlayerResponse, GetPowerSlugResponse,
  GetSpaceElevatorResponse,
  GetTrainsResponse,
  GetTrainStationResponse,
} from '@derpierre65/ficsit-remote-monitoring';
import { getSlugColor } from 'src/utils/slug.ts';

//#region Composable & Prepare
const { settings, } = defineProps<{
  settings: {
    trains: boolean;
    spaceElevator: boolean;
    players: boolean;
    trainStations: boolean;
    powerSlugs: boolean;
  };
}>();

const serverStore = useServerStore();
const trains = useFRMEndpoint<GetTrainsResponse>('getTrains');
const spaceElevators = useFRMEndpoint<GetSpaceElevatorResponse>('getSpaceElevator');
const players = useFRMEndpoint<GetPlayerResponse>('getPlayer');
const trainStations = useFRMEndpoint<GetTrainStationResponse>('getTrainStation');
const powerSlug = useFRMEndpoint<GetPowerSlugResponse>('getPowerSlug');
//#endregion

//#region Data
const mapBounds = [
  [
    -375e3,
    -324698.832031,
  ],
  [
    375e3,
    425301.832031,
  ],
];
//#endregion

//#region Computed
const filteredTrains = computed(() => {
  if (!trains.value) {
    return [];
  }

  return trains.value.filter((train) => train.location.y !== 0 && train.location.x !== 0 && train.location.z !== 0);
});
const filteredPowerSlugs = computed(() => {
  if (!powerSlug.value) {
    return [];
  }

  return powerSlug.value.map((slug) => {
    return {
      ...slug,
      slugColor: getSlugColor(slug),
    };
  });
});
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
