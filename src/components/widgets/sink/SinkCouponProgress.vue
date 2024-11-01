<template>
  <div class="tw-space-y-2 tw-w-[300px]">
    <div class="relative-position tw-bg-neutral-800 tw-rounded-lg tw-h-[64px]">
      <div class="absolute tw-inset-0 tw-bg-neutral-700 tw-z-0 tw-rounded-lg" :style="{width: `${resourceSinkPercent}%`}" />
      <div class="absolute tw-inset-0 tw-flex tw-gap-2 items-center tw-z-10">
        <div>
          <q-img
            :src="serverStore.getItemUrl('Desc_IronScrew_C')"
            width="48px"
            height="48px"
            no-spinner
          />
        </div>
        <div>
          <span>Standard Points until next Coupon:</span>
          <q-skeleton v-if="!resourceSink" height="24px" />
          <div v-else class="text-h6">
            <span>{{ formatNumber(resourceSink[0].PointsToCoupon) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="relative-position tw-bg-neutral-800 tw-rounded-lg tw-h-[64px]">
      <div class="absolute tw-inset-0 tw-bg-neutral-700 tw-z-0 tw-rounded-lg" :style="{width: `${explorationSinkPercent}%`}" />
      <div class="absolute tw-inset-0 tw-flex tw-gap-2 tw-z-10 items-center">
        <div>
          <q-img
            :src="serverStore.getItemUrl('Desc_AlienDNACapsule_C')"
            width="48px"
            height="48px"
            no-spinner
          />
        </div>
        <div>
          <span>DNA Points until next Coupon:</span>
          <q-skeleton v-if="!explorationSink" height="24px" />
          <div v-else class="text-h6">
            <span>{{ formatNumber(explorationSink[0].PointsToCoupon) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFRMEndpoint } from 'src/composables/frmEndpoint';
import { GetExplorationSinkResponse, GetResourceSinkResponse } from '@derpierre65/ficsit-remote-monitoring';
import useServerStore from 'stores/server.ts';
import { formatNumber } from 'src/utils/helpers/number';

//#region Composable & Prepare
const resourceSink = useFRMEndpoint<GetResourceSinkResponse>('getResourceSink');
const explorationSink = useFRMEndpoint<GetExplorationSinkResponse>('getExplorationSink');

const serverStore = useServerStore();
//#endregion

//#region Data
//#endregion

//#region Computed
const resourceSinkPercent = computed(() => (resourceSink.value?.[0].Percent ?? 0) * 100);
const explorationSinkPercent = computed(() => (explorationSink.value?.[0].Percent ?? 0) * 100);
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
//#endregion

//#region Created
//#endregion
</script>
