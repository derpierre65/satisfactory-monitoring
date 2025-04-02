<template>
  <template v-if="entities[0]">
    <q-icon name="fas fa-location-dot" class="cursor-pointer" @click.stop="showDialog = true">
      <q-tooltip>Show Location</q-tooltip>
    </q-icon>

    <q-dialog v-model="showDialog">
      <q-card class="tw-w-full !tw-max-w-[60vw] tw-h-[80vh] shadow-0">
        <q-card-section class="tw-flex">
          <q-img v-if="imgUrl" :src="imgUrl" width="32px" />
          <span>{{ title || entities[0].name }}</span>
          <span v-if="entities.length > 1"> ({{ entities.length }})</span>

          <q-space />

          <q-toggle v-model="playerInfo.isActive" label="Show Players" />
        </q-card-section>
        <SatisfactoryMap :center="entities[0].location" :zoom="-8">
          <MapMarker
            v-for="entity in allEntities"
            :key="entity.ID"
            :lat-lng="entity.location"
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
import { Endpoint, GetPlayerResponse } from '@derpierre65/ficsit-remote-monitoring';
import { getEntityLocation } from 'src/utils/map';
import useServerStore from 'stores/server';

const props = withDefaults(defineProps<{
  entities: Array<{
    ID: string;
    location: [number, number];
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
      location: getEntityLocation(player),
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
</script>
