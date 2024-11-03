<template>
  <LMarker :lat-lng="getEntityLocation(entity)">
    <LIcon
      :icon-size="[40, 40]"
      :class-name="'!tw-flex !tw-items-center !tw-justify-center ' + iconClasses"
    >
      <img
        :src="iconUrl"
        :alt="entityName"
        class="!tw-w-7"
      >
    </LIcon>
    <LTooltip v-if="!hideTooltip">
      <div class="text-center">
        <span>{{ entityName }}</span>
      </div>
      <slot name="tooltip" />
    </LTooltip>
    <LPopup v-if="$slots.default">
      <slot />
    </LPopup>
  </LMarker>
</template>

<script setup lang="ts">
import { getEntityLocation } from 'src/utils/map.ts';
import { LIcon, LMarker, LPopup, LTooltip } from '@vue-leaflet/vue-leaflet';
import { HasLocation } from '@derpierre65/ficsit-remote-monitoring';
import { computed } from 'vue';

const { entity, } = defineProps<{
  entity: HasLocation & { Name?: string; };
  iconUrl: string;
  hideTooltip?: boolean;
  iconClasses?: string;
}>();

defineSlots<{
  default(): never;
  tooltip(): never;
}>();

const entityName = computed(() => entity.Name || 'Unknown');
</script>
