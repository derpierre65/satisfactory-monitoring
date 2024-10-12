<template>
  <router-view />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

defineOptions({
  name: 'App',
});

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
function updateDarkMode() {
  let lightMode = false;
  if (window.localStorage) {
    lightMode = window.localStorage.getItem('light_mode') === 'true';
  }

  useQuasar().dark.set(!lightMode);
}
//#endregion

//#region Created
updateDarkMode();
//#endregion
</script>
