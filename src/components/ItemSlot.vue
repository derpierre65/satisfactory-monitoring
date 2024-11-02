<template>
  <div class="tw-relative tw-bg-neutral-300 tw-rounded-md tw-p-1" :style="{height: imageSize, width: imageSize}">
    <img :src="itemUrl" :alt="itemName">
    <div class="absolute-bottom-right tw-bg-satisfactory-orange tw-text-white tw-rounded-md tw-px-1 text-weight-bold tw-text-base">
      {{ itemAmount }}
    </div>

    <q-tooltip>{{ itemName }}</q-tooltip>
  </div>
</template>

<script setup lang="ts">
import { InventoryItemObject } from '@derpierre65/ficsit-remote-monitoring';
import useServerStore from 'stores/server.ts';
import { computed } from 'vue';

const {
  item,
  size = 32,
  amount = 0,
  title = '',
} = defineProps<{
  item: InventoryItemObject | string;
  amount?: number;
  size?: number | string;
  title?: string;
}>();

const serverStore = useServerStore();

const imageSize = computed(() => size + 'px');
const itemName = computed(() => (typeof item === 'string' ? title : item.Name));
const itemAmount = computed(() => (typeof item === 'string' ? amount : item.Amount));
const itemUrl = computed(() => serverStore.getItemUrl(typeof item === 'string' ? item : item.ClassName));
</script>
