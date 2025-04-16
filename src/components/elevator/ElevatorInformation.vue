<template>
  <q-card class="no-shadow">
    <q-card-section>
      <div class="q-mx-auto tw-w-24 tw-h-24">
        <img
          :src="serverStore.getItemUrl(item.ClassName)"
          :alt="item.Name"
        >
        <q-tooltip>{{ item.Name }}</q-tooltip>
      </div>

      <div class="tw-space-x-1">
        <q-badge v-if="!item.HasPower" class="!tw-bg-red-500 tw-text-red-500 !tw-bg-opacity-10" rounded>
          No Power
        </q-badge>
        <q-badge v-if="item.IsOccupied" class="!tw-bg-orange-500 tw-text-orange-500 !tw-bg-opacity-10" rounded>
          Occupied
        </q-badge>
        <q-badge v-if="item.Status === 'Idle'" class="!tw-bg-green-500 tw-text-green-500 !tw-bg-opacity-10" rounded>
          Idle
        </q-badge>
        <q-badge v-else class="!tw-bg-orange-500 tw-text-orange-500 !tw-bg-opacity-10" rounded>
          Moving
        </q-badge>
      </div>

      <ul class="q-mt-sm">
        <li>
          <span>
            <i class="fas fa-building" /> {{ item.NumFloorStops }}
            <q-tooltip>Floors</q-tooltip>
          </span>
        </li>
        <li>
          <span>
            <i class="fas fa-building-circle-check" /> {{ item.FloorStops[item.CurrentFloorStep].Name }} ({{ formatNumber(item.FloorStops[item.CurrentFloorStep].Height / 100, 0) }}m)
            <q-tooltip>Current Floor</q-tooltip>
          </span>
        </li>
        <li v-if="item.Status === 'Moving'">
          <span>
            <i class="fas fa-clock" /> {{ formatNumber(item.DurationOfCurrentElevatorState >= 0 ? item.DurationOfCurrentElevatorState : 0, 1) }}s
            <q-tooltip>Destination reached in</q-tooltip>
          </span>
        </li>
      </ul>

      <ul v-if="item.OccupyingCharacters.length" class="tw-mt-4">
        <li v-for="player in item.OccupyingCharacters" :key="player.ID" class="tw-flex tw-gap-1 items-center">
          <img
            :src="serverStore.getItemUrl('Desc_Helmet_Default_C')"
            class="tw-w-8"
            alt=""
          >
          <span>{{ player.Name }}</span>
        </li>
      </ul>
    </q-card-section>
    <div class="absolute-top-right tw-top-2 tw-right-2 tw-space-x-1">
      <MapShowLocation :entities="[location]" />
    </div>
  </q-card>
</template>

<script setup lang="ts">
import useServerStore from 'stores/server';
import MapShowLocation from 'components/map/MapShowLocation.vue';
import { computed } from 'vue';
import { getEntityLocation } from 'src/utils/map';
import { useTranslation } from 'i18next-vue';
import { formatNumber } from 'src/utils/helpers/number';

//#region Composable & Prepare
const { item, } = defineProps<{
  item: object;
}>();

const { t, } = useTranslation();
const serverStore = useServerStore();
//#endregion

//#region Data
//#endregion

//#region Computed
const location = computed(() => ({
  ID: item.ID,
  location: item.location,
  mapLocation: getEntityLocation(item),
  image: serverStore.getItemUrl(item.ClassName),
  name: `${item.Name}`,
}));
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
