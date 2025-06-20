<template>
  <template v-if="entities[0]">
    <q-icon name="fas fa-location-dot" class="cursor-pointer" @click.stop="createPing">
      <q-tooltip>Ping In Game</q-tooltip>
    </q-icon>

    <q-icon name="fas fa-map" class="cursor-pointer" @click.stop="showDialog = true">
      <q-tooltip>Show Location</q-tooltip>
    </q-icon>

    <q-dialog v-if="allEntities[0]" v-model="showDialog">
      <q-card class="tw-w-full !tw-max-w-[80vw] tw-h-[90vh] tw-flex tw-flex-col shadow-0">
        <q-card-section class="tw-flex tw-gap-1 tw-bg-neutral-950">
          <q-img v-if="imgUrl" :src="imgUrl" width="32px" />
          <span>{{ title || entities[0].name }}</span>
          <span v-if="entities.length > 1"> ({{ entities.length }})</span>

          <q-space />

          <q-toggle v-model="playerInfo.isActive" label="Show Players" />
        </q-card-section>
        <SatisfactoryMap class="tw-flex-auto" :center="allEntities[0].mapLocation" :zoom="-8">
          <MapMarker
            v-for="entity in allEntities"
            :key="entity.ID"
            :location="entity.location"
            :image="entity.image || ''"
            :tooltip="entity.name || ''"
          />
        </SatisfactoryMap>
      </q-card>
    </q-dialog>
  </template>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import SatisfactoryMap from 'components/SatisfactoryMap.vue';
import MapMarker from 'components/map/MapMarker.vue';
import { usePausableFRMEndpoint } from 'src/composables/frmEndpoint';
import {
  Coordinates, CoordinatesWithRotation,
  Endpoint,
  GetPlayerResponse,
} from '@derpierre65/ficsit-remote-monitoring';
import { getEntityLocation } from 'src/utils/map';
import useServerStore from 'stores/server';

const props = withDefaults(defineProps<{
  entities: Array<{
    ID: string;
    location: Coordinates | CoordinatesWithRotation;
    mapLocation: [number, number];
    image?: string;
    name?: string;
  }>;
  title?: string;
  image?: string | null;
}>(), {
  title: '',
  image: null,
  entities: () => [],
});

const serverStore = useServerStore();
const playerInfo = reactive(usePausableFRMEndpoint<GetPlayerResponse>(Endpoint.GetPlayer, {
  startPaused: true,
  fetchDuration: 2_500,
}));

const showDialog = ref(false);

const allEntities = computed(() => {
  if (!playerInfo.isActive) {
    return props.entities;
  }

  return props.entities.concat(playerInfo.data.map((player) => {
    return {
      ID: player.ID,
      location: player.location,
      mapLocation: getEntityLocation(player),
      name: player.Name,
      image: serverStore.getItemUrl('Desc_Helmet_Default_C'),
    };
  }));
});

const imgUrl = computed(() => {
  if (props.image === null) {
    return null;
  }

  return props.image || props.entities[0]!.image;
});

function createPing() {
  const entities = props.entities.map((entity) => ({
    x: entity.location.x,
    y: entity.location.y,
    z: entity.location.z + 200,
  }));
  do {
    serverStore.post('createPing', entities.splice(0, 500));
  } while (entities.length);
}
</script>
