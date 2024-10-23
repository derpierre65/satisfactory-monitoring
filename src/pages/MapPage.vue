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
          <q-toggle v-model="settings.trainStations" label="Train Stations" />
          <q-toggle v-model="settings.trains" label="Trains" />
          <q-toggle v-model="settings.powerSlugs" label="Power Slugs" />
          <q-toggle v-model="settings.radarTowers" label="Radar Towers" />
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
  trainStations: true,
  powerSlugs: true,
  radarTowers: true,
});
</script>
