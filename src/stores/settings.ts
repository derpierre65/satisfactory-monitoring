import { defineStore } from 'pinia';
import { ref } from 'vue';

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

  return {
    mapSettings,
    updateInterval,
  };
}, {
  persist: true,
});

export {
  useSettingsStore as default,
};
