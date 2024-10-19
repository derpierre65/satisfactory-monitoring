import { computed, onScopeDispose } from 'vue';
import useDataStore from 'stores/data.ts';

function useFRMEndpoint<T>(endpoint: string) {
  const dataStore = useDataStore();

  dataStore.addEndpoint(endpoint);

  onScopeDispose(() => {
    dataStore.removeEndpoint(endpoint);
  });

  return computed<T | null>(() => (dataStore.apiData[endpoint] as T) || null);
}

export {
  useFRMEndpoint,
};
