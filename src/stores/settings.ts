import { defineStore } from 'pinia';
import { ref } from 'vue';
import { GridLayoutEntry } from 'src/utils/dashboard/widgets.ts';

const useSettingsStore = defineStore('settings', () => {
  const updateInterval = ref(5_000);
  const mapSettings = ref([
    'trains',
    'spaceElevators',
    'players',
    'doggos',
    'trainStations',
    'radarTowers',
    'drones',
    'radarTowerNodes',
    'droneStations',
    'truckStations',
    'tractors',
    'trucks',
    'powerSwitches',
  ]);
  const dashboardLayout = ref<Array<{
    grid: Omit<GridLayoutEntry, 'id' | 'minW' | 'minH' | 'maxW' | 'maxH'>;
    widget: {
      widgetId: string;
      configuration: Record<string, unknown>;
    };
  }>>([]);

  return {
    mapSettings,
    dashboardLayout,
    updateInterval,
  };
}, {
  persist: true,
});

export {
  useSettingsStore as default,
};
