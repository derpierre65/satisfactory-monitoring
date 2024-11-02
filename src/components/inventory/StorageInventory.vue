<template>
  <q-card class="no-shadow">
    <q-card-section>
      <div class="tw-flex tw-items-center tw-gap-2">
        <q-img
          :src="imageUrl"
          width="64px"
          no-spinner
        />
        <span>{{ name }}</span>
      </div>
      <q-separator class="q-my-sm" />

      <div class="tw-grid tw-grid-cols-5 tw-gap-1">
        <ItemSlot v-for="item in inventory" :item :size="48" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import ItemSlot from 'components/ItemSlot.vue';
import { InventoryItemObject } from '@derpierre65/ficsit-remote-monitoring';
import useServerStore from 'stores/server.ts';
import { computed } from 'vue';

const { image = '', } = defineProps<{
  inventory: InventoryItemObject[];
  name: string;
  image?: string;
}>();

const serverStore = useServerStore();

const imageUrl = computed(() => {
  return serverStore.getItemUrl(image);
});
</script>
