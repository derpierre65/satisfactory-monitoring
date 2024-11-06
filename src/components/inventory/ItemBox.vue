<template>
  <div class="tw-grid tw-grid-cols-5 tw-gap-1">
    <ItemSlot v-for="item in inventory" :item :size />
  </div>
</template>

<script setup lang="ts">
import ItemSlot from 'components/ItemSlot.vue';
import { InventoryItemObject } from '@derpierre65/ficsit-remote-monitoring';

const { size = 48, } = defineProps<{
  inventory: InventoryItemObject[];
  size?: number;
}>();
</script>
