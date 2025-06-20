<template>
  <div class="tw-flex tw-flex-auto tw-gap-4">
    <div class="tw-flex tw-flex-col tw-flex-auto">
      <SatisfactoryMap class="tw-flex-auto">
        <!-- train stations -->
        <template v-if="settings.includes('trainStations')">
          <MapMarker
            v-for="entity in endpoints.trainStations.data"
            :key="entity.ID"
            :tooltip="entity.Name || 'Unknown'"
            :location="entity.location"
            image="/assets/map/train_station.png"
          />
        </template>

        <!-- space elevator -->
        <MapSpaceElevators
          v-if="settings.includes('spaceElevators')"
          :entities="endpoints.spaceElevators.data"
        />

        <!-- truck stations -->
        <template v-if="settings.includes('doggos')">
          <MapMarker
            v-for="entity in endpoints.doggos.data"
            :key="entity.ID"
            :location="entity.location"
            :image="serverStore.getItemUrl('Desc_SpaceRabbit_C')"
            :tooltip="entity.Name"
          >
            <template #tooltip>
              <div class="text-center">
                <span>{{ entity.Name }}</span>
              </div>
              <ItemSlot
                v-if="entity.Inventory[0]"
                :item="entity.Inventory[0]"
                :size="64"
                class="q-mx-auto"
              />
            </template>
          </MapMarker>
        </template>

        <!-- power slug -->
        <template v-if="settings.includes('powerSlugs')">
          <MapMarker
            v-for="entity in endpoints.powerSlugs.data"
            :key="entity.ID"
            :location="entity.location"
            :image="serverStore.getItemUrl(entity.ClassName)"
            :color="getPowerSlugColor(entity)"
            bg-color="white"
            pingable-until-despawn
          />
        </template>
        <template v-if="itemPickups.length">
          <MapMarker
            v-for="entity in itemPickups"
            :key="entity.ID"
            :location="entity.location"
            :image="serverStore.getItemUrl(entity.Item.ClassName)"
            bg-color="white"
            pingable-until-despawn
          />
        </template>
        <template v-if="settings.includes('itemPickupsItem')">
          <MapMarker
            v-for="entity in cachedItemPickups.others"
            :key="entity.ID"
            :location="entity.location"
            :image="serverStore.getItemUrl(entity.Item.ClassName)"
            bg-color="white"
            pingable-until-despawn
          >
            <template #tooltip>
              <div class="text-center">
                <span>{{ entity.Item.Name }}</span>
              </div>
              <ItemSlot
                :item="entity.Item"
                :size="64"
                class="q-mx-auto"
              />
            </template>
          </MapMarker>
        </template>
        <template v-if="settings.includes('artifacts')">
          <MapMarker
            v-for="entity in endpoints.artifacts.data"
            :key="entity.ID"
            :location="entity.location"
            :image="serverStore.getItemUrl(entity.ClassName)"
            bg-color="white"
            pingable-until-despawn
          />
        </template>
        <template v-if="settings.includes('dropPod')">
          <MapDropPod
            v-for="entity in endpoints.dropPod.data"
            :key="entity.ID"
            :entity
          />
        </template>

        <!-- players -->
        <template v-if="settings.includes('players')">
          <MapMarker
            v-for="entity in endpoints.players.data"
            :key="entity.ID"
            :location="entity.location"
            :bg-color="entity.Online ? 'green' : 'rgba(179,179,179,0.5)'"
            :tooltip="entity.Name || t('dashboard.widgets.inventory_player.unknown_player')"
            :icon-class="entity.Online ? '' : 'tw-opacity-50'"
            image="/assets/map/player.png"
          />
        </template>

        <!-- drone stations -->
        <template v-if="settings.includes('droneStations')">
          <MapMarker
            v-for="entity in endpoints.droneStations.data"
            :key="entity.ID"
            :tooltip="entity.Name || 'Unknown'"
            :location="entity.location"
            image="/assets/map/drone_station.png"
          />
        </template>

        <!-- truck stations -->
        <template v-if="settings.includes('truckStations')">
          <MapMarker
            v-for="entity in endpoints.truckStations.data"
            :key="entity.ID"
            :tooltip="entity.Name || 'Unknown'"
            :location="entity.location"
            image="/assets/map/truck_station.png"
          />
        </template>

        <!-- drones -->
        <template v-if="settings.includes('drones')">
          <MapMarker
            v-for="entity in endpoints.drones.data"
            :key="entity.ID"
            :tooltip="entity.Name || 'Unknown'"
            :location="entity.location"
            bg-color="rgb(87, 87, 87)"
            image="/assets/map/drone.png"
          />
        </template>

        <!-- trains -->
        <template v-if="settings.includes('trains')">
          <MapMarker
            v-for="entity in cachedTrains"
            :key="entity.ID"
            :tooltip="entity.Name"
            :location="entity.location"
            bg-color="rgb(63, 63, 63)"
            image="/assets/map/train.png"
          />
        </template>

        <template v-if="settings.includes('trucks')">
          <MapMarker
            v-for="entity in endpoints.trucks.data"
            :key="entity.ID"
            :tooltip="entity.Name"
            :location="entity.location"
            bg-color="rgb(63, 63, 63)"
            image="/assets/map/tractor.png"
          />
        </template>

        <template v-if="settings.includes('tractors')">
          <MapMarker
            v-for="entity in endpoints.tractors.data"
            :key="entity.ID"
            :tooltip="entity.Name"
            :location="entity.location"
            bg-color="rgb(63, 63, 63)"
            image="/assets/map/tractor.png"
          />
        </template>

        <template v-if="settings.includes('powerSwitches')">
          <MapPowerSwitch
            v-for="entity in endpoints.powerSwitches.data"
            :key="entity.ID"
            :entity="entity"
          />
        </template>

        <!-- radar towers -->
        <MapRadarTowers
          v-if="settings.includes('radarTowers')"
          :entities="endpoints.radarTowers.data"
        />

        <MapRadarTowerNodes
          v-if="settings.includes('radarTowerNodes')"
          :entities="endpoints.radarTowers.data"
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
          <q-toggle v-model="settings" val="spaceElevators" :label="$t('buildings.space_elevator')" />
          <q-toggle v-model="settings" val="radarTowers" :label="$t('buildings.radar_tower')" />
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
          <q-toggle v-model="settings" val="dropPod" label="Drop Pods" />
          <q-toggle v-model="settings" val="powerSlugs" label="Power Slugs" />
          <q-toggle v-model="settings" val="artifacts" label="Artifacts" />
          <q-toggle v-model="settings" val="itemPickupsBerry" label="Berries" />
          <q-toggle v-model="settings" val="itemPickupsNut" label="Nuts" />
          <q-toggle v-model="settings" val="itemPickupsItem" label="Items" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import SatisfactoryMap from 'components/SatisfactoryMap.vue';
