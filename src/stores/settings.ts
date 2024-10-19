import { defineStore } from 'pinia';
import { ref } from 'vue';

const useSettingsStore = defineStore('settings', () => {
  const updateInterval = ref(5_000);

  return {
    updateInterval,
  };
}, {
  persist: true,
});

export {
  useSettingsStore as default,
};
