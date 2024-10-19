<template>
  <div>
    <div class="text-center">
      <q-icon name="fa fa-ticket" size="100px" /><br>
      <q-skeleton v-if="!resourceSink" width="180px" class="q-mx-auto" />
      <div v-else>
        <span>Printable Coupons {{ resourceSink[0].NumCoupon }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFRMEndpoint } from 'src/composables/frmEndpoint.ts';
import type { GetResourceSinkResponse } from '@derpierre65/ficsit-remote-monitoring';

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
