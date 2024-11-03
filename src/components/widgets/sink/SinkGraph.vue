<template>
  <q-card class="shadow-0">
    <q-card-section>
      <ChartLine :chart-data :chart-options />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useFRMEndpoint } from 'src/composables/frmEndpoint.ts';
import type { GetExplorationSinkResponse, GetResourceSinkResponse } from '@derpierre65/ficsit-remote-monitoring';
import ChartLine from 'components/charts/ChartLine.vue';
import { computed } from 'vue';

//#region Composable & Prepare
const resourceSink = useFRMEndpoint<GetResourceSinkResponse>('getResourceSink');
const explorationSink = useFRMEndpoint<GetExplorationSinkResponse>('getExplorationSink');
//#endregion

//#region Data
//#endregion

//#region Computed
const maxLabels = computed(() => {
  return Math.max(
    resourceSink.value[0]?.GraphPoints.length,
    explorationSink.value[0]?.GraphPoints.length,
  ) || 10;
});
const chartLabels = computed(() => {
  const labels: string[] = [];
  for (let index = 0; index < maxLabels.value; index++) {
    labels.push('');
  }

  return labels;
});
const chartData = computed(() => {
  return {
    labels: chartLabels.value,
    datasets: [
      {
        label: 'Standard Points',
        data: resourceSink.value[0]?.GraphPoints || [],
        borderColor: 'rgb(229, 147, 68)',
      },
      {
        label: 'DNA Points',
        data: explorationSink.value[0]?.GraphPoints || [],
        borderColor: 'rgb(161, 113, 161)',
      },
    ],
  };
});
const chartOptions = computed(() => {
  return {
    responsive: true,
    scales: {
      y: {
        ticks: {
          stepSize: 1_000,
        },
        beginAtZero: true,
      },
    },
  };
});
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
