<template>
  <div>
    Graph soon.
  </div>
</template>

<script setup lang="ts">
import { useFRMEndpoint } from 'src/composables/frmEndpoint.ts';
import type { GetExplorationSinkResponse, GetResourceSinkResponse } from '@derpierre65/ficsit-remote-monitoring';

//#region Composable & Prepare
const resourceSink = useFRMEndpoint<GetResourceSinkResponse>('getResourceSink');
const explorationSink = useFRMEndpoint<GetExplorationSinkResponse>('getExplorationSink');
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
