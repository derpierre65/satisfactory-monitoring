<template>
  <LMap
    :min-zoom="-10"
    :max-zoom="10"
    :zoom="-10"
    :center="[0, 0]"
    :options="mapOptions"
  >
    <LImageOverlay
      :url="serverStore.currentServer?.url + '/img/Map/map.png'"
      :bounds="mapBounds"
      :z-index="-1"
    />

    <!-- train stations -->
    <template v-if="settings.trainStations">
      <MapStaticMarker
        v-for="entity in cachedTrainStations"
        :key="entity.ID"
        :entity="entity"
        icon-url="/assets/map/train_station.png"
      />
    </template>

    <!-- space elevator -->
    <template v-if="settings.spaceElevator">
      <MapSpaceElevators :entities="cachedSpaceElevators" />
    </template>

    <!-- power slug -->
    <template v-if="settings.powerSlugs">
      <MapStaticMarker
        v-for="entity in cachedPowerSlugs"
        :key="entity.ID"
        :entity="entity"
        :icon-url="`/assets/map/power_slug_${entity.slugColor}.png`"
        hide-tooltip
      />
    </template>

    <!-- players -->
    <template v-if="settings.players">
      <LMarker v-for="entity in players" :key="entity.ID" :lat-lng="getEntityLocation(entity)">
        <LIcon
          :icon-size="[32, 32]"
          icon-url="/assets/map/player.png"
          :class-name="!entity.Online ? 'tw-opacity-50' : ''"
        />
        <LTooltip :content="entity.Name || 'Unknown Player'" />
      </LMarker>
    </template>

    <!-- drone stations -->
    <template v-if="settings.droneStations">
      <MapStaticMarker
        v-for="entity in cachedDroneStations"
        :key="entity.ID"
        :entity="entity"
        icon-url="/assets/map/drone_station.png"
      />
    </template>

    <!-- truck stations -->
    <template v-if="settings.truckStations">
      <MapStaticMarker
        v-for="entity in cachedTruckStations"
        :key="entity.ID"
        :entity="entity"
        icon-url="/assets/map/truck_station.png"
      />
    </template>

    <!-- drones -->
    <template v-if="settings.drones">
      <LMarker v-for="entity in drones" :key="entity.ID" :lat-lng="getEntityLocation(entity)">
        <LIcon
          :icon-size="[32, 32]"
          icon-url="/assets/map/drone.png"
        />
        <LTooltip :content="entity.Name || 'Unknown'" />
      </LMarker>
    </template>

    <!-- trains -->
    <template v-if="settings.trains">
      <LMarker v-for="entity in filteredTrains" :key="entity.ID" :lat-lng="getEntityLocation(entity)">
        <LIcon :icon-size="[32, 32]" icon-url="/assets/map/train.png" />
        <LTooltip :content="entity.Name" />
      </LMarker>
    </template>

    <template v-if="settings.trucks">
      <LMarker v-for="entity in trucks" :key="entity.ID" :lat-lng="getEntityLocation(entity)">
        <LIcon
          :icon-size="[32, 32]"
          icon-url="/assets/map/tractor.png"
        />
        <LTooltip :content="entity.Name || 'Unknown'" />
      </LMarker>
    </template>

    <template v-if="settings.tractors">
      <LMarker v-for="entity in tractors" :key="entity.ID" :lat-lng="getEntityLocation(entity)">
        <LIcon
          :icon-size="[32, 32]"
          icon-url="/assets/map/tractor.png"
        />
        <LTooltip :content="entity.Name || 'Unknown'" />
      </LMarker>
    </template>

    <!-- radar towers -->
    <template v-if="settings.radarTowers">
      <MapRadarTowers :entities="cachedRadarTowers" />
    </template>

    <MapRadarTowerNodes
      v-if="settings.radarTowerNodes"
      :entities="cachedRadarTowerNodes"
    />
  </LMap>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { LIcon, LMap, LMarker, LImageOverlay, LTooltip } from '@vue-leaflet/vue-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useServerStore from 'stores/server.ts';
