import { defineStore } from 'pinia';
import { ref } from 'vue';
import useServerStore from 'stores/server.ts';
import { unique, useInterval } from '@derpierre65/frontend-utils';
import FRM from 'src/utils/FRM.ts';
import useSettingsStore from 'stores/settings.ts';

const useDataStore = defineStore('data', () => {
  const settingsStore = useSettingsStore();
  const { setInterval, } = useInterval();

  const fetchEndpoints = ref<string[]>([]);
  const lastUpdate = ref<Record<string, number>>({});
  const apiData = ref<Record<string, object>>({});
  const promises: Record<string, Promise<unknown>> = {};

  function addEndpoint(endpoint: string) {
    fetchEndpoints.value.push(endpoint);
    fetch(endpoint);
  }

  function removeEndpoint(endpoint: string) {
    const index = fetchEndpoints.value.indexOf(endpoint);
    if (index >= 0) {
      fetchEndpoints.value.splice(index, 1);
    }
  }

  function needUpdate(endpoint: string) {
    return !lastUpdate.value[endpoint] || (Date.now() - lastUpdate.value[endpoint]) > settingsStore.updateInterval;
  }

  function fetch(endpoint: string | null = null) {
    const serverStore = useServerStore();
    if (!serverStore.currentServer) {
      return;
    }

    const fetch = endpoint ? [ endpoint, ] : unique(fetchEndpoints.value);

    for (const endpoint of fetch) {
      if (!needUpdate(endpoint)) {
        continue;
      }

      lastUpdate.value[endpoint] = Date.now();
      if (!promises[endpoint]) {
        promises[endpoint] = FRM.fetch<object>(serverStore.currentServer.url, endpoint)
          .then((data) => {
            serverStore.isConnected = true;
            apiData.value[endpoint] = data;
          })
          .catch((response) => {
            if (response.code === 'ERR_NETWORK') {
              serverStore.isConnected = false;
            }
          })
          .finally(() => {
            delete promises[endpoint];
          });
        console.log('updating', endpoint);
      }
    }
  }

  setInterval(() => fetch(), 1_000, 'fetchInterval');

  return {
    lastUpdate,
    apiData,
    fetchEndpoints,
    addEndpoint,
    removeEndpoint,
  };
});

export {
  useDataStore as default,
};
