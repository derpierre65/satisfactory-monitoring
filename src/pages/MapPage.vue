<template>
  <div class="tw-flex tw-flex-auto tw-gap-4">
    <div class="tw-flex tw-flex-col tw-flex-auto">
      <SatisfactoryMap class="tw-flex-auto">
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

        <!-- truck stations -->
        <template v-if="settings.doggos">
          <MapStaticMarker
            v-for="entity in cachedDoggos"
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

        <template v-if="settings.powerSwitches">
          <MapStaticMarker
            v-for="entity in powerSwitches"
            :key="entity.ID"
            :entity="entity"
            :icon-url="serverStore.getItemUrl(entity.ClassName)"
            :icon-classes="getPowerSwitchMapIconClasses(entity)"
          >
            <q-input
              :model-value="entity.Name"
              bg-color="black"
              dark
              dense
              autofocus
            />
          </MapStaticMarker>
        </template>

        <!-- radar towers -->
        <template v-if="settings.radarTowers">
          <MapRadarTowers :entities="cachedRadarTowers" />
        </template>

        <MapRadarTowerNodes
          v-if="settings.radarTowerNodes"
          :entities="cachedRadarTowerNodes"
        />
      </SatisfactoryMap>
    </div>

    <div class="tw-w-1/4">
      <q-card>
        <q-card-section class="tw-flex tw-flex-col tw-gap-2">
          <q-toggle v-model="settings.spaceElevator" label="Space Elevator" />
          <q-toggle v-model="settings.players" label="Players" />
          <q-toggle v-model="settings.doggos" label="Doggos" />
          <q-toggle v-model="settings.trainStations" label="Train Stations" />
          <q-toggle v-model="settings.trains" label="Trains" />
          <q-toggle v-model="settings.powerSlugs" label="Power Slugs" />
          <q-toggle v-model="settings.radarTowers" label="Radar Towers" />
          <q-toggle v-model="settings.radarTowerNodes" label="Radar Tower Nodes" />
          <q-toggle v-model="settings.drones" label="Drones" />
          <q-toggle v-model="settings.droneStations" label="Drone Stations" />
          <q-toggle v-model="settings.truckStations" label="Truck Stations" />
          <q-toggle v-model="settings.tractors" label="Tractors" />
          <q-toggle v-model="settings.trucks" label="Trucks" />
          <q-toggle v-model="settings.powerSwitches" label="Power Switches" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import SatisfactoryMap from 'components/SatisfactoryMap.vue';
import { computed, ComputedRef, ref } from 'vue';
import useServerStore from 'stores/server.ts';
import { useFRMEndpoint } from 'src/composables/frmEndpoint.ts';
import {
  GetDoggoResponse,
  GetDroneResponse,
  GetDroneStationResponse,
  GetPlayerResponse,
  GetPowerSlugResponse,
  GetRadarTowerResponse,
  GetSpaceElevatorResponse,
  GetTractorResponse,
  GetTrainsResponse,
  GetTrainStationResponse,
  GetTruckResponse,
  GetTruckStationResponse,
  type HasLocation,
  type IDClassObject,
  TowerObject,
} from '@derpierre65/ficsit-remote-monitoring';
import { getSlugColor } from 'src/utils/slug.ts';
import { isEqual } from '@derpierre65/frontend-utils';
import { getEntityLocation } from 'src/utils/map.ts';
import ItemSlot from 'components/ItemSlot.vue';
import { LIcon, LMarker, LTooltip } from '@vue-leaflet/vue-leaflet';
import MapSpaceElevators from 'components/map/MapSpaceElevators.vue';
import MapStaticMarker from 'components/map/MapStaticMarker.vue';
import MapRadarTowers from 'components/map/MapRadarTowers.vue';
import MapRadarTowerNodes from 'components/map/MapRadarTowerNodes.vue';
import { getPowerSwitchMapIconClasses } from 'src/utils/api/switches.ts';

//#region Composable & Prepare
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
const doggos = useFRMEndpoint<GetDoggoResponse>('getDoggo');
const powerSwitches = useFRMEndpoint<GetDoggoResponse>('getSwitches');
//#endregion

//#region Data
const settings = ref({
  trains: true,
  spaceElevator: true,
  players: true,
  doggos: true,
  trainStations: true,
  powerSlugs: true,
  radarTowers: true,
  drones: true,
  radarTowerNodes: true,
  droneStations: true,
  truckStations: true,
  tractors: true,
  trucks: true,
  powerSwitches: true,
});
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
const cachedDoggos = createCachedComputed(doggos);
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
