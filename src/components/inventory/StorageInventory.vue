<template>
  <q-card class="no-shadow">
    <q-card-section>
      <div class="tw-flex tw-items-center tw-gap-2">
        <q-img
          :src="image"
          width="32px"
          no-spinner
        />
        <span>{{ name }}</span>
        <template v-if="location">
          <q-space />
          <MapShowLocation :entities="[entity]" />
        </template>
      </div>
      <q-separator class="q-my-sm" />

      <ItemBox :size="48" :inventory />
      <AppAlert v-if="inventory.length === 0" type="info" text>
        Empty
      </AppAlert>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { InventoryItemObject } from '@derpierre65/ficsit-remote-monitoring';
import ItemBox from 'components/inventory/ItemBox.vue';
import AppAlert from 'components/AppAlert.vue';
import MapShowLocation from 'components/map/MapShowLocation.vue';
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  inventory: InventoryItemObject[];
  name?: string;
  image?: string;
  location?: [number, number] | null;
}>(), {
  name: '',
  image: '',
  location: null,
});

const entity = computed(() => {
  return {
    ID: '1',
    name: props.name,
    location: props.location!,
    image: props.image,
  };
});
</script>