import { computed, reactive } from 'vue';
import useServerStore from 'stores/server';
import { useEndpointsByOptions, usePausableFRMEndpoint } from 'src/composables/frmEndpoint';
import {
  Endpoint,
  GetDoggoResponse,
  GetDroneResponse,
  GetDroneStationResponse,
  GetDropPodResponse,
  GetPlayerResponse,
  GetPowerSlugResponse,
  GetRadarTowerResponse,
  GetSpaceElevatorResponse,
  GetSwitchesResponse,
  GetTractorResponse,
  GetTrainsResponse,
  GetTrainStationResponse,
  GetTruckResponse,
  GetTruckStationResponse,
  PowerSlugObject,
} from '@derpierre65/ficsit-remote-monitoring';
import ItemSlot from 'components/ItemSlot.vue';
import MapSpaceElevators from 'components/map/MapSpaceElevators.vue';
import MapRadarTowers from 'components/map/MapRadarTowers.vue';
import MapRadarTowerNodes from 'components/map/MapRadarTowerNodes.vue';
import useSettingsStore from 'stores/settings';
import MapPowerSwitch from 'components/map/MapPowerSwitch.vue';
import { useTranslation } from 'i18next-vue';
import MapMarker from 'components/map/MapMarker.vue';
import MapDropPod from 'components/map/MapDropPod.vue';

