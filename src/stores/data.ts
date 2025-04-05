import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useInterval, uuidv4 } from '@derpierre65/frontend-utils';
import useServerStore from 'stores/server';
import useSettingsStore from 'stores/settings';
import axios from 'axios';

type EndpointFetchInfo = {
  id: string;
  endpoint: string;
  fetchEvery: number;
};

const useDataStore = defineStore('data', () => {
  const settingsStore = useSettingsStore();
  const { setInterval, } = useInterval();

  const fetchEndpoints = ref<EndpointFetchInfo[]>([]);
  const lastUpdate = ref<Record<string, number>>({});
  const apiData = ref<Record<string, object>>({});
  const promises: Record<string, Promise<unknown>> = Object.create(null);
  const promisesUpdated: Record<string, object | null> = Object.create(null);

  function addEndpoint(endpoint: string, fetchEvery = -1) {
    const id = uuidv4();
    fetchEndpoints.value.push({
      id: id,
      endpoint,
      fetchEvery,
    });
    fetch(endpoint);

    return id;
  }

  function removeEndpoint(id: string) {
    const index = fetchEndpoints.value.findIndex((endpoint) => endpoint.id === id);
    if (index >= 0) {
      fetchEndpoints.value.splice(index, 1);
    }
  }

  function needUpdate(endpoint: EndpointFetchInfo) {
    const lastEndpointUpdate = lastUpdate.value[endpoint.endpoint];
    const updateInterval = endpoint.fetchEvery > 0 ? endpoint.fetchEvery : settingsStore.updateInterval;

    return !lastEndpointUpdate || (Date.now() - lastEndpointUpdate) > updateInterval;
  }

  async function fetch(endpoint: string | string[] | EndpointFetchInfo[] | null = null, force = false, wait = false) {
    const serverStore = useServerStore();
    if (!serverStore.currentServer) {
      return;
    }

    let fetch;
    if (endpoint) {
      fetch = Array.isArray(endpoint) ? endpoint : [ endpoint, ];
    }
    else {
      fetch = fetchEndpoints.value;
    }

    for (const endpoint of fetch) {
      if (!force && (typeof endpoint !== 'string' && !needUpdate(endpoint))) {
        continue;
      }

      const endpointName = typeof endpoint === 'string' ? endpoint : endpoint.endpoint;

      lastUpdate.value[endpointName] = Date.now();
      if (!promises[endpointName]) {
        console.debug(`Fetching data from endpoint ${endpointName}`);
        promises[endpointName] = axios
          .get<object>(endpointName, {
            baseURL: serverStore.currentServer.url,
            headers: {
              Authorization: serverStore.currentServer.authToken,
            },
          })
          .then(({ data, }) => {
            serverStore.isConnected = true;
            promisesUpdated[endpointName] = data;
          })
          .catch((response) => {
            if (response.code === 'ERR_NETWORK') {
              serverStore.isConnected = false;
            }
            promisesUpdated[endpointName] = null;
          });

        if (wait) {
          await promises[endpointName];
        }
      }
    }

    const keys = Object.keys(promisesUpdated);
    if (keys.length === 0) {
      return;
    }

    for (const key of keys) {
      if (promisesUpdated[key]) {
        apiData.value[key] = promisesUpdated[key];
      }

      delete promises[key];
      delete promisesUpdated[key];
    }

    console.debug('Updated', keys);
  }

  setInterval(() => fetch(), 100, 'fetchInterval');

  return {
    lastUpdate,
    apiData,
    fetchEndpoints,
    addEndpoint,
    removeEndpoint,
    fetch,
  };
});

export {
  useDataStore as default,
};
