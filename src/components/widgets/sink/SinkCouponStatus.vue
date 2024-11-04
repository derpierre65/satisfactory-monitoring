<template>
  <div class="text-center">
    <q-skeleton v-if="!resourceSink[0]" width="180px" class="q-mx-auto" />
    <ItemSlot
      v-else
      :amount="resourceSink[0].NumCoupon"
      class="tw-mx-auto"
      item="Desc_ResourceSinkCoupon_C"
      title="Printable Coupons"
      size="128"
    />
  </div>
</template>

<script setup lang="ts">
import { useFRMEndpoint } from 'src/composables/frmEndpoint.ts';
import { GetResourceSinkResponse } from '@derpierre65/ficsit-remote-monitoring';
import ItemSlot from 'components/ItemSlot.vue';

//#region Composable & Prepare
const resourceSink = useFRMEndpoint<GetResourceSinkResponse>('getResourceSink');
//#endregion

//#region Data
//#endregion

//#region Computed
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