//#region Composable & Prepare
const serverStore = useServerStore();
const settingsStore = useSettingsStore();
const { t, } = useTranslation();
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
  dropPod: reactive(usePausableFRMEndpoint<GetDropPodResponse>(Endpoint.GetDropPod)),
  trucks: reactive(usePausableFRMEndpoint<GetTruckResponse>('getTruck')),
  tractors: reactive(usePausableFRMEndpoint<GetTractorResponse>('getTractor')),
  doggos: reactive(usePausableFRMEndpoint<GetDoggoResponse>('getDoggo')),
  powerSwitches: reactive(usePausableFRMEndpoint<GetSwitchesResponse>('getSwitches')),
  artifacts: reactive(usePausableFRMEndpoint('getArtifacts')), // TODO typing
  itemPickups: reactive(usePausableFRMEndpoint<object[]>('getItemPickups')), // TODO typing
};

const endpointAliases = {
  radarTowerNodes: 'radarTowers',
  itemPickupsBerry: 'itemPickups',
  itemPickupsNut: 'itemPickups',
  itemPickupsItem: 'itemPickups',
};
const { options: settings, } = useEndpointsByOptions(computed({
  get: () => settingsStore.mapSettings,
  set: (newValue) => settingsStore.$patch({
    mapSettings: newValue,
  }),
}), endpoints, endpointAliases);
//#endregion

//#region Data
//#endregion

//#region Computed
const cachedTrains = computed(() => {
  if (!endpoints.trains.data || endpoints.trains.data.length === 0) {
    return [];
  }

  return endpoints.trains.data.filter((train) => train.location.y !== 0 && train.location.x !== 0 && train.location.z !== 0);
});

const itemPickups = computed(() => {
  const items = [];
  if (settings.value.includes('itemPickupsBerry')) {
    items.push(...cachedItemPickups.value.berries);
  }
  if (settings.value.includes('itemPickupsNut')) {
    items.push(...cachedItemPickups.value.nuts);
  }
  if (settings.value.includes('itemPickupsShroom')) {
    items.push(...cachedItemPickups.value.shrooms);
  }

  return items;
});

const cachedItemPickups = computed(() => {
  const berries = [];
  const nuts = [];
  const shrooms = [];
  const others = [];

  for (const entity of endpoints.itemPickups.data ?? []) {
    if (entity.Item.ClassName.startsWith('Desc_Crystal') || entity.Item.ClassName.startsWith('Desc_WAT')) {
      continue;
    }

    if (entity.Item.ClassName === 'Desc_Berry_C') {
      berries.push(entity);
    }
    else if (entity.Item.ClassName === 'Desc_Nut_C') {
      nuts.push(entity);
    }
    else if (entity.Item.ClassName === 'Desc_Shroom_C') {
      shrooms.push(entity);
    }
    else {
      others.push(entity);
    }
  }

  return {
    berries,
    nuts,
    shrooms,
    others,
  };
});
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
function enableAllSettings() {
  settings.value = [
    ...Object.keys(endpoints),
    ...Object.keys(endpointAliases),
  ];
}

function getPowerSlugColor(entity: PowerSlugObject) {
  if (entity.ClassName === 'BP_Crystal_C') {
    return '#5caad1';
  }
  if (entity.ClassName === 'BP_Crystal_mk2_C') {
    return '#e3d281';
  }
  if (entity.ClassName === 'BP_Crystal_mk3_C') {
    return '#e08be8';
  }

  return 'grey';
}
//#endregion

//#region Created
//#endregion
</script>
