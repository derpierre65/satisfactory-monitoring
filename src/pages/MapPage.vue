<template>
  <div class="tw-flex tw-flex-auto tw-gap-4">
    <div class="tw-flex tw-flex-col tw-flex-auto">
      <SatisfactoryMap class="tw-flex-auto">
        <!-- train stations -->
        <template v-if="settings.includes('trainStations')">
          <MapStaticMarker
            v-for="entity in endpoints.trainStations.data"
            :key="entity.ID"
            :entity="entity"
            icon-url="/assets/map/train_station.png"
          />
        </template>

        <!-- space elevator -->
        <template v-if="settings.includes('spaceElevators')">
          <MapSpaceElevators :entities="endpoints.spaceElevators.data" />
        </template>

        <!-- truck stations -->
        <template v-if="settings.includes('doggos')">
          <MapStaticMarker
            v-for="entity in endpoints.doggos.data"
            :key="entity.ID"
            :entity="entity"
            :icon-url="serverStore.getItemUrl('Desc_SpaceRabbit_C')"
          >
            <template #tooltip>
              <ItemSlot v-if="entity.Inventory.length" :item="entity.Inventory[0]" :size="64" />
            </template>
          </MapStaticMarker>
        </template>

        <!-- power slug -->
        <template v-if="settings.includes('powerSlugs')">
          <MapStaticMarker
            v-for="entity in endpoints.powerSlugs.data"
            :key="entity.ID"
            :entity="entity"
            :icon-url="serverStore.getItemUrl(entity.ClassName)"
            hide-tooltip
          />
        </template>

        <!-- players -->
        <template v-if="settings.includes('players')">
          <LMarker v-for="entity in endpoints.players.data" :key="entity.ID" :lat-lng="getEntityLocation(entity)">
            <LIcon
              :icon-size="[32, 32]"
              icon-url="/assets/map/player.png"
              :class-name="!entity.Online ? 'tw-opacity-50' : ''"
            />
            <LTooltip :content="entity.Name || 'Unknown Player'" />
          </LMarker>
        </template>

        <!-- drone stations -->
        <template v-if="settings.includes('droneStations')">
          <MapStaticMarker
            v-for="entity in endpoints.droneStations.data"
            :key="entity.ID"
            :entity="entity"
            icon-url="/assets/map/drone_station.png"
          />
        </template>

        <!-- truck stations -->
        <template v-if="settings.includes('truckStations')">
          <MapStaticMarker
            v-for="entity in endpoints.truckStations.data"
            :key="entity.ID"
            :entity="entity"
            icon-url="/assets/map/truck_station.png"
          />
        </template>

        <!-- drones -->
        <template v-if="settings.includes('drones')">
          <LMarker v-for="entity in endpoints.drones.data" :key="entity.ID" :lat-lng="getEntityLocation(entity)">
            <LIcon
              :icon-size="[32, 32]"
              icon-url="/assets/map/drone.png"
            />
            <LTooltip :content="entity.Name || 'Unknown'" />
          </LMarker>
        </template>

        <!-- trains -->
        <template v-if="settings.includes('trains')">
          <LMarker v-for="entity in cachedTrains" :key="entity.ID" :lat-lng="getEntityLocation(entity)">
            <LIcon :icon-size="[32, 32]" icon-url="/assets/map/train.png" />
            <LTooltip :content="entity.Name" />
          </LMarker>
        </template>

        <template v-if="settings.includes('trucks')">
          <LMarker v-for="entity in endpoints.trucks.data" :key="entity.ID" :lat-lng="getEntityLocation(entity)">
            <LIcon
              :icon-size="[32, 32]"
              icon-url="/assets/map/tractor.png"
            />
            <LTooltip :content="entity.Name || 'Unknown'" />
          </LMarker>
        </template>

        <template v-if="settings.includes('tractors')">
          <LMarker v-for="entity in endpoints.tractors.data" :key="entity.ID" :lat-lng="getEntityLocation(entity)">
            <LIcon
              :icon-size="[32, 32]"
              icon-url="/assets/map/tractor.png"
            />
            <LTooltip :content="entity.Name || 'Unknown'" />
          </LMarker>
        </template>

        <template v-if="settings.includes('powerSwitches')">
          <MapPowerSwitch
            v-for="entity in endpoints.powerSwitches.data"
            :key="entity.ID"
            :entity="entity"
          />
        </template>

        <!-- radar towers -->
        <template v-if="settings.includes('radarTowers')">
          <MapRadarTowers :entities="endpoints.radarTowers.data" />
        </template>

        <MapRadarTowerNodes
          v-if="settings.includes('radarTowerNodes')"
          :entities="cachedRadarTowerNodes"
        />
      </SatisfactoryMap>
    </div>

    <div class="tw-w-1/4">
      <q-card class="no-shadow">
        <q-card-section class="tw-flex tw-flex-col tw-gap-2">
          <q-btn-group>
            <q-btn label="Enable all" color="green" @click="enableAllSettings" />
            <q-btn label="Disable all" color="red" @click="settings = []" />
          </q-btn-group>

          <strong>Entities</strong>
          <q-toggle v-model="settings" val="players" label="Players" />
          <q-toggle v-model="settings" val="doggos" label="Doggos" />

          <strong>Buildings</strong>
          <q-toggle v-model="settings" val="spaceElevators" label="Space Elevator" />
          <q-toggle v-model="settings" val="radarTowers" label="Radar Towers" />
          <q-toggle v-model="settings" val="radarTowerNodes" label="Radar Tower Nodes" />
          <q-toggle v-model="settings" val="trainStations" label="Train Stations" />
          <q-toggle v-model="settings" val="droneStations" label="Drone Stations" />
          <q-toggle v-model="settings" val="truckStations" label="Truck Stations" />
          <q-toggle v-model="settings" val="powerSwitches" label="Power Switches" />

          <strong>Vehicles</strong>
          <q-toggle v-model="settings" val="trains" label="Trains" />
          <q-toggle v-model="settings" val="drones" label="Drones" />
          <q-toggle v-model="settings" val="tractors" label="Tractors" />
          <q-toggle v-model="settings" val="trucks" label="Trucks" />

          <strong>Collectibles</strong>
          <q-toggle v-model="settings" val="powerSlugs" label="Power Slugs" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import SatisfactoryMap from 'components/SatisfactoryMap.vue';
