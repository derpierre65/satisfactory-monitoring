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

      <ItemBox :size="48" :inventory />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { InventoryItemObject } from '@derpierre65/ficsit-remote-monitoring';
import useServerStore from 'stores/server.ts';
import { computed } from 'vue';
import ItemBox from 'components/inventory/ItemBox.vue';

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
