<template>
  <MapMarker
    :key="entity.ID"
    :location="entity.location"
    :image="serverStore.getItemUrl('Desc_HardDrive_C')"
    :icon-class="entity.Looted ? 'tw-opacity-50' : ''"
    :is-despawned="entity.Looted"
    bg-color="white"
    pingable-until-despawn
  >
    <template #tooltip>
      <div v-if="entity.RequiredItem.ClassName" class="text-center">
        <q-badge v-if="entity.Opened" class="!tw-bg-green-600 tw-text-green-600 !tw-bg-opacity-10" rounded label="Opened" />
        <q-badge v-if="entity.Looted" class="!tw-bg-green-600 tw-text-green-600 !tw-bg-opacity-10" rounded label="Looted" />
        <div>{{ entity.RequiredItem.Name }}</div>
        <ItemSlot
          :size="64"
          class="q-mx-auto"
          :item="entity.RequiredItem"
        />
      </div>
      <div v-if="entity.RequiredPower" class="text-center" :class="{'q-mt-md': entity.RequiredItem.ClassName}">
        Power: {{ entity.RequiredPower }}MW
      </div>
    </template>
  </MapMarker>
</template>

<script setup lang="ts">
import MapMarker from 'components/map/MapMarker.vue';
import useServerStore from 'stores/server';
import { DropPodObject } from '@derpierre65/ficsit-remote-monitoring';
import ItemSlot from 'components/ItemSlot.vue';

//#region Composable & Prepare
defineProps<{
  entity: DropPodObject;
}>();

const serverStore = useServerStore();
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
