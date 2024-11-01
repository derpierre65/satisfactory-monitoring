<template>
  <div class="tw-relative tw-bg-neutral-300 tw-rounded-md tw-p-1" :style="{height: imageSize, width: imageSize}">
    <img :src="serverStore.getItemUrl(item.ClassName)">
    <div class="absolute-bottom-right tw-bg-satisfactory-orange tw-text-white tw-rounded-md tw-px-1 font-weight-bold">
      {{ item.Amount }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { InventoryItemObject } from '@derpierre65/ficsit-remote-monitoring';
import useServerStore from 'stores/server.ts';
import { computed } from 'vue';

const { size = 32, } = defineProps<{
  item: InventoryItemObject;
  size: number;
}>();

const serverStore = useServerStore();

const imageSize = computed(() => size + 'px');
</script>
