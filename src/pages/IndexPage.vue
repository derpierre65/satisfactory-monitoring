<template>
  <q-page class="row items-center justify-evenly">
    dashboard
    {{ dataStore.apiData }}
  </q-page>
</template>

<script setup lang="ts">
import { useFRMEndpoint } from 'src/composables/frmEndpoint';
import useDataStore from 'stores/data.ts';

defineOptions({
  name: 'IndexPage',
});

useFRMEndpoint('getModList');
const dataStore = useDataStore();
</script>