import { computed, reactive } from 'vue';
import useServerStore from 'stores/server.ts';
import { useEndpointsByOptions, usePausableFRMEndpoint } from 'src/composables/frmEndpoint.ts';
import {
  GetDoggoResponse,
  GetDroneResponse,
  GetDroneStationResponse,
  GetPlayerResponse,
  GetPowerSlugResponse,
  GetRadarTowerResponse,
  GetSpaceElevatorResponse, GetSwitchesResponse,
  GetTractorResponse,
  GetTrainsResponse,
  GetTrainStationResponse,
  GetTruckResponse,
  GetTruckStationResponse, TowerObject,
} from '@derpierre65/ficsit-remote-monitoring';
import { getEntityLocation } from 'src/utils/map.ts';
import ItemSlot from 'components/ItemSlot.vue';
import { LIcon, LMarker, LTooltip } from '@vue-leaflet/vue-leaflet';
import MapSpaceElevators from 'components/map/MapSpaceElevators.vue';
import MapStaticMarker from 'components/map/MapStaticMarker.vue';
import MapRadarTowers from 'components/map/MapRadarTowers.vue';
import MapRadarTowerNodes from 'components/map/MapRadarTowerNodes.vue';
import useSettingsStore from 'stores/settings.ts';
import MapPowerSwitch from 'components/map/MapPowerSwitch.vue';

//#region Composable & Prepare
const serverStore = useServerStore();
const settingsStore = useSettingsStore();
const endpoints = {
  trains: reactive(usePausableFRMEndpoint<GetTrainsResponse>('getTrains')),
  spaceElevators: reactive(usePausableFRMEndpoint<GetSpaceElevatorResponse>('getSpaceElevator')),
  players: reactive(usePausableFRMEndpoint<GetPlayerResponse>('getPlayer')),
  trainStations: reactive(usePausableFRMEndpoint<GetTrainStationResponse>('getTrainStation')),
  powerSlugs: reactive(usePausableFRMEndpoint<GetPowerSlugResponse>('getPowerSlug')),
  radarTowers: reactive(usePausableFRMEndpoint<GetRadarTowerResponse>('getRadarTower')),
  drones: reactive(usePausableFRMEndpoint<GetDroneResponse>('getDrone')),
  droneStations: reactive(usePausableFRMEndpoint<GetDroneStationResponse>('getDroneStation')),
  truckStations: reactive(usePausableFRMEndpoint<GetTruckStationResponse>('getTruckStation')),
  trucks: reactive(usePausableFRMEndpoint<GetTruckResponse>('getTruck')),
  tractors: reactive(usePausableFRMEndpoint<GetTractorResponse>('getTractor')),
  doggos: reactive(usePausableFRMEndpoint<GetDoggoResponse>('getDoggo')),
  powerSwitches: reactive(usePausableFRMEndpoint<GetSwitchesResponse>('getSwitches')),
};

const { options: settings, } = useEndpointsByOptions(computed({
  get: () => settingsStore.mapSettings,
  set: (newValue) => settingsStore.$patch({
    mapSettings: newValue,
  }),
}), endpoints, {
  radarTowerNodes: 'radarTowers',
});
//#endregion

//#region Data
//#endregion

//#region Computed
const cachedRadarTowerNodes = computed(() => {
  return endpoints.radarTowers.data.reduce((acc, tower) => {
    acc.push(...tower.ScannedResourceNodes);

    return acc;
  }, [] as TowerObject['ScannedResourceNodes']);
});

const cachedTrains = computed(() => {
  if (!endpoints.trains.data || endpoints.trains.data.length === 0) {
    return [];
  }

  return endpoints.trains.data.filter((train) => train.location.y !== 0 && train.location.x !== 0 && train.location.z !== 0);
});
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
function enableAllSettings() {
  settings.value = [
    'players',
    'doggos',
    'spaceElevators',
    'radarTowers',
    'radarTowerNodes',
    'trainStations',
    'droneStations',
    'truckStations',
    'powerSwitches',
    'trains',
    'drones',
    'tractors',
    'trucks',
    'powerSlugs',
  ];
}
//#endregion

//#region Created
//#endregion
</script>