import { useFRMEndpoint } from 'src/composables/frmEndpoint.ts';
import type {
  GetDroneResponse,
  GetPlayerResponse,
  GetPowerSlugResponse,
  GetRadarTowerResponse,
  GetSpaceElevatorResponse,
  GetTractorResponse,
  GetTrainsResponse,
  GetTrainStationResponse,
  GetTruckResponse,
  GetTruckStationResponse,
  HasLocation,
  IDClassObject,
} from '@derpierre65/ficsit-remote-monitoring';
import { getSlugColor } from 'src/utils/slug.ts';
import { TowerObject } from '@derpierre65/ficsit-remote-monitoring';
import { isEqual } from '@derpierre65/frontend-utils';
import MapRadarTowerNodes from 'components/map/MapRadarTowerNodes.vue';
import { getEntityLocation } from 'src/utils/map.ts';
import MapRadarTowers from 'components/map/MapRadarTowers.vue';
import MapSpaceElevators from 'components/map/MapSpaceElevators.vue';
import MapStaticMarker from 'components/map/MapStaticMarker';

//#region Composable & Prepare
const { settings, } = defineProps<{
  settings: {
    trains: boolean;
    spaceElevator: boolean;
    players: boolean;
    trainStations: boolean;
    powerSlugs: boolean;
    radarTowers: boolean;
    radarTowerNodes: boolean;
    drones: boolean;
    droneStations: boolean;
    truckStations: boolean;
    tractors: boolean;
    trucks: boolean;
  };
}>();

const serverStore = useServerStore();
const trains = useFRMEndpoint<GetTrainsResponse>('getTrains');
const spaceElevators = useFRMEndpoint<GetSpaceElevatorResponse>('getSpaceElevator');
const players = useFRMEndpoint<GetPlayerResponse>('getPlayer');
const trainStations = useFRMEndpoint<GetTrainStationResponse>('getTrainStation');
const powerSlugs = useFRMEndpoint<GetPowerSlugResponse>('getPowerSlug');
const radarTowers = useFRMEndpoint<GetRadarTowerResponse>('getRadarTower');
const drones = useFRMEndpoint<GetDroneResponse>('getDrone');
const droneStations = useFRMEndpoint<GetDroneStationResponse>('getDroneStation');
const truckStations = useFRMEndpoint<GetTruckStationResponse>('getTruckStation');
const trucks = useFRMEndpoint<GetTruckResponse>('getTruck');
const tractors = useFRMEndpoint<GetTractorResponse>('getTractor');
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
const filteredTrains = computed(() => {
  if (!trains.value) {
    return [];
  }

  return trains.value.filter((train) => train.location.y !== 0 && train.location.x !== 0 && train.location.z !== 0);
});

const cachedSpaceElevators = createCachedComputed(spaceElevators);
const cachedRadarTowers = createCachedComputed(radarTowers);
const cachedDroneStations = createCachedComputed(droneStations);
const cachedTruckStations = createCachedComputed(truckStations);
const cachedTrainStations = createCachedComputed(trainStations);
const cachedRadarTowerNodes = createCachedComputed(radarTowers, () => {
  return radarTowers.value!.reduce((acc, tower) => {
    acc.push(...tower.ScannedResourceNodes);

    return acc;
  }, [] as TowerObject['ScannedResourceNodes']);
});
const cachedPowerSlugs = createCachedComputed(powerSlugs, () => {
  return powerSlugs.value!.map((slug) => {
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
function createCachedComputed<T extends IDClassObject & HasLocation, U extends IDClassObject & HasLocation = T>(
  obj: ComputedRef<T[] | null>,
  getNewValues: (() => U[]) | null = null,
) {
  return computed<U[]>((oldValue) => {
    if (!obj.value) {
      return [] as U[];
    }

    const newValue = getNewValues ? getNewValues() : obj.value;

    const newIds = newValue.map((entity) => entity.ID + entity.location.x + entity.location.z);
    const oldIds = oldValue?.map((entity) => entity.ID + entity.location.x + entity.location.z) || [];
    if (isEqual(newIds, oldIds)) {
      return oldValue;
    }

    return newValue;
  });
}
//#endregion

//#region Created
//#endregion
</script>
