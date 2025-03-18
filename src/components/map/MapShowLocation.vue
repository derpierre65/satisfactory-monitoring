<template>
  <template v-if="entities[0]">
    <q-icon name="fas fa-location-dot" class="cursor-pointer" @click.stop="showDialog = true">
      <q-tooltip>Show Location</q-tooltip>
    </q-icon>

    <q-dialog v-model="showDialog">
      <q-card class="tw-w-full !tw-max-w-[60vw] tw-h-[80vh] shadow-0">
        <q-card-section>
          <q-img v-if="imgUrl" :src="imgUrl" width="32px" />
          <span>{{ title || entities[0].name }}</span>
          <span v-if="entities.length > 1"> ({{ entities.length }})</span>
        </q-card-section>
        <SatisfactoryMap :center="entities[0].location" :zoom="-8">
          <MapMarker
            v-for="entity in entities"
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
import { computed, ref } from 'vue';
import SatisfactoryMap from 'components/SatisfactoryMap.vue';
import MapMarker from 'components/map/MapMarker.vue';

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

const showDialog = ref(false);

const imgUrl = computed(() => {
  if (props.image === null) {
    return null;
  }

  return props.image || props.entities[0]!.image;
});
</script>
