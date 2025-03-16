<template>
  <MapMarker
    v-for="node in cachedRadarTowerNodes"
    :key="node.ID"
    :lat-lng="node.location"
    :image="node.image"
    :bg-color="node.bgColor"
  >
    <template #tooltip>
      <table>
        <thead>
          <tr>
            <th colspan="2" class="tw-min-w-[42px] text-right">50%</th>
            <th class="tw-min-w-[42px] text-right">100%</th>
            <th class="tw-min-w-[42px] text-right">150%</th>
            <th class="tw-min-w-[42px] text-right">200%</th>
            <th class="tw-min-w-[42px] text-right">250%</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Miner MK1</th>
            <td v-for="value in node.values" :key="value" class="tw-min-w-[42px] text-right">{{ value }}</td>
          </tr>
          <tr>
            <th>Miner MK2</th>
            <td v-for="value in node.values" :key="value" class="tw-min-w-[42px] text-right">{{ value * 2 }}</td>
          </tr>
          <tr>
            <th>Miner MK3</th>
            <td v-for="value in node.values" :key="value" class="tw-min-w-[42px] text-right">{{ value * 4 }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </MapMarker>
</template>

<script setup lang="ts">
import {
  GetRadarTowerResponse,
  ResourceNodePurity,
  TowerObject,
} from '@derpierre65/ficsit-remote-monitoring';
import useServerStore from 'stores/server';
import MapMarker from 'components/map/MapMarker.vue';
import { getEntityLocation } from 'src/utils/map';
import { computed } from 'vue';

type CachedRadarTowerNode = {
  ID: string;
  bgColor: string;
  image: string;
  location: [number, number];
  values: number[];
};

const props = defineProps<{
  entities: GetRadarTowerResponse;
}>();

const serverStore = useServerStore();

const cachedRadarTowerNodes = computed(() => {
  return props.entities.reduce((acc, tower) => {
    acc.push(...tower.ScannedResourceNodes.map((node) => {
      return {
        ID: node.ID,
        image: serverStore.getItemUrl(node.ClassName),
        location: getEntityLocation(node),
        bgColor: getNodeBackground(node),
        values: getNodeValues(getNodeBaseValue(node)),
      };
    }));

    return acc;
  }, [] as CachedRadarTowerNode[]);
});

function getNodeValues(baseValue: number) {
  return [
    baseValue * 0.5,
    baseValue,
    baseValue * 1.5,
    baseValue * 2,
    baseValue * 2.5,
  ];
}

function getNodeBaseValue(entity: TowerObject['ScannedResourceNodes'][0]) {
  if (entity.EnumPurity === ResourceNodePurity.Impure) {
    return 30;
  }

  if (entity.EnumPurity === ResourceNodePurity.Normal) {
    return 60;
  }

  return 120;
}

function getNodeBackground(entity: TowerObject['ScannedResourceNodes'][0]) {
  if (entity.EnumPurity === ResourceNodePurity.Impure) {
    return 'rgb(210, 52, 48)';
  }

  if (entity.EnumPurity === ResourceNodePurity.Normal) {
    return 'rgb(242, 100, 24)';
  }

  return 'rgb(128, 177, 57)';
}
</script>
