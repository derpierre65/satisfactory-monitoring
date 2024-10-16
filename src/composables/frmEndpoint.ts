import { onScopeDispose } from 'vue';
import useDataStore from 'stores/data.ts';

function useFRMEndpoint(endpoint: string) {
  const dataStore = useDataStore();

  dataStore.addEndpoint(endpoint);

  onScopeDispose(() => {
    dataStore.removeEndpoint(endpoint);
  });
}

export {
  useFRMEndpoint,
};
