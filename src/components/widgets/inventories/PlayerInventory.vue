<template>
  <div v-if="!hideHeader" class="tw-flex tw-items-center tw-gap-2 q-mb-md">
    <img
      :src="serverStore.getItemUrl('Desc_Helmet_Default_C')"
      class="tw-w-8"
      alt=""
    >
    {{ item.Name || t('dashboard.widgets.inventory_player.unknown_player') }}
  </div>
  <ItemBox :size="48" :inventory="item.Inventory" />
</template>

<script setup lang="ts">
import { PlayerObject } from '@derpierre65/ficsit-remote-monitoring';
import ItemBox from 'components/inventory/ItemBox.vue';
import useServerStore from 'stores/server.ts';
import { useTranslation } from 'i18next-vue';

defineProps<{
  item: PlayerObject;
  hideHeader?: boolean;
}>();

const serverStore = useServerStore();
const { t, } = useTranslation();
</script>
