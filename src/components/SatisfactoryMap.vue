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
    <template v-if="settings.trains">
      <template v-for="entity of filteredTrains" :key="entity.ID">
        <LMarker :lat-lng="getEntityLocation(entity)">
          <LIcon :icon-size="[32, 32]" icon-url="/assets/map/train.png" />
          <LTooltip :content="entity.Name" />
        </LMarker>
      </template>
    </template>

    <!-- power slugs -->
    <template v-if="settings.spaceElevator">
      <LMarker v-for="entity of spaceElevators" :key="entity.ID" :lat-lng="getEntityLocation(entity)">
        <LIcon :icon-size="[32, 32]" icon-url="/assets/map/space_elevator.png" />
      </LMarker>
    </template>

    <!-- train stations -->
    <template v-if="settings.trainStations">
      <LMarker v-for="entity of trainStations" :key="entity.ID" :lat-lng="getEntityLocation(entity)">
        <LIcon :icon-size="[32, 32]" icon-url="/assets/map/train_station.png" />
        <LTooltip :content="entity.Name" />
      </LMarker>
    </template>

    <!-- space elevator -->
    <template v-if="settings.spaceElevator">
      <LMarker v-for="entity of spaceElevators" :key="entity.ID" :lat-lng="getEntityLocation(entity)">
        <LIcon :icon-size="[32, 32]" icon-url="/assets/map/space_elevator.png" />
      </LMarker>
    </template>

    <!-- power slug -->
    <template v-if="settings.powerSlugs">
      <LMarker v-for="entity of filteredPowerSlugs" :key="entity.ID" :lat-lng="getEntityLocation(entity)">
        <LIcon :icon-size="[32, 32]" :icon-url="`/assets/map/power_slug_${entity.slugColor}.png`" />
      </LMarker>
    </template>

    <!-- players -->
    <template v-if="settings.players">
      <LMarker v-for="entity of players" :key="entity.ID" :lat-lng="getEntityLocation(entity)">
        <LIcon
          :icon-size="[32, 32]"
          icon-url="/assets/map/player.png"
          :class-name="!entity.Online ? 'tw-opacity-50' : ''"
        />
        <LTooltip :content="entity.Name || 'Unknown Player'" />
      </LMarker>
    </template>

    <template v-if="settings.drones">
      <LMarker v-for="entity of drones" :key="entity.ID" :lat-lng="getEntityLocation(entity)">
        <LIcon
          :icon-size="[32, 32]"
          icon-url="/assets/map/drone.png"
        />
        <LTooltip :content="entity.Name || 'Unknown'" />
      </LMarker>
    </template>

    <template v-if="settings.droneStations">
      <LMarker v-for="entity of droneStations" :key="entity.ID" :lat-lng="getEntityLocation(entity)">
        <LIcon
          :icon-size="[32, 32]"
          icon-url="/assets/map/drone_station.png"
        />
        <LTooltip :content="entity.Name || 'Unknown'" />
      </LMarker>
    </template>

    <template v-if="settings.truckStations">
      <LMarker v-for="entity of truckStations" :key="entity.ID" :lat-lng="getEntityLocation(entity)">
        <LIcon
          :icon-size="[32, 32]"
          icon-url="/assets/map/truck_station.png"
        />
        <LTooltip :content="entity.Name || 'Unknown'" />
      </LMarker>
    </template>

    <template v-if="settings.trucks">
      <LMarker v-for="entity of trucks" :key="entity.ID" :lat-lng="getEntityLocation(entity)">
        <LIcon
          :icon-size="[32, 32]"
          icon-url="/assets/map/tractor.png"
        />
        <LTooltip :content="entity.Name || 'Unknown'" />
      </LMarker>
    </template>

    <LLayerGroup v-if="settings.tractors" name="tractors">
      <LMarker v-for="entity of tractors" :key="entity.ID" :lat-lng="getEntityLocation(entity)">
        <LIcon
          :icon-size="[32, 32]"
          icon-url="/assets/map/tractor.png"
        />
        <LTooltip :content="entity.Name || 'Unknown'" />
      </LMarker>
    </LLayerGroup>

    <!-- radar towers -->
    <template v-if="settings.radarTowers">
      <LMarker v-for="entity of radarTowers" :key="entity.ID" :lat-lng="[entity.location.y * -1, entity.location.x]">
        <LIcon :icon-size="[32, 32]" icon-url="/assets/map/radar_tower.png" />
        <LPopup>
          <template v-if="entity.Signal.length">
            <div class="text-center q-mb-md">
              <span>Weak signals found in area:</span>
            </div>
            <div class="tw-flex tw-flex-wrap justify-center tw-gap-4">
              <div v-for="signal of entity.Signal" class="tw-flex tw-items-center tw-gap-2">
                <img :src="serverStore.getItemUrl(signal.ClassName)" width="32px" height="32px">
                <span>x{{ signal.Amount }}</span>
              </div>
            </div>
          </template>

          <template v-if="entity.Fauna.length">
            <div class="text-center q-my-md">
              <span>Fauna found in area:</span>
            </div>
            <div class="tw-flex tw-flex-wrap justify-center tw-gap-x-2">
              <div v-for="fauna of entity.Fauna" class="tw-flex tw-items-center tw-gap-2">
                <img :src="serverStore.getItemUrl(fauna.ClassName)" width="32px" height="32px">
                <span>x{{ fauna.Amount }}</span>
              </div>
            </div>
          </template>

          <template v-if="entity.Flora">
            <div class="text-center q-my-md">
              <span>Flora found in area:</span>
            </div>
            <div class="tw-flex tw-flex-wrap justify-center tw-gap-x-2">
              <div v-for="flora of entity.Flora" class="tw-flex tw-items-center tw-gap-2">
                <img :src="serverStore.getItemUrl(flora.ClassName)" width="32px" height="32px">
                <span>x{{ flora.Amount }}</span>
              </div>
            </div>
          </template>
        </LPopup>
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
const powerSlug = useFRMEndpoint<GetPowerSlugResponse>('getPowerSlug');
const radarTowers = useFRMEndpoint<GetRadarTowerResponse>('getRadarTower');
const drones = useFRMEndpoint<GetDroneResponse>('getDrone');
const droneStations = useFRMEndpoint<GetDroneStationResponse>('getDroneStation');
const truckStations = useFRMEndpoint<GetTruckStationResponse>('getTruckStation');
const trucks = useFRMEndpoint<GetTruckResponse>('getTruck');
const tractors = useFRMEndpoint<GetTractorResponse>('getTractor');
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
function getEntityLocation(entity) {
  return [
    entity.location.y * -1,
    entity.location.x,
  ];
}
//#endregion

//#region Created
//#endregion
</script>
