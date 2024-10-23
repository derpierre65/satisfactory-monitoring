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

    <!-- radar towers -->
    <template v-if="settings.radarTowers">
      <LMarker v-for="entity of radarTowers" :lat-lng="[entity.location.y * -1, entity.location.x]">
        <LIcon :icon-size="[32, 32]" icon-url="/assets/map/radar_tower.png" />
        <LPopup>
          <div class="text-center q-mb-md">
            <span>Weak signals found in area:</span>
          </div>
          <div class="tw-flex tw-flex-wrap justify-center tw-gap-4">
            <div v-for="signal of entity.Signal" class="tw-flex tw-items-center tw-gap-2">
              <img :src="serverStore.getItemUrl(signal.ClassName)" width="32px" height="32px">
              <span>x{{ signal.Amount }}</span>
            </div>
          </div>

          <div class="text-center q-my-md">
            <span>Fauna found in area:</span>
          </div>
          <div class="tw-flex tw-flex-wrap justify-center tw-gap-x-2">
            <div v-for="fauna of entity.Fauna" class="tw-flex tw-items-center tw-gap-2">
              <img :src="serverStore.getItemUrl(fauna.ClassName)" width="32px" height="32px">
              <span>x{{ fauna.Amount }}</span>
            </div>
          </div>

          <div class="text-center q-my-md">
            <span>Flora found in area:</span>
          </div>
          <div class="tw-flex tw-flex-wrap justify-center tw-gap-x-2">
            <div v-for="flora of entity.Flora" class="tw-flex tw-items-center tw-gap-2">
              <img :src="serverStore.getItemUrl(flora.ClassName)" width="32px" height="32px">
              <span>x{{ flora.Amount }}</span>
            </div>
          </div>
        </LPopup>
      </LMarker>
    </template>
  </LMap>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { LIcon, LMap, LMarker, LImageOverlay, LTooltip, LPopup } from '@vue-leaflet/vue-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useServerStore from 'stores/server.ts';
import { useFRMEndpoint } from 'src/composables/frmEndpoint.ts';
import type {
  GetPlayerResponse, GetPowerSlugResponse, GetRadarTowerResponse,
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
    radarTowers: boolean;
  };
}>();

const serverStore = useServerStore();
const trains = useFRMEndpoint<GetTrainsResponse>('getTrains');
const spaceElevators = useFRMEndpoint<GetSpaceElevatorResponse>('getSpaceElevator');
const players = useFRMEndpoint<GetPlayerResponse>('getPlayer');
const trainStations = useFRMEndpoint<GetTrainStationResponse>('getTrainStation');
const powerSlug = useFRMEndpoint<GetPowerSlugResponse>('getPowerSlug');
const radarTowers = useFRMEndpoint<GetRadarTowerResponse>('getRadarTower');
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
