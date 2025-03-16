<template>
  <MapMarker
    v-for="entity of entities"
    :key="entity.ID"
    :lat-lng="getEntityLocation(entity)"
    :tooltip="entity.Name"
    image="/assets/map/radar_tower.png"
  >
    <template #popup>
      <template v-if="entity.Signal.length">
        <div class="text-center q-mb-md">
          <span>Weak signals found in area:</span>
        </div>
        <div class="tw-flex tw-flex-wrap justify-center tw-gap-x-2">
          <div v-for="signal in entity.Signal" :key="signal.ClassName" class="tw-flex tw-items-center tw-gap-2">
            <img :src="serverStore.getItemUrl(signal.ClassName)" width="32px" height="32px" :alt="signal.Name">
            <span>x{{ signal.Amount }}</span>
          </div>
        </div>
      </template>
      <template v-if="entity.Fauna.length">
        <div class="text-center q-my-md">
          <span>Fauna found in area:</span>
        </div>
        <div class="tw-flex tw-flex-wrap justify-center tw-gap-x-2">
          <div v-for="fauna in entity.Fauna" :key="fauna.ClassName" class="tw-flex tw-items-center tw-gap-2">
            <img :src="serverStore.getItemUrl(fauna.ClassName)" width="32px" height="32px" :alt="fauna.Name">
            <span>x{{ fauna.Amount }}</span>
          </div>
        </div>
      </template>
      <template v-if="entity.Flora">
        <div class="text-center q-my-md">
          <span>Flora found in area:</span>
        </div>
        <div class="tw-flex tw-flex-wrap justify-center tw-gap-x-2">
          <div v-for="flora in entity.Flora" :key="flora.ClassName" class="tw-flex tw-items-center tw-gap-2">
            <img :src="serverStore.getItemUrl(flora.ClassName)" width="32px" height="32px" :alt="flora.Name">
            <span>x{{ flora.Amount }}</span>
          </div>
        </div>
      </template>
    </template>
  </MapMarker>
</template>

<script setup lang="ts">
import { getEntityLocation } from 'src/utils/map';
import { TowerObject } from '@derpierre65/ficsit-remote-monitoring';
import useServerStore from 'stores/server';
import MapMarker from 'components/map/MapMarker.vue';

defineProps<{
  entities: TowerObject[];
}>();

const serverStore = useServerStore();
</script>
