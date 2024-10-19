<template>
  <LineChart
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script setup lang="ts">
import { Line as LineChart } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  type ChartOptions,
  type ChartData,
} from 'chart.js';

defineProps<{
  chartData: ChartData;
  chartOptions: ChartOptions;
}>();

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);
</script>
