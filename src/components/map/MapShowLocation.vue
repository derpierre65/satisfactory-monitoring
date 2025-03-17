<template>
  <q-icon name="fas fa-location" class="cursor-pointer" @click.stop="showDialog = true">
    <q-tooltip>Show Location</q-tooltip>
  </q-icon>

  <q-dialog v-model="showDialog">
    <q-card class="tw-w-[40vw] tw-h-[40vh] shadow-0">
      <q-card-section>
        <q-img v-if="image" :src="image" width="32px" />
        <span>{{ name }}</span>
      </q-card-section>
      <SatisfactoryMap :center="location">
        <MapMarker
          :lat-lng="location"
          :image="image || ''"
        />
      </SatisfactoryMap>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SatisfactoryMap from 'components/SatisfactoryMap.vue';
import MapMarker from 'components/map/MapMarker.vue';

withDefaults(defineProps<{
  location: [number, number];
  image?: string;
  name?: string;
}>(), {
  name: '',
  image: '',
});

const showDialog = ref(false);
</script>
