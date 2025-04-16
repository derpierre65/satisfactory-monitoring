<template>
  <div class="tw-grid tw-grid-cols-5 tw-gap-4">
    <ElevatorInformation v-for="elevator in elevators" :key="elevator.ID" :item="elevator" />
  </div>
</template>

<script setup lang="ts">

//#region Composable & Prepare
import { useFRMEndpoint } from 'src/composables/frmEndpoint';
import ElevatorInformation from 'components/elevator/ElevatorInformation.vue';

const elevators = useFRMEndpoint('getElevators');
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
