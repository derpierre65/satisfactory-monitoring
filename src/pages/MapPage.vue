<template>
  <div class="tw-flex tw-flex-auto tw-gap-4">
    <div class="tw-flex tw-flex-col tw-flex-auto">
      <SatisfactoryMap :settings class="tw-flex-auto" />
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
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import SatisfactoryMap from 'components/SatisfactoryMap.vue';
import { ref } from 'vue';

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
});
</script>
