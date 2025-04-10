<template>
  <div />
</template>

<script setup lang="ts">
import { getAvailableNotifications } from 'src/utils/dashboard/notifications';

//#region Composable & Prepare
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

getAvailableNotifications().then((notifications) => {
  console.log(notifications[0].name);
});
//#endregion
</script>
